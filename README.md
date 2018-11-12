[![Build Status](https://semaphoreci.com/api/v1/projects/eed6b3c3-3362-4867-a009-d11d25d72baf/2337807/shields_badge.svg)](https://semaphoreci.com/stratumn/postgraphile-plugin-hashid)
[![codecov](https://codecov.io/gh/stratumn/postgraphile-plugin-hashid/branch/master/graph/badge.svg?token=ZKGnBOIpSb)](https://codecov.io/gh/stratumn/postgraphile-plugin-hashid)

# postgraphile-plugin-hashid

This [PostGraphile](https://www.graphile.org/postgraphile/) plugin replaces database big int by hash ids

By default all Bigint are replaced by HashId.
You can avoid this behaviour for a column, input, function argument, ... using the tag `doNotUseHashId`

Examples:

```sql
comment on column foo.user_id is E'@doNotUseHashId\nThe user id type will be BigInt.';
comment on function edit_foo is E'@doNotUseHashId userId\nOnly BigInt argument userId will not be transformed.';
```

```js
export default gql`
  extend type Foo {
    """
    @doNotUseHashId
    anotherUserId type will be BigInt.
    """
    anotherUserId: BigInt!
  }
`;
```

## Install

To install node dependencies:

```bash
yarn
```

## Development

This command builds the library:

```bash
yarn build
```

## Tests

This command runs the unit tests:

```bash
yarn test
```
