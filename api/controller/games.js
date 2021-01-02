const { v4: uuidv4 } = require('uuid');
const { Chess } = require("chess.js");


// Board map
const squareNames = [
  ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
  ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
  ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
  ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
  ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
  ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
  ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
  ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
];

let requests = [];
let games = [];

function createRequest(from, to) {
  const request = {
    id: uuidv4(),
    from: from,
    to: to
  };
  requests.push(request);
}

function declineRequest(id) {
  // Remove request and replace array.
  requests = requests.filter(request => request.id !== id);
}

function acceptRequest(id) {
  const request = requests.find(request => request.id === id);
  const chess = Chess();

  const currentFen = chess.fen();
  const possibleMoves = getPossibleMovesPerSquare(chess);
  const currentTurn = request.to.id;

  const game = {
    id: uuidv4(),
    white: request.to,
    black: request.from,
    fen: currentFen,
    currentTurn: currentTurn,
    possibleMoves: possibleMoves
  };
  games.push(game);
  // Remove request and replace array.
  requests = requests.filter(request => request.id !== id);
}

function getRequestsByPlayerId(id) {
  return requests.filter(request => {
    if(request.to.id === id){
      return request;
    }
  });
}

function getGameByPlayerId(id) {
  return games.filter(game => {
    if(game.white.id === id || game.black.id === id){
      return game;
    }
  });
}

function addMoveToGame(id, move) {
  const index = games.indexOf(games.find(game => game.id === id));

  const chess = Chess(games[index].fen);

  chess.move(move);

  const currentFen = chess.fen();
  const possibleMoves = getPossibleMovesPerSquare(chess);

  if(chess.turn() === "w"){
    var currentTurn = games[index].white.id;
  }
  if(chess.turn() === "b"){
    var currentTurn = games[index].black.id;
  }

  games[index].fen = currentFen;
  games[index].currentTurn = currentTurn;
  games[index].possibleMoves = possibleMoves;
}

function getLastMoveByPlayerId(id) {
  const game = games.find(game => game.id === id);
  return { lastMove: game.lastMove };
}

function getPossibleMovesPerSquare(chess) {
  const moves = {};
  squareNames.forEach((row) => {
    row.forEach((square) => {
      moves[square] = chess.moves({ square: square });
    });
  });
  return moves;
}

function getGameById(id){
  const game = games.find(game => game.id === id);
  return game;
}

exports.createRequest = createRequest;
exports.declineRequest = declineRequest;
exports.acceptRequest = acceptRequest;
exports.getRequestsByPlayerId = getRequestsByPlayerId;
exports.getGameByPlayerId = getGameByPlayerId;
exports.addMoveToGame = addMoveToGame;
exports.getLastMoveByPlayerId = getLastMoveByPlayerId;
exports.getGameById = getGameById;