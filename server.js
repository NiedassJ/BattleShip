const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require('body-parser')
const gameLogic = require('./gameLogic');

app.use(express.json());
app.use(cors());

app.use(bodyParser.json());

app.post('/start', (req, res) => {
  const game = gameLogic.startGame();
  res.json(game);
});

app.post('/guess', (req, res) => {
  const { gameId, x, y } = req.body;
  const result = gameLogic.makeGuess(gameId, x, y);
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

























