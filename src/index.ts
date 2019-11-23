import http from 'http'
import WebSocket from 'ws'

import { DEFAULT_PORT } from './shared/env'

const PORT = DEFAULT_PORT || process.env.PORT
const server = http.createServer((req, res) => {
  res.end(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>WebSocket</title>
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        height: 100%;
      }
      #root {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="root">Seems nothing could be found.</div>
  </body>
</html>
  `)
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
