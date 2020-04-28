class ChessUI {
    constructor() {
        this.currentPlayer = document.querySelector('#current-player');
    }

    init() {
        this.currentPlayer.textContent = 'white';
    }

    update(board) {
        this.currentPlayer.textContent = board.getColor();
    }
}