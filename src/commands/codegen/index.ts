import { Command, ux } from '@oclif/core';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { createSearchEngine } from '../../utils/search';
import { readBulkFiles } from '../../utils/file';
import { clipboard } from '../../utils/clipboard';

export default class CodeGen extends Command {
  async run() {
    console.clear();

    const keyword = await ux.prompt('Enter the function name or description you want to search for');

    const rootDirPath = path.join(__dirname, '..', '..', '..', '..');
    const codeAssetsDirPath = path.join(rootDirPath, '/assets/codegen/codes');
    const filePathes = fs.readdirSync(codeAssetsDirPath).map((fileName) => path.join(codeAssetsDirPath, fileName));

    const codes = await readBulkFiles(filePathes);
    const codeInfos = codes.map((code, index) => {
      const description = code.match(/@description (?<description>.*)/)?.groups?.description ?? null;
      const name = code.match(/(?<=const\s)(?<name>\w+)(?=\s=)/)?.groups?.name ?? null;

      return {
        index,
        name,
        description,
        code: code.replace(/\/\*[\s\S]*\*\//, ''),
      };
    });

    const searchEngine = createSearchEngine({
      pool: codeInfos,
      id: ({ index }) => index.toString(),
      keyword: ({ name, description }) => `${name} ${description}`,
    });

    const { ids } = searchEngine.search(keyword);
    const searchedResults = ids.map((id) => codeInfos[Number(id)]);

    const { codeInfo: targetIndex } = await inquirer.prompt([{
      name: 'codeInfo',
      message: 'Search results',
      type: 'list',
      choices: searchedResults.slice(0, 10).map(({ index, description, name }) => ({
        name: `${name}\n  - ${description ?? 'No description'}\n`,
        value: index,
      })),
      pageSize: 20,
    }]);

    const targetCodeInfo = codeInfos[targetIndex];

    clipboard.copy(targetCodeInfo.code);
    this.log(`"${targetCodeInfo.name}" is copied to the clipboard`);

    this.exit();
  }
}
