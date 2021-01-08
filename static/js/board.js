function Chessboard(){
  // Board interaction
  const squareNames = [
    ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"],
    ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
    ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
    ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
    ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
    ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
    ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
    ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
  ]

  // Add hightlight class to a list of square names
  // Squares to highlight are expected to be moves in SAN
  // notation, that contain target square in last two chars.
  const setHighlights = (legal,start) => {
    resetHighlights()
    document.getElementById(start).classList.add('start')
    legal.forEach((move) => {
      if(move.from === start){
        document.getElementById(move.to).classList.add('highlight')
      }
    })
  }

  // Remove highlight class from all squares
  const resetHighlights = () => {
    squareNames.forEach((row) => {
      row.forEach((squareName) => {
        const square = document.getElementById(squareName)
        square.classList.remove('highlight')
        square.classList.remove('start')
      })
    })
  }

  // Draws pieces on board according to FEN string
  // Sample string: "rnbnkqrb/pppppppp/8/8/8/8/PPPPPPPP/RNBNKQRB w KQkq - 0 1"
  const drawPieces = (fen) => {
    removePieces()
    const fenPerRow = fen.substring(0,fen.search(/\s/)).split("/");
    fenPerRow.forEach((row,rowIndex) => {
      let colIndex = 0;
      [...row].forEach((char) => {
        if(/[r,n,b,k,q,p]/i.test(char)){
          const square = document.getElementById(squareNames[rowIndex][colIndex]);
          square.classList.add(`fen-${char}`);
          colIndex++;
        } else {
          colIndex += Number(char);
        }
      });
    });
  }

  // Remove all FEN class names from the square divs
  const removePieces = () => {
    squareNames.forEach((row) => {
      row.forEach((squareName) => {
        const square = document.getElementById(squareName);
        square.className = square.className.replace(/fen-./, "");
      });
    });
  }

  return {
    drawPieces: drawPieces,
    removePieces: removePieces,
    setHighlights: setHighlights,
    resetHighlights: resetHighlights
  }
}
