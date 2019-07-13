import {
  callWithCheckedError,
  nil,
  ResultWithCheckedError,
  asyncCallWithCheckedError,
} from './index'

describe('callWithCheckedError', () => {
  test('should get nil', () => {
    const result = callWithCheckedError(() => {
      return 1 + 1
    })
    expect(result.error).toBe(nil)
    expect(result.returnValue).toBe(2)
  })

  test('should throw error', () => {
    function throwError() {
      const result = callWithCheckedError(() => {
        return JSON.parse('\\')
      })
      if (result.error !== nil) {
        throw new Error('json 无法解析')
      }
    }
    expect(throwError).toThrow()
  })

  test('can throw `undefined`', () => {
    const result = callWithCheckedError(() => {
      throw undefined
    })
    expect(result.error).not.toBe(nil)
  })
  // don not do this
  test('can not throw `nil`', () => {
    const result = callWithCheckedError(() => {
      throw nil
    })
    expect(result.error).toBe(nil)
  })

  test('should not catch async error', () => {
    const result = callWithCheckedError(() => {
      return Promise.reject('1')
    })
    expect(result.error).toBe(nil)
  })
})
describe('asyncCallWithCheckedError', () => {
  test('should get nil', async () => {
    const result = await asyncCallWithCheckedError(() => {
      return Promise.resolve(1 + 1)
    })

    expect(result.error).toBe(nil)
    expect(result.returnValue).toBe(2)
  })

  test('can throw `undefined`', async () => {
    const result = await asyncCallWithCheckedError(() => {
      throw undefined
    })
    expect(result.error).not.toBe(nil)
  })
  // don not do this
  test('can not throw `nil`', async () => {
    const result = await asyncCallWithCheckedError(() => {
      throw nil
    })
    expect(result.error).toBe(nil)
  })

  test('should catch async error', async () => {
    const result = await asyncCallWithCheckedError(() => {
      return Promise.reject(new Error(`error`))
    })
    expect(result.error).not.toBe(nil)
  })
})
