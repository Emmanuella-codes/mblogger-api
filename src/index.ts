import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";
import 'dotenv/config'

const app = express();

app.use(cors({ credentials: true }));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

const mongoUrl = `${process.env.MONGODB_URL}`;

mongoose.Promise = Promise;
mongoose.connect(mongoUrl);
mongoose.connection.on("error", (error: Error) => console.log(error));

app.use("/", router());
