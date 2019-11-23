import WebSocket = require('ws')
import { randomBytes } from 'crypto'
import fs from 'fs'
import path from 'path'

import { RequestAction } from '.'

export function router(ws: WebSocket, request: RequestAction) {
  const send = (...rest: [Record<string, any>, ...any[]]) =>
    ws.send(JSON.stringify(rest[0]), ...rest.slice(1))

  switch (request.action) {
    case 0:
      return send({
        type: 0,
        data: 'connected'
      })

    case 1:
      // https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
      // https://github.com/websockets/ws/blob/master/doc/ws.md#websocketsenddata-options-callback
      ws.send(randomBytes(1024))
      return

    case 2:
      const rs = fs.createReadStream(
        path.resolve(process.cwd(), 'src/services/video.mp4'),
        {
          // DOC: https://nodejs.org/api/stream.html#stream_buffering
          highWaterMark: 1 * 1024 // bytes
        }
      )
      let size = 0
      let chunks = 0
      rs.on('data', chunk => {
        chunks++
        size += chunk.length
        ws.send(chunk)
      })
      rs.on('end', () => {
        send({
          type: 0,
          data: {
            size,
            chunks
          }
        })
      })
      return

    default:
      return send({
        type: 1,
        data: 'Bad request'
      })
  }
}
