const board = new Chessboard();
const playerFactory = new PlayerFactory(board);

let playerWhite = {type: 'human', name: 'Human'};
let playerBlack = {type: 'human', name: 'Human'};

const playerWhiteSelect = document.querySelector('#player-white');
const playerBlackSelect = document.querySelector('#player-black');

window.addEventListener('load', function(){
    // Init UI
    board.createBoard();
    playerWhiteSelect.value = playerWhite.name;
    playerBlackSelect.value = playerBlack.name;
});

playerWhiteSelect.addEventListener('click', async function(event){
    const dialog = new DialogPlayer(playerWhite);
    playerWhite = await dialog.show();
    playerWhiteSelect.value = playerWhite.name;
});

playerBlackSelect.addEventListener('click', async function(event){
    const dialog = new DialogPlayer(playerBlack);
    playerBlack = await dialog.show();
    playerBlackSelect.value = playerBlack.name;
});

const startButton = document.querySelector('#start-game');

startButton.addEventListener('click', event => {
    board.removePlayer();

    const player1 = playerFactory.createPlayer(playerWhite.type,'w');
    const player2 = playerFactory.createPlayer(playerBlack.type,'b');
    
    board.init();

    event.preventDefault();
});

const currentPlayer = document.querySelector('#game-dialog');

board.addEventListener('init',function(event){
    currentPlayer.textContent = 'Active player: white';
});  
board.addEventListener('next turn',function(event){
    if(board.getColor() === 'w') {
        currentPlayer.textContent = 'Active player: white';
    } else {
        currentPlayer.textContent = 'Active player: black';
    }
});
board.addEventListener('check',function(){
    currentPlayer.textContent = 'Check! ' + currentPlayer.textContent;
});
board.addEventListener('checkmate',function(){
    if(board.getColor() === 'w') {
        currentPlayer.textContent = 'Checkmate! Black wins.';
    } else {
        currentPlayer.textContent = 'Checkmate! White wins.';
    }
});