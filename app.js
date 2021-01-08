const express = require('express')
const http = require('http')
const io = require('socket.io')
const { v4:uuid } = require('uuid')
const { Chess } = require('chess.js')

// Express server to serve static
// files of page and content
const app = express()
const server = http.createServer(app)
app.use('/', express.static(__dirname + '/static'))

// Create websocket and attach to server
const websocket = io(server)

// Array holding all current games
const games = []

// Real-time interaction between server and boards
websocket.on('connection', socket => {
  console.log('Client connected')

  socket.on('start game', args => {
    // Create new instance of chess
    const chess = Chess()
    // Create game with status info
    // from fresh chess game
    const game = {
      id: uuid(), 
      fen: chess.fen(),
      turn: chess.turn(),
      legal: chess.moves({verbose: true}),
      history: []
    }
    games.push(game)
    // Create socket room to target
    // clients more easily only related
    // to this game
    socket.join(game.id)
    socket.emit('started', game)
  })

  socket.on('join game', args => {
    // Find and get game requested 
    // and join socket room
    socket.join(args)
    socket.emit('joined', games.find(game => game.id === args))
  })

  socket.on('move', args => {
    let update

    games.forEach(game => {
      // Find game to update
      if(game.id === args.id) {
        // Create chess instance with current
        // game status and perform move 
        const chess = Chess(game.fen)
        chess.move(args.move)

        // Update game status information
        game.fen = chess.fen()
        game.turn = chess.turn()
        game.legal = chess.moves({verbose: true})
        game.history.push(args.move)

        update = game
      }
    })
    // Return updated game
    websocket.sockets.in(update.id).emit('update', update)
  })
})

server.listen(5000)