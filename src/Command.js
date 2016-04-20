import commander from 'commander';

export default class Command {
  constructor({
    version,
    name,
    options,
    usage,
    description,
    help,
    aliases,
    callback,
  }) {
    this.version = version || 'dev';
    this.name = name;
    this.options = options || [];
    this.usage = usage || '';
    this.description = description || '';
    this.help = help || '';
    this.aliases = aliases || [];
    this.callback = callback || false;

    if (!this.name) throw new Error('Command is missing a name');
    if (!Array.isArray(this.options)) throw new Error('Command options should be an array');
    if (!Array.isArray(this.aliases)) throw new Error('Command aliases should be an array');
  }

  async run() {
    process.exit(await this._internalRun());
  }

  async _internalRun(args = process.argv) {
    let program = commander.version(this.version);

    if (this.usage) program = program.usage(this.usage);

    this.options.forEach(option => {
      program = program.option.apply(program, option);
    });

    const options = program.parse(args);

    return await this.callback(options);
  }
}
