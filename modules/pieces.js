class Piece {
    constructor(fen){
        this.pieces = new Map();

        this.pieces.set('K', '\u2654');
        this.pieces.set('Q', '\u2655');
        this.pieces.set('R', '\u2656');
        this.pieces.set('B', '\u2657');
        this.pieces.set('N', '\u2658');
        this.pieces.set('P', '\u2659');
        
        this.pieces.set('k', '\u265A');
        this.pieces.set('q', '\u265B');
        this.pieces.set('r', '\u265C');
        this.pieces.set('b', '\u265D');
        this.pieces.set('n', '\u265E');
        this.pieces.set('p', '\u265F');

        this.fen = fen;
    }
    
    getElement(){
        let div = document.createElement('div');
  
        div.classList.add('piece');
        div.classList.add(`fen-${this.fen}`);
        div.classList.add(this.fen === this.fen.toUpperCase() ? 'white' : 'black');

        div.textContent = this.pieces.get(this.fen);

        return div;
    }
}