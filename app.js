const express = require('express');
const http = require('http');
const io = require('socket.io');
const { v4:uuid } = require('uuid');
const { Chess } = require('chess.js');

const app = express();
const server = http.createServer(app);
app.use('/', express.static(__dirname + '/public'));

const websocket = io(server);

// Array holding all current games
const games = [];

websocket.on('connection', socket => {
  console.log('Client connected');

  socket.on('game:start', args => {
    // Create game, default position is loaded
    // on 'undefined' fen string.
    const chess = Chess(args === "" ? undefined : args);

    const whitePlayer = {id: uuid(), color: 'w'};
    const blackPlayer = {id: uuid(), color: 'b'};

    const game = {
      whitePlayer: whitePlayer,
      blackPlayer: blackPlayer,
      board: chess.board(),
      pieces: initPieces(chess.board()),
      fen: chess.fen(),
      turn: (chess.turn() === 'w') ? whitePlayer : blackPlayer,
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
    const game = games.find(game => (game.whitePlayer.id === args.id || game.blackPlayer.id === args.id));

    if (!game) return;

    const chess = Chess(game.fen);

    const move = chess.move(args.move);
    move.duration = Date.now() - game.timeLastMove;
    move.event = chess.in_checkmate() ? "Checkmate" : (chess.in_check() ? "Check" : "");

    // Update game status information
    game.board = chess.board();
    game.pieces = updatePieces(move, game.pieces);
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
  });
});

server.listen(5000, () => {
  console.log('Server started');
});

function initPieces(board) {
  const squares = [
    "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
    "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
    "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
    "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
    "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
    "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
    "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
    "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"
  ];

  const pieces = [];

  board.flat().forEach((piece, index) => {
    if(piece) {
      piece.id = index;
      piece.position = squares[index];
      pieces.push(piece);
    }
  });

  return pieces;
}

function updatePieces(move, pieces) {
  const indexMovedPiece = pieces.findIndex(piece => piece.position === move.from);
  const indexCapturedPiece = pieces.findIndex(piece => piece.position === move.to);

  if(indexMovedPiece > -1) {
    pieces[indexMovedPiece].position = move.to;
  }
  if(indexCapturedPiece > -1) {
    this.pieces.splice(indexCapturedPiece, 1);
  }

  return pieces;
}