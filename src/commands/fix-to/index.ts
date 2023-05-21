import { Command, ux } from '@oclif/core';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { log } from 'console';
import { createSearchEngine } from '../../utils/search';
import {
  isDirectory, readBulkFiles, readDirectory, readFile, writeFile,
} from '../../utils/file';
import { clipboard } from '../../utils/clipboard';

const classifyObjects = (objects: string[]) => objects.reduce(
  (classification, target) => {
    const { files, directories } = classification;

    return isDirectory(target)
      ? { ...classification, directories: [...directories, target] }
      : { ...classification, files: [...files, target] };
  },
  { files: [], directories: [] } as {files: string[]
    directories: string[]
  },
);

const readDirectoriesRecursively = async (parentPath: string, testRegex: RegExp, excludeRegex: RegExp | null): Promise<string[]> => {
  if (!parentPath) {
    return [];
  }

  const childPathes = await readDirectory(parentPath);
  const mergedPathes = childPathes.map((childPath) => path.join(parentPath, childPath));
  const { files, directories } = classifyObjects(mergedPathes);

  const matchesFiles = files.filter((file) => (testRegex ? testRegex.test(file) : true));

  const matchedDirectories = directories.filter((dir) => (excludeRegex ? !excludeRegex.test(dir) : true));
  const readingDirectoriesPromises = matchedDirectories.map((dir) => readDirectoriesRecursively(dir, testRegex, excludeRegex));

  const results = await Promise.all(readingDirectoriesPromises);

  return [...matchesFiles, ...results.flat()];
};

const replaceFileText = async (filePath: string, fromRegex:RegExp, toText: string) => {
  const fileData = await readFile(filePath);
  const updatedData = fileData.replace(new RegExp(fromRegex, 'g'), toText);

  await writeFile(filePath, updatedData);
};

export default class FixTo extends Command {
  async run() {
    const root = process.cwd();

    const test = await ux.prompt('test :', {
      required: false,
      default: '.jsx?$|.tsx?$',
    });
    const exclude = await ux.prompt('exclude :', {
      required: false,
      default: 'node_modules/.*',
    });

    const testRegex = new RegExp(test);
    const excludeRegex = exclude === 'null' ? null : new RegExp(exclude);

    const filePathes = await readDirectoriesRecursively(root, testRegex, excludeRegex);
    if (filePathes.length === 0) {
      this.log('일치하는 파일이 존재하지 않습니다.');
      return;
    }

    const filePathesToShow = filePathes.map((filePath) => `  ${filePath.replace(process.cwd(), '')}`).join('\n');
    const answer = await ux.prompt(`다음과 같은 파일들에 대해 수정을 수행합니다.\n${filePathesToShow}\nyes/no`, {
      required: false,
      default: 'yes',
    });

    if (answer !== 'yes') {
      return;
    }

    const from = await ux.prompt('from 정규식을 입력해주세요', { required: true });
    const to = await ux.prompt(`${from} 정규식에 맞는 문자열을 치환하고자 하는 문자열을 입력해주세요`, { required: true });

    const fromRegex = new RegExp(from);

    const replacingPromises = filePathes.map((filePath) => replaceFileText(filePath, fromRegex, to));

    ux.action.start('수정중');
    await Promise.all(replacingPromises);
    ux.action.stop('\n⚡ 수정이 완료되었습니다.');
  }
}
