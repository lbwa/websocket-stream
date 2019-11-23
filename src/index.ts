import WebSocket from 'ws'
import http from 'http'

import { DEFAULT_PORT } from './shared/env'
import { server } from './basic-server'

const PORT = DEFAULT_PORT || process.env.PORT
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(
  ws: WebSocket,
  req: http.IncomingMessage,
  client: Set<WebSocket>
) {
  // Receive messages from clients
  ws.on('message', function incoming(data: any) {
    // WebSocket broadcast
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        // to do create a stream response
        client.send(data)
      }
    })
  })
})

server.listen(PORT, () => {
  console.info(`Server has running at the http://localhost:${PORT}`)
})
