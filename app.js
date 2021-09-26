const express = require('express');
const http = require('http');
const io = require('socket.io');
const { v4:uuid } = require('uuid');
const { Chess } = require('chess.js');

const app = express();
const server = http.createServer(app);
app.use('/', express.static(__dirname + '/static'));
app.use('/:id', express.static(__dirname + '/static'));

const websocket = io(server);

// Array holding all current games
const games = [];

websocket.on('connection', socket => {
  console.log('Client connected');

  socket.on('game:start', args => {
    // Create game, default position is loaded
    // on 'undefined' fen string.
    const chess = Chess(args === "" ? undefined : args);

    const whitePlayer = {id: uuid(), color: 'white'};
    const blackPlayer = {id: uuid(), color: 'black'};

    const game = {
      whitePlayer: whitePlayer,
      blackPlayer: blackPlayer,
      board: chess.board(),
      fen: chess.fen(),
      turn: chess.turn() === 'w' ? whitePlayer : blackPlayer,
      check: chess.in_check(),
      checkmate: chess.in_checkmate(),
      legal: chess.moves({verbose: true}),
      timeStart: Date.now(),
      timeLastMove: Date.now(),
      history: []
    };

    games.push(game);
    // Create socket room to target
    // clients more easily only related
    // to this game
    socket.join(game.whitePlayer.id);
    socket.emit('game:started', game);
  });

  socket.on('game:join', args => {
    const game = games.find(game => game.blackPlayer.id === args || game.whitePlayer.id === args);

    if(game) {
      socket.join(args);
      socket.emit('game:joined', game);
    }
  });

  socket.on('game:move', args => {
    games.forEach(game => {
      // Find game to update
      if(game.whitePlayer.id === args.id || game.blackPlayer.id === args.id) {
        // Create chess instance with current game status
        const chess = Chess(game.fen);

        const move = chess.move(args.move);
        move.duration = Date.now() - game.timeLastMove;
        move.event = chess.in_checkmate() ? "Checkmate" : (chess.in_check() ? "Check" : "");

        // Update game status information
        game.board = chess.board();
        game.fen = chess.fen();
        game.turn = chess.turn() === 'w' ? game.whitePlayer : game.blackPlayer;
        game.legal = chess.moves({verbose: true});
        game.check = chess.in_check();
        game.checkmate = chess.in_checkmate();
        game.timeLastMove = Date.now();
        game.history.push(move);

        // Return updated game
        websocket.sockets.in(game.whitePlayer.id).emit('game:update', game);
        websocket.sockets.in(game.blackPlayer.id).emit('game:update', game);    
      }
    });
  });
});

server.listen(5000, () => {
  console.log('Server started');
});