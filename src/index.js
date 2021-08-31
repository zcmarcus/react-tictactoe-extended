import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
	Optionally implement some of these additional features (listed in order of increasing difficulty):


		// DONE: Display the location for each move in the format (col, row) in the move history list.
		// DONE: Bold the currently selected item in the move list.
		// DONE: Rewrite Board to use two loops to make the squares instead of hardcoding them.
		TODO: Add a toggle button that lets you sort the moves in either ascending or descending order.
	    TODO: When someone wins, highlight the three squares that caused the win.
		TODO: When no one wins, display a message about the result being a draw.
*/

function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
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
		return (
			<Square 
				key={i}
				value={this.props.squares[i]} 
				onClick={() => this.props.onClick(i)}
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
					// create gameboard rows
					gridWidthCoordinates.map( (row) => { 
						return <div key={row} className="board-row">
							{
								// create squares (buttons) in row
								gridWidthCoordinates.map( (col) => {
									squareNumber++;
									return this.renderSquare(squareNumber);
								})
							}

						</div>
					})
				}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				coordinates: [null,null]
			}],
			stepNumber: 0,
			xIsNext: true,
			boldMove: false
		};
	}

	handleClick(i) {
		
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		
		const coordinates = determineCoordinates(i);

		if (calculateWinner(squares) || squares[i]) {
			return;
		}

		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				coordinates: coordinates
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		})
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step,move) => {
			const xCoordinate = step.coordinates ? step.coordinates[0] : '';
			const yCoordinate = step.coordinates ? step.coordinates[1] : '';

			const desc = move 
				? 'Go to move #' + move + ' (' + xCoordinate + ', ' + yCoordinate + ')'
				: 'Go to game start';

			let boldMove = '';
			switch (this.state.stepNumber) {
				case move:
					boldMove = 'bold-move'
					break;
				default:
					boldMove = '';
					break;
			}
			return (
				<li key={move}>
					<button 
						onClick={() => this.jumpTo(move)}
						className={boldMove} 
					>{desc}</button>
				</li>
			)
		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board 
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div className="section-title">{status}</div>
					<hr/>
					<ol>{moves}</ol>
				</div>
				<div className="vertical-divider"></div>
				<div className="game-controls">
					<div className="section-title">Controls</div>
					<hr/>
					<ol className="game-controls-list">
						<li><button className="control-button">Regular Sort</button></li>
					</ol>
				</div>
			</div>

		);
	}
}

// ========================================

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);


function calculateWinner(squares) {

	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a]
		}
	}
	return null
}

function determineCoordinates(squareNumericValue) {
	
	const cols = [
		[0,3,6],
		[1,4,7],
		[2,5,8]
	]
	const rows = [
		[0,1,2],
		[3,4,5],
		[6,7,8]
	]

	let xCoordinate = null;
	let yCoordinate = null;
	
	for (let i = 0; i < cols.length; i++ ) {
		for (let j = 0; j < cols[i].length; j++) {
			if (squareNumericValue === cols[i][j]) {
				xCoordinate = i + 1; 
			}
		}
	}

	for (let i = 0; i < rows.length; i++ ) {
		for (let j = 0; j < rows[i].length; j++) {
			if (squareNumericValue === rows[i][j]) {
				yCoordinate = i + 1;
			}
		}
	}


	return [xCoordinate,yCoordinate];
}

