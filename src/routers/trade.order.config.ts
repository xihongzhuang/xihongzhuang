import TradeOrderController from "../db/trade.order.controller";
import { CommonRoutesConfig } from "./common.route.config";
import express from "express";
import { ITradeOrder } from "../db/datamodel";

export class TradeOrderRoutes extends CommonRoutesConfig {
  private tradeOrderCtl = new TradeOrderController();
  constructor(app: express.Application) {
    super(app, "TradeOrderRoutes");
  }
  configureRoutes(): express.Application {
    this.app
      .route(`/orders`)
      .get((req: express.Request, res: express.Response) => {
        this.tradeOrderCtl
          .QueryAll()
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((err) => {
            res.status(500).send(`error: ${err}`);
          });
      })
      .post((req: express.Request, res: express.Response) => {
        // console.log("req.body=>", req.body);
        const newOrder = req.body as ITradeOrder;
        console.log("newOrder=>", newOrder);
        this.tradeOrderCtl
          .Insert(newOrder)
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((err) => {
            res.status(500).send(`error: ${err}`);
          });
      });

    this.app
      .route(`/orders/:orderId`)
      .get((req: express.Request, res: express.Response) => {
        this.tradeOrderCtl
          .QueryOne(req.params.orderId)
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((err) => {
            res.status(500).send(`error:${err}`);
          });
      })
      .delete((req: express.Request, res: express.Response) => {
        this.tradeOrderCtl
          .Delete(req.params.orderId)
          .then((resp) => {
            res.status(200).json(resp);
          })
          .catch((err) => {
            res
              .status(500)
              .send(`DELETE on orderId: ${req.params.orderId}, error:${err}`);
          });
      });

    return this.app;
  }
}
