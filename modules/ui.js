class ChessUI {
    constructor() {
        this.currentPlayer = document.querySelector('#current-player');
    }

    init() {
        this.currentPlayer.textContent = 'White';
    }

    update(board) {
        if (board.getColor() === 'w') {
            this.currentPlayer.textContent = 'White';
        } else {
            this.currentPlayer.textContent = 'Black'
        }
    }
}