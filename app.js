const express = require("express");
const http = require("http");
const io = require("socket.io");
const routes = require("./api/routes/routes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use("/api/", routes.router);

const server = http.createServer(app);
const socket = io(server);

routes.initWebsocket(socket);

server.listen(PORT, () => console.log("Server started"));