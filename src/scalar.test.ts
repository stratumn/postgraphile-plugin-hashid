import { graphQLHashId } from './scalar';

describe('graphQLHashId', () => {
  it('serialize', () => {
    expect(graphQLHashId.serialize(42)).toEqual('xBVnl0jNoz3b');
  });
  it('parseValue', () => {
    expect(graphQLHashId.parseValue('xBVnl0jNoz3b')).toEqual(42);
  });
  it('parseLiteral string', () => {
    expect(
      graphQLHashId.parseLiteral(
        { kind: 'StringValue', value: 'xBVnl0jNoz3b' },
        undefined
      )
    ).toEqual(42);
  });
  it('parseLiteral other', () => {
    try {
      graphQLHashId.parseLiteral({ kind: 'IntValue', value: '42' }, undefined);
    } catch (e) {
      expect(e).toBe('Cannot decode unmanaged literal IntValue');
    }
  });
});
