let games = {};

const ships = [5, 4, 3, 3, 2, 2, 2, 1, 1, 1];

function isValidPlacement(grid, row, col, size, isHorizontal) {
    for (let i = 0; i < size; i++) {
        let newRow = isHorizontal ? row : row + i;
        let newCol = isHorizontal ? col + i : col;
        if (newRow >= 10 || newCol >= 10) return false;
        if (grid[newRow][newCol] !== null) return false;
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                let checkRow = newRow + x;
                let checkCol = newCol + y;
                if (checkRow >= 0 && checkRow < 10 && checkCol >= 0 && checkCol < 10) {
                    if (grid[checkRow][checkCol] !== null) return false;
                }
            }
        }
    }
    return true;
}

function placeShips(grid, ships, gameId) {
  let shipId = 1;
  games[gameId].ships = {};
  ships.forEach(size => {
      let placed = false;
      while (!placed) {
          let row = Math.floor(Math.random() * 10);
          let col = Math.floor(Math.random() * 10);
          let isHorizontal = Math.random() < 0.5;
          if (isValidPlacement(grid, row, col, size, isHorizontal)) {
              const shipCoords = [];
              for (let i = 0; i < size; i++) {
                  let newRow = isHorizontal ? row : row + i;
                  let newCol = isHorizontal ? col + i : col;
                  grid[newRow][newCol] = shipId;
                  shipCoords.push({ x: newRow, y: newCol });
              }
              games[gameId].ships[shipId] = { coords: shipCoords, hits: 0, size: size };
              placed = true;
              shipId++;
          }
      }
  });
}

function printGrid(grid) {
    console.log("  0 1 2 3 4 5 6 7 8 9");
    grid.forEach((row, rowIndex) => {
        let rowString = rowIndex.toString() + ' '; 
        row.forEach(cell => {
            rowString += cell === null ? '. ' : 'S '; 
        });
        console.log(rowString);
    });
}

const startGame = () => {
  const gameId = Date.now().toString();
  const grid = Array.from({ length: 10 }, () => new Array(10).fill(null));
  games[gameId] = { grid, movesLeft: 25, ships: {} };
  placeShips(grid, ships, gameId);

    printGrid(grid);

    return { gameId, grid };
};

const makeGuess = (gameId, x, y) => {
  const game = games[gameId];
  if (!game) {
      return { error: 'Game not found' };
  }

  if (x < 0 || x >= 10 || y < 0 || y >= 10) {
      return { error: 'Invalid coordinates' };
  }

  if (game.grid[x][y] === 'H' || game.grid[x][y] === 'M') {
      return { error: 'Move already made', grid: game.grid, movesLeft: game.movesLeft };
  }

  let message = 'Move registered';
  if (typeof game.grid[x][y] === 'number') { 
      const hitShipId = game.grid[x][y];
      game.grid[x][y] = 'H'; 
      game.ships[hitShipId].hits++; 

      if (game.ships[hitShipId].hits === game.ships[hitShipId].size) { 
          // Check if all ships are sunk
          let allSunk = Object.values(game.ships).every(ship => ship.hits === ship.size);
          if (allSunk) {
              game.movesLeft = 0;
              message = 'Visi laivai paskandinti!';
              return { grid: game.grid, movesLeft: game.movesLeft, gameOver: true, message };
          }
          message = `Laivas paskandintas!`;
          console.log("Laivas paskandintas")
      } else {
          message = 'HIT!';
      }
  } else { // It's a miss
      game.grid[x][y] = 'M'; // Mark as miss
      game.movesLeft -= 1; 
      message = 'MISS!';
  }

  // Check if the game is over due to no moves left
  let gameOver = false;
  if (game.movesLeft <= 0) {
      gameOver = true;
      message = 'OVER';
  }

  return { grid: game.grid, movesLeft: game.movesLeft, gameOver, message };
};


module.exports = { startGame, makeGuess };
