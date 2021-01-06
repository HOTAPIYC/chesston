const http = require('http')
const fs = require('fs/promises')
const path = require('path')
const io = require('socket.io')

// Simple http server to serve static
// files of page and content
const app = http.createServer(async (req, res) => {
  try {
    const pathname = __dirname + '/static' + req.url
  
    const stats = await fs.lstat(pathname)
  
    let filename = pathname
  
    // In case of a directory, search for 
    // default index page 
    if(stats.isDirectory()){
      filename += '/index.html'
    }

    const ext = path.parse(filename).ext
    const map = {
      '.html': 'text/html',
      '.json': 'application/json',
      '.ico': 'image/x-icon',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.js': 'text/javascript'
    }

    const file = await fs.readFile(filename)

    res.statusCode = 200
    res.setHeader('Content', map[ext]);
    res.end(file);
  } 
  catch {
    res.statusCode = 500
    res.setHeader('Content', 'plain/text')
    res.end('Error retrieving file')
  }
})

// Create websocket and attach to server
const websocket = io(app)

websocket.on('connection', data => {
  console.log('Client connected')
})

app.listen(5000)