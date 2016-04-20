/* eslint-disable no-console */

import Plugin from '../Plugin';

const infoPlugin = new Plugin({
  name: 'info',
  callback: () => console.log('info was called!'),
});

infoPlugin.run();
