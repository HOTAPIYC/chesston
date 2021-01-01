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

let gameOnDisplay = {};
let moveStarted = false;

const localGames = DataArray();
const localRequests = DataArray();
const localPlayers = DataArray();

const playerList = ObservableList();
playerList.setListId("#ul-player");
playerList.registerUI(createPlayerItem);
const requestList = ObservableList();
requestList.setListId("#ul-requests");
requestList.registerUI(createRequestItem);
const gamesList = ObservableList();
gamesList.setListId("#ul-games");
gamesList.registerUI(createGameItem);

const player = JSON.parse(localStorage.getItem("player"));

const name = player.name;
const id = player.id;

document.querySelector("#display-name").textContent = name;

// Background activity
setInterval(getPlayers, 2000, localPlayers, playerList);
setInterval(getRequests, 2000, localRequests, requestList);
setInterval(getGames, 2000, localGames, gamesList);

async function getPlayers(localPlayers, playerList){
  const response = await fetch(`/api/player/${id}`);

  if(response.status === 200){
    const players = await response.json();  
    localPlayers.setItems(players);
    playerList.observe(localPlayers.getItems());
  }
}

async function getRequests(localRequests, requestList){
  const response = await fetch(`/api/requests/${id}`);

  if(response.status === 200){
    const requests = await response.json();
    localRequests.setItems(requests);
    requestList.observe(localRequests.getItems());
  }
}

async function getGames(localGames, gamesList){
  const response = await fetch(`/api/games/${id}`);

  if(response.status === 200){
    const games = await response.json();
    localGames.setItems(games);
    gamesList.observe(localGames.getItems());
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
  gameOnDisplay = localGames.getItem(event.target.parentElement.id);
  drawPieces(gameOnDisplay.fen, squareNames);
});

document.addEventListener('click', async function (event) {
  if(event.target.classList.contains('square')) {
      if(gameOnDisplay.currentTurn === id){
        const possibleMoves = gameOnDisplay.possibleMoves[event.target.id];
        if(possibleMoves.length != 0){
          console.log("Start move");
          possibleMoves.push(event.target.id);
          moveStarted = true;
        } else {
          if(event.target.classList.contains('highlight')){
            console.log("Make move");
            const response = await fetch(`/api/games/${gameOnDisplay.id}/newmove`, {
              method: 'PUT',
              body: JSON.stringify({move: event.target.id}),
              headers: {'Content-type': 'application/json; charset=UTF-8'}
            });
            moveStarted = false;
          } else {
            console.log("Abort move");
            moveStarted = false;
          }
        }
        resetHighlight(squareNames);
        setHighlights(possibleMoves);
      }
  } else {
      resetHighlight(squareNames);
      moveStarted = false;
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

// List control
function ObservableList () {
  let _id = "ul";
  let _list = [];
  let _ui = {};
  const observe = function (array) {
    // check for users missing in the list
    array.forEach((arrayItem) => {
      if(_list.find((listItem) => listItem.id === arrayItem.id) === undefined){
        _list.push(arrayItem);
        _createUI(arrayItem);
        console.log("Found new user and updated list")
      }
    });
    // check for list items not anymore in the user array
    _list.forEach((listItem) => {
      if(array.find((arrayItem) => listItem.id === arrayItem.id) === undefined){
        _list = _list.filter((item) => item.id != listItem.id);
        _removeUI(listItem);
        console.log("Removed list item for non existent user");
      };
    });
  };
  const registerUI = function(ui){
    _ui = ui
  };
  const setListId = function(id){
    _id = id;
  }
  const _createUI = function (listItem){
    document.querySelector(_id).appendChild(_ui(listItem));
  };
  const _removeUI = function(listItem) {
    document.getElementById(`${listItem.id}`).remove();
  };
  return Object.freeze({
    observe: observe,
    registerUI: registerUI,
    setListId: setListId
  });
}

function DataArray () {
  let _items = [];
  const getItems = function () {
    return _items;
  };
  const setItems = function (items) {
    _items = items;
  }
  const addItem = function (item) {
    _items.push(item);
  };
  const removeItem = function (id) {
    _items = _items.filter((element) => element.id != id);
  };
  const getItem = function (id) {
    return _items.find((item) => item.id === id);
  };
  return Object.freeze({
    getItems: getItems,
    setItems: setItems,
    addItem: addItem,
    getItem: getItem,
    removeItem: removeItem
  });
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
        colIndex =+ Number(char);
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