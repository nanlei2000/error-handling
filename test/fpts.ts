import {
  either,
  tryCatch,
  toError,
  right,
  getOrElse,
  fold,
  isLeft,
} from 'fp-ts/lib/Either';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { call, callAsync, Match, Ok, Err, Result } from '../src/index';
import * as Rx from 'rxjs';
import { catchError } from 'rxjs/operators';
import { noop } from '@babel/types';
describe('callWithCheckedError', () => {
  test('should get nil', () => {
    const result = tryCatch<Error, number>(() => {
      return 1 + 1;
    }, toError);
    pipe(
      result,
      fold(
        err => {
          console.log(err);
        },
        value => {
          expect(value).toBe(2);
        }
      )
    );
    expect(
      pipe(
        result,
        isLeft
      )
    ).toBe(false);
  });

  test('should throw error', () => {
    function throwError() {
      const result = tryCatch(() => {
        return JSON.parse('\\');
      }, toError);
      if (E.isLeft(result)) {
        throw new Error('json 无法解析');
      }
    }
    expect(throwError).toThrow();
  });

  test('can throw `undefined`', () => {
    const result = tryCatch(() => {
      throw undefined;
    }, toError);
    expect(E.isLeft(result)).not.toBe(false);
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
describe('Work with rxjs', () => {
  test('sync', () => {
    const res$ = Rx.of(E.right<Error, number>(2)).pipe(
      catchError(err => Rx.of(E.left<Error, number>(toError(err))))
    );
    res$.subscribe(res => {
      pipe(
        res,
        fold(
          err => {},
          value => {
            expect(value).toBe(2);
          }
        )
      );
    });
  });
});
