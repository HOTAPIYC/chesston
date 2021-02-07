function Header() {
  const clockGame = Stopwatch(document.querySelector('#status-clock-game'));
  const clockMove = Stopwatch(document.querySelector('#status-clock-move'));

  // Init header information
  function init(game) {
    const color = game.whitePlayer.id === id ? 'white' : 'black';
    const turn = game.turn.color;

    document.querySelector('#status-color').textContent = color;
    document.querySelector('#status-turn').textContent = turn;

    clockGame.start(new Date(game.timeStart));
    clockMove.start(new Date(game.timeLastMove));

    checkEvents(game);
  }

  // Update header information
  function update(game) {
    const turn = game.turn.color;

    document.querySelector('#status-turn').textContent = turn;

    clockMove.start(new Date(game.timeLastMove));

    setHighlightCheck(game);
    setHighlightCheckmate(game);
  }

  function setHighlightCheck(game) {
    const element = document.querySelector('#status-check');
    if(game.check) {  
      element.classList.add('check-alert');
    } else {
      element.classList.remove('check-alert');
    }
  }
  
  function setHighlightCheckmate(game) {
    const element = document.querySelector('#status-checkmate');
    if(game.checkmate) {  
      element.classList.add('check-alert');
    } else {
      element.classList.remove('check-alert');
    }
  }

  return {
    init: init, 
    update: update
  };
}

function Stopwatch(element) {
  let startTime;
  let interval;

  function printTime() {
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
  
  function start(value = new Date().getTime()) {
    startTime = value;
    interval = setInterval(printTime, 1000, element);
  }

  function reset(value = new Date().getTime()) {
    startTime = value;
  }

  function stop() {
    clearInterval(interval);
  }

  return {
    start: start,
    reset: reset,
    stop: stop
  }
}