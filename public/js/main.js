const socket = io();

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

let gameOnDisplay;
const move = Move();

const player = JSON.parse(localStorage.getItem("player"));

const name = player.name;
const id = player.id;

document.querySelector("#display-name").textContent = name;

async function getPlayers(){
  const response = await fetch(`/api/player/${id}`);

  if(response.status === 200){
    const players = await response.json();  
    players.forEach((player) => {
      document.querySelector("#ul-player").appendChild(createPlayerItem(player));
    });
  }
}

async function getGames(){
  const response = await fetch(`/api/games/${id}`);

  if(response.status === 200){
    const games = await response.json();
    games.forEach((game) => {
      document.querySelector("#ul-games").appendChild(createGameItem(player));
    });
  }
}

// Page interaction
document.querySelector('#ul-player').addEventListener('click', async function(event){ 
  if(event.target.id === 'game-request-send'){
    const request = { 
      from: {id: id, name: name}, 
      to: {id: event.target.parentElement.id, name: event.target.parentElement.querySelector('.li-player-text').textContent} 
    };

    const response = await fetch('/api/requests/', {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    });       
  }
});

document.querySelector('#ul-requests').addEventListener('click', async function(event){
  if(event.target.id === 'game-request-accept'){
    const response = await fetch('/api/requests/accept/', {
      method: 'PUT',
      body: JSON.stringify({id: event.target.parentElement.id}),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    });
  }
  if(event.target.id === 'game-request-decline'){
    const response = await fetch('/api/requests/decline/', {
      method: 'PUT',
      body: JSON.stringify({id: event.target.parentElement.id}),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    });
  }
});

document.querySelector("#ul-games").addEventListener("click", function (event) {
  removePieces(squareNames);
  gameOnDisplay = localGames.getItem(event.target.parentElement.id);
  drawPieces(gameOnDisplay.fen, squareNames);
});

document.addEventListener('click', async function (event) {
  if(event.target.classList.contains('square')) {
      if(gameOnDisplay != undefined && gameOnDisplay.currentTurn === id){
        const squaresToHighlight = gameOnDisplay.possibleMoves[event.target.id];
        if(squaresToHighlight.length != 0){
          move.startMove(event.target.id);
          squaresToHighlight.push(event.target.id);
        } else {
          if(event.target.classList.contains('highlight')){
            const selectedMove = move.makeMove(event.target.id)
            socket.emit("move", {id: gameOnDisplay.id, move: selectedMove});
          } else {
            move.abortMove();
          }
        }
        resetHighlight(squareNames);
        setHighlights(squaresToHighlight);
      }
  } else {
      resetHighlight(squareNames);
      moveStarted = false;
  }
});

socket.on("gameupdate", (data) => {
  if(data.game.id === gameOnDisplay.id){
    removePieces(squareNames);
    gameOnDisplay = data.game;
    drawPieces(gameOnDisplay.fen, squareNames);
  }
});

function createGameItem(game){
  let li = document.createElement('li');
  li.id = game.id;

  let text = document.createElement('div');
  text.className = 'li-games-text';
  text.textContent = `${game.white.name} (w) vs ${game.black.name} (b)`;

  li.appendChild(text);

  return li;
}

function createPlayerItem(player){
  let li = document.createElement('li');
  li.id = player.id;

  let avatar = document.createElement('div');
  avatar.className = 'li-player-img';

  let text = document.createElement('div');
  text.className = 'li-player-text';
  text.textContent = player.name;

  let btn = document.createElement('button');
  btn.id = 'game-request-send';
  btn.className = 'btn btn-text';
  btn.textContent = 'REQUEST'

  li.appendChild(avatar);
  li.appendChild(text);
  li.appendChild(btn);

  return li;
}

function createRequestItem(request){
  let li = document.createElement('li');
  li.id = request.id;

  let text = document.createElement('div');
  text.className = 'li-request-text';
  text.textContent = request.from.name;

  let btnDecline = document.createElement('button');
  btnDecline.id = 'game-request-decline';
  btnDecline.className = 'btn btn-text';
  btnDecline.textContent = 'DECLINE'

  let btnAccept = document.createElement('button');
  btnAccept.id = 'game-request-accept';
  btnAccept.className = 'btn btn-text';
  btnAccept.textContent = 'ACCEPT'

  li.appendChild(text);
  li.appendChild(btnDecline);
  li.appendChild(btnAccept);
  
  return li;
}

// Sidebar control
const sidebar = document.querySelector('.sidebar');
const btn = document.querySelector('.sidebar-btn');

btn.addEventListener('click', function(e){
  if(sidebar.classList.contains('sidebar-show')){
    sidebar.classList.replace('sidebar-show','sidebar-hide');
  } else if(sidebar.classList.contains('sidebar-hide')) {
    sidebar.classList.replace('sidebar-hide','sidebar-show');
  } else {
    sidebar.classList.add('sidebar-show');
  }
});

window.matchMedia('(min-width: 1000px)').addEventListener('change',function(e){
  if(sidebar.classList.contains('sidebar-show')){
    sidebar.classList.remove('sidebar-show');
  }
  if(sidebar.classList.contains('sidebar-hide')){
    sidebar.classList.remove('sidebar-hide');
  }
});

// Draws pieces on board according to FEN string
// Sample string: "rnbnkqrb/pppppppp/8/8/8/8/PPPPPPPP/RNBNKQRB w KQkq - 0 1"
function drawPieces(fen, squareNames){
  const fenPerRow = fen.substring(0,fen.search(/\s/)).split("/");
  fenPerRow.forEach((row,rowIndex) => {
    let colIndex = 0;
    [...row].forEach((char) => {
      if(/[r,n,b,k,q,p]/i.test(char)){
        const square = document.getElementById(squareNames[rowIndex][colIndex]);
        square.classList.add(`fen-${char}`);
        colIndex++;
      } else {
        colIndex += Number(char);
      }
    });
  });
}

// Remove all FEN class names from the square divs
function removePieces(squaresNames){
  squaresNames.forEach((row) => {
    row.forEach((squareName) => {
      const square = document.getElementById(squareName);
      square.className = square.className.replace(/fen-./, "");
    });
  });
}

// Add hightlight class to a list of square names
// Squares to highlight are expected to be moves in SAN
// notation, that contain target square in last two chars.
function setHighlights(squaresToHighlight){
  squaresToHighlight.forEach((squareName) => {
    const square = document.getElementById(squareName.slice(-2));
    square.classList.add('highlight');
  });
}

// Remove highlight class from all squares
function resetHighlight(squaresNames){
  squaresNames.forEach((row) => {
    row.forEach((squareName) => {
      const square = document.getElementById(squareName);
      square.classList.remove('highlight');
    });
  });
}

function Move () {
  let _possibleMoves;

  const startMove = function (startSquare) {
    console.log("Start move");
    _possibleMoves = gameOnDisplay.possibleMoves[startSquare];
  };
  const makeMove = function (target) {
    // TODO: Analyse for promotion and casteling
    console.log("Make move");
    return _possibleMoves.filter((move) => move.slice(-2) === target)[0];
  };
  const abortMove = function () {
    console.log("Abort move");
    _possibleMoves = [];
  };
  return Object.freeze({
    startMove: startMove,
    makeMove: makeMove,
    abortMove: abortMove
  });
}

function getMove (selectedSquare, moves) {
  let selectedMove;
  
  moves.forEach(move => {
    // Decode targets from moves in SAN notation
    let re1 = new RegExp(/O-O/);
    const castlingShort = re1.test(move);
    let re2 = new RegExp(/O-O-O/);
    const castlingLong = re2.test(move);
    let re3 = new RegExp(/=[BNRQbnrq]/);
    const promotion = re3.test(move);

    // TODO: Show promotion dialog
    let key = ''

    if(!castlingLong && !castlingShort){
      key = move.match(/[a-h][1-8]/)[0];
    } else if(castlingLong){
      key = this.color === 'w' ? 'c1' : 'c8';
    } else if(castlingShort){
      key = this.color === 'w' ? 'g1' : 'g8';
    }

    if(move.slice(-2) = selectedSquare){
      selectedMove = move;
    }
  });
  return selectedMove;
}