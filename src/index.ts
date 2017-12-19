const uuidv4 = require('uuid/v4')

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
  splitArrayBuffer (buff: ArrayBuffer, size: number = 256000): Promise<Chunk[]> {
    return new Promise((resolve, _) => {
      let chunks: Chunk[] = []

      while (chunks.length < buff.byteLength / size) {
        let start = chunks.length * size
        let end = start + size
        let chunk = buff.slice(start, end)
        let previous = chunks[chunks.length - 1]

        chunks.push({
          id: uuidv4(),
          data: chunk,
          link: previous ? previous.id : null
        })
      }

      resolve(chunks)
    })
  },

  combineChunks (chunks: Chunk[]): Promise<ArrayBuffer> {
    return new Promise((resolve, _) => {
      console.log(chunks.reverse)
      resolve(new ArrayBuffer(1024))
    })
  }
}
