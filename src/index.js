import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
	Optionally implement some of these additional features (listed in order of increasing difficulty):


		// DONE: Display the location for each move in the format (col, row) in the move history list.
		// DONE: Bold the currently selected item in the move list.
		// DONE: Rewrite Board to use two loops to make the squares instead of hardcoding them.
		// DONE: Add hover effect showing next game marker (X or O) to be laid.
		// DONE: Add a toggle button that lets you sort the moves in either ascending or descending order.
	    // TODO: When someone wins, highlight the three squares that caused the win.
		// TODO: Clean up repeated code in calculateWinner() and calculateWinningSquares()
		TODO: When no one wins, display a message about the result being a draw.
*/

function Square(props) {
	return (
		<button 
			className={"square " + props.hoverClass + " " + props.borderClass + " " + props.highlightClass} 
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

		let borderClass = assignBorderClass(i);
		let highlightClass = ((this.props.winningSquares) && this.props.winningSquares.includes(i)) 
				? 'highlight'
				: '';
		return (
			<Square 
				key={i}
				value={this.props.squares[i]} 
				onClick={() => this.props.onClick(i)}
				hoverClass={(this.props.squares[i] == null) ? this.props.hoverClass : "hover-none"}
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
					gridWidthCoordinates.map( (row) => { 
						return <div key={row} className="board-row">
							{
								// draw squares in row
								gridWidthCoordinates.map( (col) => {
									squareNumber++;
									return this.renderSquare(squareNumber, col, row);
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
			boldMove: false,
			reverseSortMoves: false,
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

	invertMoveSorting(reverseSortMoves = false) {
		this.setState({
			reverseSortMoves: !reverseSortMoves
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


			let boldMove = (move === this.state.stepNumber) 
					? 'bold-move'
					: '';

			return (
				<li key={move}>
					<button 
						onClick={() => this.jumpTo(move)}
						className={boldMove} 
					>{desc}</button>
				</li>
			)
		});


		const movesReverseOrder = moves.slice().reverse();

		let status;
		let hoverClass;
		let winningSquares;
		if (winner) {
			winningSquares = calculateWinningSquares(current.squares);
			status = 'Winner: ' + winner;
			hoverClass = "hover-none";
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
			hoverClass = this.state.xIsNext ? 'hover-x' : 'hover-o';
		}

		let sortOrderButtonText = this.state.reverseSortMoves ? 'Sort Moves Normally' : 'Reverse Sort Moves';

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
					<div id="status" className="section-title">{status}</div>
					<hr/>
					<ol reversed={this.state.reverseSortMoves}>
						{(this.state.reverseSortMoves) ? movesReverseOrder : moves}
					</ol>
				</div>
				<div className="vertical-divider"></div>
				<div className="game-controls">
					<div className="section-title">Controls</div>
					<hr/>
					<ol className="game-controls-list">
						<li><button
								className="control-button" 
								onClick={() => this.invertMoveSorting(this.state.reverseSortMoves)}
							>
							{sortOrderButtonText}</button>
						</li>
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

function getWinningLineDefinitions() {

	const winningLineDefinitions = [
		[0, 1, 2], /* Horizontal winning lines */
		[3, 4, 5], 
		[6, 7, 8],  
		[0, 3, 6], /* Vertical winning lines */
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8], /* Diagonal winning lines */
		[2, 4, 6],
	];

	return winningLineDefinitions;
}

function calculateWinner(squares) {

	const lines = getWinningLineDefinitions();

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a]
		}
	}
	return null
}

function calculateWinningSquares(squares) {

	const lines = getWinningLineDefinitions();

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [a, b, c];
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

// Style individual square's borders to produce appropriate border lines on gameboard
function assignBorderClass(squareNumber) {
	let borderClass;
	switch (squareNumber) {
		case 0: 
			borderClass = 'border-rb';
			break;
		case 1:
			borderClass = 'border-rbl';
			break;
		case 2: 
			borderClass = 'border-bl';
			break;
		case 3:
			borderClass = 'border-tbr';
			break;
		case 4: 
			borderClass = 'border-all';
			break;
		case 5:
			borderClass = 'border-tbl';
			break;
		case 6: 
			borderClass = 'border-tr';
			break;
		case 7:
			borderClass = 'border-trl';
			break;
		case 8: 
			borderClass = 'border-tl';
			break;
		default: 
			borderClass = 'border-all';
	}

	return borderClass;
}

