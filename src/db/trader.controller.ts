import { Connection, DataTypeOIDs } from "postgresql-client";
import { BaseDbController } from "./base.db.controller";
import { ITrader } from "./datamodel";

export class TraderController extends BaseDbController {
  constructor() {
    super("trader");
  }

  convert2TS(r1: Array<any>): ITrader {
    let tk: ITrader = {
      trader_id: r1[0] as number,
      username: r1[1] as string,
      upassword: r1[2] as string,
      email: r1[3] as string,
      created_on: r1[4] as Date,
      last_login: r1[5] as Date,
    };
    return tk;
  }

  //TODO: implement PATCH, which needs to query from database first, then apply only the changes
  //Only name and email are allowed to be updated
  async Update(dataIn: ITrader, connection?: Connection): Promise<ITrader> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    const statement = await connection.prepare(
      `update ${this.tableName} set username=$1, upassword=$2, email=$3, 
      last_login=CURRENT_TIMESTAMP where trader_id=$4`,
      {
        paramTypes: [
          DataTypeOIDs.varchar,
          DataTypeOIDs.varchar,
          DataTypeOIDs.varchar,
          DataTypeOIDs.numeric,
        ],
      }
    );
    await statement.execute({
      params: [
        dataIn.username,
        dataIn.upassword,
        dataIn.email,
        dataIn.trader_id,
      ],
    });
    await connection.close();
    if (dataIn.trader_id) {
      return this.QueryOne(dataIn.trader_id, connection);
    }
    return this.QueryByUsername(dataIn.username, connection);
  }

  async Insert(dataIn: ITrader, connection?: Connection): Promise<ITrader> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    // const time = new Date().toISOString();
    //insert into times (time) values (to_timestamp(${Date.now()} / 1000.0))`
    const statement = await connection.prepare(
      `insert into ${this.tableName} 
      (username, upassword,email,last_login) 
      values ($1,$2,$3,CURRENT_TIMESTAMP)`,
      {
        paramTypes: [
          DataTypeOIDs.varchar,
          DataTypeOIDs.varchar,
          DataTypeOIDs.varchar,
        ],
      }
    );
    await statement.execute({
      params: [dataIn.username, dataIn.upassword, dataIn.email],
    });
    console.log("inserted=>", dataIn);
    return await this.QueryByUsername(dataIn.username, connection);
  }

  async Delete(trader_id: number, connection?: Connection): Promise<void> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    const statement = await connection.prepare(
      `delete from ${this.tableName} where trader_id=$1`,
      {
        paramTypes: [DataTypeOIDs.varchar],
      }
    );
    await statement.execute({ params: [trader_id] });
  }

  async QueryOne(trader_id: number, connection?: Connection): Promise<ITrader> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    const result = await connection.query(
      `select * from ${this.tableName} where trader_id = $1`,
      {
        params: [trader_id],
      }
    );
    const rows = result.rows;

    let p = new Promise<ITrader>((resolve, reject) => {
      if (rows && rows.length > 0) {
        resolve(this.convert2TS(rows[0]));
      } else {
        reject(new Error(`no Trader found for ${trader_id}`));
      }
    });
    await connection.close(); // Disconnect
    return p;
  }

  async QueryByUsername(
    username: string,
    connection?: Connection
  ): Promise<ITrader> {
    const rows = await this.doQueryAll(connection, `username='${username}'`);
    let p = new Promise<ITrader>((resolve, reject) => {
      if (rows && Array.isArray(rows) && rows.length > 0) {
        resolve(this.convert2TS(rows[0]));
      } else {
        reject(
          new Error(
            `no record found in Trader table with username = ${username}!`
          )
        );
      }
    });
    return p;
  }

  async QueryAll(connection?: Connection): Promise<ITrader[]> {
    const rows = await this.doQueryAll(connection);
    let p = new Promise<ITrader[]>((resolve, reject) => {
      if (rows && Array.isArray(rows) && rows.length > 0) {
        let tks: ITrader[] = [];
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

export default TraderController;
