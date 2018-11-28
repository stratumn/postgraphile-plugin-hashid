import { Plugin } from 'graphile-build';
import { transformBigIntToHashId } from './transform';
import { hashids } from './scalar';

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

const base64 = (str: string): string =>
  Buffer.from(String(str)).toString('base64');
const base64Decode = (str: string): string =>
  Buffer.from(String(str), 'base64').toString('utf8');

export const hashIdNodeIdPlugin: Plugin = builder => {
  builder.hook('build', build => ({
    ...build,
    getNodeIdForTypeAndIdentifiers(type: any, ...identifiers: any) {
      return base64(
        JSON.stringify([build.getNodeAlias(type), hashids.encode(identifiers)])
      );
    },
    getTypeAndIdentifiersFromNodeId(nodeId: any) {
      const [alias, ...identifiers] = JSON.parse(base64Decode(nodeId));
      return {
        Type: build.getNodeType(alias),
        identifiers: hashids.decode(...identifiers)
      };
    }
  }));
};
