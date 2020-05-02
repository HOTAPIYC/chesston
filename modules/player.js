class PlayerFactory {
    constructor(board){
        this.board = board;
    }

    createPlayer(type, color){
        switch(type){
            case 'human':
                return new HumanPlayer(this.board, color);
                break;
            case 'artifical':
                return new ArtificalPlayer(this.board, color);
                break;
            default:
                return new HumanPlayer(this.board, color);
                break;
        }
    }
}

class HumanPlayer {
    constructor(board, color){    
        this.board = board;
        
        this.color = color;
        this.currentColor = '';
        this.moveStarted = false;

        this.board.addEventListener(`click ${this.color}`, event => this.onClick(event), 'player');
        this.board.addEventListener('next turn', event => this.onNextTurn(event), 'player');
    }

    onClick(event) {
        if(!this.moveStarted) {
            this.moveStarted = this.selectPiece(event);
        } else {
            this.moveStarted = this.selectTarget(event);
        }
    }

    onNextTurn(event) {
        this.currentColor = this.board.getColor();
    }

    selectPiece(event) {
        if(event.target.className.search(new RegExp(`fen-.-${this.color}`)) > -1) {
            this.possibleMoves = new Map(); // Reset possible moves
            this.possibleMoves.set(event.target.id, 'root');

            const moves = this.board.getPossibleMoves(event.target.id);

            moves.forEach(move => {
                // Decode targets from moves in SAN notation
                const targetSquare = /[a-h][1-8]/
                this.possibleMoves.set(move.match(targetSquare)[0], move);
            });
            this.board.setHighlight(this.possibleMoves);
            return true;
        } else {
            this.board.resetHighlight();
            return false;
        }
    }

    selectTarget(event) {
        if(event.target.classList.contains('highlight')) {
            const selectedMove = this.possibleMoves.get(event.target.id);
            this.board.makeMove(selectedMove);
            return false;
        } else {
            return this.selectPiece(event);
        }
    }
}

class ArtificalPlayer {
    constructor(board, color){
        this.board = board;

        this.color = color;
        this.currentColor = ''; 
        
        this.board.addEventListener('next turn', event => this.onNextTurn(event), 'player');
    }

    onNextTurn(event) {
        this.currentColor = this.board.getColor();

        // On this players turn make a random move
        if(this.currentColor === this.color){
            const moves = this.board.getPossibleMoves();
            const selectedMove = moves[Math.floor(Math.random() * moves.length)];
            // Simulate thinking
            setTimeout(this.makeMove,2000,this.board,selectedMove);
        }
    }

    makeMove(board, selectedMove){
        board.makeMove(selectedMove);
    }
}