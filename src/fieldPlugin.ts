import { Plugin } from 'graphile-build';
import { transformBigIntToHashId } from './transform';

export const hashIdInputPlugin: Plugin = builder => {
  builder.hook('GraphQLInputObjectType:fields:field', (field, build, context) =>
    transformBigIntToHashId(
      field,
      build,
      context,
      context.scope.fieldName,
      field.description
    )
  );
};

export const hashIdOutputPlugin: Plugin = builder => {
  builder.hook('GraphQLObjectType:fields:field', (field, build, context) =>
    transformBigIntToHashId(
      field,
      build,
      context,
      context.scope.fieldName,
      field.description
    )
  );
};
