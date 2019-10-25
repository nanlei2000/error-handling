import { call, nil, callAsync } from '../src/index';
describe('callWithCheckedError', () => {
  test('should get nil', () => {
    const result = call(() => {
      return 1 + 1;
    });
    expect(result.error).toBe(nil);
    expect(result.value).toBe(2);
  });

  test('should throw error', () => {
    function throwError() {
      const result = call(() => {
        return JSON.parse('\\');
      });
      if (result.error !== nil) {
        throw new Error('json 无法解析');
      }
    }
    expect(throwError).toThrow();
  });

  test('can throw `undefined`', () => {
    const result = call(() => {
      throw undefined;
    });
    expect(result.error).not.toBe(nil);
  });
  // don not do this
  test('can not throw `nil`', () => {
    const result = call(() => {
      throw nil;
    });
    expect(result.error).toBe(nil);
  });

  test('should not catch async error', () => {
    const result = call(() => {
      return Promise.reject('1');
    });
    expect(result.error).toBe(nil);
  });
});
describe('asyncCallWithCheckedError', () => {
  test('should get nil', async () => {
    const result = await callAsync(() => {
      return Promise.resolve(1 + 1);
    });

    expect(result.error).toBe(nil);
    expect(result.value).toBe(2);
  });

  test('can throw `undefined`', async () => {
    const result = await callAsync(() => {
      throw undefined;
    });
    expect(result.error).not.toBe(nil);
  });
  // don not do this
  test('can not throw `nil`', async () => {
    const result = await callAsync(() => {
      throw nil;
    });
    expect(result.error).toBe(nil);
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
    const res1 = (await callAsync(() => Promise.resolve(1))).unwrapOr(0);
    const res2 = (await callAsync<number>(() =>
      Promise.resolve(JSON.parse('\\'))
    )).unwrapOr(0);
    const res3 = await callAsync(() => Promise.resolve(JSON.parse('\\'))).then(
      v => v.unwrapOr(0)
    );
    expect(res1).toBe(1);
    expect(res2).toBe(0);
    expect(res3).toBe(0);
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
    const res1 = (await callAsync(() => Promise.resolve(1))).unwrapOrElse(e => {
      console.log(`never`);
      return 0;
    });
    const res2 = (await callAsync<number, Error>(() =>
      Promise.resolve(JSON.parse('\\'))
    )).unwrapOrElse(e => {
      console.log(e.message);
      return 0;
    });
    expect(res1).toBe(1);
    expect(res2).toBe(0);
  });
});
