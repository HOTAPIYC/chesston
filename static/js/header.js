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

function Stopwatch (element) {
  let startTime;
  let interval;

  function printTime () {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;

    const hrs = Math.floor((elapsedTime / 1000) / 3600);
    const min = Math.floor(((elapsedTime / 1000) % 3600) / 60);
    const sec = Math.floor(((elapsedTime / 1000) % 3600) % 60);
  
    const hrs_string = hrs < 10 ? `0${hrs}` : `${hrs}`;
    const min_string = min < 10 ? `0${min}` : `${min}`;
    const sec_string = sec < 10 ? `0${sec}` : `${sec}`;
  
    element.innerHTML = `<p>${hrs_string}:${min_string}:${sec_string}</p>`;
  }
  
  function start (value = new Date().getTime()) {
    startTime = value;
    interval = setInterval(printTime, 1000, element);
  }

  function reset (value = new Date().getTime()) {
    startTime = value;
  }

  function stop () {
    clearInterval(interval);
  }

  return {
    start: start,
    reset: reset,
    stop: stop
  }
}