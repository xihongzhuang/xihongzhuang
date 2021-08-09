import { Pool, Connection } from "postgresql-client";

const dburl = "postgres://xihongzhuang:xh123456@localhost:5432/tradeweb";
const dbpool = new Pool(dburl);
export async function ClosePool() {
  await dbpool.close();
}

export class BaseDbController {
  constructor(protected tableName: string) {}

  async AcquireDBConnection(): Promise<Connection> {
    return await dbpool.acquire();
  }

  async ExecSQL(
    sqlStatement: string,
    connection?: Connection,
    closeConnection = true
  ): Promise<any[] | undefined> {
    if (connection === undefined) {
      connection = await this.AcquireDBConnection();
    }
    const result = await connection.query(sqlStatement);
    const rows = result.rows;
    // console.log(`execute sql: ${sqlStatement}, get result:`, rows);
    if (closeConnection) {
      await connection.close(); // Disconnect
    }
    return rows;
  }

  async doQueryAll(
    connection?: Connection,
    condition?: string
  ): Promise<any[] | undefined> {
    let sqlStatement = `select * from ${this.tableName}`;
    if (condition !== undefined) {
      sqlStatement += " where " + condition;
    }
    return this.ExecSQL(sqlStatement);
  }
}
