import { Connection, DataTypeOIDs } from "postgresql-client";
import { BaseDbController } from "./base.db.controller";
import { ITicker } from "./datamodel";

export class TickerController extends BaseDbController {
  constructor() {
    super("ticker");
  }

  convert2TS(r1: Array<any>): ITicker {
    let tk: ITicker = {
      id: r1[0] as string,
      name: r1[1] as string,
      email: r1[2] as string,
      created_at: r1[3] as Date,
    };
    return tk;
  }

  //Only name and email are allowed to be updated
  async Update(dataIn: ITicker, connection?: Connection): Promise<ITicker> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    const statement = await connection.prepare(
      `update ${this.tableName} set name=$1, email=$2 where id=$3`,
      {
        paramTypes: [
          DataTypeOIDs.varchar,
          DataTypeOIDs.varchar,
          DataTypeOIDs.varchar,
        ],
      }
    );
    await statement.execute({ params: [dataIn.name, dataIn.email, dataIn.id] });
    await connection.close();
    return dataIn;
  }

  async Insert(dataIn: ITicker, connection?: Connection): Promise<ITicker> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    const statement = await connection.prepare(
      `insert into ${this.tableName} (id, name, email) values ($1,$2,$3)`,
      {
        paramTypes: [
          DataTypeOIDs.varchar,
          DataTypeOIDs.varchar,
          DataTypeOIDs.varchar,
        ],
      }
    );
    await statement.execute({ params: [dataIn.id, dataIn.name, dataIn.email] });
    return await this.QueryOne(dataIn.id);
  }

  async Delete(id: string, connection?: Connection): Promise<void> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    const statement = await connection.prepare(
      `delete from ${this.tableName} where id=$1`,
      {
        paramTypes: [DataTypeOIDs.varchar],
      }
    );
    await statement.execute({ params: [id] });
  }

  async QueryOne(id: string, connection?: Connection): Promise<ITicker> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    const result = await connection.query(
      `select * from ${this.tableName} where id = $1`,
      {
        params: [id],
      }
    );
    const rows = result.rows;

    let p = new Promise<ITicker>((resolve, reject) => {
      if (rows && rows.length > 0) {
        resolve(this.convert2TS(rows[0]));
      } else {
        reject(new Error(`no ticker found for ${id}`));
      }
    });
    await connection.close(); // Disconnect
    return p;
  }

  async QueryAll(connection?: Connection): Promise<ITicker[]> {
    const rows = await this.doQueryAll(connection);
    let p = new Promise<ITicker[]>((resolve, reject) => {
      if (rows && Array.isArray(rows) && rows.length > 0) {
        let tks: ITicker[] = [];
        rows.forEach((row: any) => {
          tks.push(this.convert2TS(row));
        });
        resolve(tks);
      } else {
        reject(new Error(`no record found in ticker table!`));
      }
    });
    return p;
  }
}

export default TickerController;
