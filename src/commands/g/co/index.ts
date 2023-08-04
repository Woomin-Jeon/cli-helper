import inquirer from 'inquirer';
import { Args, Command, Flags } from '@oclif/core';
import { getBranchInfo } from '../../../utils/branch';
import { exec, spawn } from '../../../utils/exec';
import { ArgInput } from '@oclif/core/lib/interfaces/parser';

export default class GitCheckout extends Command {
  static args = {
    branchName: Args.string({
      required: false
    }),
  }
 
  static flags = {
    branchCreation: Flags.boolean({
      char: 'b',
      required: false,
    }),
  };

  async run() {
    const { flags, args } = await this.parse(GitCheckout);
  
    if (flags.branchCreation) {
      const newBranchName = args.branchName
      spawn(`git checkout -b ${newBranchName}`)
      this.exit()
    }
    
    const { branches } = getBranchInfo();

    console.clear();
    const { branch: targetBranchName } = await inquirer.prompt([{
      name: 'branch',
      message: 'Select a branch',
      type: 'list',
      choices: branches.map((name) => ({ name })),
    }]);

    spawn(`git checkout ${targetBranchName}`);
    this.exit();
  }
}
