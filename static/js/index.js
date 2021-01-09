const websocket = io()
const board = Chessboard()

let id // Game id
let color // Color of player
let turn // Color of the current turn
let legal // All legal moves of current board state
let check // Current game is in check
let checkmate // Current game is in checkmate

// If move assembly (two consecutive clicks on the
// board) has not been finished, prevent that too many
// parallel threads are started
let lock

document.addEventListener('click', event => {
  if(event.target.classList.contains('square') && turn === color && !lock){
    board.highlight(legal, event.target.id)
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
    board.reset()
    // Release click listener and allow
    // renewal of move call
    lock = false
  }
  catch {
    // Abort move if no valid target
    // has been selected
    board.reset()
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

document.querySelector('#join').addEventListener('click', async event => {
  const id = await showInputDialog({text: 'Enter a valid ID:'})
  websocket.emit('join game', id)
})

websocket.on('started', async args => {
  // Update local status vars
  id = args.id
  legal = args.legal
  color = 'w'
  turn = args.turn
  await showMsgDialog({msgln1: 'The id of your game is:', msgln2: args.id})
  // Update UI
  board.draw(args.fen)
  updateStatus()
})

websocket.on('joined', async args => {
  // Update local status vars
  id = args.id
  legal = args.legal
  color = 'b'
  turn = args.turn
  await showMsgDialog({msgln1: 'You joined the game!', msgln2: ''})
  // Update UI
  board.draw(args.fen)
  updateStatus()
})

websocket.on('update', args => {
  // Update local status vars
  legal = args.legal
  turn = args.turn
  check = args.check
  checkmate = args.checkmate
  // Update UI
  board.draw(args.fen)
  updateStatus()
})