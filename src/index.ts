import http from 'http'
import WebSocket from 'ws'
import fs from 'fs'
import path from 'path'

import { DEFAULT_PORT } from './shared/env'

const PORT = DEFAULT_PORT || process.env.PORT
const server = http.createServer((req, res) => {
  const htmlStream = fs.createReadStream(
    path.resolve(process.cwd(), 'src/public/index.html')
  )

  res.writeHead(200, {
    'Content-Type': 'text/html'
  })
  htmlStream.pipe(res)
  htmlStream.on('end', () => {
    res.end()
  })
})
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(
  ws: WebSocket,
  req: http.IncomingMessage,
  client: Set<WebSocket>
) {
  // Receive messages from clients
  wss.on('message', function incoming(data: any) {
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
