import { v4 as uuidv4, parse as uuidparse } from "uuid";
import { Connection, DataTypeOIDs } from "postgresql-client";

import { BaseDbController } from "./base.db.controller";
import {
  ITradeOrder,
  IBidOrOffer,
  ITrade,
  OrderSide,
  OrderStatus,
} from "./datamodel";
import { TradeController } from "./trade.controller";

export class TradeOrderController extends BaseDbController {
  private _tradeCtrl = new TradeController();
  constructor() {
    super("trade_order");
  }

  convert2TS(r1: Array<any>): ITradeOrder {
    const res: ITradeOrder = {
      order_id: r1[0] as string,
      ticker_id: r1[1] as string,
      trader_id: r1[2] as number,
      side: r1[3] as OrderSide,
      price_limit: r1[4] as number,
      quantity: r1[5] as number,
      filled_quantity: r1[6] as number,
      order_status: r1[7] as OrderStatus,
      created_at: r1[8] as Date,
    };
    return res;
  }

  //TODO: implement PATCH, which needs to query from database first, then apply only the changes
  //Only name and email are allowed to be updated
  //   async Update(
  //     dataIn: ITradeOrder,
  //     connection?: Connection
  //   ): Promise<ITradeOrder> {
  //     if (connection === undefined) {
  //       connection = await this.AcquireDBConnection();
  //     }
  //     const statement = await connection.prepare(
  //       `update ${this.tableName} set username=$1, upassword=$2, email=$3,
  //       last_login=CURRENT_TIMESTAMP where trader_id=$4`,
  //       {
  //         paramTypes: [
  //           DataTypeOIDs.varchar,
  //           DataTypeOIDs.varchar,
  //           DataTypeOIDs.varchar,
  //           DataTypeOIDs.numeric,
  //         ],
  //       }
  //     );
  //     await statement.execute({
  //       params: [
  //         // dataIn.username,
  //         // dataIn.upassword,
  //         // dataIn.email,
  //         dataIn.trader_id,
  //       ],
  //     });
  //     await connection.close();
  //     return this.QueryOne(dataIn.order_id, connection);
  //   }

  //   PlaceOrder
  async Insert(
    dataIn: ITradeOrder,
    connection?: Connection
  ): Promise<ITradeOrder> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    if (!dataIn.order_id) {
      dataIn.order_id = uuidv4();
    }
    if (!dataIn.order_status) {
      dataIn.order_status = OrderStatus.Opened;
    }
    if (!dataIn.filled_quantity) {
      dataIn.filled_quantity = 0;
    }

    // TODO: verify if ticker_id exists
    const statement = await connection.prepare(
      `insert into ${this.tableName} 
      (order_id, ticker_id, trader_id, side, price_limit, quantity, filled_quantity, order_status) 
      values ($1,$2,$3,$4,$5,$6,$7,$8)`,
      {
        paramTypes: [
          DataTypeOIDs.uuid,
          DataTypeOIDs.varchar,
          DataTypeOIDs.numeric,
          DataTypeOIDs.varchar,
          DataTypeOIDs.numeric,
          DataTypeOIDs.numeric,
          DataTypeOIDs.numeric,
          DataTypeOIDs.varchar,
        ],
      }
    );

    await statement.execute({
      params: [
        dataIn.order_id,
        dataIn.ticker_id,
        dataIn.trader_id,
        dataIn.side,
        dataIn.price_limit,
        dataIn.quantity,
        dataIn.filled_quantity,
        dataIn.order_status,
      ],
    });
    // trigger trade processing,
    // TODO: it's better to process this in worker
    // Instead of blocking here
    await this.GenerateTrades(dataIn.ticker_id);
    return await this.QueryOne(dataIn.order_id, connection);
  }

  async Delete(order_id: string, connection?: Connection): Promise<void> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    const statement = await connection.prepare(
      `delete from ${this.tableName} where order_id=$1`,
      {
        paramTypes: [DataTypeOIDs.varchar],
      }
    );
    await statement.execute({ params: [order_id] });
  }

  async QueryOne(
    order_id: string,
    connection?: Connection
  ): Promise<ITradeOrder> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    const result = await connection.query(
      `select * from ${this.tableName} where order_id = $1`,
      {
        params: [order_id],
      }
    );
    const rows = result.rows;

    let p = new Promise<ITradeOrder>((resolve, reject) => {
      if (rows && rows.length > 0) {
        resolve(this.convert2TS(rows[0]));
      } else {
        reject(new Error(`no Trade order found for ${order_id}`));
      }
    });
    await connection.close(); // Disconnect
    return p;
  }

  convert2BidOrOffer(r1: Array<any>): IBidOrOffer {
    const res: IBidOrOffer = {
      price_limit: r1[0] as number,
      quantity: r1[1] as number,
      order_id: r1[2] as string,
      trader_id: r1[3] as number,
    };
    return res;
  }
  convertArray(arr: any[]): IBidOrOffer[] {
    let res: IBidOrOffer[] = [];
    arr.forEach((a) => {
      res.push(this.convert2BidOrOffer(a));
    });
    return res;
  }

  //   return the list of trade_id created
  // TODO: make this operation transactional
  async GenerateTrades(tickerId: string): Promise<ITrade[]> {
    let res: ITrade[] = [];
    const connection = await this.AcquireDBConnection();
    try {
      // this view is sorted by price desc
      let sqlbids = `select price_limit,quantity_needed,order_id,trader_id from view_bids where ticker_id='${tickerId}' limit 10;`;
      let resbids = await this.ExecSQL(sqlbids, connection, false);
      if (!resbids || resbids.length == 0) return res;
      // this view is sorted by price asc
      let sqloffers = `select price_limit,quantity_needed,order_id,trader_id from view_offers where ticker_id='${tickerId}' limit 10;`;
      let resoffers = await this.ExecSQL(sqloffers, connection, false);
      if (!resoffers || resoffers.length == 0) return res;
      let bids = this.convertArray(resbids);
      let offers = this.convertArray(resoffers);
      for (let i = 0, j = 0; i < bids.length && j < offers.length; ) {
        if (bids[i].price_limit < offers[j].price_limit) {
          break;
        }
        // Safty check, should not happen, just in case
        if (bids[i].quantity <= 0) {
          this.updateOrderStatus(
            bids[i].order_id,
            0,
            OrderStatus.Completed,
            connection
          );
          i++;
          continue;
        }
        if (offers[j].quantity <= 0) {
          this.updateOrderStatus(
            offers[j].order_id,
            0,
            OrderStatus.Completed,
            connection
          );
          j++;
          continue;
        }

        let midPrice =
          offers[j].price_limit +
          (bids[i].price_limit - offers[j].price_limit) / 2;
        let tradeNew: ITrade = {
          ticker_id: tickerId,
          price: midPrice,
          quantity: Math.min(bids[i].quantity, offers[j].quantity),
          buy_order: bids[i].order_id,
          sell_order: offers[j].order_id,
        };
        // TODO: it makes more sense to make it a transaction
        let tradeRet = await this._tradeCtrl.Insert(tradeNew);
        res.push(tradeRet);
        // update trade_order to reflect the status
        let bidStatus = OrderStatus.Opened;
        let offerStatus = OrderStatus.Opened;
        if (bids[i].quantity == tradeNew.quantity) {
          // bids use up quantity
          bids[i].quantity = 0;
          offers[j].quantity -= tradeNew.quantity;
          bidStatus = OrderStatus.Completed;
          if (offers[j].quantity == 0) {
            offerStatus = OrderStatus.Completed;
            j++;
          }
          i++;
        } else {
          // offer use up quantity
          offers[j].quantity = 0;
          bids[i].quantity -= tradeNew.quantity;
          // means bids and offer has the same quantity
          if (bids[i].quantity == 0) {
            bidStatus = OrderStatus.Completed;
            i++;
          }
          offerStatus = OrderStatus.Completed;
          j++;
        }
        await this.updateOrderStatus(
          tradeNew.buy_order,
          tradeNew.quantity,
          bidStatus,
          connection
        );
        await this.updateOrderStatus(
          tradeNew.sell_order,
          tradeNew.quantity,
          offerStatus,
          connection
        );
      }
    } finally {
      await connection.close();
    }

    return res;
  }

  async updateOrderStatus(
    order_id: string,
    quantity: number,
    status: OrderStatus,
    connection: Connection
  ): Promise<void> {
    console.log(
      `execute updateOrderStatus on ${order_id}, filled quantity:${quantity}, ${status}`
    );
    try {
      const statement = await connection.prepare(
        `update trade_order set filled_quantity=filled_quantity+$1,order_status=$2 where order_id=$3`,
        {
          paramTypes: [
            DataTypeOIDs.numeric,
            DataTypeOIDs.varchar,
            DataTypeOIDs.uuid,
          ],
        }
      );
      await statement.execute({
        params: [quantity, status, order_id],
      });
    } catch (err) {
      console.log(`updateOrderStatus on ${order_id}, error: ${err}`);
    }
  }

  async QueryAll(connection?: Connection): Promise<ITradeOrder[]> {
    const rows = await this.doQueryAll(connection);
    console.log("rows=>", rows);
    let p = new Promise<ITradeOrder[]>((resolve, reject) => {
      if (rows && Array.isArray(rows) && rows.length > 0) {
        let tks: ITradeOrder[] = [];
        rows.forEach((row: any) => {
          tks.push(this.convert2TS(row));
        });
        resolve(tks);
      } else {
        reject(new Error(`no record found in Trader table!`));
      }
    });
    return p;
  }
}

export default TradeOrderController;
