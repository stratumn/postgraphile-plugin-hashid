import { Plugin, Build, Context } from 'graphile-build';
import { GraphQLFieldConfig } from 'graphql';
import { transformBigIntToHashId, stripTagsFromComment } from './transform';

const modifyQuery = (
  build: Build,
  context: Context<GraphQLFieldConfig<{}, {}, any>>,
  field: GraphQLFieldConfig<{}, {}, any>
): any => {
  if (!field.args) return field;
  field.args = Object.entries(field.args).reduce(
    (acc: any, [fieldName, fieldArg]: any[]) => ({
      ...acc,
      [fieldName]: transformBigIntToHashId(
        fieldArg,
        build,
        context,
        fieldName,
        field.description
      )
    }),
    {}
  );
  const description = stripTagsFromComment(field.description);
  return { ...field, description };
};

export const hashIdQueryArgsPlugin: Plugin = builder => {
  builder.hook('GraphQLObjectType:fields', (fields, build, context) => {
    if (context.scope.isRootQuery && context.Self.name === 'Query') {
      return Object.entries(fields).reduce(
        (acc, [funcName, funcField]: any[]) => ({
          ...acc,
          [funcName]: modifyQuery(build, context, funcField)
        }),
        {}
      );
    }
    return fields;
  });
};

export default hashIdQueryArgsPlugin;
