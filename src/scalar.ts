import { GraphQLScalarType, ValueNode } from 'graphql';

import HashIds from 'hashids';

let hashids: any = undefined;

export const initHashIds = (salt: string, length: number) => {
  hashids = new HashIds(salt, length);
};

export const encode = (...value: number[]) => hashids.encode(...value);
export const decode = (value: string) => hashids.decode(value);
export const decodeOne = (value: string) => decode(value)[0];

export const graphQLHashId: GraphQLScalarType = new GraphQLScalarType({
  name: 'HashId',
  description: `The HashId scalar type represents a int id hashed using hashids algorithm`,
  serialize(value: any) {
    return encode(value);
  },
  parseValue(value: any) {
    return decodeOne(value);
  },
  parseLiteral(value: ValueNode) {
    switch (value.kind) {
      case 'StringValue':
        return decodeOne(value.value);
      default:
        throw `Cannot decode unmanaged literal ${value.kind}`;
    }
  }
});
