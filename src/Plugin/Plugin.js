/*
 * @providesModule PluginWorksNice
 */

// Plugin class allows the implementation of additional functionality
export default class Plugin {
  async commands() {
    return [];
  }

  async run() {
    process.exit(await this._internalRun());
  }
}
