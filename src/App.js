/* eslint-disable no-console */

import glob from 'glob';
import path from 'path';

export default class App {
  constructor() {
    this.plugins = {};
  }

  registerPlugin(name, plugin) {
    this.plugins[name] = plugin;
  }

  discoverPlugins() {
    const searchPaths = new Set();
    searchPaths.add(path.resolve(__dirname, '..', 'bin'));
    process.env.PATH.split(':').forEach(p => searchPaths.add(path.resolve(p)));

    let plugins = [];
    searchPaths.forEach(searchPath => {
      const files = glob.sync(`${searchPath}/mediatool-plugin-*`);
      plugins = [
        ...files,
        ...plugins,
      ];
    });

    console.log('plugins', plugins);
  }
}
