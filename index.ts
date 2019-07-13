/**
 * @param callback 待执行的函数
 * @description 使用值来处理错误
 */
export const callWithCheckedError = <T extends any>(
  callback: () => T
): ResultWithCheckedError<T> => {
  try {
    return {
      error: nil,
      returnValue: callback(),
    }
  } catch (error) {
    return {
      error: error,
      returnValue: undefined,
    }
  }
}

export const asyncCallWithCheckedError = async <T extends any>(
  callback: () => Promise<T>
): Promise<ResultWithCheckedError<T>> => {
  try {
    return {
      error: nil,
      returnValue: await callback(),
    }
  } catch (error) {
    return {
      error: error,
      returnValue: undefined,
    }
  }
}

export const nil = Symbol('nil')
export type ResultWithCheckedError<T> =
  | {
      error: typeof nil
      returnValue: T
    }
  | {
      error: any
      returnValue: undefined
    }
