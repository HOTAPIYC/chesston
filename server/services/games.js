import { v4 as uuidv4 } from "uuid";

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
  const game = {
    id: uuidv4(),
    white: request.to,
    black: request.from,
    fen: "",
    lastMove: ""
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
  games[index].lastMove = move;
}

function getLastMoveByPlayerId(id) {
  const game = games.find(game => game.id === id);
  return { lastMove: game.lastMove };
}

export { createRequest, declineRequest, acceptRequest, getRequestsByPlayerId, getGameByPlayerId, addMoveToGame, getLastMoveByPlayerId };