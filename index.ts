const genUnwrapOrErrorHandle = <V extends any, E = ErrorTypes>(
  error: E
): UnwrapOr<V> => {
  return (defaultValue: V, errorTitle?: string) => {
    console.error(
      `${errorTitle ||
        ''}\nError occurred,default value \n ${defaultValue} \n is used instead \n`,
      error
    );
    return defaultValue;
  };
};
const genUnwrapOrOkHandle = <V extends any>(value: V): UnwrapOr<V> => {
  return (_defaultValue: V, _errorTitle?: string) => {
    return value;
  };
};

/**
 * @param callback 待执行的函数
 * @description 使用值来处理错误
 */
export const call = <V extends any, E = ErrorTypes>(
  callback: () => V
): Result<V, E> => {
  try {
    const value = callback();
    return {
      error: nil,
      value: value,
      unwrapOr: genUnwrapOrOkHandle(value),
    };
  } catch (error) {
    return {
      error: error as E,
      value: undefined,
      unwrapOr: genUnwrapOrErrorHandle<V, E>(error),
    };
  }
};

export const callAsync = async <V extends any, E = ErrorTypes>(
  callback: () => Promise<V>
): Promise<Result<V, E>> => {
  try {
    const value = await callback();
    return {
      error: nil,
      value: value,
      unwrapOr: genUnwrapOrOkHandle(value),
    };
  } catch (error) {
    return {
      error: error as E,
      value: undefined,
      unwrapOr: genUnwrapOrErrorHandle<V, E>(error),
    };
  }
};

export const nil = Symbol('nil');
type ErrorTypes = string | number | boolean | object | undefined | null;
type UnwrapOr<V> = (value: V, errorTitle?: string) => V;
export type Result<V, E = ErrorTypes> = (
  | {
      error: typeof nil;
      value: V;
    }
  | {
      // 因为可以 throw 任何值
      error: E;
      value: undefined;
    }) & {
  unwrapOr: UnwrapOr<V>;
};
