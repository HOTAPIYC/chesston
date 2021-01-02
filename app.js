const express = require("express");
const io = require("socket.io");
const router = require("./api/routes/routes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use("/api/", router);

app.listen(PORT, () => console.log("Server started"));

const socket = io(app);

socket.on("connection", (socket) => {
  console.log("Client connected.");
})