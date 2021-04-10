export function fromIterable<T>(iterator: IterableIterator<T>) {
  const asyncIterable = {
    [Symbol.asyncIterator]() {
      return {
        next() {
          return Promise.resolve(iterator.next())
        }
      }
    }
  }

  return asyncIterable
}

export function fromArray<T>(arr: T[]) {
  const asyncIterable = {
    [Symbol.asyncIterator]() {
      let i = 0
      return {
        next() {
          i++
          return Promise.resolve({
            value: arr[i - 1],
            done: i > arr.length
          })
        }
      }
    }
  }

  return asyncIterable
}

export async function toArray<T>(iter: AsyncIterable<T>): Promise<T[]> {
  const arr = []
  for await (const x of iter) {
    arr.push(x)
  }
  return arr
}
