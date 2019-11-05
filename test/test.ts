import {
  tryCatch,
  Match,
  Ok,
  Err,
  Result,
  parseJSON,
  stringifyJSON,
} from '../src/index';
import * as Rx from 'rxjs';
import { catchError } from 'rxjs/operators';
import { noop } from '@babel/types';
describe('callWithCheckedError', () => {
  test('should get nil', () => {
    const result = tryCatch(() => {
      return 1 + 1;
    });
    Match(result)({
      Ok: value => {
        expect(value).toBe(2);
      },
      Err: Rx.noop,
    });
    expect(result.isErr).toBe(false);
  });

  test('should throw error', () => {
    function throwError() {
      const result = tryCatch(() => {
        return JSON.parse('\\');
      });
      if (result.isErr) {
        throw new Error('json 无法解析');
      }
    }
    expect(throwError).toThrow();
  });

  test('can throw `undefined`', () => {
    const result = tryCatch<never, undefined>(() => {
      throw undefined;
    });
    Match(result)({
      Err: err => expect(err).toBe(undefined),
    });
  });

  test('should catch async error', async () => {
    const result = await tryCatch(Promise.reject(1));
    result.isErr && expect(result.error).toBe(1);
  });
});
describe('asyncCallWithCheckedError', () => {
  test('should get nil', async () => {
    const result = await tryCatch(Promise.resolve(1 + 1));
    expect(result.isErr).toBe(false);
    Match(result)({
      Ok: value => {
        expect(value).toBe(2);
      },
      Err: Rx.noop,
    });
  });
});
describe(`unwrapOr`, () => {
  test(`sync`, () => {
    const res1 = tryCatch(() => 1).unwrapOr(0);
    const res2 = tryCatch<number>(() => JSON.parse('\\')).unwrapOr(0);
    expect(res1).toBe(1);
    expect(res2).toBe(0);
  });
  test(`async`, async () => {
    const res1 = (await tryCatch(Promise.resolve(1))).unwrapOr(0);
    expect(res1).toBe(1);
  });
});
describe(`unwrapOrElse`, () => {
  test(`sync`, () => {
    const res1 = tryCatch(() => 1).unwrapOrElse(e => {
      return 0;
    });
    const res2 = tryCatch<number>(() => JSON.parse('\\')).unwrapOrElse(e => {
      return 0;
    });
    expect(res1).toBe(1);
    expect(res2).toBe(0);
  });
  test(`async`, async () => {
    const res1 = (await tryCatch(Promise.resolve(1))).unwrapOrElse(e => {
      console.log(`never`);
      return 0;
    });
    expect(res1).toBe(1);
  });
});
describe('Work with rxjs', () => {
  test('sync', () => {
    const res$ = Rx.of(Ok(2)).pipe(
      catchError(err => Rx.of(Err<number, Error>(err)))
    );
    res$.subscribe(res => {
      Match(res)({
        Ok: value => expect(value).toBe(2),
        Err: err => console.log(err.message),
      });
    });
  });
});
describe('Deal with JSON', () => {
  test('parse', () => {
    const res1 = parseJSON('//');
    const res2 = parseJSON<object>(JSON.stringify({ a: 1 }));
    Match(res1)({
      Err: err => {
        console.log('→: err', err.message);
        expect(err).toBeInstanceOf(Error);
      },
    });
    Match(res2)({
      Err: noop,
      Ok: value => expect(value).toEqual({ a: 1 }),
    });
  });
  test('stringify', () => {
    const res1 = stringifyJSON({ a: 1 });
    var badObj: any = { a: 1 };
    badObj.b = badObj;
    const res2 = stringifyJSON(badObj);
    Match(res1)({
      Err: noop,
      Ok: value => expect(value).toEqual(JSON.stringify({ a: 1 })),
    });
    Match(res2)({
      Err: err => {
        console.log(err.message);
        expect(err).toBeInstanceOf(Error);
      },
    });
  });
});
