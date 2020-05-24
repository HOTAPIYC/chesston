let name;
let id;
let localgames = [];

const playerlist = document.querySelector('#ul-player');
const requestlist = document.querySelector('#ul-requests');

document.querySelector('#register').addEventListener('click', async function(event){
    event.preventDefault();

    name = document.querySelector('#name').value;
    document.querySelector('#display-name').textContent = name;
    
    const player = { name: name };

    const response = await fetch('/api/player/', {
      method: 'POST',
      body: JSON.stringify(player),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    });

    if(response.status === 200){
      const player = await response.json();

      id = player.id;

      document.querySelector('.login').style.display = 'none';
      document.querySelector('.dashboard').style.display = 'grid';
  
      setInterval(getPlayers, 2000);
      setInterval(getRequests, 2000);
      setInterval(getGames, 2000);
    }
});

async function getPlayers(){
  const response = await fetch('/api/player/');

  if(response.status === 200){
    playerlist.innerHTML = '';

    const players = await response.json();  
    players.forEach(player => {
      if(player.id !== id){
        playerlist.appendChild(createPlayerItem(player));
      }
    });
  }
}

async function getRequests(){
  const response = await fetch(`/api/requests/${id}`);

  if(response.status === 200){
    requestlist.innerHTML = '';

    const requests = await response.json();
    requests.forEach(request => {
      requestlist.appendChild(createRequestItem(request));
    });
  }
}

async function getGames(){
  const response = await fetch(`/api/games/${id}`);

  if(response.status === 200){
    const servergames = await response.json();
    servergames.forEach(servergame => {
      if(!localgames.find(localgame => localgame.id === servergame.id)){
        const newgame = new Game(servergame);
  
        newgame.createBoard();
        newgame.start(id);
  
        localgames.push(newgame);
      }
    });
  }
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