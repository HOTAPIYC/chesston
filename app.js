const express = require('express');
const http = require('http');
const io = require('socket.io');
const { v4:uuid } = require('uuid');
const { Chess } = require('chess.js');

// Express server to serve static
// files of page and content
const app = express();
const server = http.createServer(app);
app.use('/', express.static(__dirname + '/static'));
app.use('/:id', express.static(__dirname + '/static'));

// Create websocket and attach to server
const websocket = io(server);

// Array holding all current games
const games = [];

// Real-time interaction between server and boards
websocket.on('connection', socket => {
  console.log('Client connected');

  socket.on('start game', args => {
    // Create new instance of chess
    const chess = Chess();
    // Create game with status info
    // from fresh chess game

    const whitePlayer = {id: uuid(), color: 'white'};
    const blackPlayer = {id: uuid(), color: 'black'};

    const game = {
      whitePlayer: whitePlayer,
      blackPlayer: blackPlayer,
      board: chess.board(),
      fen: chess.fen(),
      turn: whitePlayer,
      check: chess.in_check(),
      checkmate: chess.in_checkmate(),
      legal: chess.moves({verbose: true}),
      startTime: new Date(),
      history: []
    };

    games.push(game);
    // Create socket room to target
    // clients more easily only related
    // to this game
    socket.join(game.whitePlayer.id);
    socket.emit('started', game);
  });

  socket.on('join game', args => {
    // Find and get game requested 
    // and join socket room to access
    // player via id
    const game = games.find(game => game.blackPlayer.id === args || game.whitePlayer.id === args);

    socket.join(args);
    socket.emit('joined', game);
  });

  socket.on('move', args => {
    games.forEach(game => {
      // Find game to update
      if(game.whitePlayer.id === args.id || game.blackPlayer.id === args.id) {
        console.log('Game found');
        
        // Create chess instance with current
        // game status and perform move 
        const chess = Chess(game.fen);
        chess.move(args.move);

        // Update game status information
        game.board = chess.board();
        game.fen = chess.fen();
        game.turn = chess.turn() === 'w' ? game.whitePlayer : game.blackPlayer;
        game.legal = chess.moves({verbose: true});
        game.check = chess.in_check();
        game.checkmate = chess.in_checkmate();
        game.history.push(args.move);

        // Return updated game
        websocket.sockets.in(game.whitePlayer.id).emit('update', game);
        websocket.sockets.in(game.blackPlayer.id).emit('update', game);    
      }
    });
  });
});

server.listen(5000, () => {
  console.log('Server started');
});