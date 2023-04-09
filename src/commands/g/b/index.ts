import { Command, Flags } from '@oclif/core';
import inquirer from 'inquirer';
import { getBranchInfo } from '../../../utils/branch';
import { exec } from '../../../utils/exec';

export default class GitBranch extends Command {
  static flags = {
    delete: Flags.boolean({
      char: 'D',
      required: false,
    }),
  };

  async run() {
    const { flags } = await this.parse(GitBranch);

    const { branches, headBranchIndex } = getBranchInfo();

    if (flags.delete) {
      const filteredBranches = branches.filter((_, index) => index !== headBranchIndex);
      if (filteredBranches.length === 0) {
        this.log('No branch to delete');
        this.exit();
      }

      console.clear();
      const { branchList } = await inquirer.prompt([{
        name: 'branchList',
        message: 'Select a branch to delete',
        type: 'checkbox',
        choices: filteredBranches.map((name) => ({ name })),
      }]);

      exec(`git branch -D ${branchList.join(' ')}`);
      this.log(`Branch deleted! ${branchList.join(', ')}`);
      this.exit();
    }

    branches.forEach((branch) => this.log(`>>> ${branch}`));
    this.exit();
  }
}
