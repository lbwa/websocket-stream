import { DEFAULT_PORT } from './shared/env'
import { server as httpServer } from './server-http'
import { createWebSocketServer } from './server-ws'

const PORT = DEFAULT_PORT || process.env.PORT

createWebSocketServer({
  server: httpServer
})

httpServer.listen(PORT, () => {
  console.info(`Server has running at the http://localhost:${PORT}`)
})
