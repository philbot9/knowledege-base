import { fromIterable, fromArray, toArray } from './async-iterator'

describe('async-iterator', () => {
  it('fromIterable()', async () => {
    const s = new Set([1, 2, 3])
    const iterable = s.values()
    const asyncIter = fromIterable(iterable)

    const result = []
    for await (const x of asyncIter) {
      result.push(x)
    }

    expect(result).toEqual([1, 2, 3])
  })

  it('fromArray()', async () => {
    const arr = [1, 2, 3]
    const asyncIter = fromArray<number>(arr)

    const result = []
    for await (const x of asyncIter) {
      result.push(x)
    }

    expect(result).toEqual(arr)
  })

  it('toArray()', async () => {
    const iter = fromArray([1, 2, 3])
    expect(toArray(iter)).resolves.toEqual([1, 2, 3])
  })
})
