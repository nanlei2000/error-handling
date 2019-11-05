import { call, callAsync, Match } from '../src/index';
describe('callWithCheckedError', () => {
  test('should get nil', () => {
    const result = call(() => {
      return 1 + 1;
    });
    Match(result)({
      Ok: value => {
        expect(value).toBe(2);
      },
    });
    expect(result.isErr).toBe(false);
  });

  test('should throw error', () => {
    function throwError() {
      const result = call(() => {
        return JSON.parse('\\');
      });
      if (result.isErr) {
        throw new Error('json 无法解析');
      }
    }
    expect(throwError).toThrow();
  });

  test('can throw `undefined`', () => {
    const result = call(() => {
      throw undefined;
    });
    expect(result.isErr).not.toBe(false);
  });

  test('should not catch async error', () => {
    const result = call(() => {
      return Promise.reject('1');
    });
    expect(result.isErr).toBe(false);
  });
});
describe('asyncCallWithCheckedError', () => {
  test('should get nil', async () => {
    const result = await callAsync(Promise.resolve(1 + 1));
    expect(result.isErr).toBe(false);
    Match(result)({
      Ok: value => {
        expect(value).toBe(2);
      },
    });
  });
});
describe(`unwrapOr`, () => {
  test(`sync`, () => {
    const res1 = call(() => 1).unwrapOr(0);
    const res2 = call<number>(() => JSON.parse('\\')).unwrapOr(0);
    expect(res1).toBe(1);
    expect(res2).toBe(0);
  });
  test(`async`, async () => {
    const res1 = (await callAsync(Promise.resolve(1))).unwrapOr(0);
    expect(res1).toBe(1);
  });
});
describe(`unwrapOrElse`, () => {
  test(`sync`, () => {
    const res1 = call(() => 1).unwrapOrElse(e => {
      return 0;
    });
    const res2 = call<number>(() => JSON.parse('\\')).unwrapOrElse(e => {
      return 0;
    });
    expect(res1).toBe(1);
    expect(res2).toBe(0);
  });
  test(`async`, async () => {
    const res1 = (await callAsync(Promise.resolve(1))).unwrapOrElse(e => {
      console.log(`never`);
      return 0;
    });
    expect(res1).toBe(1);
  });
});
