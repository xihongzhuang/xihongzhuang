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
exports.TradeController = void 0;
const uuid_1 = require("uuid");
const postgresql_client_1 = require("postgresql-client");
const base_db_controller_1 = require("./base.db.controller");
class TradeController extends base_db_controller_1.BaseDbController {
    constructor() {
        super("trade");
    }
    convert2TS(r1) {
        const res = {
            trade_id: r1[0],
            ticker_id: r1[1],
            price: r1[2],
            quantity: r1[3],
            buy_order: r1[4],
            sell_order: r1[5],
            created_at: r1[6],
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
    Insert(dataIn, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            if (!dataIn.trade_id) {
                dataIn.trade_id = uuid_1.v4();
            }
            // TODO: verify if ticker_id exists
            const statement = yield connection.prepare(`insert into ${this.tableName} 
      (trade_id,ticker_id,price,quantity,buy_order,sell_order) 
      values ($1,$2,$3,$4,$5,$6)`, {
                paramTypes: [
                    postgresql_client_1.DataTypeOIDs.uuid,
                    postgresql_client_1.DataTypeOIDs.varchar,
                    postgresql_client_1.DataTypeOIDs.numeric,
                    postgresql_client_1.DataTypeOIDs.numeric,
                    postgresql_client_1.DataTypeOIDs.uuid,
                    postgresql_client_1.DataTypeOIDs.uuid,
                ],
            });
            yield statement.execute({
                params: [
                    dataIn.trade_id,
                    dataIn.ticker_id,
                    dataIn.price,
                    dataIn.quantity,
                    dataIn.buy_order,
                    dataIn.sell_order,
                ],
            });
            return yield this.QueryOne(dataIn.trade_id, connection);
        });
    }
    Delete(trade_id, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            const statement = yield connection.prepare(`delete from ${this.tableName} where trade_id=$1`, {
                paramTypes: [postgresql_client_1.DataTypeOIDs.uuid],
            });
            yield statement.execute({ params: [trade_id] });
        });
    }
    QueryOne(trade_id, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            const result = yield connection.query(`select * from ${this.tableName} where trade_id = $1`, {
                params: [trade_id],
            });
            const rows = result.rows;
            let p = new Promise((resolve, reject) => {
                if (rows && rows.length > 0) {
                    resolve(this.convert2TS(rows[0]));
                }
                else {
                    reject(new Error(`no Trade order found for ${trade_id}`));
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
                    reject(new Error(`no record found in Trader table!`));
                }
            });
            return p;
        });
    }
}
exports.TradeController = TradeController;
exports.default = TradeController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhZGUuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi90cmFkZS5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLCtCQUFvQztBQUNwQyx5REFBNkQ7QUFDN0QsNkRBQXdEO0FBR3hELE1BQWEsZUFBZ0IsU0FBUSxxQ0FBZ0I7SUFDbkQ7UUFDRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVELFVBQVUsQ0FBQyxFQUFjO1FBQ3ZCLE1BQU0sR0FBRyxHQUFXO1lBQ2xCLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFXO1lBQ3pCLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFXO1lBQzFCLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFXO1lBQ3RCLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFXO1lBQ3pCLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFXO1lBQzFCLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFXO1lBQzNCLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFTO1NBQzFCLENBQUM7UUFDRixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCw4RkFBOEY7SUFDOUYsK0NBQStDO0lBQy9DLGtCQUFrQjtJQUNsQixzQkFBc0I7SUFDdEIsOEJBQThCO0lBQzlCLHlCQUF5QjtJQUN6QixzQ0FBc0M7SUFDdEMsdURBQXVEO0lBQ3ZELFFBQVE7SUFDUixrREFBa0Q7SUFDbEQsMkVBQTJFO0lBQzNFLDBEQUEwRDtJQUMxRCxVQUFVO0lBQ1Ysd0JBQXdCO0lBQ3hCLGtDQUFrQztJQUNsQyxrQ0FBa0M7SUFDbEMsa0NBQWtDO0lBQ2xDLGtDQUFrQztJQUNsQyxhQUFhO0lBQ2IsVUFBVTtJQUNWLFNBQVM7SUFDVCxnQ0FBZ0M7SUFDaEMsa0JBQWtCO0lBQ2xCLDhCQUE4QjtJQUM5QiwrQkFBK0I7SUFDL0IsMkJBQTJCO0lBQzNCLDRCQUE0QjtJQUM1QixXQUFXO0lBQ1gsVUFBVTtJQUNWLGdDQUFnQztJQUNoQyx5REFBeUQ7SUFDekQsTUFBTTtJQUVOLHdCQUF3QjtJQUNsQixNQUFNLENBQUMsTUFBYyxFQUFFLFVBQXVCOztZQUNsRCxJQUFJLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JBQzVCLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO2FBQy9DO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7Z0JBQ3BCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsU0FBTSxFQUFFLENBQUM7YUFDNUI7WUFFRCxtQ0FBbUM7WUFDbkMsTUFBTSxTQUFTLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUN4QyxlQUFlLElBQUksQ0FBQyxTQUFTOztpQ0FFRixFQUMzQjtnQkFDRSxVQUFVLEVBQUU7b0JBQ1YsZ0NBQVksQ0FBQyxJQUFJO29CQUNqQixnQ0FBWSxDQUFDLE9BQU87b0JBQ3BCLGdDQUFZLENBQUMsT0FBTztvQkFDcEIsZ0NBQVksQ0FBQyxPQUFPO29CQUNwQixnQ0FBWSxDQUFDLElBQUk7b0JBQ2pCLGdDQUFZLENBQUMsSUFBSTtpQkFDbEI7YUFDRixDQUNGLENBQUM7WUFDRixNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3RCLE1BQU0sRUFBRTtvQkFDTixNQUFNLENBQUMsUUFBUTtvQkFDZixNQUFNLENBQUMsU0FBUztvQkFDaEIsTUFBTSxDQUFDLEtBQUs7b0JBQ1osTUFBTSxDQUFDLFFBQVE7b0JBQ2YsTUFBTSxDQUFDLFNBQVM7b0JBQ2hCLE1BQU0sQ0FBQyxVQUFVO2lCQUNsQjthQUNGLENBQUMsQ0FBQztZQUNILE9BQU8sTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDMUQsQ0FBQztLQUFBO0lBRUssTUFBTSxDQUFDLFFBQWdCLEVBQUUsVUFBdUI7O1lBQ3BELElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtnQkFDNUIsVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7YUFDL0M7WUFDRCxNQUFNLFNBQVMsR0FBRyxNQUFNLFVBQVUsQ0FBQyxPQUFPLENBQ3hDLGVBQWUsSUFBSSxDQUFDLFNBQVMsb0JBQW9CLEVBQ2pEO2dCQUNFLFVBQVUsRUFBRSxDQUFDLGdDQUFZLENBQUMsSUFBSSxDQUFDO2FBQ2hDLENBQ0YsQ0FBQztZQUNGLE1BQU0sU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsRCxDQUFDO0tBQUE7SUFFSyxRQUFRLENBQUMsUUFBZ0IsRUFBRSxVQUF1Qjs7WUFDdEQsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUM1QixVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUMvQztZQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLEtBQUssQ0FDbkMsaUJBQWlCLElBQUksQ0FBQyxTQUFTLHNCQUFzQixFQUNyRDtnQkFDRSxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7YUFDbkIsQ0FDRixDQUFDO1lBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztZQUV6QixJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDOUMsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ25DO3FCQUFNO29CQUNMLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUMzRDtZQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxhQUFhO1lBQ3ZDLE9BQU8sQ0FBQyxDQUFDO1FBQ1gsQ0FBQztLQUFBO0lBRUssUUFBUSxDQUFDLFVBQXVCOztZQUNwQyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQVcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQ2hELElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ2xELElBQUksR0FBRyxHQUFhLEVBQUUsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFO3dCQUN4QixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDakMsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNkO3FCQUFNO29CQUNMLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZEO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLENBQUMsQ0FBQztRQUNYLENBQUM7S0FBQTtDQUNGO0FBNUlELDBDQTRJQztBQUVELGtCQUFlLGVBQWUsQ0FBQyJ9