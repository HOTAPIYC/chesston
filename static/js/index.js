const websocket = io();
const board = Chessboard();

let game;
let id;

// If move assembly (two consecutive clicks on the
// board) has not been finished, prevent that too many
// parallel threads are started
let lock;

document.addEventListener('click', event => {
  if(event.target.classList.contains('square') && game.turn.id === id && !lock){
    board.setHighlights(game.legal, event.target.id);
    move(event.target.id);
    // Prevent start of next async call before
    // second click has been evaluated
    lock = true;
  }
});

async function move (start) {
  try {
    // Wait for second valid click on board
    const target = await click();
    // Send selection to server
    websocket.emit('move', {id: id, move: { from: start, to: target }});
    console.log('Your move: ' + start + "-" + target);
    board.resetHighlights();
    // Release click listener and allow
    // renewal of move call
    lock = false;
  }
  catch {
    // Abort move if no valid target
    // has been selected
    board.resetHighlights();
    // Release click listener and allow
    // renewal of move call
    lock = false;
  }
}

function click () {
  return new Promise((resolve, reject) => {
    document.addEventListener('click', event => {
      if(event.target.classList.contains('highlight')) {
        resolve(event.target.id);
      } else {
        reject();
      }
    });
  });
}

document.querySelector('#start').addEventListener('click', event => {
  websocket.emit('start game');
});

document.querySelector('#join').addEventListener('click', async event => {
  id = await showInputDialog('Enter a valid ID:');
  websocket.emit('join game', id);
});

document.querySelector('#flip').addEventListener('click', event => {
  board.flip();
});

websocket.on('started', async args => {
  game = args;
  id = game.whitePlayer.id;
  await showMsgDialog('Send this code to someone to join:', game.blackPlayer.id);

  board.update(game.board);
  updateStatus();

  window.history.replaceState({}, '', `/${id}`);
});

websocket.on('joined', async args => {
  game = args;

  board.update(game.board);
  updateStatus();

  window.history.replaceState({}, '', `/${id}`);
});

websocket.on('update', args => {
  game = args;

  board.update(game.board);
  updateStatus();
});

// Update status bar information
function updateStatus () {
  const color = game.whitePlayer.id === id ? 'w' : 'b';

  document.querySelector('#status').textContent = `Your color: ${color} | Current turn: ${game.turn.color}`;
  if(game.check) {
    document.querySelector('#status').textContent += ' | Check!';
  }
  if(game.checkmate) {
    document.querySelector('#status').textContent += ' | Checkmate!';
  }
}

// Check if a player ID has been saved to the
// address bar and rejoin game if that's the case
window.addEventListener('load', event => {
  const idUrl = /[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}/i.exec(window.location.href);

  if(idUrl != null) {
    id = idUrl[0];
    websocket.emit('join game', id);
  }
});