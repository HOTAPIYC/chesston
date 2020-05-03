const board = new Chessboard();
const playerFactory = new PlayerFactory(board);

let playerWhite = {type: 'human', name: 'Human'};
let playerBlack = {type: 'human', name: 'Human'};

const playerWhiteSelect = document.querySelector('#player-white');
const playerBlackSelect = document.querySelector('#player-black');

window.addEventListener('load',() => {
    board.createBoard();

    playerWhiteSelect.value = playerWhite.name;
    playerBlackSelect.value = playerBlack.name;
});

playerWhiteSelect.addEventListener('click', async function(event){
    const dialog = new DialogPlayer();
    playerWhite = await dialog.show();
    playerWhiteSelect.value = playerWhite.name;
});

playerBlackSelect.addEventListener('click', async function(event){
    const dialog = new DialogPlayer();
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

board.addEventListener('init',event => {
    currentPlayer.textContent = 'Active player: white';
});  
board.addEventListener('next turn',event => {
    if(board.getColor() === 'w') {
        currentPlayer.textContent = 'Active player: white';
    } else {
        currentPlayer.textContent = 'Active player: black';
    }
});