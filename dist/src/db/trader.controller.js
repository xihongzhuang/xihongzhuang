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
exports.TraderController = void 0;
const postgresql_client_1 = require("postgresql-client");
const base_db_controller_1 = require("./base.db.controller");
class TraderController extends base_db_controller_1.BaseDbController {
    constructor() {
        super("trader");
    }
    convert2TS(r1) {
        let tk = {
            trader_id: r1[0],
            username: r1[1],
            upassword: r1[2],
            email: r1[3],
            created_on: r1[4],
            last_login: r1[5],
        };
        return tk;
    }
    //TODO: implement PATCH, which needs to query from database first, then apply only the changes
    //Only name and email are allowed to be updated
    Update(dataIn, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            const statement = yield connection.prepare(`update ${this.tableName} set username=$1, upassword=$2, email=$3, 
      last_login=CURRENT_TIMESTAMP where trader_id=$4`, {
                paramTypes: [
                    postgresql_client_1.DataTypeOIDs.varchar,
                    postgresql_client_1.DataTypeOIDs.varchar,
                    postgresql_client_1.DataTypeOIDs.varchar,
                    postgresql_client_1.DataTypeOIDs.numeric,
                ],
            });
            yield statement.execute({
                params: [
                    dataIn.username,
                    dataIn.upassword,
                    dataIn.email,
                    dataIn.trader_id,
                ],
            });
            yield connection.close();
            if (dataIn.trader_id) {
                return this.QueryOne(dataIn.trader_id, connection);
            }
            return this.QueryByUsername(dataIn.username, connection);
        });
    }
    Insert(dataIn, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            // const time = new Date().toISOString();
            //insert into times (time) values (to_timestamp(${Date.now()} / 1000.0))`
            const statement = yield connection.prepare(`insert into ${this.tableName} 
      (username, upassword,email,last_login) 
      values ($1,$2,$3,CURRENT_TIMESTAMP)`, {
                paramTypes: [
                    postgresql_client_1.DataTypeOIDs.varchar,
                    postgresql_client_1.DataTypeOIDs.varchar,
                    postgresql_client_1.DataTypeOIDs.varchar,
                ],
            });
            yield statement.execute({
                params: [dataIn.username, dataIn.upassword, dataIn.email],
            });
            console.log("inserted=>", dataIn);
            return yield this.QueryByUsername(dataIn.username, connection);
        });
    }
    Delete(trader_id, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            const statement = yield connection.prepare(`delete from ${this.tableName} where trader_id=$1`, {
                paramTypes: [postgresql_client_1.DataTypeOIDs.numeric],
            });
            yield statement.execute({ params: [trader_id] });
        });
    }
    QueryOne(trader_id, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            const result = yield connection.query(`select * from ${this.tableName} where trader_id = $1`, {
                params: [trader_id],
            });
            const rows = result.rows;
            let p = new Promise((resolve, reject) => {
                if (rows && rows.length > 0) {
                    resolve(this.convert2TS(rows[0]));
                }
                else {
                    reject(new Error(`no Trader found for ${trader_id}`));
                }
            });
            yield connection.close(); // Disconnect
            return p;
        });
    }
    QueryByUsername(username, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.doQueryAll(connection, `username='${username}'`);
            let p = new Promise((resolve, reject) => {
                if (rows && Array.isArray(rows) && rows.length > 0) {
                    resolve(this.convert2TS(rows[0]));
                }
                else {
                    reject(new Error(`no record found in Trader table with username = ${username}!`));
                }
            });
            return p;
        });
    }
    QueryAll(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.doQueryAll(connection);
            let p = new Promise((resolve, reject) => {
                if (rows && Array.isArray(rows) && rows.length > 0) {
                    let tks = [];
                    rows.forEach((row) => {
                        tks.push(this.convert2TS(row));
                    });
                    resolve(tks);
                }
                else {
                    reject(new Error(`no record found in Trader table!`));
                }
            });
            return p;
        });
    }
}
exports.TraderController = TraderController;
exports.default = TraderController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhZGVyLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGIvdHJhZGVyLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseURBQTZEO0FBQzdELDZEQUF3RDtBQUd4RCxNQUFhLGdCQUFpQixTQUFRLHFDQUFnQjtJQUNwRDtRQUNFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQsVUFBVSxDQUFDLEVBQWM7UUFDdkIsSUFBSSxFQUFFLEdBQVk7WUFDaEIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVc7WUFDMUIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVc7WUFDekIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVc7WUFDMUIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVc7WUFDdEIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVM7WUFDekIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVM7U0FDMUIsQ0FBQztRQUNGLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELDhGQUE4RjtJQUM5RiwrQ0FBK0M7SUFDekMsTUFBTSxDQUFDLE1BQWUsRUFBRSxVQUF1Qjs7WUFDbkQsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUM1QixVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUMvQztZQUNELE1BQU0sU0FBUyxHQUFHLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FDeEMsVUFBVSxJQUFJLENBQUMsU0FBUztzREFDd0IsRUFDaEQ7Z0JBQ0UsVUFBVSxFQUFFO29CQUNWLGdDQUFZLENBQUMsT0FBTztvQkFDcEIsZ0NBQVksQ0FBQyxPQUFPO29CQUNwQixnQ0FBWSxDQUFDLE9BQU87b0JBQ3BCLGdDQUFZLENBQUMsT0FBTztpQkFDckI7YUFDRixDQUNGLENBQUM7WUFD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