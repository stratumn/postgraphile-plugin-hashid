import { GraphQLScalarType, ValueNode } from 'graphql';

import HashIds from 'hashids';

const salt = process.env.HASHID_SALT || 'secret';

export const hashids = new HashIds(salt, 12);

export const graphQLHashId: GraphQLScalarType = new GraphQLScalarType({
  name: 'HashId',
  description: `The HashId scalar type represents a int id hashed using hashids algorithm`,
  serialize(value: any) {
    return hashids.encode(value);
  },
  parseValue(value: any) {
    return hashids.decode(value)[0];
  },
  parseLiteral(value: ValueNode) {
    switch (value.kind) {
      case 'StringValue':
        return hashids.decode(value.value)[0];
      default:
        throw `Cannot decode unmanaged literal ${value.kind}`;
    }
  }
});
