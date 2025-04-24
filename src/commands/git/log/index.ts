import { Command, Flags } from '@oclif/core';
import { getLogInfo } from '@src/utils/log';

export default class GitLog extends Command {
  async run() {
    const { log } = getLogInfo();

    this.log(log);
    this.exit();
  }
}
