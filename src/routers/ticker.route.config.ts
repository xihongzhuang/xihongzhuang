// import { v4 as uuidv4 } from "uuid";
import { qAllTickers, qTicker } from "../db/psql";
import { CommonRoutesConfig } from "./common.route.config";
import express from "express";

export class TickerRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "TickerRoutes");
  }
  configureRoutes(): express.Application {
    this.app
      .route(`/tickers`)
      .get((req: express.Request, res: express.Response) => {
        qAllTickers()
          .then((resp) => {
            res.status(200).json(resp);
            // res.status(200).send(JSON.stringify(resp));
          })
          .catch((err) => {
            res.status(500).send(`error: ${err}`);
          });
      })
      .post((req: express.Request, res: express.Response) => {
        res.status(200).send(`Created mew ticker`);
        // let newGameId = uuidv4();
        // createGame(newGameId)
        //   .then((resp) => {
        //     res
        //       .status(200)
        //       .send(`New Game created: ${newGameId}, resp:${resp}`);
        //   })
        //   .catch((err) => console.log(err));
      });

    this.app
      .route(`/tickers/:tickerId`)
      .get((req: express.Request, res: express.Response) => {
        qTicker(req.params.tickerId)
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((err) => {
            res.status(500).send(`error:${err}`);
          });
      })
      .delete((req: express.Request, res: express.Response) => {
        res
          .status(200)
          .send(`DELETE request for tickerId: ${req.params.tickerId}`);
      });

    return this.app;
  }
}
