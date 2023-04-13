import { Command, ux } from '@oclif/core';
import { exec } from '../../../utils/exec';

export default class GitResetHead extends Command {
  async run() {
    console.clear();
    const count = await ux.prompt('How many commits need to be reset');

    exec(`git reset HEAD~${count}`);
    this.exit();
  }
}
