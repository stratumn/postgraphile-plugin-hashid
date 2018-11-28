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

## Release process

We are using `semantic-release` to publish the package on the NPM registry. Publishing can be triggered by "promoting" a successful build on master from Semaphore UI.

The commit message summary should follow the following format: `Tag: Message (fixes #1234)`

Where `Tag` is one of the following:

- Fix - for a bug fix.
- Update - for a backwards-compatible enhancement.
- Breaking - for a backwards-incompatible enhancement.
- Docs - changes to documentation only.
- Build - changes to build process only.
- New - implemented a new feature.
- Upgrade - for a dependency upgrade.

Rules about `Message`

- The message summary should be a one-sentence description of the change.
- First letter of the message is uppercase.
- The issue number should be mentioned at the end.
  - The commit message should say "(fixes #1234)" at the end of the description if it closes out an existing issue (replace 1234 with the issue number).
  - If the commit doesn't completely fix the issue, then use (refs #1234) instead of (fixes #1234).

Here are some good commit message summary examples:

```
Build: Update Semaphore to only test Node 0.10 (refs #734)
Fix: Semi rule incorrectly flagging extra semicolon (fixes #840)
Upgrade: Express to 13.4.2, switch to using Express comment attachment (fixes #730)
```
