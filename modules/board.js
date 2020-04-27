import { Piece } from './pieces.js';
import { Chess } from './chess.js';

class Chessboard {
    constructor(fen) {
        this.chess = new Chess(fen);   
        this.board = document.querySelector('.chessboard');
        this.players = [];


        this.squares = new Map();
        this.possibleMoves = new Map();

        this.moveStarted = false;
    }

    createBoard() {
        // Create shapes
        // Iterate rows
        for (let i = 8; i > 0; i--) {
            let row = document.createElement('div');
            row.classList.add('row');
            
            // Iterate columns
            // Char 97-104 are lower case a-h in ASCII
            for (let k = 97; k < 105; k++) {
                let square = document.createElement('div');
                square.id = `${String.fromCharCode(k)}${i}`;
                square.classList.add('square');

                if ((i % 2) && !(k % 2) || !(i % 2) && (k % 2)) {             
                    square.classList.add('light');
                } else {
                    square.classList.add('dark');
                }

                row.appendChild(square);
                this.squares.set(square.id, square);
            }
            this.board.appendChild(row);
        }

        // Forward clicks to the currently active player
        document.addEventListener('click', event => {
            if(event.target.classList.contains('square') 
            || event.target.classList.contains('piece')) {
                const currPlayer = this.players.find(player => {
                    return player.color === this.getColor();
                });
                currPlayer.onClick(event);
            } else {
                this.abortMove();
            }
        });
    }

    drawPieces() {
        const boardState = this.chess.board();
        const squaresArray = Array.from(this.squares);

        let count = 0;

        boardState.forEach(row => {
            row.forEach(fen => {
                const piece = new Piece();

                squaresArray[count][1].textContent = ''; // Clear existing content
                squaresArray[count][1].appendChild(piece.getElement(fen));

                count++;
            });
        });
    }

    registerPlayer(player) {
        this.players.push(player);
    }

    startGame(){
        this.chess.reset();
        this.drawPieces();
        this.players.forEach(player => player.onNextTurn());
    }

    getColor() {
        return this.chess.turn();
    }

    selectPiece(color, event) {
        if(event.target.classList.contains(color)) {
            this.possibleMoves = new Map(); // Reset possible moves
            
            this.chess.moves({ square: event.target.parentElement.id}).forEach(move => {
                // Decode targets from moves in SAN notation
                const targetSquare = /[a-h][1-8]/
                this.possibleMoves.set(move.match(targetSquare)[0], move);
            });

            this.setHighlight(event.target.parentElement);
            return true; // Piece selected
        } else {
            return false; // No piece selected
        }
    }

    selectTarget(event) {
        if(event.target.classList.contains('piece')) {
            if(event.target.parentElement.classList.contains('highlight')) {
                const selectedMove = this.possibleMoves.get(event.target.parentElement.id);
                this.makeMove(selectedMove); 
            }                   
        }
        if(event.target.classList.contains('square')) {
            if(event.target.classList.contains('highlight')) {
                const selectedMove = this.possibleMoves.get(event.target.id);
                this.makeMove(selectedMove);
            } 
        }
        return false;
    }

    makeMove(selectedMove){
        this.chess.move(selectedMove);

        this.resetHighlight();
        this.drawPieces();

        this.players.forEach(player => player.onNextTurn());
    }

    abortMove(){
        this.resetHighlight();
    }

    setHighlight(selectedSquare) {
        this.resetHighlight();     

        selectedSquare.classList.add('highlight');

        this.possibleMoves.forEach((value, key) => {
            const square = this.squares.get(key);
            square.classList.add('highlight');
        })    
    }

    resetHighlight(){
        this.squares.forEach((value) => value.classList.remove('highlight'))
    }
}

export { Chessboard };