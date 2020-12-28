import express from "express";
import { router } from "./api/routes.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"));
app.use("/api/", router);

app.listen(PORT, () => console.log("Server started"));