import { makePluginByCombiningPlugins } from 'graphile-utils';
import { SchemaBuilder, Plugin } from 'graphile-build';
import { mocked } from 'ts-jest/utils';
import { default as hashIdPlugin } from './index';
import { initHashIds } from './scalar';

jest.mock('graphile-utils');
jest.mock('./fieldPlugin', () => ({
  hashIdInputPlugin: 'hashIdInputPlugin',
  hashIdOutputPlugin: 'hashIdOutputPlugin',
  hashIdNodeIdPlugin: 'hashIdNodeIdPlugin'
}));
jest.mock('./queryPlugin', () => 'hashIdQueryArgsPlugin');
jest.mock('./scalar', () => ({
  initHashIds: jest.fn()
}));

jest.mock('graphile-utils');
const mockCombinePlugins = mocked(makePluginByCombiningPlugins);
mockCombinePlugins.mockImplementation((): Plugin => jest.fn());
const mockSchemaBuilder = {} as SchemaBuilder;

describe('hashId plugin', () => {
  it('combines the plugins together', () => {
    hashIdPlugin(mockSchemaBuilder, {});
    expect(mockCombinePlugins).toHaveBeenCalledTimes(1);
    expect(mockCombinePlugins).toHaveBeenCalledWith(
      'hashIdOutputPlugin',
      'hashIdInputPlugin',
      'hashIdNodeIdPlugin',
      'hashIdQueryArgsPlugin'
    );
  });

  it('init hashids with default', () => {
    hashIdPlugin(mockSchemaBuilder, {});
    expect(initHashIds).toBeCalled();
    expect(initHashIds).toBeCalledWith('secret', 12);
  });

  it('init hashids with custom values', () => {
    hashIdPlugin(mockSchemaBuilder, { hashIdSalt: 'foo', hashIdLength: 42 });
    expect(initHashIds).toBeCalled();
    expect(initHashIds).toBeCalledWith('foo', 42);
  });
});
