import express from "express";
import TickerController from "../db/ticker.controller";
import { CommonRoutesConfig } from "./common.route.config";
import { ITicker } from "../db/datamodel";

export class TickerRoutes extends CommonRoutesConfig {
  private _controller = new TickerController();

  constructor(app: express.Application) {
    super(app, "ticker");
  }
  configureRoutes(): express.Application {
    this.app
      .route(`/tickers`)
      .get((req: express.Request, res: express.Response) => {
        this._controller
          .QueryAll()
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((err) => {
            res.status(404).send(`error: ${err}`);
          });
      })
      .post((req: express.Request, res: express.Response) => {
        let newTicker = req.body as ITicker;
        // console.log("get newTicker POST", newTicker);
        this._controller
          .Insert(newTicker)
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((err) => {
            res.status(404).send(`error: ${err}`);
          });
      });

    this.app
      .route(`/tickers/:tickerId`)
      .get((req: express.Request, res: express.Response) => {
        this._controller
          .QueryOne(req.params.tickerId)
          .then((resp) => {
            // res.status(200).send(JSON.stringify(resp));
            res.status(200).json(resp);
          })
          .catch((err) => {
            res.status(404).send(`error:${err}`);
          });
      })
      .delete((req: express.Request, res: express.Response) => {
        this._controller
          .Delete(req.params.tickerId)
          .then((resp) => {
            res.status(200).send(`deleted tickerId: ${req.params.tickerId}`);
          })
          .catch((err) => {
            res
              .status(404)
              .send(
                `Failed to delete tickerId ${req.params.tickerId}, error:${err}`
              );
          });
      });

    return this.app;
  }
}

export default TickerController;
