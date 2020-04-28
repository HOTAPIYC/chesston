const board = new Chessboard();
const playerFactory = new PlayerFactory(board);

window.addEventListener('load',() => {
    board.createBoard();
});

const startButton = document.querySelector('#start-game');

startButton.addEventListener('click', event => {
    const selectionWhite = document.querySelector('#playerWhite').value;
    const selectionBlack = document.querySelector('#playerBlack').value;

    const player1 = playerFactory.createPlayer(selectionWhite,'white');
    const player2 = playerFactory.createPlayer(selectionBlack,'black');

    board.registerPlayer(player1);
    board.registerPlayer(player2);
    
    board.startGame();

    event.preventDefault();
});