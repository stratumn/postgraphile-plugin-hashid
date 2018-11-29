import { makePluginByCombiningPlugins } from 'graphile-utils';
import { SchemaBuilder, Options } from 'graphile-build';

import { initHashIds } from './scalar';
export { encode, decode } from './scalar';

import {
  hashIdInputPlugin,
  hashIdOutputPlugin,
  hashIdNodeIdPlugin
} from './fieldPlugin';
import hashIdQueryArgsPlugin from './queryPlugin';

const hashIdPlugin = (builder: SchemaBuilder, options: Options) => {
  const { hashIdSalt = 'secret', hashIdLength = 12 } = options;
  initHashIds(hashIdSalt as string, hashIdLength as number);

  makePluginByCombiningPlugins(
    hashIdOutputPlugin,
    hashIdInputPlugin,
    hashIdNodeIdPlugin,
    hashIdQueryArgsPlugin
  )(builder, options);
};

export default hashIdPlugin;
