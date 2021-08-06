import React from 'react';
import '../css/Game.css';
import { ROWS, COLS, INTERVAL, ALIVE_PERCENT } from '../../utils/Globals';

class Game extends React.Component {
  state = {
    grid: [],
    isOn: false,
    isMousePressed: false,
  };

  board = {
    ROWS: ROWS,
    COLS: COLS,
    INTERVAL: INTERVAL,
  };

  status = {
    ALIVE: true,
    DEAD: false,
  };

  neighbours = {
    TOPLEFT: [-1, 1],
    TOP: [0, 1],
    TOPRIGHT: [1, 1],
    LEFT: [-1, 0],
    RIGHT: [1, 0],
    BOTTOMLEFT: [-1, -1],
    BOTTOM: [0, -1],
    BOTTOMRIGHT: [1, -1],
  };

  componentDidMount() {
    this.setState({
      grid: this.generateGrid(),
      isOn: false,
    });

    setInterval(() => this.Update(), this.board.INTERVAL);
  }

  Update = () => {
    if (!this.state.isOn) return;

    const newGrid = [];
    for (let col = 0; col < this.board.COLS; col++) {
      newGrid[col] = [];
      for (let row = 0; row < this.board.ROWS; row++) {
        newGrid[col][row] = this.simulateNewGrid(col, row);
      }
    }

    this.setState({ grid: newGrid });
  };

  simulateNewGrid = (col, row) => {
    let aliveNeigbours = 0;

    /*
    * == Cell
    TL T  TR
    L  *  R
    BL B  BR
    */

    for (const neighbour in this.neighbours) {
      const [x, y] = this.neighbours[neighbour];
      let newCol = col + x;
      let newRow = row + y;

      if (newCol < 0) {
        newCol = this.board.COLS - 1;
      }

      if (newCol > this.board.COLS - 1) {
        newCol = 0;
      }

      if (newRow < 0) {
        newRow = this.board.ROWS - 1;
      }

      if (newRow > this.board.ROWS - 1) {
        newRow = 0;
      }

      const neighbourStatus = this.state.grid[newCol][newRow];
      if (neighbourStatus === this.status.ALIVE) {
        aliveNeigbours++;
      }
    }

    const currentGrid = this.state.grid[col][row];

    if (currentGrid === this.status.ALIVE) {
      if (aliveNeigbours < 2) {
        return this.status.DEAD;
      } else if (aliveNeigbours === 2 || aliveNeigbours === 3) {
        return this.status.ALIVE;
      } else if (aliveNeigbours > 3) {
        return this.status.DEAD;
      }
    } else {
      if (aliveNeigbours === 3) {
        return this.status.ALIVE;
      }
    }

    return this.status.DEAD;
  };

  generateGrid = () => {
    let grid = [];
    for (let col = 0; col < this.board.COLS; col++) {
      grid[col] = [];
      for (let row = 0; row < this.board.ROWS; row++) {
        grid[col][row] = this.status.DEAD;
      }
    }
    return grid;
  };

  renderGrid = () => {
    return (
      <div className='grid'>
        {this.state.grid.map((row, col) => this.renderCol(row, col))}
      </div>
    );
  };

  renderCol = (row, col) => {
    return (
      <div key={`col-${col}`} className='col'>
        {row.map((cellStatus, row) => {
          return (
            <div
              key={`${col}${row}`}
              className={`cell ${
                cellStatus === this.status.DEAD ? 'cell--dead' : 'cell--alive'
              }`}
              onMouseDown={() => this.toggleState(col, row, 'down')}
              onMouseEnter={() => this.toggleState(col, row, 'enter')}
              onMouseUp={() => this.toggleState(col, row, 'up')}
            ></div>
          );
        })}
      </div>
    );
  };

  toggleState = (col, row, modifier) => {
    const newGrid = this.state.grid;

    switch (modifier) {
      case 'down':
        newGrid[col][row] = !newGrid[col][row];
        this.setState({ grid: newGrid, isMousePressed: true });
        break;

      case 'enter':
        if (!this.state.isMousePressed) return;
        newGrid[col][row] = !newGrid[col][row];
        this.setState({ grid: newGrid });
        break;

      case 'up':
        this.setState({ isMousePressed: false });
        break;

      default:
        break;
    }
  };

  toggleIsOn = () => {
    this.setState({ isOn: !this.state.isOn });
  };

  getRandomBool = (ALIVE_PERCENT) =>
    Math.random() < ALIVE_PERCENT ? this.status.ALIVE : this.status.DEAD;

  generateRandomGrid = () => {
    const newGrid = this.state.grid;

    for (let col = 0; col < this.board.COLS; col++) {
      newGrid[col] = [];
      for (let row = 0; row < this.board.ROWS; row++) {
        newGrid[col][row] = this.getRandomBool(ALIVE_PERCENT);
      }
    }

    this.setState({ grid: newGrid });
  };

  render() {
    return (
      <div onContextMenu={(e) => e.preventDefault()}>
        <div className='Board'>
          <button
            className={`btn ${this.state.isOn ? 'btn--stop' : 'btn--start'}`}
            onClick={() => this.toggleIsOn()}
          >
            {this.state.isOn ? 'stop' : 'start'}
          </button>

          <button
            className={`btn btn--random`}
            onClick={() => this.generateRandomGrid()}
            disabled={this.state.isOn ? true : false}
          >
            randomize
          </button>

          {this.renderGrid()}
        </div>
      </div>
    );
  }
}

export default Game;
