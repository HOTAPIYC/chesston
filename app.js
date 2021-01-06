const http = require('http')
const fs = require('fs/promises')
const path = require('path')
const io = require('socket.io')
const { uuid } = require('uuidv4')
const { Chess } = require('chess.js')

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

const games = []

websocket.on('connection', socket => {
  console.log('Client connected')

  socket.on('start game', args => {
    const chess = Chess()
    const game = {
      id: uuid(), 
      fen: chess.fen(),
      turn: chess.turn(),
      moves: []
    }
    socket.join(game.id)
    socket.emit('started', game)
    games.push(game)
  })

  socket.on('join game', args => {
    socket.join(args)
    socket.emit('joined', games.find(game => game.id === args))
  })

  socket.on('move', args => {
    let update

    games.forEach(game => {
      if(game.id === args.id) {
        const chess = Chess(game.fen)
        chess.move(args.move)

        game.fen = chess.fen()
        game.turn = chess.turn()
        game.moves.push(args.move)

        update = game
      }
    })
    socket.to(update.id).emit('update', update)
  })
})

app.listen(5000)