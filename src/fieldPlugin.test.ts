import { mocked } from 'ts-jest/utils';
import { hashIdInputPlugin, hashIdOutputPlugin } from './fieldPlugin';
import { transformBigIntToHashId } from './transform';

jest.mock('./transform');
const mockTransformBigIntToHashId = mocked(transformBigIntToHashId);

const builder: any = { hook: jest.fn() };
const options: any = null;

describe('hashId input plugin', () => {
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
});
