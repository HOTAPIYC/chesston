import express from "express";
import * as playerController from "../services/player.js";
import * as gameController from "../services/games.js";

const router = express();

router.get("/player", (req,res) => {
  res.json(playerController.getAllPlayers())
});

router.post("/player/new", (req,res) => {
  playerController.createPlayer(req.body.name, req.body.password)
  .then((result) => res.status(200).json(result))
  .catch((error) => res.status(400).json(error));
});

router.post("/player/login", (req,res) => {
  playerController.getPlayer(req.body.name, req.body.password)
  .then((result) => res.status(200).json(result))
  .catch((error) => res.status(400).json(error));
});

router.get("/requests/:id", (req,res) => {
  res.json(gameController.getRequestsByPlayerId(req.params.id));
});

router.post("/requests", (req,res) => {
  gameController.createRequest(req.body.from, req.body.to);
  res.json({ msg: "Request placed"});  
});

router.put('/requests/decline', (req,res) => {
  gameController.declineRequest(req.body.id);
  res.json({ msg: "Request removed"});
});

router.put("/requests/accept", (req,res) => {
  gameController.acceptRequest(req.body.id);
  res.json({ msg: "Game created"});
});

router.get("/games/:id", (req,res) => {
  res.json(gameController.getGameByPlayerId(req.params.id));
});

router.put("/games/:id/newmove", (req,res) => {
  gameController.addMoveToGame(req.params.id, req.body.move);
  res.json({ msg: 'Move placed' });
});

router.get("/games/:id/lastmove/:color", (req,res) => {
  res.json(gameController.getLastMoveByPlayerId(req.params.id));
});

export { router }