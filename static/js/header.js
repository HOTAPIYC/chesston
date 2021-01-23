function Header () {
  // Update header information
  function update (game) {
    const color = game.whitePlayer.id === id ? 'white' : 'black';

    document.querySelector('#status').textContent = `Your color: ${color} | Current turn: ${game.turn.color}`;
    if(game.check) {
      document.querySelector('#status').textContent += ' | Check!';
    }
    if(game.checkmate) {
      document.querySelector('#status').textContent += ' | Checkmate!';
    }
  }

  return {
    update: update
  };
}