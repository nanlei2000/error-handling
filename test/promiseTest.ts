import { Result, callAsync, call, Ok, Err } from '../src/index';
import * as assert from 'assert';

const res: Result<number, Error> = call(() => JSON.parse('\\'));

if (res.isErr !== false) {
  // value is `undefined` here
  console.error(res.error);
} else {
  // value is `number` here
  console.log(res.value);
}

function mayFail(): Result<number, Error> {
  return call(() => {
    if (Math.random() < 0.5) {
      return 0;
    } else {
      throw new Error('too big');
    }
  });
}

(async () => {
  const res = await callAsync<number, Error>(
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('promise reject'));
      }, 1000);
    })
  );
  const value = res.unwrapOr(1, '出错了!!');
  console.log('🤓🤔😓: value', value);
})();

const value1 = call<object>(JSON.parse.bind(this, '\\')).unwrapOr({});
const value2 = call<object>(
  JSON.parse.bind(this, '{"hello":"world"}')
).unwrapOr({});
console.log(value1);
console.log(value2);

const parsed = call<object>(JSON.parse.bind(this, '\\')).unwrapOr({});
console.log(parsed);
const value5 = call<object, Error>(JSON.parse.bind(this, '\\')).unwrapOrElse(
  err => (console.log(err), {})
);
const object: {
  a?: {
    b?: {
      c?: string;
    };
  };
} = {};

const value = call(() => object!.a!.b!.c!).unwrapOr('ok'); // ok;
console.log('🤓🤔😓: value', value);

Ok(1).unwrapOr(2);
Ok(1).unwrapOrElse(err => {
  console.log('→: err', err);
  return 2;
});

Err<string, Error>(new Error('测试')).unwrapOrElse(
  err => (console.log(err.message), '')
);
