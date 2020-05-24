const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

let players = [];
let requests = [];
let games = [];

router.get('/player', (req,res) => res.json(players));

router.post('/player', (req,res) => {
  const player = {
    id: uuidv4(),
    name: req.body.name,
  };

  if (!player.name) {
    res.status(400).json({ msg: 'Please provide a name' });
  } else {
    players.push(player);
    res.json(player);
  }
});

router.get('/requests/:id', (req,res) => {
  const filtered = requests.filter(request => {
    if(request.to.id === req.params.id){
      return request;
    }
  });
  res.json(filtered);
});

router.post('/requests', (req,res) => {
  const request = {
    id: uuidv4(),
    from: req.body.from,
    to: req.body.to
  };

  requests.push(request);
  res.json({ msg: 'Request placed'});  
});

router.put('/requests/decline', (req,res) => {
  requests = requests.filter(request => request.id !== req.body.id);
  res.json({ msg: 'Request removed'});
});

router.put('/requests/accept', (req,res) => {
  const request = requests.find(request => request.id === req.body.id);
  const game = {
    id: uuidv4(),
    white: request.to,
    black: request.from,
    fen: '',
    lastMove: ''
  };

  games.push(game);

  requests = requests.filter(request => request.id !== req.body.id);
  res.json({ msg: 'Game created'});
});

router.get('/games/:id', (req,res) => {
  const filtered = games.filter(game => {
    if(game.white.id === req.params.id || game.black.id === req.params.id){
      return game;
    }
  });
  res.json(filtered);
});

router.put('/games/:id/newmove', (req,res) => {
  const index = games.indexOf(games.find(game => game.id === req.params.id));
  games[index].lastMove = req.body.move;
  res.json({ msg: 'Move placed' });
});

router.get('/games/:id/lastmove/:color', (req,res) => {
  const game = games.find(game => game.id === req.params.id);
  res.json({ lastMove: game.lastMove });
});

module.exports = router;