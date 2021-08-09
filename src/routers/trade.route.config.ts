import express from "express";
import TradeController from "../db/trade.controller";
import { CommonRoutesConfig } from "./common.route.config";
import { ITrade } from "../db/datamodel";

export class TradeRoutes extends CommonRoutesConfig {
  private _controller = new TradeController();

  constructor(app: express.Application) {
    super(app, "trade");
  }
  configureRoutes(): express.Application {
    this.app
      .route(`/trades`)
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
        let newTrade = req.body as ITrade;
        this._controller
          .Insert(newTrade)
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((err) => {
            res.status(500).send(`error: ${err}`);
          });
      });

    this.app
      .route(`/trades/:tradeId`)
      .get((req: express.Request, res: express.Response) => {
        this._controller
          .QueryOne(req.params.tradeId)
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((err) => {
            res.status(500).send(`error:${err}`);
          });
      })
      .delete((req: express.Request, res: express.Response) => {
        this._controller
          .Delete(req.params.TradeId)
          .then((resp) => {
            res.status(200).send(`deleted TradeId: ${req.params.TradeId}`);
          })
          .catch((err) => {
            res
              .status(500)
              .send(
                `Failed to delete TradeId ${req.params.TradeId}, error:${err}`
              );
          });
      });

    return this.app;
  }
}
