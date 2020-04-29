const board = new Chessboard();
const playerFactory = new PlayerFactory(board);

window.addEventListener('load',() => {
    board.createBoard();
});

const startButton = document.querySelector('#start-game');

startButton.addEventListener('click', event => {
    const selectionWhite = document.querySelector('#player-white').value;
    const selectionBlack = document.querySelector('#player-black').value;

    board.removePlayer();

    const player1 = playerFactory.createPlayer(selectionWhite,'w');
    const player2 = playerFactory.createPlayer(selectionBlack,'b');
    
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