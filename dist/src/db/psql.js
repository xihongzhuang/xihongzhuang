"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qAllTickers = exports.qTicker = exports.closePool = void 0;
const postgresql_client_1 = require("postgresql-client");
// import { Connection } from "postgresql-client";
// const connection = new Connection("postgres://localhost");
// [pg:// | postgres://][<user>][:<password>]@<host>[:<port>][/<database>][?query&query...]
const dburl = "pg://xihongzhuang:xh123456@localhost:5432/tradeweb";
// const connection = new Connection(dburl);
const dbpool = new postgresql_client_1.Pool(dburl);
// const connection = new Connection({
//   host: "localhost",
//   port: 5432,
//   user: "xihongzhuang",
//   password: "xh123456",
//   database: "tradeweb",
// });
function closePool() {
    return __awaiter(this, void 0, void 0, function* () {
        yield dbpool.close();
    });
}
exports.closePool = closePool;
function qTicker(traderId) {
    return __awaiter(this, void 0, void 0, function* () {
        //   await connection.connect();
        const connection = yield dbpool.acquire();
        const result = yield connection.query("select * from trader where trader_id = $1", { params: [traderId] });
        const rows = result.rows;
        let p = new Promise((resolve, reject) => {
            if (rows && rows.length > 0) {
                resolve(rows[0]);
            }
            else {
                reject(new Error(`no trader found for ${traderId}`));
            }
        });
        yield connection.close(); // Disconnect
        return p;
    });
}
exports.qTicker = qTicker;
function qAllTickers() {
    return __awaiter(this, void 0, void 0, function* () {
        //   await connection.connect();
        const connection = yield dbpool.acquire();
        const result = yield connection.query("select * from trader");
        const rows = result.rows;
        let p = new Promise((resolve, reject) => {
            if (rows) {
                resolve(rows);
            }
            else {
                reject(new Error(`no trader found!`));
            }
        });
        yield connection.close(); // Disconnect
        return p;
    });
}
exports.qAllTickers = qAllTickers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHNxbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9wc3FsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlEQUFxRDtBQUNyRCxrREFBa0Q7QUFFbEQsNkRBQTZEO0FBQzdELDJGQUEyRjtBQUMzRixNQUFNLEtBQUssR0FBRyxvREFBb0QsQ0FBQztBQUNuRSw0Q0FBNEM7QUFDNUMsTUFBTSxNQUFNLEdBQUcsSUFBSSx3QkFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLHNDQUFzQztBQUN0Qyx1QkFBdUI7QUFDdkIsZ0JBQWdCO0FBQ2hCLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCLE1BQU07QUFDTixTQUFzQixTQUFTOztRQUM3QixNQUFNLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN2QixDQUFDO0NBQUE7QUFGRCw4QkFFQztBQUVELFNBQXNCLE9BQU8sQ0FBQyxRQUFnQjs7UUFDNUMsZ0NBQWdDO1FBQ2hDLE1BQU0sVUFBVSxHQUFHLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzFDLE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLEtBQUssQ0FDbkMsMkNBQTJDLEVBQzNDLEVBQUUsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FDdkIsQ0FBQztRQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFFekIsSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDM0MsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNsQjtpQkFBTTtnQkFDTCxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsdUJBQXVCLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN0RDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxhQUFhO1FBQ3ZDLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztDQUFBO0FBbEJELDBCQWtCQztBQUVELFNBQXNCLFdBQVc7O1FBQy9CLGdDQUFnQztRQUNoQyxNQUFNLFVBQVUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMxQyxNQUFNLE1BQU0sR0FBRyxNQUFNLFVBQVUsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUM5RCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFRLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQzdDLElBQUksSUFBSSxFQUFFO2dCQUNSLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNmO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7YUFDdkM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsYUFBYTtRQUN2QyxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7Q0FBQTtBQWRELGtDQWNDIn0=