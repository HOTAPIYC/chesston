class PlayerFactory {
  constructor(id){
    this.id = id;
  }

  createPlayer(game, color){
    if(color === 'w'){
      if(game.white.id === this.id){
        return new LocalPlayer(game, color);
      } else {
        return new RemotePlayer(game, color);
      }
    } else {
      if(game.black.id === this.id){
        return new LocalPlayer(game, color);
      } else {
        return new RemotePlayer(game, color);
      }
    }
  }
}

class HumanPlayer {
  constructor(game, color){    
    this.game = game;
        
    this.color = color;
    this.currentColor = '';
    this.moveStarted = false;

    this.game.board.addEventListener(`click ${this.color}`, event => this.onClick(event));
    this.game.board.addEventListener('next turn', event => this.onNextTurn(event));
  }

  onClick(event) {
    if(!this.moveStarted) {
      this.moveStarted = this.selectPiece(event);
    } else {
      this.moveStarted = this.selectTarget(event);
    }
  }

  onNextTurn(event) {
    this.currentColor = this.game.board.getColor();
  }

  selectPiece(event) {
    if(event.target.className.search(new RegExp(`fen-.-${this.color}`)) > -1) {
      this.possibleMoves = new Map(); // Reset possible moves
      this.possibleMoves.set(event.target.id, {move:'root', promotion: false});

      const moves = this.game.board.getPossibleMoves(event.target.id);

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
      this.game.board.setHighlight(this.possibleMoves);
      return true;
    } else {
      this.game.board.resetHighlight();
      return false;
    }
  }

  async selectTarget(event) {
    if(event.target.classList.contains('highlight')) {
      const selectedMove = this.possibleMoves.get(event.target.id);

      if(!selectedMove.promotion){
        this.makeMove(this.game, selectedMove.move);
        return false;
      } else {
        const dialog = new DialogPromotion();
        const result = await dialog.show();

        this.makeMove(this.game, selectedMove.move.replace(/=[BNRQbnrq]/, `=${result}`));

        return false;
      }
    } else {
      return this.selectPiece(event);
    }
  }

  async makeMove(game, selectedMove){
    game.board.makeMove(selectedMove);
  }
}

class LocalPlayer extends HumanPlayer {
  constructor(game, color){
    super(game, color);
  }

  async makeMove(game, selectedMove){
    const response = await fetch(`/api/games/${game.id}/newmove`, {
      method: 'PUT',
      body: JSON.stringify({player: this.color, move: selectedMove}),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    });

    if(response.status === 200){
      game.board.makeMove(selectedMove);
    } else {
      // Error message
      game.board.resetHighlight();
    }
  }
}

class RemotePlayer {
  constructor(game, color){
    this.game = game;

    this.color = color;
    this.currentColor = '';

    this.game.board.addEventListener('init', event => this.onNextTurn(event));
    this.game.board.addEventListener('next turn', event => this.onNextTurn(event));
  }

  onNextTurn(event){
    this.currentColor = this.game.board.getColor();

    // On this players turn wait for change in lastMove
    if(this.currentColor === this.color){
      this.intervl = setInterval(this.getMove,2000,this.game,this.color,this.makeMove);
    } else {
      clearInterval(this.intervl);
    }
  }

  async getMove(game,color,makeMove){
    const response = await fetch(`/api/games/${game.id}/lastmove/${color}`);

    if(response.status === 200){
      const servergame = await response.json();
    
      if(servergame.lastMove !== game.lastMove){
        makeMove(game, servergame.lastMove);
      }
  
      game.lastMove = servergame.lastMove;
    }
  }

  makeMove(game,selectedMove){
    game.board.makeMove(selectedMove);
  }
}

class ArtificalPlayer {
  constructor(game, color){
    this.game = game;

    this.color = color;
    this.currentColor = ''; 
    
    this.game.board.addEventListener('next turn', event => this.onNextTurn(event));
  }

  onNextTurn(event) {
    this.currentColor = this.game.board.getColor();

    // On this players turn make a random move
    if(this.currentColor === this.color){
      const moves = this.game.board.getPossibleMoves();
      const selectedMove = moves[Math.floor(Math.random() * moves.length)];
      // Simulate thinking
      setTimeout(this.makeMove,2000,this.game,selectedMove);
    }
  }

  makeMove(game, selectedMove){
    game.board.makeMove(selectedMove);
  }
}