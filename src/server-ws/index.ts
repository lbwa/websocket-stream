import WebSocket from 'ws'
import http from 'http'
import { randomBytes } from 'crypto'

interface RequestAction {
  action: number
  [key: string]: any
}

export function createWebSocketServer(options: WebSocket.ServerOptions) {
  const wss = new WebSocket.Server(options)

  wss.on('connection', function connection(
    ws: WebSocket,
    req: http.IncomingMessage,
    client: Set<WebSocket>
  ) {
    ws.on('message', function onmessage(data: string) {
      let request: RequestAction
      try {
        request = JSON.parse(data)
      } catch (err) {
        console.error('[ONMESSAGE ERROR]', err)
        return ws.send(
          JSON.stringify({
            type: 1,
            data: 'Bad request'
          })
        )
      }

      router(ws, request)
    })
  })
}

function router(ws: WebSocket, request: RequestAction) {
  const send = (res: any, cb?: (err?: Error | undefined) => void) =>
    ws.send(JSON.stringify(res), cb)

  switch (request.action) {
    case 0:
      return send({
        type: 0,
        data: 'connected'
      })

    case 1:
      // https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback
      ws.send(randomBytes(1024))
      return

    default:
      return send({
        type: 1,
        data: 'Bad request'
      })
  }
}
