import cors from "cors";
import express from "express";
import logger from "morgan";

import { config } from "./config/env";
import { connectDB } from "./config/prisma";
import { errorHandler } from "./middleware/exception-handler";
import routes from "./routes";

connectDB();

const app = express();

app.use(cors());
app.use(logger(config.env == "development" ? "dev" : "combined"));
app.use(express.json());
app.use("/api", routes);

app.use(errorHandler);

app.get("/", (_req, res) =>
  res.json({ name: "realtime-chat-backend", ok: true })
);

export { app };
