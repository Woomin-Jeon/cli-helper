import path from 'path';
import inquirer from 'inquirer';
import { Command, ux } from '@oclif/core';
import { clipboard } from '../../../utils/clipboard';
import { spawn } from '../../../utils/exec';
import { getParentPath, getChildDirPathes } from '../../../utils/path';
import { findFileByASC, parseJSONFile } from '../../../utils/file';

const findRootPackageJSONPath = (currentDir: string): string | null => {
  const packageJSONPath = findFileByASC('package.json', currentDir);
  if (!packageJSONPath) {
    return null;
  }

  const packageJSON = parseJSONFile(packageJSONPath);

  const hasWorkspaces = Boolean(packageJSON.workspaces);
  if (!hasWorkspaces) {
    const parentDir = getParentPath(currentDir);
    if (!parentDir) {
      return null;
    }

    return findRootPackageJSONPath(parentDir);
  }

  return packageJSONPath;
};

const findWorkspacePackageJSONPathes = (workspacePathes: string[]) => workspacePathes.flatMap((workspacePath) => {
  if (workspacePath.endsWith('/*')) {
    const dirPath = workspacePath.replace('/*', '');

    const childDirPathes = getChildDirPathes(dirPath);

    return childDirPathes.map((childDirPath) => `${childDirPath}/package.json`);
  }

  return [`${workspacePath}/package.json`];
});

export default class YarnWorkspaces extends Command {
  async run() {
    const workingDirPath = path.join(process.cwd());

    const rootPackageJSONPath = findRootPackageJSONPath(workingDirPath);
    if (!rootPackageJSONPath) {
      this.error('yarn workspaces의 root를 찾을 수 없습니다.');
    }

    const rootPackageJSON = parseJSONFile(rootPackageJSONPath);

    const packageJSONDirPath = rootPackageJSONPath.replace('/package.json', '');
    const workspacePathes = rootPackageJSON.workspaces.map((workspacePath: string) => `${packageJSONDirPath}/${workspacePath}`);

    const workspacePackageJSONPathes = findWorkspacePackageJSONPathes(workspacePathes);
    const workspacePackageJSONs = workspacePackageJSONPathes.map((workspacePackageJSONPath) => parseJSONFile(workspacePackageJSONPath)).filter(Boolean);

    const workspaceNames = workspacePackageJSONs.map((packageJSON) => packageJSON.name);

    console.clear();
    const { workspace: targetWorkspaceName } = await inquirer.prompt([{
      name: 'workspace',
      message: 'Select a workspace',
      type: 'list',
      choices: workspaceNames.map((name) => ({ name })),
    }]);

    const targetWorkspace = workspacePackageJSONs.find((packageJSON) => packageJSON.name === targetWorkspaceName);

    console.clear();
    const { command: targetCommand } = await inquirer.prompt([{
      name: 'command',
      message: 'Select a command',
      type: 'list',
      choices: Object.keys(targetWorkspace.scripts).map((name) => ({ name })),
    }]);

    const wholeCommand = `yarn workspace ${targetWorkspaceName} ${targetCommand}`;
    clipboard.copy(wholeCommand);

    ux.action.start(`Executing command... \n$ ${wholeCommand}`);
    spawn(wholeCommand);
    ux.action.stop('\n⚡ Command execution completed!');
  }
}
