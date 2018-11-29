import { makePluginByCombiningPlugins } from 'graphile-utils';
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

const mockCombinePlugins = mocked(makePluginByCombiningPlugins);

describe('hashId plugin', () => {
  it('combines the plugins together', () => {
    hashIdPlugin(undefined, {});
    expect(mockCombinePlugins).toHaveBeenCalledTimes(1);
    expect(mockCombinePlugins).toHaveBeenCalledWith(
      'hashIdOutputPlugin',
      'hashIdInputPlugin',
      'hashIdNodeIdPlugin',
      'hashIdQueryArgsPlugin'
    );
    expect(initHashIds).toBeCalled();
    expect(initHashIds).toBeCalledWith('secret', 12);
  });

  it('init hashids with default', () => {
    hashIdPlugin(undefined, {});
    expect(initHashIds).toBeCalled();
    expect(initHashIds).toBeCalledWith('secret', 12);
  });

  it('init hashids with default', () => {
    hashIdPlugin(undefined, { hashIdSalt: 'foo', hashIdLength: 42 });
    expect(initHashIds).toBeCalled();
    expect(initHashIds).toBeCalledWith('foo', 42);
  });
});
