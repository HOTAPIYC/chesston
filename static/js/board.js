function Chessboard(){
  let state = []

  const squares = [
    ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
    ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
    ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
    ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
    ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
    ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
    ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
    ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
  ]

  // Extend array of pieces with square ids
  function setState (board) {
    state = board.map((row, idx1) => {
      return row.map((piece, idx2) => {
        return {id: squares[idx1][idx2], piece: piece}
      })
    })
  }

  // Add hightlight class to a list of square names
  // Squares to highlight are expected to be moves in SAN
  // notation, that contain target square in last two chars.
  function highlight (legal, start) {
    reset()

    document.getElementById(start).classList.add('start')

    legal.forEach((move) => {
      if(move.from === start){
        document.getElementById(move.to).classList.add('highlight')
      }
    })
  }

  // Remove highlight class from all squares
  function reset () {
    document.querySelectorAll('.square').forEach(el => {
      el.classList.remove('highlight')
      el.classList.remove('start')
    })
  }

  // Draws pieces from current board state
  function drawPieces () {
    clear()

    state.forEach(row => {
      row.forEach(square => {
        if (square.piece != null) {
          const el = document.getElementById(square.id)
          el.classList.add(`fen-${square.piece.type}-${square.piece.color}`)
        }
      })
    })
  }

  // Remove all FEN class names from the square divs
  function clear () {
    document.querySelectorAll('.square').forEach(el => {
      el.className = el.className.replace(/fen-.-./, "")
    })
  }

  // Default orientation of board is white base line at
  // the bottom. Board is flipped by reseting ids of squares.
  let flipped = false

  function flip () {
    let arr = []
  
    if (flipped) {
      arr = squares.flat()
    } else {
      arr = squares.flat().reverse()
    }
  
    document.querySelectorAll('.square').forEach((el, index) => {
      el.id = arr[index]
    })
  
    flipped = !flipped

    drawPieces()
  }

  return {
    setState: setState,
    drawPieces: drawPieces,
    clear: clear,
    highlight: highlight,
    reset: reset,
    flip: flip
  }
}
