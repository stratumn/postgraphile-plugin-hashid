import { makePluginByCombiningPlugins } from 'graphile-utils';
import { mocked } from 'ts-jest/utils';

jest.mock('graphile-utils');
jest.mock('./fieldPlugin', () => ({
  hashIdInputPlugin: 'hashIdInputPlugin',
  hashIdOutputPlugin: 'hashIdOutputPlugin'
}));
jest.mock('./queryPlugin', () => 'hashIdQueryArgsPlugin');

const mockCombinePlugins = mocked(makePluginByCombiningPlugins);

describe('hashId plugin', () => {
  it('combines the plugins together', () => {
    require('.');
    expect(mockCombinePlugins).toHaveBeenCalledTimes(1);
    expect(mockCombinePlugins).toHaveBeenCalledWith(
      'hashIdOutputPlugin',
      'hashIdInputPlugin',
      'hashIdQueryArgsPlugin'
    );
  });
});
