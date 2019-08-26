import { nil, Result, callAsync, call } from './index';
import * as assert from 'assert';

(async () => {
  const res = await callAsync<number, Error>(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('promise reject'));
      }, 1000);
    });
  });
  const value = res.unwrapOr(1, '出错了!!');
  console.log('🤓🤔😓: value', value);
})();

const value1 = call<object>(JSON.parse.bind(this, '\\')).unwrapOr({});
const value2 = call<object>(
  JSON.parse.bind(this, '{"hello":"world"}')
).unwrapOr({});
console.log(value1);
console.log(value2);

const { value: parsed = {} } = call<object>(JSON.parse.bind(this, '\\'));

console.log(parsed);
const value5 = call<object, Error>(JSON.parse.bind(this, '\\')).unwrapOrElse(
  err => (console.log(err), {})
);
