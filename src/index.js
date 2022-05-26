import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import * as util from "./game_utility_functions";
import * as api from "./api";

import "./index.css";

/*
	Optionally implement some of these additional features (listed in order of increasing difficulty):


		// DONE: Display the location for each move in the format (col, row) in the move history list.
		// DONE: Bold the currently selected item in the move list.
		// DONE: Rewrite Board to use two loops to make the squares instead of hardcoding them.
		// DONE: Add hover effect showing next game marker (X or O) to be laid.
		// DONE: Add a toggle button that lets you sort the moves in either ascending or descending order.
		// DONE: When someone wins, highlight the three squares that caused the win.
		// DONE: Clean up repeated code in calculateWinner() and calculateWinningSquares()
		// DONE: When no one wins, display a message about the result being a draw.
		// TODO: Save and display gameplay stats.
		// TODO: 
		// TODO: 
		// TODO: 

*/

function Square(props) {
  return (
    <button
      className={
        "square " +
        props.hoverClass +
        " " +
        props.borderClass +
        " " +
        props.highlightClass
      }
      onClick={props.onClick}
      data-coordinates={props.coordinates}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gridWidth: Math.sqrt(this.props.squares.length),
    };
  }

  renderSquare(i) {
    let borderClass = util.assignBorderClass(i);
    let highlightClass =
      this.props.winningSquares && this.props.winningSquares.includes(i)
        ? "highlight"
        : "";
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        hoverClass={
          this.props.squares[i] == null ? this.props.hoverClass : "hover-none"
        }
        borderClass={borderClass}
        highlightClass={highlightClass}
      />
    );
  }

  render() {
    const gridWidthCoordinates = ((gridWidth) => {
      let coords = [];
      for (let x = 0; x < gridWidth; x++) {
        coords.push(x);
      }
      return coords;
    })(this.state.gridWidth);

    let squareNumber = -1;

    return (
      <div>
        {
          // draw gameboard rows
          gridWidthCoordinates.map((row) => {
            return (
              <div key={row} className="board-row">
                {
                  // draw squares in row
                  gridWidthCoordinates.map((col) => {
                    squareNumber++;
                    return this.renderSquare(squareNumber, col, row);
                  })
                }
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default function GamesHistory() {
  const [gamesPlayedArray, setGamesPlayedArray] = useState([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const gamesArray = await api.getGames();
    if (gamesArray) {
      setGamesPlayedArray(gamesArray);
    }
  };

  // const fetchGames = () => {
  //   fetch("http://localhost/games/index.json")
  //     .then((response) => {
  //       if (response.ok) {
  //         return response.json();
  //       }
  //       throw response;
  //     })
  //     .then((data) => {
  //       console.log("fetched");
  //       setGamesPlayedArray(data.games);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data: ", error);
  //     });
  // };

  return (
    <div className="game-history">
      <h3>Game History</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Winner</th>
            <th># of Moves</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {gamesPlayedArray.map((game) => {
            return (
              <tr>
                <td>{game.id}</td>
                <td>{game.winner}</td>
                <td>{game.num_moves}</td>
                <td>{game.formatted_created_date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          coordinates: [null, null],
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      boldMove: false,
      reverseSortMoves: false,
      winnerResult: null,
      totalNumberOfMoves: null,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    const coordinates = util.determineCoordinates(i);

    if (util.calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          coordinates: coordinates,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  invertMoveSorting(reverseSortMoves = false) {
    this.setState({
      reverseSortMoves: !reverseSortMoves,
    });
  }

  async saveGameStats(winnerResult, numMoves) {
    let saveResult = await api.addGame({
      winnerResult: winnerResult,
      numMoves: numMoves,
    });
    console.log(saveResult);
  }

  displaySaveButton(winnerResult, numMoves) {
    if (winnerResult && numMoves) {
      return (
        <li>
          <button
            className="control-button"
            onClick={() => this.saveGameStats(winnerResult, numMoves)}
          >
            Save Game Stats
          </button>
        </li>
      );
    }
    return "";
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const winner = util.calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const xCoordinate = step.coordinates ? step.coordinates[0] : "";
      const yCoordinate = step.coordinates ? step.coordinates[1] : "";

      const desc = move
        ? "Go to move #" + move + " (" + xCoordinate + ", " + yCoordinate + ")"
        : "Go to game start";

      let boldMove = move === this.state.stepNumber ? "bold-move" : "";

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={boldMove}>
            {desc}
          </button>
        </li>
      );
    });

    const movesReverseOrder = moves.slice().reverse();

    let status;
    let hoverClass;
    let winningSquares;
    let winnerResult;
    if (winner) {
      winnerResult = winner;
      winningSquares = util.calculateWinningSquares(current.squares);
      status = "Winner: " + winner;
      hoverClass = "hover-none";
    } else if (util.determineIfDraw(current.squares)) {
      winnerResult = "D";
      status = "Draw!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      hoverClass = this.state.xIsNext ? "hover-x" : "hover-o";
    }

    let sortOrderButtonText = this.state.reverseSortMoves
      ? "Sort Moves Normally"
      : "Reverse Sort Moves";

    return (
      <div className="game">
        <div className="game-board">
          <Board
            hoverClass={hoverClass}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={winningSquares}
          />
        </div>
        <div className="game-info">
          <div id="status" className="section-title">
            {status}
          </div>
          <hr />
          <ol reversed={this.state.reverseSortMoves}>
            {this.state.reverseSortMoves ? movesReverseOrder : moves}
          </ol>
        </div>
        <div className="vertical-divider"></div>
        <div className="game-controls">
          <div className="section-title">Controls</div>
          <hr />
          <ol className="game-controls-list">
            <li>
              <button
                className="control-button"
                onClick={() =>
                  this.invertMoveSorting(this.state.reverseSortMoves)
                }
              >
                {sortOrderButtonText}
              </button>
            </li>

            {this.displaySaveButton(winnerResult, moves.length)}
          </ol>
        </div>
        <GamesHistory />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
