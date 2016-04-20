import fs from 'fs';

const contains = (arr, val) => arr && arr.indexOf(val) !== -1;

const readDir = (dirName) => {
  try {
    return fs.readdirSync(dirName);
  } catch (e) {
    return [];
  }
};

export default (options = {}) => {
  const blacklist = [].concat(options.blacklist || []);
  const binaryDirs = [].concat(options.binaryDirs || ['.bin']);
  const modulesDir = options.modulesDir || 'node_modules';

  const isNotBinary = (x) => !contains(binaryDirs, x);
  const isNotBlacklisted = x => !contains(blacklist, x);

  return readDir(modulesDir).filter(isNotBinary).filter(isNotBlacklisted);
};
