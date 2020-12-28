import express from "express";
import { createPlayer, getPlayer, getAllPlayers } from "../services/player.js";

const router = express();

let requests = [];
let games = [];

router.get("/player", (req,res) => {
  res.json(getAllPlayers())
});

router.post("/player/new", (req,res) => {
  createPlayer(req.body.name, req.body.password)
  .then((result) => res.status(200).json(result))
  .catch((error) => {
    console.log(error);
    res.status(400).json(error);});
});

router.post("/player/login", (req,res) => {
  getPlayer(req.body.name, req.body.password)
  .then((result) => res.status(200).json(result))
  .catch((error) => res.status(400).json(error));
});

router.get("/requests/:id", (req,res) => {
  const filtered = requests.filter(request => {
    if(request.to.id === req.params.id){
      return request;
    }
  });
  res.json(filtered);
});

router.post("/requests", (req,res) => {
  const request = {
    id: uuidv4(),
    from: req.body.from,
    to: req.body.to
  };

  requests.push(request);
  res.json({ msg: "Request placed"});  
});

router.put('/requests/decline', (req,res) => {
  requests = requests.filter(request => request.id !== req.body.id);
  res.json({ msg: "Request removed"});
});

router.put("/requests/accept", (req,res) => {
  const request = requests.find(request => request.id === req.body.id);
  const game = {
    id: uuidv4(),
    white: request.to,
    black: request.from,
    fen: "",
    lastMove: ""
  };

  games.push(game);

  requests = requests.filter(request => request.id !== req.body.id);
  res.json({ msg: "Game created"});
});

router.get("/games/:id", (req,res) => {
  const filtered = games.filter(game => {
    if(game.white.id === req.params.id || game.black.id === req.params.id){
      return game;
    }
  });
  res.json(filtered);
});

router.put("/games/:id/newmove", (req,res) => {
  const index = games.indexOf(games.find(game => game.id === req.params.id));
  games[index].lastMove = req.body.move;
  res.json({ msg: 'Move placed' });
});

router.get("/games/:id/lastmove/:color", (req,res) => {
  const game = games.find(game => game.id === req.params.id);
  res.json({ lastMove: game.lastMove });
});

export { router }