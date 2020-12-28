const param = {
  id: 'local-game',
  white: {id: '', name: 'White'},
  black: {id: '', name: 'Black'},
  fen: '',
  lastMove: ''
}

const game = new Game(param);
game.createBoard();
game.start('local');