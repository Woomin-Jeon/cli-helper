import inquirer from 'inquirer';
import { Command } from '@oclif/core';
import { getBranchInfo } from '../../../utils/branch';
import { exec } from '../../../utils/exec';

export default class GitCheckout extends Command {
  async run() {
    const { branches } = getBranchInfo();

    console.clear();
    const { branch: targetBranchName } = await inquirer.prompt([{
      name: 'branch',
      message: 'Select a branch',
      type: 'list',
      choices: branches.map((name) => ({ name })),
    }]);

    exec(`git checkout ${targetBranchName}`);
    this.exit();
  }
}
