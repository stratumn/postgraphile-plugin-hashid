import { mocked } from 'ts-jest/utils';
import { isScalarType, isNonNullType, GraphQLNonNull } from 'graphql';
import snakeCase from 'lodash.snakecase';
import { transformBigIntToHashId, stripTagsFromComment } from './transform';
import { graphQLHashId } from './scalar';

jest.mock('graphql');
const mockIsScalarType = mocked(isScalarType);
const mockIsNonNullType = mocked(isNonNullType);
const mockGraphQLNonNull = mocked(GraphQLNonNull);
jest.mock('lodash.snakecase');
const mockSnakeCase = mocked(snakeCase);

describe('stripTagsFromComment', () => {
  it('undefined', () => {
    expect(stripTagsFromComment(undefined)).toBeUndefined();
  });
  it('null', () => {
    expect(stripTagsFromComment(null)).toBeNull();
  });
  it('unchanged', () => {
    const comment = 'Foo\nBar\nToto\nTata';
    expect(stripTagsFromComment(comment)).toEqual(comment);
  });
  it('strip tags', () => {
    const comment = '@tag1 bla\n@tag2\n@foo bar\nFoo\nBar\nToto\nTata';
    expect(stripTagsFromComment(comment)).toEqual('Foo\nBar\nToto\nTata');
  });
  it('tags after', () => {
    const comment = 'Foo\nBar\nToto\nTata\n@tag1 bla\n@tag2';
    expect(stripTagsFromComment(comment)).toEqual(comment);
  });
});

describe('transformBigIntToHashId', () => {
  let field: any;
  let context: any;
  beforeEach(() => {
    mockIsScalarType.mockClear();
    mockIsScalarType.mockImplementation(() => true);
    mockIsNonNullType.mockClear();
    mockIsNonNullType.mockImplementation(() => false);
    mockGraphQLNonNull.mockClear();
    mockSnakeCase.mockClear();
    field = {
      type: { name: 'BigInt' },
      description: 'My description'
    };
    context = {
      scope: {}, // { pgFieldIntrospection: { tags: { doNotUseHashId: true } } },
      Self: { name: 'FuncObject' }
    };
  });

  const build: any = {
    graphql: {
      isScalarType: mockIsScalarType,
      isNonNullType: mockIsNonNullType,
      GraphQLNonNull: mockGraphQLNonNull
    }
  };
  it('does nothing on non scalar field', () => {
    mockIsScalarType.mockImplementation(() => false);
    expect(
      transformBigIntToHashId(
        field,
        build,
        context,
        'fieldName',
        field.description
      )
    ).toEqual(field);
  });
  it('does nothing on non BigInt field', () => {
    field.type.name = 'String';
    expect(
      transformBigIntToHashId(
        field,
        build,
        context,
        'fieldName',
        field.description
      )
    ).toEqual(field);
  });
  it('does nothing on BigIntFilter object', () => {
    context.Self.name = 'BigIntFilter';
    expect(
      transformBigIntToHashId(
        field,
        build,
        context,
        'fieldName',
        field.description
      )
    ).toEqual(field);
  });
  describe('does not update field on doNotUseHashId tag detection', () => {
    it('does not update desc on postgres smart comment', () => {
      context.scope.pgFieldIntrospection = { tags: { doNotUseHashId: true } };
      expect(
        transformBigIntToHashId(
          field,
          build,
          context,
          'fieldName',
          field.description
        )
      ).toEqual(field);
    });
    it('updates desc on description comment', () => {
      const commentedDesc = `@doNotUseHashId\n${field.description}`;
      expect(
        transformBigIntToHashId(
          field,
          build,
          context,
          'fieldName',
          commentedDesc
        )
      ).toEqual(field);
    });
    it('does not update desc on hierarchical comment', () => {
      mockSnakeCase.mockImplementation(() => 'field_name');
      context.scope.pgIntrospection = {
        attributes: [{ name: 'field_name', tags: { doNotUseHashId: true } }]
      };
      expect(
        transformBigIntToHashId(
          field,
          build,
          context,
          'fieldName',
          field.description
        )
      ).toEqual(field);
    });
    it('does not update desc on function arguments', () => {
      context.scope.__origin = `blabla\nblabla\n@doNotUseHashId\nblabla\nblabla`;
      expect(
        transformBigIntToHashId(
          field,
          build,
          context,
          'fieldName',
          field.description
        )
      ).toEqual(field);
    });
  });
  it('changes type to graphQLHashId', () => {
    expect(
      transformBigIntToHashId(
        field,
        build,
        context,
        'fieldName',
        field.description
      )
    ).toEqual({ ...field, type: graphQLHashId });
  });
  it('changes type to non null graphQLHashId', () => {
    mockIsNonNullType.mockImplementation(() => true);
    field.type.ofType = { name: 'BigInt' };
    expect(
      transformBigIntToHashId(
        field,
        build,
        context,
        'fieldName',
        field.description
      )
    ).toEqual({ ...field, type: build.graphql.GraphQLNonNull(graphQLHashId) });
    expect(mockGraphQLNonNull).toHaveBeenCalled();
  });
  describe('check doNotUseHashId type', () => {
    it('boolean', () => {
      const commentedDesc = `@doNotUseHashId\n${field.description}`;
      expect(
        transformBigIntToHashId(
          field,
          build,
          context,
          'fieldName',
          commentedDesc
        )
      ).toEqual(field);
    });
    it('good string', () => {
      const commentedDesc = `@doNotUseHashId fieldName\n${field.description}`;
      expect(
        transformBigIntToHashId(
          field,
          build,
          context,
          'fieldName',
          commentedDesc
        )
      ).toEqual(field);
    });
    it('bad string', () => {
      const commentedDesc = `@doNotUseHashId badName\n${field.description}`;
      expect(
        transformBigIntToHashId(
          field,
          build,
          context,
          'fieldName',
          commentedDesc
        )
      ).toEqual({ ...field, type: graphQLHashId });
    });
    it('good array', () => {
      const commentedDesc = `@doNotUseHashId badName\n@doNotUseHashId fieldName\n${
        field.description
      }`;
      expect(
        transformBigIntToHashId(
          field,
          build,
          context,
          'fieldName',
          commentedDesc
        )
      ).toEqual(field);
    });
    it('bad array', () => {
      const commentedDesc = `@doNotUseHashId badName\n@doNotUseHashId badName2\n${
        field.description
      }`;
      expect(
        transformBigIntToHashId(
          field,
          build,
          context,
          'fieldName',
          commentedDesc
        )
      ).toEqual({ ...field, type: graphQLHashId });
    });
  });
});
