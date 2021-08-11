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
exports.qAllTraders = exports.qTrader = exports.qAllTickers = exports.qTicker = exports.InsertTicker = exports.closePool = void 0;
const postgresql_client_1 = require("postgresql-client");
// import { Connection } from "postgresql-client";
// const connection = new Connection("postgres://localhost");
// [pg:// | postgres://][<user>][:<password>]@<host>[:<port>][/<database>][?query&query...]
const dburl = "postgres://xihongzhuang:xh123456@localhost:5432/tradeweb";
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
class DbController {
    constructor(tableName) {
        this.tableName = tableName;
    }
    insertHandler(dataIn, conn) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    doInsert(dataIn) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield dbpool.acquire();
            let p = yield this.insertHandler(dataIn, connection);
            yield connection.close(); // Disconnect
            return p;
        });
    }
    AcquireDBConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield dbpool.acquire();
        });
    }
    doQueryOne(id, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield dbpool.acquire();
            }
            const result = yield connection.query(`select * from ${this.tableName} where id = $1`, {
                params: [id],
            });
            const rows = result.rows;
            let p = new Promise((resolve, reject) => {
                if (rows && rows.length > 0) {
                    resolve(this.convert2TS(rows[0]));
                }
                else {
                    reject(new Error(`no ticker found for ${id}`));
                }
            });
            yield connection.close(); // Disconnect
            return p;
        });
    }
    doQueryAll(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            const result = yield connection.query("select * from " + this.tableName);
            const rows = result.rows;
            let p = new Promise((resolve, reject) => {
                if (rows) {
                    let tks = [];
                    rows.forEach((row) => {
                        tks.push(this.convert2TS(row));
                    });
                    resolve(tks);
                }
                else {
                    reject(new Error(`no record found in ${this.tableName}!`));
                }
            });
            yield connection.close(); // Disconnect
            return p;
        });
    }
}
exports.default = DbController;
// TODO: implement a third party tool to automatically convert the database dataset to type saved data
function toTicker(r1) {
    let tk = {
        id: r1[0],
        name: r1[1],
        email: r1[2],
        created_at: r1[3],
    };
    console.log("get tk=>", tk);
    return tk;
}
function InsertTicker(ticker) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield dbpool.acquire();
        const statement = yield connection.prepare(`insert into ticker (id, name, email) values ($1,$2,$3)`, {
            paramTypes: [
                postgresql_client_1.DataTypeOIDs.varchar,
                postgresql_client_1.DataTypeOIDs.varchar,
                postgresql_client_1.DataTypeOIDs.varchar,
            ],
        });
        yield statement.execute({ params: [ticker.id, ticker.name, ticker.email] });
        const result = yield connection.query("select * from ticker where id = $1", {
            params: [ticker.id],
        });
        const rows = result.rows;
        let p = new Promise((resolve, reject) => {
            if (rows && rows.length > 0) {
                resolve(toTicker(rows[0]));
            }
            else {
                reject(new Error(`failed to insert ticker ${ticker.id}`));
            }
        });
        yield connection.close(); // Disconnect
        return p;
    });
}
exports.InsertTicker = InsertTicker;
function qTicker(tickerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield dbpool.acquire();
        const result = yield connection.query("select * from ticker where id = $1", {
            params: [tickerId],
        });
        const rows = result.rows;
        console.log("result=>", result);
        let p = new Promise((resolve, reject) => {
            if (rows && rows.length > 0) {
                resolve(toTicker(rows[0]));
            }
            else {
                reject(new Error(`no ticker found for ${tickerId}`));
            }
        });
        yield connection.close(); // Disconnect
        return p;
    });
}
exports.qTicker = qTicker;
// TODO: implement a nicer controller
function qAllTickers() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield dbpool.acquire();
        const result = yield connection.query("select * from ticker");
        const rows = result.rows;
        console.log("result=>", result);
        let p = new Promise((resolve, reject) => {
            if (rows) {
                let tks = [];
                rows.forEach((row) => {
                    tks.push(toTicker(row));
                });
                resolve(tks);
            }
            else {
                reject(new Error(`no ticker found!`));
            }
        });
        yield connection.close(); // Disconnect
        return p;
    });
}
exports.qAllTickers = qAllTickers;
function qTrader(traderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield dbpool.acquire();
        const result = yield connection.query("select * from trader where id = $1", {
            params: [traderId],
        });
        const rows = result.rows;
        let p = new Promise((resolve, reject) => {
            if (rows && rows.length > 0) {
                resolve(rows[0]);
            }
            else {
                reject(new Error(`no ticker found for ${traderId}`));
            }
        });
        yield connection.close(); // Disconnect
        return p;
    });
}
exports.qTrader = qTrader;
function qAllTraders() {
    return __awaiter(this, void 0, void 0, function* () {
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
exports.qAllTraders = qAllTraders;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHNxbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi9wc3FsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlEQUFtRTtBQUVuRSxrREFBa0Q7QUFFbEQsNkRBQTZEO0FBQzdELDJGQUEyRjtBQUMzRixNQUFNLEtBQUssR0FBRywwREFBMEQsQ0FBQztBQUN6RSw0Q0FBNEM7QUFDNUMsTUFBTSxNQUFNLEdBQUcsSUFBSSx3QkFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLHNDQUFzQztBQUN0Qyx1QkFBdUI7QUFDdkIsZ0JBQWdCO0FBQ2hCLDBCQUEwQjtBQUMxQiwwQkFBMEI7QUFDMUIsMEJBQTBCO0FBQzFCLE1BQU07QUFDTixTQUFzQixTQUFTOztRQUM3QixNQUFNLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN2QixDQUFDO0NBQUE7QUFGRCw4QkFFQztBQUVELE1BQThCLFlBQVk7SUFDeEMsWUFBbUIsU0FBaUI7UUFBakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtJQUFHLENBQUM7SUFHbEMsYUFBYSxDQUFDLE1BQVksRUFBRSxJQUFnQjs4REFBa0IsQ0FBQztLQUFBO0lBRS9ELFFBQVEsQ0FBQyxNQUFZOztZQUN6QixNQUFNLFVBQVUsR0FBRyxNQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUMxQyxJQUFJLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsYUFBYTtZQUN2QyxPQUFPLENBQUMsQ0FBQztRQUNYLENBQUM7S0FBQTtJQUVLLG1CQUFtQjs7WUFDdkIsT0FBTyxNQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNoQyxDQUFDO0tBQUE7SUFFSyxVQUFVLENBQUMsRUFBVSxFQUFFLFVBQXVCOztZQUNsRCxJQUFJLFVBQVUs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