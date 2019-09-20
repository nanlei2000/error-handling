# error-handling

[![npm version](https://badge.fury.io/js/%40nanlei%2Ferror-handling.svg)](https://badge.fury.io/js/%40nanlei%2Ferror-handling)

- [rust: unwrap_or(),unwrap_or_else()](https://learning-rust.github.io/docs/e4.unwrap_and_expect.html)
- [Scala 使用 Option、Some、None，避免使用 Null](https://www.runoob.com/w3cnote/scala-option-some-none.html)
- [Java 的异常](https://www.liaoxuefeng.com/wiki/1252599548343744/1264734349295520)

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
      throw new Error('too big');
    }
  });
}
```
