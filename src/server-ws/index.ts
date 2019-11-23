import WebSocket from 'ws'
import http from 'http'

import { router } from './router'

export interface RequestAction {
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
    detectRemoteIP(req)

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

function detectRemoteIP(req: http.IncomingMessage) {
  const ip = req.connection.remoteAddress
  console.info(`[IP]: Remote IP: ${ip || 'Unknown'}`)
  return ip
}
