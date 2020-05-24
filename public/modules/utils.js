class EventObserver{
  constructor() {
    this.listeners = [];
  }

  addEventListener(event, callback, param) {
    this.listeners.push({event: event, callback: callback, param: param});
  }

  emitEvent(event, details) {
    this.listeners.forEach(listener => {
      if(listener.event === event) {
        if(listener.param === undefined){
          listener.callback(details);
        } else {
          listener.callback(details, listener.param);
        }
      }
    });
  }
}

class Game{
  constructor(serverGame){
    this.id = serverGame.id;
    this.white = serverGame.white;
    this.black = serverGame.black;
    this.lastMove = serverGame.lastMove;
  }

  createBoard(){
    let container = document.createElement('div');
    container.className = 'game';
    container.id = this.id;

    let heading = document.createElement('h4');

    heading.textContent = `${this.white.name} vs ${this.black.name}`;

    let chessboard = document.createElement('div');
    chessboard.className = 'chessboard';

    let subtext = document.createElement('p');
    subtext.textContent = `Current turn: ${this.white.name}`;

    container.appendChild(heading);
    container.appendChild(chessboard);
    container.appendChild(subtext);

    document.querySelector('.content').appendChild(container);

    this.board = new Chessboard(this.id);
    this.board.createBoard();

    this.board.addEventListener('next turn', this.onUpdate, this);
    this.board.addEventListener('check', this.onCheck, this);
    this.board.addEventListener('checkmate', this.onCheckmate, this);
  }

  start(id){
    const playerFactory = new PlayerFactory(id);

    this.white.obj = playerFactory.createPlayer(this, 'w');
    this.black.obj = playerFactory.createPlayer(this, 'b');

    this.board.init();
  }

  onUpdate(event, game){  
    if(game.board.getColor() === 'w'){
      document.getElementById(game.id).querySelector('p').textContent = `Current turn: ${game.white.name}`;
    } else {
      document.getElementById(game.id).querySelector('p').textContent = `Current turn: ${game.black.name}`;
    }
  }

  onCheck(event, game){  
    document.getElementById(game.id).querySelector('p').textContent = 
      'Check! ' + document.getElementById(game.id).querySelector('p').textContent;
  }

  onCheckmate(event, game){
    if(game.board.getColor() === 'w'){
      document.getElementById(game.id).querySelector('p').textContent = 'Checkmate! Black wins.';
    } else {
      document.getElementById(game.id).querySelector('p').textContent = 'Checkmate! White wins.';
    }
  }
}

class Dialog{
  constructor(){
    this.id = '';
  }

  show(){
    document.querySelector(`#${this.id}`).style.display = 'block';
    return new Promise((resolve,reject) => {
      document.querySelector(`#${this.id}-close`).addEventListener('click', event => {
        document.querySelector(`#${this.id}`).style.display = 'none';
        resolve(this.getResult());
      });
    });
  }

  getResult(){
    return '';
  }
}

class DialogPromotion extends Dialog{
  constructor(){
    super();
    this.id = 'promotion-dialog';
    document.querySelector('#promo-Q').checked = true;
  }

  getResult(){
    if(document.querySelector('#promo-Q').checked){
      return 'Q';
    } else if(document.querySelector('#promo-R').checked){
      return 'R';
    } else if(document.querySelector('#promo-B').checked){
      return 'B';
    } else if(document.querySelector('#promo-N').checked){
      return 'N';
    }
  }
}

class DialogPlayer extends Dialog{
  constructor(currentSelect){
    super();
    this.id = 'player-dialog';
    if(currentSelect.type === 'human'){
      document.querySelector('#player-human').checked = true;
    } else if(currentSelect.type === 'artifical'){
      document.querySelector('#player-machine').checked = true;
    }
  }

  getResult(){
    if(document.querySelector('#player-human').checked){
      return {type: 'human', name: 'Human'};
    } else if(document.querySelector('#player-machine').checked){
      return {type: 'artifical', name: 'Machine'};
    }
  }
}

class DialogInfo extends Dialog{
  constructor(msg){
    super();
    this.id = 'info-dialog';
    document.querySelector('#info-dialog-msg').textContent = msg;
  }
}