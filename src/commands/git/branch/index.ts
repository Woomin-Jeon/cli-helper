import { Command } from '@oclif/core';
import { getBranchInfo } from '../../../utils/branch';

export default class Branch extends Command {
  async run() {
    const { branches } = getBranchInfo();

    branches.forEach((branch) => this.log(branch));
    this.exit();
  }
}
