# error-handling

- [rust: unwrap_or(),unwrap_or_else()](https://learning-rust.github.io/docs/e4.unwrap_and_expect.html)

### example
```typescript
// safe & type safe access nested properties
const object: {
  a?: {
    b?: {
      c?: string;
    };
  };
} = {};

const value = call(() => object!.a!.b!.c!).unwrapOr('ok'); // ok
```