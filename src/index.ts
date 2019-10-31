function genLeft<V extends any, E = ErrorTypes>(value: V): Result<V, E> {
  return {
    error: nil,
    value: value,
    unwrapOr: (_defaultValue: V, _errorTitle?: string) => {
      return value;
    },
    unwrapOrElse: (_cb: UnwrapOrElseCallback<E, V>) => {
      return value;
    },
  };
}

function genRight<V extends any, E = ErrorTypes>(error: any): Result<V, E> {
  return {
    error: error as E,
    value: undefined,
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

/**
 * @param callback 待执行的函数
 * @description 使用值来处理错误
 */
export const call = <V extends any, E = ErrorTypes>(
  callback: () => V
): Result<V, E> => {
  try {
    const value = callback();
    return genLeft<V, E>(value);
  } catch (error) {
    return genRight<V, E>(error);
  }
};

export const callAsync = async <V extends any, E = ErrorTypes>(
  callback: () => Promise<V>
): Promise<Result<V, E>> => {
  try {
    const value = await callback();
    return genLeft<V, E>(value);
  } catch (error) {
    return genRight<V, E>(error);
  }
};

export const nil = Symbol('nil');
// 因为可以 throw 任何值
type ErrorTypes = string | number | boolean | object | undefined | null;
type UnwrapOr<V> = (value: V, errorTitle?: string) => V;
type UnwrapOrElseCallback<E, V> = (error: E) => V;
type UnwrapOrElse<V, E> = (callback: UnwrapOrElseCallback<E, V>) => V;
export type Result<V, E = ErrorTypes> = (
  | {
      error: typeof nil;
      value: V;
    }
  | {
      error: E;
      value: undefined;
    }) & {
  unwrapOr: UnwrapOr<V>;
  unwrapOrElse: UnwrapOrElse<V, E>;
};
