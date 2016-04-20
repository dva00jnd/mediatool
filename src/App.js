import glob from 'glob';
import path from 'path';

const PLUGIN_SEARCH_PATHS = [
  path.resolve(__dirname, '..', 'bin'),
  ...process.env.PATH.split(':'),
];

export default class App {
  constructor() {
    this.plugins = {};
  }

  registerPlugin(name, plugin) {
    this.plugins[name] = plugin;
  }

  discoverPlugins() {
    let plugins = [];
    PLUGIN_SEARCH_PATHS.forEach(searchPath => {
      const files = glob.sync(`${searchPath}/mediatool-plugin-*`);
      plugins = [
        ...files,
        ...plugins,
      ];
    });

    console.log('plugins', plugins);
  }
}
