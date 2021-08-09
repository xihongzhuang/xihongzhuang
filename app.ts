import express, { Request, Response, NextFunction } from "express";
import * as http from "http";
import { CommonRoutesConfig } from "./src/routers/common.route.config";
import { TickerRoutes } from "./src/routers/ticker.route.config";
import { TraderRoutes } from "./src/routers/trader.route.config";
import { TradeOrderRoutes } from "./src/routers/trade.order.config";
import { TradeRoutes } from "./src/routers/trade.route.config";

import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import debug from "debug";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

app.use(express.json());
app.use(cors());
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (process.env.DEBUG !== "on") {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
}
app.use(expressWinston.logger(loggerOptions));
routes.push(new TickerRoutes(app));
routes.push(new TraderRoutes(app));
routes.push(new TradeOrderRoutes(app));
routes.push(new TradeRoutes(app));

const runningMessage = `Server running at http://localhost:${port}`;
app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.Name}`);
  });
  console.log(runningMessage);
});
