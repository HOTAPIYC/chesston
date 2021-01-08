const websocket = io()
const board = Chessboard()

let id // Game id
let color // Color of player client
let turn // Color of the current turn
let legal // All legal moves of current board state
let check // Current game is in check
let checkmate // Current game is in checkmate

// If move assembly (to consecutive clicks on the
// board) has not been finished, prevent that too many
// parallel threads are started
let lock

document.addEventListener('click', event => {
  if(event.target.classList.contains('square') && turn === color && !lock){
    board.setHighlights(legal,event.target.id)
    move(event.target.id)
    // Prevent start of next async call before
    // second click has been evaluated
    lock = true
  }
})

const move = async (start) => {
  try {
    // Wait for second valid click on board
    const target = await click()
    // Send selection to server
    websocket.emit('move', {id: id, move: { from: start, to: target }})
    console.log('Your move: ' + start + "-" + target)
    board.resetHighlights()
    // Release click listener and allow
    // renewal of move call
    lock = false
  }
  catch {
    // Abort move if no valid target
    // has been selected
    board.resetHighlights()
    // Release click listener and allow
    // renewal of move call
    lock = false
  }
}

const click = () => {
  return new Promise((res, rej) => {
    document.addEventListener('click', event => {
      if(event.target.classList.contains('highlight')) {
        res(event.target.id)
      } else {
        rej()
      }
    })
  })
}

document.querySelector('#start').addEventListener('click', event => {
  websocket.emit('start game')
})

document.querySelector('#join').addEventListener('click', event => {
  websocket.emit('join game', document.querySelector('#id').value)
})

websocket.on('started', args => {
  // Update local status vars
  id = args.id
  legal = args.legal
  color = 'w'
  turn = args.turn
  console.log('Game started with id: ' + id)
  // Update UI
  board.drawPieces(args.fen)
  status()
})

websocket.on('joined', args => {
  // Update local status vars
  id = args.id
  legal = args.legal
  color = 'b'
  turn = args.turn
  console.log('You joined game id: ' + id)
  // Update UI
  board.drawPieces(args.fen)
  status()
})

websocket.on('update', args => {
  // Update local status vars
  legal = args.legal
  turn = args.turn
  check = args.check
  checkmate = args.checkmate
  // Update UI
  board.drawPieces(args.fen)
  status()
})

const status = () => {
  document.querySelector('#status').textContent = `Your color: ${color} | Current turn: ${turn}`
  if(check) {
    document.querySelector('#status').textContent += ' | Check!'
  }
  if(checkmate) {
    document.querySelector('#status').textContent += ' | Checkmate!'
  }
}