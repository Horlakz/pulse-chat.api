import "module-alias/register";
import "reflect-metadata";

import { app } from "./app";
import { config } from "./config/env";
import { initSockets } from "./socket";

const server = app.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
});

initSockets(server);
