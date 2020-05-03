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
            this.possibleMoves.set(event.target.id, {move:'root', promotion: false});

            const moves = this.board.getPossibleMoves(event.target.id);

            moves.forEach(move => {
                // Decode targets from moves in SAN notation
                let re1 = new RegExp(/O-O/);
                const castlingShort = re1.test(move);
                let re2 = new RegExp(/O-O-O/);
                const castlingLong = re2.test(move);
                let re3 = new RegExp(/=[BNRQbnrq]/);
                const promotion = re3.test(move);

                let key = ''

                if(!castlingLong && !castlingShort){
                    key = move.match(/[a-h][1-8]/)[0];
                } else if(castlingLong){
                    key = this.color === 'w' ? 'c1' : 'c8';
                } else if(castlingShort){
                    key = this.color === 'w' ? 'g1' : 'g8';
                }

                this.possibleMoves.set(key, {move: move, promotion: promotion});
            });
            this.board.setHighlight(this.possibleMoves);
            return true;
        } else {
            this.board.resetHighlight();
            return false;
        }
    }

    async selectTarget(event) {
        if(event.target.classList.contains('highlight')) {
            const selectedMove = this.possibleMoves.get(event.target.id);

            if(!selectedMove.promotion){
                this.makeMove(this.board, selectedMove.move);
                return false;
            } else {
                const dialog = new DialogPromotion();
                const result = await dialog.show();

                this.board.makeMove(selectedMove.move.replace(/=[BNRQbnrq]/, `=${result}`));

                return false;
            }
        } else {
            return this.selectPiece(event);
        }
    }

    makeMove(board, selectedMove){
        board.makeMove(selectedMove);
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