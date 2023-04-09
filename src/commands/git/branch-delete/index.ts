import inquirer from 'inquirer';
import { Command } from '@oclif/core';
import { getBranchInfo } from '../../../utils/branch';
import { exec } from '../../../utils/exec';

export default class BranchDelete extends Command {
  async run() {
    const { branches: _branches, headBranchIndex } = getBranchInfo();
    const branches = _branches.filter((_, index) => index !== headBranchIndex);

    console.clear();
    const { branchList } = await inquirer.prompt([{
      name: 'branchList',
      message: 'Select a branch to delete',
      type: 'checkbox',
      choices: branches.map((name) => ({ name })),
    }]);

    exec(`git branch -D ${branchList.join(' ')}`);
    this.exit();
  }
}
