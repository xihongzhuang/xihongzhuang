import { Connection, Pool } from "postgresql-client";
// import { Connection } from "postgresql-client";

// const connection = new Connection("postgres://localhost");
// [pg:// | postgres://][<user>][:<password>]@<host>[:<port>][/<database>][?query&query...]
const dburl = "pg://xihongzhuang:xh123456@localhost:5432/tradeweb";
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

export async function qTicker(tickerId: string): Promise<any> {
  const connection = await dbpool.acquire();
  const result = await connection.query("select * from ticker where id = $1", {
    params: [tickerId],
  });
  const rows = result.rows;

  let p = new Promise<any>((resolve, reject) => {
    if (rows && rows.length > 0) {
      resolve(rows[0]);
    } else {
      reject(new Error(`no ticker found for ${tickerId}`));
    }
  });
  await connection.close(); // Disconnect
  return p;
}

export async function qAllTickers(): Promise<any[]> {
  //   await connection.connect();
  const connection = await dbpool.acquire();
  const result = await connection.query("select * from ticker");
  const rows = result.rows;
  let p = new Promise<any[]>((resolve, reject) => {
    if (rows) {
      resolve(rows);
    } else {
      reject(new Error(`no trader found!`));
    }
  });
  await connection.close(); // Disconnect
  return p;
}
