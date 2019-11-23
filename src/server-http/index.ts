import http from 'http'
import fs from 'fs'
import path from 'path'

export const server = http.createServer((req, res) => {
  const htmlStream = fs.createReadStream(
    path.resolve(process.cwd(), 'src/public/index.html')
  )
  htmlStream.pipe(res)
  res.writeHead(200, {
    'Content-Type': 'text/html'
  })
  htmlStream.on('end', () => res.end())
})
