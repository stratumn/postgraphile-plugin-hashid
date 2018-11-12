import { mocked } from 'ts-jest/utils';
import hashIdQueryPlugin from './queryPlugin';
import { transformBigIntToHashId, stripTagsFromComment } from './transform';

jest.mock('./transform');
const mockTransformBigIntToHashId = mocked(transformBigIntToHashId);
const mockStripTagsFromComment = mocked(stripTagsFromComment);

const builder: any = { hook: jest.fn() };
const options: any = null;

const fields = {
  foo: {
    args: { first: 'fooFirst', second: 'fooSecond' },
    description: 'fooDesc'
  },
  bar: {
    args: { first: 'barFirst' },
    description: 'barDesc'
  },
  baz: {
    xxxx: { first: 'bazFirst' },
    description: 'bazDesc'
  }
};
const build = 'build';
let context: any;

describe('hashId query plugin', () => {
  let hookFn: any;
  beforeEach(() => {
    mockTransformBigIntToHashId.mockClear();
    mockStripTagsFromComment.mockClear();
    builder.hook.mockClear();
    context = {
      name: 'ctx',
      scope: { isRootQuery: true },
      Self: { name: 'Query' }
    };

    hashIdQueryPlugin(builder, options);
    expect(builder.hook).toHaveBeenCalledTimes(1);
    expect(builder.hook).toHaveBeenCalledWith(
      'GraphQLObjectType:fields',
      expect.any(Function)
    );
    hookFn = builder.hook.mock.calls[0][1];
  });

  describe('visits non query object', () => {
    it('visits non root object', () => {
      context.scope.isRootQuery = false;
      hookFn(fields, build, context);
      expect(mockTransformBigIntToHashId).not.toHaveBeenCalled();
      expect(mockStripTagsFromComment).not.toHaveBeenCalled();
    });

    it('visits non query object', () => {
      context.Self.name = 'Mutation';
      hookFn(fields, build, context);
      expect(mockTransformBigIntToHashId).not.toHaveBeenCalled();
      expect(mockStripTagsFromComment).not.toHaveBeenCalled();
    });
  });

  it('visits and transforms queries', () => {
    mockTransformBigIntToHashId.mockImplementation(x => x);
    hookFn(fields, build, context);
    expect(mockTransformBigIntToHashId).toHaveBeenCalledTimes(3);
    expect(mockTransformBigIntToHashId).toHaveBeenNthCalledWith(
      1,
      fields.foo.args.first,
      build,
      context,
      'first',
      fields.foo.description
    );
    expect(mockTransformBigIntToHashId).toHaveBeenNthCalledWith(
      3,
      fields.bar.args.first,
      build,
      context,
      'first',
      fields.bar.description
    );
    expect(mockStripTagsFromComment).toHaveBeenCalledTimes(2);
    expect(mockStripTagsFromComment).toHaveBeenNthCalledWith(
      1,
      fields.foo.description
    );
    expect(mockStripTagsFromComment).toHaveBeenNthCalledWith(
      2,
      fields.bar.description
    );
  });
});
