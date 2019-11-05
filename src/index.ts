interface Ok<V> {
  isErr: false;
  value: V;
  unwrapOr: UnwrapOr<V>;
  unwrapOrElse: UnwrapOrElse<V, never>;
}
export function Ok<V extends any>(value: V): Ok<V> {
  return {
    isErr: false as false,
    value: value,
    unwrapOr: (_defaultValue: V, _errorTitle?: string) => {
      return value;
    },
    unwrapOrElse: (_cb: UnwrapOrElseCallback<never, V>) => {
      return value;
    },
  };
}
interface Err<V, E> {
  error: E;
  isErr: true;
  unwrapOr: UnwrapOr<V>;
  unwrapOrElse: UnwrapOrElse<V, E>;
}

export function Err<V extends any, E = any>(error: any): Err<V, E> {
  return {
    error: error as E,
    isErr: true as true,
    unwrapOr: (defaultValue: V, errorTitle?: string) => {
      console.error(
        `${errorTitle ||
          ''}\nError occurred,default value \n ${defaultValue} \n is used instead \n`,
        error
      );
      return defaultValue;
    },
    unwrapOrElse: (cb: UnwrapOrElseCallback<E, V>) => {
      return cb(error);
    },
  };
}

const isFunction = (val: unknown): val is Function => typeof val === 'function';

type CaseHandle<E, V> = (handles: {
  Ok?: (value: V) => void;
  Err: (err: E) => void;
}) => Result<V, E>;

/**
 *
 * @param res Result
 * @description 辅助函数,模拟`pattern match`
 */
export function Match<V, E>(res: Result<V, E>): CaseHandle<E, V> {
  const func: CaseHandle<E, V> = handles => {
    if (res.isErr) {
      handles.Err(res.error);
    } else {
      handles.Ok && handles.Ok(res.value);
    }
    return res;
  };
  return func;
}
/**
 *
 * @param func Function may throw
 */
export function tryCatch<V extends any, E = any>(func: () => V): Result<V, E>;
/**
 *
 * @param promise Promise may reject
 */
export function tryCatch<V extends any, E = any>(
  promise: Promise<V>
): Promise<Result<V, E>>;
export function tryCatch<V extends any, E = any>(
  funcOrPromise: (() => V) | Promise<V>
): Result<V, E> | Promise<Result<V, E>> {
  if (isFunction(funcOrPromise)) {
    try {
      const value = funcOrPromise();
      return Ok<V>(value);
    } catch (error) {
      return Err<V, E>(error);
    }
  } else {
    return funcOrPromise.then(v => Ok<V>(v)).catch(err => Err<V, E>(err));
  }
}

type UnwrapOr<V> = (value: V, errorTitle?: string) => V;
type UnwrapOrElseCallback<E, V> = (error: E) => V;
type UnwrapOrElse<V, E> = (callback: UnwrapOrElseCallback<E, V>) => V;
export type Result<V, E> = Ok<V> | Err<V, E>;
