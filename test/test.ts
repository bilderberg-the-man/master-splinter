import Splinter from '../src/index'
const test = require('blue-tape')

test('it returns an ArrayBuffer given that it has been handed a blob', (t: any) => {
  let file = new Blob(['This is a test file'], { type: 'plain/text' })

  return Splinter.convertFileToArrayBuffer(file)
    .then(result => {
      t.ok(result instanceof ArrayBuffer)
      t.equals(result.byteLength, 19)
    })
})

test('it splits an ArrayBuffer to tiny little pieces', (t: any) => {
  const ab = new ArrayBuffer(1024 * 1024 * 10) // 1Mb
  const size = 256000

  return Splinter.splitArrayBuffer(ab, size)
    .then(result => {

      // Given the example Array buffer there should be 2 keys.
      // The first is the MD5 of 256k 0s, the other is 249k'ish 0s
      t.ok(hasKey('fe52e3ab6381cf6cc34d57bd28a6b2e0', result))
      t.ok(hasKey('25bfe113bc9eb27b2ed004e8378fdc30', result))
    })
})

//
// Support
//

function hasKey (key: string, obj: object): boolean {
  return !(key in Object.keys(obj))
}
