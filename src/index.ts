import { makePluginByCombiningPlugins } from 'graphile-utils';

import { hashIdInputPlugin, hashIdOutputPlugin } from './fieldPlugin';
import hashIdQueryArgsPlugin from './queryPlugin';

export default makePluginByCombiningPlugins(
  hashIdOutputPlugin,
  hashIdInputPlugin,
  hashIdQueryArgsPlugin
);
