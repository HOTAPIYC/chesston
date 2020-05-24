let name;
let id;
let localgames = [];

const playerlist = document.querySelector('#ul-player');
const requestlist = document.querySelector('#ul-requests');
const content = document.querySelector('.content');
const playerFactory = new PlayerFactory();

document.querySelector('#register').addEventListener('click', async function(event){
    event.preventDefault();

    name = document.querySelector('#name').value;

    const player = { name: name };

    const response = await fetch('/api/player/', {
      method: 'POST',
      body: JSON.stringify(player),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    });
    if(response.status === 200){
      const player = await response.json();

      id = player.id;

      playerFactory.setId(id);

      document.querySelector('.login').style.display = 'none';
      document.querySelector('.dashboard').style.display = 'grid';
  
      setInterval(getPlayers, 2000);
      setInterval(getRequests, 2000);
      setInterval(getGames, 2000);
    }
});

async function getPlayers(){
  const response = await fetch('/api/player/');
  const players = await response.json();

  playerlist.innerHTML = '';

  players.forEach(player => {
    if(player.id !== id){
      playerlist.appendChild(UI.createPlayerItem(player));
    }
  });
}

async function getRequests(){
  const response = await fetch(`/api/requests/${id}`);
  const requests = await response.json();

  requestlist.innerHTML = '';

  requests.forEach(request => {
    requestlist.appendChild(UI.createRequestItem(request));
  });
}

async function getGames(){
  const response = await fetch(`/api/games/${id}`);
  const servergames = await response.json();

  servergames.forEach(servergame => {
    if(!localgames.find(localgame => localgame.id === servergame.id)){
      const newgame = servergame;
      content.appendChild(UI.createGameVisuals(newgame, id));

      newgame.board = new Chessboard(servergame.id);
      newgame.board.createBoard();

      newgame.playerWhite = playerFactory.createPlayer(newgame, 'w');
      newgame.playerBlack = playerFactory.createPlayer(newgame, 'b');

      newgame.board.init();

      localgames.push(newgame);
    }
  });
}

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
    console.log('remove request');
    const response = await fetch('/api/requests/decline/', {
      method: 'PUT',
      body: JSON.stringify({id: event.target.parentElement.id}),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    });
  }
  event.target.parentElement.remove();
});
