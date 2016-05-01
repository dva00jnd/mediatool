/*
 * @providesModule RPC
 */

import { fork } from 'child_process';
import EventEmitter from 'events';

export const RPCVersion = '1';

export class RPCConnection {
  constructor(remote) {
    this.events = new EventEmitter();

    this.remote = remote;
    this.remote.on('message', data => {
      console.log('got message', data);
      const payload = JSON.parse(data);

      if (payload.version !== RPCVersion) {
        throw new Error(`RPC version mismatch: expected ${RPCVersion}, got ${payload.version}`);
      }

      this.events.emit(payload.channel, payload.data);
      this.events.emit('___internal_all_messages___', payload);
    });
  }

  send(channel, data) {
    console.log('sending', channel, data);
    this.remote.send(JSON.stringify({
      version: RPCVersion,
      channel,
      data,
    }));
  }

  on(channel = null, handler) {
    if (channel === null) {
      return this.events.on('___internal_all_messages___', handler);
    }

    return this.events.on(channel, handler);
  }
}

export const spawnChild = childPath => {
  const child = fork(childPath);
  child.on('error', (...args) => console.log('child error', ...args));
  child.on('exit', () => console.log('child exited'));
  return new RPCConnection(child);
};

export const connectToParent = () => {
  const parent = new RPCConnection(process);
  console.log(1);
  parent.send('hi');
  return parent;
};
