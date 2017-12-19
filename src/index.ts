import * as SparkMD5 from 'spark-md5'

interface FileReaderEvent extends Event {
  target: any
  getMessage? (): string
}

export interface Chunk {
  id: string
  data: ArrayBuffer
  link: string | null
}

export default {
  /**
   * converFileToArrayBuffer takes a file or Blob and converts it to an
   * ArrayBuffer.
   * @param file File of Blob
   */
  convertFileToArrayBuffer (file: File | Blob): Promise<ArrayBuffer> {
    return new Promise((resolve: any, reject: any) => {
      let fileReader = new FileReader()

      if (!(file instanceof Blob)) {
        reject('Argument must either be a File or Blob')
      }

      fileReader.onload = (ev: FileReaderEvent): void => {
        resolve(ev.target.result)
      }

      fileReader.readAsArrayBuffer(file)
    })
  },

  /**
   * splitArrayBuffer splits an array buffer into chunks of n size.
   *
   * @param buff ArrayBuffer
   * @param size number
   */
  splitArrayBuffer (buff: ArrayBuffer, size: number = 256000): Promise<object> {
    return new Promise((resolve, _) => {
      let hm: any = {}
      let sliceNum = 0

      while (sliceNum < buff.byteLength / size) {
        let start = sliceNum * size
        let end = start + size
        let chunk = buff.slice(start, end)

        hm[hash(chunk)] = chunk

        sliceNum ++
      }

      resolve(hm)
    })
  },

  combineChunks (chunks: Chunk[]): Promise<ArrayBuffer> {
    return new Promise((resolve, _) => {
      console.log(chunks)
      resolve(new ArrayBuffer(1024))
    })
  }
}

// hash the given array buffer in order to create an identifier for a given
// chunk. The goal is that a hash map will hold the given data and if 2
// chunks are identical they should only represented once in the HM
function hash (chunk: ArrayBuffer): string {
  return SparkMD5.ArrayBuffer.hash(chunk, false)
}
