import { Build, Context } from 'graphile-build';
import {
  isScalarType,
  isNonNullType,
  GraphQLFieldConfig,
  GraphQLInputFieldConfig
} from 'graphql';
import Maybe from 'graphql/tsutils/Maybe';
import snakeCase from 'lodash.snakecase';
import { parseTags } from './parseTags';
import { graphQLHashId } from './scalar';

export const stripTagsFromComment = (desc: Maybe<string>): Maybe<string> =>
  desc && parseTags(desc).text;

const extractDoNotUseHashId = (
  context: Context<GraphQLFieldConfig<{}, {}, any>>,
  description?: Maybe<string>
): any | undefined => {
  // Search in postgresql smart comments
  const { pgFieldIntrospection } = context.scope;
  let tags = pgFieldIntrospection && pgFieldIntrospection.tags;
  if (tags && !!tags.doNotUseHashId) {
    return tags.doNotUseHashId;
  }

  // Search in description
  if (description) {
    ({ tags } = parseTags(description));
    if (tags && !!tags.doNotUseHashId) {
      return tags.doNotUseHashId;
    }
  }

  // Warning: Hacky stuff below

  // Search in context.scope.pgIntrospection.attributes
  // smart comment on the target structure (ex: Group for GroupCondition)
  const { pgIntrospection } = context.scope;
  if (pgIntrospection) {
    const { attributes } = pgIntrospection;
    if (attributes) {
      const snakeFieldName = snakeCase(context.scope.fieldName);
      const match = attributes.find(
        (attr: any): boolean => attr.name === snakeFieldName
      );
      if (match && match.tags && !!match.tags.doNotUseHashId) {
        return match.tags.doNotUseHashId;
      }
    }
  }

  // Search in context.scope.__origin for function arguments
  if (context.scope.__origin) {
    ({ tags } = parseTags(
      context.scope.__origin
        .split(/(\\n|\n)/)
        .filter((l: string): boolean => l.substr(0, 1) === '@')
        .join('\n')
    ));
    return tags.doNotUseHashId;
  }
  return undefined;
};

const checkDoNotUseHashId = (
  context: Context<GraphQLFieldConfig<{}, {}, any>>,
  fieldName: string,
  description?: Maybe<string>
): boolean => {
  const doNotUseHashId = extractDoNotUseHashId(context, description);
  if (!doNotUseHashId) return false;
  if (Array.isArray(doNotUseHashId)) {
    return doNotUseHashId.includes(fieldName);
  }
  if (typeof doNotUseHashId === 'string') {
    return doNotUseHashId === fieldName;
  }
  return doNotUseHashId;
};

export const transformBigIntToHashId = (
  field: GraphQLFieldConfig<{}, {}, any> | GraphQLInputFieldConfig,
  build: Build,
  context: Context<GraphQLFieldConfig<{}, {}, any> | GraphQLInputFieldConfig>,
  fieldName: string,
  description?: Maybe<string>
): any => {
  const fieldType = isNonNullType(field.type) ? field.type.ofType : field.type;
  if (!isScalarType(fieldType)) return field;
  if (fieldType.name !== 'BigInt') return field;
  if (context.Self.name === 'BigIntFilter') return field;
  if (checkDoNotUseHashId(context, fieldName, description)) {
    return { ...field, description: stripTagsFromComment(description) };
  }
  let type = graphQLHashId;
  if (build.graphql.isNonNullType(field.type)) {
    type = build.graphql.GraphQLNonNull(graphQLHashId);
  }
  return { ...field, type };
};
