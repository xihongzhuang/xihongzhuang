import { Pool, Connection, DataTypeOIDs } from "postgresql-client";
import { ITicker, ITrader } from "./datamodel";
// import { Connection } from "postgresql-client";

// const connection = new Connection("postgres://localhost");
// [pg:// | postgres://][<user>][:<password>]@<host>[:<port>][/<database>][?query&query...]
const dburl = "postgres://xihongzhuang:xh123456@localhost:5432/tradeweb";
// const connection = new Connection(dburl);
const dbpool = new Pool(dburl);
// const connection = new Connection({
//   host: "localhost",
//   port: 5432,
//   user: "xihongzhuang",
//   password: "xh123456",
//   database: "tradeweb",
// });
export async function closePool() {
  await dbpool.close();
}

export default abstract class DbController<Type> {
  constructor(public tableName: string) {}

  abstract convert2TS(res: Array<any>): Type;
  async insertHandler(dataIn: Type, conn: Connection): Promise<Type> {}

  async doInsert(dataIn: Type): Promise<Type> {
    const connection = await dbpool.acquire();
    let p = await this.insertHandler(dataIn, connection);
    await connection.close(); // Disconnect
    return p;
  }

  async AcquireDBConnection(): Promise<Connection> {
    return await dbpool.acquire();
  }

  async doQueryOne(id: string, connection?: Connection): Promise<Type> {
    if (connection === undefined) {
      connection = await dbpool.acquire();
    }
    const result = await connection.query(
      `select * from ${this.tableName} where id = $1`,
      {
        params: [id],
      }
    );
    const rows = result.rows;

    let p = new Promise<Type>((resolve, reject) => {
      if (rows && rows.length > 0) {
        resolve(this.convert2TS(rows[0]));
      } else {
        reject(new Error(`no ticker found for ${id}`));
      }
    });
    await connection.close(); // Disconnect
    return p;
  }

  async doQueryAll(connection?: Connection): Promise<Type[]> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    const result = await connection.query("select * from " + this.tableName);
    const rows = result.rows;
    let p = new Promise<Type[]>((resolve, reject) => {
      if (rows) {
        let tks: Type[] = [];
        rows.forEach((row: any) => {
          tks.push(this.convert2TS(row));
        });
        resolve(tks);
      } else {
        reject(new Error(`no record found in ${this.tableName}!`));
      }
    });
    await connection.close(); // Disconnect
    return p;
  }
}

// TODO: implement a third party tool to automatically convert the database dataset to type saved data
function toTicker(r1: Array<any>): ITicker {
  let tk: ITicker = {
    id: r1[0] as string,
    name: r1[1] as string,
    email: r1[2] as string,
    created_at: r1[3] as Date,
  };
  console.log("get tk=>", tk);
  return tk;
}

export async function InsertTicker(ticker: ITicker): Promise<ITicker> {
  const connection = await dbpool.acquire();
  const statement = await connection.prepare(
    `insert into ticker (id, name, email) values ($1,$2,$3)`,
    {
      paramTypes: [
        DataTypeOIDs.varchar,
        DataTypeOIDs.varchar,
        DataTypeOIDs.varchar,
      ],
    }
  );
  await statement.execute({ params: [ticker.id, ticker.name, ticker.email] });
  const result = await connection.query("select * from ticker where id = $1", {
    params: [ticker.id],
  });
  const rows = result.rows;

  let p = new Promise<ITicker>((resolve, reject) => {
    if (rows && rows.length > 0) {
      resolve(toTicker(rows[0]));
    } else {
      reject(new Error(`failed to insert ticker ${ticker.id}`));
    }
  });
  await connection.close(); // Disconnect

  return p;
}

export async function qTicker(tickerId: string): Promise<ITicker> {
  const connection = await dbpool.acquire();
  const result = await connection.query("select * from ticker where id = $1", {
    params: [tickerId],
  });
  const rows = result.rows;
  console.log("result=>", result);

  let p = new Promise<ITicker>((resolve, reject) => {
    if (rows && rows.length > 0) {
      resolve(toTicker(rows[0]));
    } else {
      reject(new Error(`no ticker found for ${tickerId}`));
    }
  });
  await connection.close(); // Disconnect
  return p;
}

// TODO: implement a nicer controller
export async function qAllTickers(): Promise<ITicker[]> {
  const connection = await dbpool.acquire();
  const result = await connection.query("select * from ticker");
  const rows = result.rows;
  console.log("result=>", result);
  let p = new Promise<ITicker[]>((resolve, reject) => {
    if (rows) {
      let tks: ITicker[] = [];
      rows.forEach((row: any) => {
        tks.push(toTicker(row));
      });
      resolve(tks);
    } else {
      reject(new Error(`no ticker found!`));
    }
  });
  await connection.close(); // Disconnect
  return p;
}

export async function qTrader(traderId: string): Promise<ITrader> {
  const connection = await dbpool.acquire();
  const result = await connection.query("select * from trader where id = $1", {
    params: [traderId],
  });
  const rows = result.rows;

  let p = new Promise<ITrader>((resolve, reject) => {
    if (rows && rows.length > 0) {
      resolve(rows[0]);
    } else {
      reject(new Error(`no ticker found for ${traderId}`));
    }
  });
  await connection.close(); // Disconnect
  return p;
}

export async function qAllTraders(): Promise<ITrader[]> {
  const connection = await dbpool.acquire();
  const result = await connection.query("select * from trader");
  const rows = result.rows;
  let p = new Promise<ITrader[]>((resolve, reject) => {
    if (rows) {
      resolve(rows);
    } else {
      reject(new Error(`no trader found!`));
    }
  });
  await connection.close(); // Disconnect
  return p;
}
