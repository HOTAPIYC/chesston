class Piece {
    constructor(){
        this.pieces = new Map();

        this.pieces.set('kw', '\u2654');
        this.pieces.set('qw', '\u2655');
        this.pieces.set('rw', '\u2656');
        this.pieces.set('bw', '\u2657');
        this.pieces.set('nw', '\u2658');
        this.pieces.set('pw', '\u2659');
        
        this.pieces.set('kb', '\u265A');
        this.pieces.set('qb', '\u265B');
        this.pieces.set('rb', '\u265C');
        this.pieces.set('bb', '\u265D');
        this.pieces.set('nb', '\u265E');
        this.pieces.set('pb', '\u265F');
    }
    
    getElement(fen){
        let div = document.createElement('div');
  
        if(fen !== null) {
            div.classList.add('piece');
            div.classList.add(fen.type);
            div.classList.add(fen.color);
    
            div.textContent = this.pieces.get(`${fen.type}${fen.color}`);
        }

        return div;
    }
}


export { Piece };