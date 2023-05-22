import { Command, ux } from '@oclif/core';
import { exec } from '../../../utils/exec';

export default class GitResetHead extends Command {
  async run() {
    console.clear();
    const count = await ux.prompt('How many commits need to be reset');
    const answer = await ux.prompt(`Execute "git reset HEAD~${count}". Are you sure? yes/no`, {
      required: true,
      default: 'yes',
    });

    if (answer !== 'yes') {
      return;
    }

    exec(`git reset HEAD~${count}`);
    this.exit();
  }
}
