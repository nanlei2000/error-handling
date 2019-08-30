# error-handling
[![npm version](https://badge.fury.io/js/%40nanlei%2Ferror-handling.svg)](https://badge.fury.io/js/%40nanlei%2Ferror-handling)
- [rust: unwrap_or(),unwrap_or_else()](https://learning-rust.github.io/docs/e4.unwrap_and_expect.html)

### usage
- safe and type safe access nested properties
```typescript
const object: {
  a?: {
    b?: {
      c?: string;
    };
  };
} = {};

const value = call(() => object!.a!.b!.c!).unwrapOr('ok'); // ok
```
- compare to `nil` to narrow the `Result` type
```typescript
import { nil, Result } from '../src/index';
const res: Result<number, Error> = call(() => JSON.parse('\\'));
if (res.error !== nil) {
  // value is `undefined` here
  console.error(res.error);
} else {
  // value is `number` here
  console.log(res.value);
}
```
- define a method return a `Result` type
```typescript
function mayFail(): Result<number, Error> {
  return call(() => {
    if (Math.random() < 0.5) {
      return 0;
    } else {
      throw new Error("too big");
    }
  });
}
```