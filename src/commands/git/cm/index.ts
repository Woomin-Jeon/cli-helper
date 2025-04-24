import { Args, Command } from '@oclif/core';
import { spawn } from '../../../utils/exec';

export default class GitCommitMessage extends Command {
  static args = {
    message: Args.string({
      required: true,
    }),
  };

  async run() {
    const { args } = await this.parse(GitCommitMessage);

    console.clear();

    const commitMessage = args.message;

    spawn(`git commit -m ${commitMessage}`);
    this.exit();
  }
}
