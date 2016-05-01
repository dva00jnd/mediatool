/*
 * @providesModule Plugin
 */

import connectToParent from 'RPC';

// Plugin class allows the implementation of additional functionality
export default class Plugin {
  constructor() {
    this.parent = null;
  }

  async commands() {
    return [];
  }

  async run() {
    console.log('running');
    this.parent = connectToParent();

    this.parent.on('ping', () => parent.send('pong'));
    this.parent.on('exit', code => process.exit(code));
  }
}
