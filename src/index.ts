import { makePluginByCombiningPlugins } from 'graphile-utils';

import { initHashIds } from './scalar';
export { encode, decode } from './scalar';

import {
  hashIdInputPlugin,
  hashIdOutputPlugin,
  hashIdNodeIdPlugin
} from './fieldPlugin';
import hashIdQueryArgsPlugin from './queryPlugin';

export default (_: any, options: any) => {
  const { hashIdSalt = 'secret', hashIdLength = 12 } = options;
  initHashIds(hashIdSalt, hashIdLength);

  return makePluginByCombiningPlugins(
    hashIdOutputPlugin,
    hashIdInputPlugin,
    hashIdNodeIdPlugin,
    hashIdQueryArgsPlugin
  );
};
