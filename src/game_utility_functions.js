export function getWinningLineDefinitions() {
  const winningLineDefinitions = [
    [0, 1, 2] /* Horizontal winning lines */,
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6] /* Vertical winning lines */,
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8] /* Diagonal winning lines */,
    [2, 4, 6],
  ];

  return winningLineDefinitions;
}

export function calculateWinner(squares) {
  const lines = getWinningLineDefinitions();

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  // check for now winner
  for (let i in squares) return null;
}

export function calculateWinningSquares(squares) {
  const lines = getWinningLineDefinitions();

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}

export function determineIfDraw(squares) {
  let emptySquaresRemain = false;
  for (let i in squares) {
    if (squares[i] === null) {
      emptySquaresRemain = true;
    }
  }

  if (emptySquaresRemain === false) {
    return true;
  }

  return false;
}

export function determineCoordinates(squareNumericValue) {
  const cols = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];
  const rows = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ];

  let xCoordinate = null;
  let yCoordinate = null;

  for (let i = 0; i < cols.length; i++) {
    for (let j = 0; j < cols[i].length; j++) {
      if (squareNumericValue === cols[i][j]) {
        xCoordinate = i + 1;
      }
    }
  }

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      if (squareNumericValue === rows[i][j]) {
        yCoordinate = i + 1;
      }
    }
  }

  return [xCoordinate, yCoordinate];
}

// Style individual square's borders to produce appropriate border lines on gameboard
export function assignBorderClass(squareNumber) {
  let borderClass;
  switch (squareNumber) {
    case 0:
      borderClass = "border-rb";
      break;
    case 1:
      borderClass = "border-rbl";
      break;
    case 2:
      borderClass = "border-bl";
      break;
    case 3:
      borderClass = "border-tbr";
      break;
    case 4:
      borderClass = "border-all";
      break;
    case 5:
      borderClass = "border-tbl";
      break;
    case 6:
      borderClass = "border-tr";
      break;
    case 7:
      borderClass = "border-trl";
      break;
    case 8:
      borderClass = "border-tl";
      break;
    default:
      borderClass = "border-all";
  }

  return borderClass;
}

