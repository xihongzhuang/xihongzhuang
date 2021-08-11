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
exports.TickerController = void 0;
const postgresql_client_1 = require("postgresql-client");
const base_db_controller_1 = require("./base.db.controller");
class TickerController extends base_db_controller_1.BaseDbController {
    constructor() {
        super("ticker");
    }
    convert2TS(r1) {
        let tk = {
            id: r1[0],
            name: r1[1],
            email: r1[2],
            created_at: r1[3],
        };
        return tk;
    }
    //Only name and email are allowed to be updated
    Update(dataIn, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            const statement = yield connection.prepare(`update ${this.tableName} set name=$1, email=$2 where id=$3`, {
                paramTypes: [
                    postgresql_client_1.DataTypeOIDs.varchar,
                    postgresql_client_1.DataTypeOIDs.varchar,
                    postgresql_client_1.DataTypeOIDs.varchar,
                ],
            });
            yield statement.execute({ params: [dataIn.name, dataIn.email, dataIn.id] });
            yield connection.close();
            return dataIn;
        });
    }
    Insert(dataIn, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            const statement = yield connection.prepare(`insert into ${this.tableName} (id, name, email) values ($1,$2,$3)`, {
                paramTypes: [
                    postgresql_client_1.DataTypeOIDs.varchar,
                    postgresql_client_1.DataTypeOIDs.varchar,
                    postgresql_client_1.DataTypeOIDs.varchar,
                ],
            });
            yield statement.execute({ params: [dataIn.id, dataIn.name, dataIn.email] });
            return yield this.QueryOne(dataIn.id);
        });
    }
    Delete(id, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            const statement = yield connection.prepare(`delete from ${this.tableName} where id=$1`, {
                paramTypes: [postgresql_client_1.DataTypeOIDs.varchar],
            });
            yield statement.execute({ params: [id] });
        });
    }
    QueryOne(id, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
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
                    reject(new Error(`no record found in ticker table!`));
                }
            });
            return p;
        });
    }
}
exports.TickerController = TickerController;
exports.default = TickerController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlja2VyLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGIvdGlja2VyLmNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEseURBQTZEO0FBQzdELDZEQUF3RDtBQUd4RCxNQUFhLGdCQUFpQixTQUFRLHFDQUFnQjtJQUNwRDtRQUNFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsQixDQUFDO0lBRUQsVUFBVSxDQUFDLEVBQWM7UUFDdkIsSUFBSSxFQUFFLEdBQVk7WUFDaEIsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVc7WUFDbkIsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVc7WUFDckIsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVc7WUFDdEIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVM7U0FDMUIsQ0FBQztRQUNGLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELCtDQUErQztJQUN6QyxNQUFNLENBQUMsTUFBZSxFQUFFLFVBQXVCOztZQUNuRCxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JBQzVCLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2FBQy9DO1lBQ0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUN4QyxVQUFVLElBQUksQ0FBQyxTQUFTLG9DQUFvQyxFQUM1RDtnQkFDRSxVQUFVLEVBQUU7b0JBQ1YsZ0NBQVksQ0FBQyxPQUFPO29CQUNwQixnQ0FBWSxDQUFDLE9BQU87b0JBQ3BCLGdDQUFZLENBQUMsT0FBTztpQkFDckI7YUFDRixDQUNGLENBQUM7WUFDRixNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxF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