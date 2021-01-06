const websocket = io();

const board = Chessboard()
const chess = Chess()

board.drawPieces(chess.fen())

document.addEventListener('click', event => {
  if(event.target.classList.contains('square')){
    board.setHighlights(chess.moves({square: event.target.id}))
    move(event.target.id)
  }
})

const move = async (start) => {
  try {
    const target = await click()
    chess.move({ from: start, to: target})
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