const websocket = io()
const board = Chessboard()

let id
let chess
let color

document.addEventListener('click', event => {
  if(event.target.classList.contains('square') && chess.turn() === color){
    board.setHighlights(chess.moves({square: event.target.id}))
    move(event.target.id)
  }
})

const move = async (start) => {
  try {
    const target = await click()
    chess.move({ from: start, to: target})
    websocket.emit('move', {id: id, move: { from: start, to: target }})
    board.drawPieces(chess.fen())
    console.log(start + "-" + target)
  }
  catch {
    board.resetHighlights()
    console.log("Move aborted")
  }
}

const click = () => {
  return new Promise((res, rej) => {
    document.addEventListener('click', event => {
      if(event.target.classList.contains('square')) {
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
  id = args.id
  chess = Chess(args.fen)
  color = 'w'
  board.drawPieces(chess.fen())
  console.log(args)
})

websocket.on('joined', args => {
  id = args.id
  chess = Chess(args.fen)
  color = 'b'
  board.drawPieces(chess.fen())
  console.log(id)
})

websocket.on('update', args => {
  chess = Chess(args.fen)
  board.drawPieces(chess.fen())
  console.log('Current turn: ' + chess.turn())
})