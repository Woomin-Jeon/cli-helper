import { Args, Command, ux } from '@oclif/core';
import { getCommitInfo } from '../../../utils/commit';
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

    const resetCount = Number(args.resetCount || (await ux.prompt('How many commits need to be reset')));

    const { commits } = getCommitInfo({ size: resetCount });

    const answer = await ux.prompt(`Execute "git reset HEAD~${resetCount}".\n\n${commits.map((commit) => `- ${commit}`).join('\n')}\n\nAre you sure? yes/no`, {
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
