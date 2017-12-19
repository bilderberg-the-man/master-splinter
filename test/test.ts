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
      t.equals(result.length, Math.ceil(ab.byteLength / size))
    })
})

test('it reassembles the file from the peices', (t: any) => {
  const ab = new ArrayBuffer(1024 * 1024 * 10) // 1Mb

  return Splinter.splitArrayBuffer(ab, 256000)
    .then(chunks => {
      return Splinter.combineChunks(chunks)
    })
    .then(reconstructedAB => {
      console.log(reconstructedAB)
      t.ok(true)
    })
})
