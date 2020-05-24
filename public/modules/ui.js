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

class UI{
  static createPlayerItem(player){
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

  static createRequestItem(request){
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

  static createGameVisuals(game){
    let container = document.createElement('div');
    container.className = 'game';
    container.id = game.id;

    let heading = document.createElement('h4');

    heading.textContent = `${game.white.name} vs ${game.black.name}`;

    let chessboard = document.createElement('div');
    chessboard.className = 'chessboard';

    let subtext = document.createElement('p');
    subtext.textContent = 'Instructions';

    container.appendChild(heading);
    container.appendChild(chessboard);
    container.appendChild(subtext);

    return container;
  }
}