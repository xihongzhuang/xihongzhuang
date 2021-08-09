import express from "express";
import { TraderController } from "../db/trader.controller";
import { CommonRoutesConfig } from "./common.route.config";
import { ITrader } from "../db/datamodel";

export class TraderRoutes extends CommonRoutesConfig {
  private _controller = new TraderController();
  constructor(app: express.Application) {
    super(app, "TraderRoutes");
  }
  configureRoutes(): express.Application {
    this.app
      .route(`/traders`)
      .get((req: express.Request, res: express.Response) => {
        this._controller
          .QueryAll()
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((err) => {
            res.status(500).send(`error: ${err}`);
          });
      })
      .post((req: express.Request, res: express.Response) => {
        let newTrader = req.body as ITrader;
        this._controller
          .Insert(newTrader)
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((err) => {
            res.status(500).send(`error: ${err}`);
          });
      });

    this.app
      .route(`/traders/:traderId`)
      .get((req: express.Request, res: express.Response) => {
        const trader_id: number = +req.params.traderId;
        this._controller
          .QueryOne(trader_id)
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((err) => {
            res.status(500).send(`error:${err}`);
          });
      })
      .delete((req: express.Request, res: express.Response) => {
        const trader_id: number = +req.params.traderId;
        this._controller
          .Delete(trader_id)
          .then((resp) => {
            res.status(200).send(`DELETED TraderId: ${req.params.traderId}`);
          })
          .catch((err) => {
            res.status(500).send(`error:${err}`);
          });
      });

    return this.app;
  }
}
