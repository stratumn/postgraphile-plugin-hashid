import { mocked } from 'ts-jest/utils';
import {
  hashIdInputPlugin,
  hashIdOutputPlugin,
  hashIdNodeIdPlugin
} from './fieldPlugin';
import { transformBigIntToHashId } from './transform';

jest.mock('./transform');
const mockTransformBigIntToHashId = mocked(transformBigIntToHashId);

const builder: any = { hook: jest.fn() };
const options: any = null;

describe('hashId plugin', () => {
  beforeEach(() => {
    builder.hook.mockClear();
    mockTransformBigIntToHashId.mockClear();
  });

  it('calls hashIdInputPlugin', () => {
    hashIdInputPlugin(builder, options);
    expect(builder.hook).toHaveBeenCalledTimes(1);
    expect(builder.hook).toHaveBeenCalledWith(
      'GraphQLInputObjectType:fields:field',
      expect.any(Function)
    );
    const hookFn = builder.hook.mock.calls[0][1];
    const field = { name: 'field', description: 'desc' };
    const build = 'build';
    const context = { name: 'ctx', scope: { fieldName: 'fieldName' } };
    hookFn(field, build, context);
    expect(mockTransformBigIntToHashId).toHaveBeenCalledTimes(1);
    expect(mockTransformBigIntToHashId).toHaveBeenCalledWith(
      field,
      build,
      context,
      context.scope.fieldName,
      field.description
    );
  });

  it('calls hashIdOutputPlugin', () => {
    hashIdOutputPlugin(builder, options);
    expect(builder.hook).toHaveBeenCalledTimes(1);
    expect(builder.hook).toHaveBeenCalledWith(
      'GraphQLObjectType:fields:field',
      expect.any(Function)
    );
    const hookFn = builder.hook.mock.calls[0][1];
    const field = { name: 'field', description: 'desc' };
    const build = 'build';
    const context = { name: 'ctx', scope: { fieldName: 'fieldName' } };
    hookFn(field, build, context);
    expect(mockTransformBigIntToHashId).toHaveBeenCalledTimes(1);
    expect(mockTransformBigIntToHashId).toHaveBeenCalledWith(
      field,
      build,
      context,
      context.scope.fieldName,
      field.description
    );
  });

  it('calls hashIdNodeIdPlugin', () => {
    hashIdNodeIdPlugin(builder, options);
    expect(builder.hook).toHaveBeenCalledTimes(1);
    expect(builder.hook).toHaveBeenCalledWith('build', expect.any(Function));
    const hookFn = builder.hook.mock.calls[0][1];
    const build = {
      foo: 'bar',
      yin: 'yang'
    };
    const extendedBuild = hookFn(build);
    expect(extendedBuild).not.toBeNull();
    const {
      getNodeIdForTypeAndIdentifiers,
      getTypeAndIdentifiersFromNodeId,
      ...originBuild
    } = extendedBuild;
    expect(originBuild).toEqual(build);

    // Test encodingh functions
    const nodeIdValue = 'WyJhbGlhc19ub2RlVHlwZSIsInJSNUpwRFNWSlZwTyJd';
    const Type = 'nodeType';
    const identifiers = [42, 43];
    // Test encode
    expect(getNodeIdForTypeAndIdentifiers).not.toBeUndefined();
    (build as any).getNodeAlias = jest.fn();
    (build as any).getNodeAlias.mockImplementationOnce(
      (x: string) => `alias_${x}`
    );
    expect(getNodeIdForTypeAndIdentifiers(Type, ...identifiers)).toBe(
      nodeIdValue
    );
    // Test decode
    expect(getTypeAndIdentifiersFromNodeId).not.toBeUndefined();
    (build as any).getNodeType = jest.fn();
    (build as any).getNodeType.mockImplementationOnce((x: string) =>
      x.replace(/^alias_/, '')
    );
    expect(getTypeAndIdentifiersFromNodeId(nodeIdValue)).toMatchObject({
      Type,
      identifiers
    });
  });
});
