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
  const value = res.unwrapOrDefault(1, '出错了!!');
  console.log('🤓🤔😓: value', value);
})();

const value1 = call<object>(JSON.parse.bind(this, '\\')).unwrapOrDefault({});
const value2 = call<object>(
  JSON.parse.bind(this, '{"hello":"world"}')
).unwrapOrDefault({});
console.log(value1);
console.log(value2);
