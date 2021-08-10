import { v4 as uuidv4 } from "uuid";
import { Connection, DataTypeOIDs } from "postgresql-client";
import { BaseDbController } from "./base.db.controller";
import { ITrade } from "./datamodel";

export class TradeController extends BaseDbController {
  constructor() {
    super("trade");
  }

  convert2TS(r1: Array<any>): ITrade {
    const res: ITrade = {
      trade_id: r1[0] as string,
      ticker_id: r1[1] as string,
      price: r1[2] as number,
      quantity: r1[3] as number,
      buy_order: r1[4] as string,
      sell_order: r1[5] as string,
      created_at: r1[6] as Date,
    };
    return res;
  }

  //TODO: implement PATCH, which needs to query from database first, then apply only the changes
  //Only name and email are allowed to be updated
  //   async Update(
  //     dataIn: ITrade,
  //     connection?: Connection
  //   ): Promise<ITrade> {
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

  //   Create trade record
  async Insert(dataIn: ITrade, connection?: Connection): Promise<ITrade> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    if (!dataIn.trade_id) {
      dataIn.trade_id = uuidv4();
    }

    // TODO: verify if ticker_id exists
    const statement = await connection.prepare(
      `insert into ${this.tableName} 
      (trade_id,ticker_id,price,quantity,buy_order,sell_order) 
      values ($1,$2,$3,$4,$5,$6)`,
      {
        paramTypes: [
          DataTypeOIDs.uuid,
          DataTypeOIDs.varchar,
          DataTypeOIDs.numeric,
          DataTypeOIDs.numeric,
          DataTypeOIDs.uuid,
          DataTypeOIDs.uuid,
        ],
      }
    );
    await statement.execute({
      params: [
        dataIn.trade_id,
        dataIn.ticker_id,
        dataIn.price,
        dataIn.quantity,
        dataIn.buy_order,
        dataIn.sell_order,
      ],
    });
    return await this.QueryOne(dataIn.trade_id, connection);
  }

  async Delete(trade_id: string, connection?: Connection): Promise<void> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    const statement = await connection.prepare(
      `delete from ${this.tableName} where trade_id=$1`,
      {
        paramTypes: [DataTypeOIDs.uuid],
      }
    );
    await statement.execute({ params: [trade_id] });
  }

  async QueryOne(trade_id: string, connection?: Connection): Promise<ITrade> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    const result = await connection.query(
      `select * from ${this.tableName} where trade_id = $1`,
      {
        params: [trade_id],
      }
    );
    const rows = result.rows;

    let p = new Promise<ITrade>((resolve, reject) => {
      if (rows && rows.length > 0) {
        resolve(this.convert2TS(rows[0]));
      } else {
        reject(new Error(`no Trade order found for ${trade_id}`));
      }
    });
    await connection.close(); // Disconnect
    return p;
  }

  async QueryAll(connection?: Connection): Promise<ITrade[]> {
    const rows = await this.doQueryAll(connection);
    let p = new Promise<ITrade[]>((resolve, reject) => {
      if (rows && Array.isArray(rows) && rows.length > 0) {
        let tks: ITrade[] = [];
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

export default TradeController;
