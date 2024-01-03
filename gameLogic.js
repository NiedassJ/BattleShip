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

function placeShips(grid, ships) {
    ships.forEach(size => {
        let placed = false;
        while (!placed) {
            let row = Math.floor(Math.random() * 10);
            let col = Math.floor(Math.random() * 10);
            let isHorizontal = Math.random() < 0.5;
            if (isValidPlacement(grid, row, col, size, isHorizontal)) {
                for (let i = 0; i < size; i++) {
                    let newRow = isHorizontal ? row : row + i;
                    let newCol = isHorizontal ? col + i : col;
                    grid[newRow][newCol] = 'S'; 
                }
                placed = true;
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
    placeShips(grid, ships);
    games[gameId] = { grid, movesLeft: 25 };

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
    let message = 'Move registered';

    if (game.grid[x][y] === 'H' || game.grid[x][y] === 'M') {
        message = 'Move already made'
      return { error: 'Move already made', grid: game.grid, movesLeft: game.movesLeft };
    }
  
    if (game.grid[x][y] === 'S') {
      game.grid[x][y] = 'H'; // H for hit
      message = 'HIT!';
    } else {
      game.grid[x][y] = 'M'; // M for miss
      game.movesLeft -= 1;
      message = 'MISS!';
    }
  
    let gameOver = false;
    if (game.movesLeft <= 0) {
      gameOver = true;
      message = 'Game over: No more moves left';
    } else if (!game.grid.some(row => row.includes('S'))) {
      gameOver = true;
      message = 'Game over: All ships have been hit!';
    }
  
    return { grid: game.grid, movesLeft: game.movesLeft, gameOver, message };
  };
  

module.exports = { startGame, makeGuess };
