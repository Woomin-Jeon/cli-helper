import { Args, Command, ux } from '@oclif/core';
import { spawn } from '../../../utils/exec';

export default class GitResetHead extends Command {
  static args = {
    resetCount: Args.integer({
      required: false,
    }),
  };

  async run() {
    const { args } = await this.parse(GitResetHead);

    console.clear();

    const resetCount = args.resetCount || (await ux.prompt('How many commits need to be reset'));
    const answer = await ux.prompt(`Execute "git reset HEAD~${resetCount}".\nAre you sure? yes/no`, {
      required: true,
      default: 'yes',
    });

    if (answer !== 'yes') {
      return;
    }

    spawn(`git reset HEAD~${resetCount}`);
    this.exit();
  }
}
