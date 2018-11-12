import { makePluginByCombiningPlugins } from 'graphile-utils';

import {
  hashIdInputPlugin,
  hashIdOutputPlugin,
  hashIdNodeIdPlugin
} from './fieldPlugin';
import hashIdQueryArgsPlugin from './queryPlugin';

export default makePluginByCombiningPlugins(
  hashIdOutputPlugin,
  hashIdInputPlugin,
  hashIdNodeIdPlugin,
  hashIdQueryArgsPlugin
);
