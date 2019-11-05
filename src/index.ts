type Ok<V extends any> = Result<V, never>;

export function Ok<V extends any>(value: V): Ok<V> {
  return {
    isErr: false,
    value: value,
    unwrapOr: (_defaultValue: V, _errorTitle?: string) => {
      return value;
    },
    unwrapOrElse: (_cb: UnwrapOrElseCallback<never, V>) => {
      return value;
    },
  };
}

type Err<V extends any, E> = Result<V, E>;

export function Err<V extends any, E = any>(error: any): Err<V, E> {
  return {
    error: error as E,
    isErr: true,
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

type Callbacks<E, V> = (callbacks: {
  Ok?: (value: V) => void;
  Err?: (err: E) => void;
}) => Result<V, E>;

export function Match<V, E>(res: Result<V, E>): Callbacks<E, V> {
  const func: Callbacks<E, V> = callbacks => {
    if (res.isErr) {
      callbacks.Err && callbacks.Err(res.error);
    } else {
      callbacks.Ok && callbacks.Ok(res.value);
    }
    return res;
  };
  return func;
}
/**
 * @param callback 待执行的函数
 * @description 使用值来处理错误
 */
export const call = <V extends any, E = any>(
  callback: () => V
): Result<V, E> => {
  try {
    const value = callback();
    return Ok<V>(value);
  } catch (error) {
    return Err<V, E>(error);
  }
};

export const callAsync = async <V extends any, E = any>(
  task: PromiseLike<V>
): Promise<Result<V, E>> => {
  try {
    const value = await task;
    return Ok<V>(value);
  } catch (error) {
    return Err<V, E>(error);
  }
};

type UnwrapOr<V> = (value: V, errorTitle?: string) => V;
type UnwrapOrElseCallback<E, V> = (error: E) => V;
type UnwrapOrElse<V, E> = (callback: UnwrapOrElseCallback<E, V>) => V;
export type Result<V, E = any> = (
  | {
      isErr: false;
      value: V;
    }
  | {
      isErr: true;
      error: E;
    }) & {
  unwrapOr: UnwrapOr<V>;
  unwrapOrElse: UnwrapOrElse<V, E>;
};
