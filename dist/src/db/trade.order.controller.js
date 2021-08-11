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
exports.TradeOrderController = void 0;
const uuid_1 = require("uuid");
const postgresql_client_1 = require("postgresql-client");
const base_db_controller_1 = require("./base.db.controller");
const datamodel_1 = require("./datamodel");
const trade_controller_1 = require("./trade.controller");
class TradeOrderController extends base_db_controller_1.BaseDbController {
    constructor() {
        super("trade_order");
        this._tradeCtrl = new trade_controller_1.TradeController();
    }
    convert2TS(r1) {
        const res = {
            order_id: r1[0],
            ticker_id: r1[1],
            trader_id: r1[2],
            side: r1[3],
            price_limit: r1[4],
            quantity: r1[5],
            filled_quantity: r1[6],
            order_status: r1[7],
            created_at: r1[8],
        };
        return res;
    }
    //TODO: implement PATCH, which needs to query from database first, then apply only the changes
    //Only name and email are allowed to be updated
    //   async Update(
    //     dataIn: ITradeOrder,
    //     connection?: Connection
    //   ): Promise<ITradeOrder> {
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
    //   PlaceOrder
    Insert(dataIn, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            if (!dataIn.order_id) {
                dataIn.order_id = uuid_1.v4();
            }
            if (!dataIn.order_status) {
                dataIn.order_status = datamodel_1.OrderStatus.Opened;
            }
            if (!dataIn.filled_quantity) {
                dataIn.filled_quantity = 0;
            }
            // TODO: verify if ticker_id exists
            const statement = yield connection.prepare(`insert into ${this.tableName} 
      (order_id, ticker_id, trader_id, side, price_limit, quantity, filled_quantity, order_status) 
      values ($1,$2,$3,$4,$5,$6,$7,$8)`, {
                paramTypes: [
                    postgresql_client_1.DataTypeOIDs.uuid,
                    postgresql_client_1.DataTypeOIDs.varchar,
                    postgresql_client_1.DataTypeOIDs.numeric,
                    postgresql_client_1.DataTypeOIDs.varchar,
                    postgresql_client_1.DataTypeOIDs.numeric,
                    postgresql_client_1.DataTypeOIDs.numeric,
                    postgresql_client_1.DataTypeOIDs.numeric,
                    postgresql_client_1.DataTypeOIDs.varchar,
                ],
            });
            yield statement.execute({
                params: [
                    dataIn.order_id,
                    dataIn.ticker_id,
                    dataIn.trader_id,
                    dataIn.side,
                    dataIn.price_limit,
                    dataIn.quantity,
                    dataIn.filled_quantity,
                    dataIn.order_status,
                ],
            });
            // trigger trade processing,
            // TODO: it's better to process this in worker
            // Instead of blocking here
            yield this.GenerateTrades(dataIn.ticker_id);
            return yield this.QueryOne(dataIn.order_id, connection);
        });
    }
    Delete(order_id, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            const statement = yield connection.prepare(`delete from ${this.tableName} where order_id=$1`, {
                paramTypes: [postgresql_client_1.DataTypeOIDs.varchar],
            });
            yield statement.execute({ params: [order_id] });
        });
    }
    QueryOne(order_id, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            const result = yield connection.query(`select * from ${this.tableName} where order_id = $1`, {
                params: [order_id],
            });
            const rows = result.rows;
            let p = new Promise((resolve, reject) => {
                if (rows && rows.length > 0) {
                    resolve(this.convert2TS(rows[0]));
                }
                else {
                    reject(new Error(`no Trade order found for ${order_id}`));
                }
            });
            yield connection.close(); // Disconnect
            return p;
        });
    }
    convert2BidOrOffer(r1) {
        const res = {
            price_limit: r1[0],
            quantity: r1[1],
            order_id: r1[2],
            trader_id: r1[3],
        };
        return res;
    }
    convertArray(arr) {
        let res = [];
        arr.forEach((a) => {
            res.push(this.convert2BidOrOffer(a));
        });
        return res;
    }
    //   return the list of trade_id created
    // TODO: make this operation transactional
    GenerateTrades(tickerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = [];
            const connection = yield this.AcquireDBConnection();
            try {
                // this view is sorted by price desc
                let sqlbids = `select price_limit,quantity_needed,order_id,trader_id from view_bids where ticker_id='${tickerId}' limit 10;`;
                let resbids = yield this.ExecSQL(sqlbids, connection, false);
                if (!resbids || resbids.length == 0)
                    return res;
                // this view is sorted by price asc
                let sqloffers = `select price_limit,quantity_needed,order_id,trader_id from view_offers where ticker_id='${tickerId}' limit 10;`;
                let resoffers = yield this.ExecSQL(sqloffers, connection, false);
                if (!resoffers || resoffers.length == 0)
                    return res;
                let bids = this.convertArray(resbids);
                let offers = this.convertArray(resoffers);
                for (let i = 0, j = 0; i < bids.length && j < offers.length;) {
                    if (bids[i].price_limit < offers[j].price_limit) {
                        break;
                    }
                    // Safty check, should not happen, just in case
                    if (bids[i].quantity <= 0) {
                        this.updateOrderStatus(bids[i].order_id, 0, datamodel_1.OrderStatus.Completed, connection);
                        i++;
                        continue;
                    }
                    if (offers[j].quantity <= 0) {
                        this.updateOrderStatus(offers[j].order_id, 0, datamodel_1.OrderStatus.Completed, connection);
                        j++;
                        continue;
                    }
                    let midPrice = offers[j].price_limit +
                        (bids[i].price_limit - offers[j].price_limit) / 2;
                    let tradeNew = {
                        ticker_id: tickerId,
                        price: midPrice,
                        quantity: Math.min(bids[i].quantity, offers[j].quantity),
                        buy_order: bids[i].order_id,
                        sell_order: offers[j].order_id,
                    };
                    // TODO: it makes more sense to make it a transaction
                    let tradeRet = yield this._tradeCtrl.Insert(tradeNew);
                    res.push(tradeRet);
                    // update trade_order to reflect the status
                    let bidStatus = datamodel_1.OrderStatus.Opened;
                    let offerStatus = datamodel_1.OrderStatus.Opened;
                    if (bids[i].quantity == tradeNew.quantity) {
                        // bids use up quantity
                        bids[i].quantity = 0;
                        offers[j].quantity -= tradeNew.quantity;
                        bidStatus = datamodel_1.OrderStatus.Completed;
                        if (offers[j].quantity == 0) {
                            offerStatus = datamodel_1.OrderStatus.Completed;
                            j++;
                        }
                        i++;
                    }
                    else {
                        // offer use up quantity
                        offers[j].quantity = 0;
                        bids[i].quantity -= tradeNew.quantity;
                        // means bids and offer has the same quantity
                        if (bids[i].quantity == 0) {
                            bidStatus = datamodel_1.OrderStatus.Completed;
                            i++;
                        }
                        offerStatus = datamodel_1.OrderStatus.Completed;
                        j++;
                    }
                    yield this.updateOrderStatus(tradeNew.buy_order, tradeNew.quantity, bidStatus, connection);
                    yield this.updateOrderStatus(tradeNew.sell_order, tradeNew.quantity, offerStatus, connection);
                }
            }
            finally {
                yield connection.close();
            }
            return res;
        });
    }
    updateOrderStatus(order_id, quantity, status, connection) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`execute updateOrderStatus on ${order_id}, filled quantity:${quantity}, ${status}`);
            try {
                const statement = yield connection.prepare(`update trade_order set filled_quantity=filled_quantity+$1,order_status=$2 where order_id=$3`, {
                    paramTypes: [
                        postgresql_client_1.DataTypeOIDs.numeric,
                        postgresql_client_1.DataTypeOIDs.varchar,
                        postgresql_client_1.DataTypeOIDs.uuid,
                    ],
                });
                yield statement.execute({
                    params: [quantity, status, order_id],
                });
            }
            catch (err) {
                console.log(`updateOrderStatus on ${order_id}, error: ${err}`);
            }
        });
    }
    QueryAll(connection) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.doQueryAll(connection);
            console.log("rows=>", rows);
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
exports.TradeOrderController = TradeOrderController;
exports.default = TradeOrderController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhZGUub3JkZXIuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9kYi90cmFkZS5vcmRlci5jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLCtCQUF3RDtBQUN4RCx5REFBNkQ7QUFFN0QsNkRBQXdEO0FBQ3hELDJDQU1xQjtBQUNyQix5REFBcUQ7QUFFckQsTUFBYSxvQkFBcUIsU0FBUSxxQ0FBZ0I7SUFFeEQ7UUFDRSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7UUFGZixlQUFVLEdBQUcsSUFBSSxrQ0FBZSxFQUFFLENBQUM7SUFHM0MsQ0FBQztJQUVELFVBQVUsQ0FBQyxFQUFjO1FBQ3ZCLE1BQU0sR0FBRyxHQUFnQjtZQUN2QixRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBVztZQUN6QixTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBVztZQUMxQixTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBVztZQUMxQixJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBYztZQUN4QixXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBVztZQUM1QixRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBVztZQUN6QixlQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBVztZQUNoQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBZ0I7WUFDbEMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVM7U0FDMUIsQ0FBQztRQUNGLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELDhGQUE4RjtJQUM5RiwrQ0FBK0M7SUFDL0Msa0JBQWtCO0lBQ2xCLDJCQUEyQjtJQUMzQiw4QkFBOEI7SUFDOUIsOEJBQThCO0lBQzlCLHNDQUFzQztJQUN0Qyx1REFBdUQ7SUFDdkQsUUFBUTtJQUNSLGtEQUFrRDtJQUNsRCwyRUFBMkU7SUFDM0UsMERBQTBEO0lBQzFELFVBQVU7SUFDVix3QkFBd0I7SUFDeEIsa0NBQWtDO0lBQ2xDLGtDQUFrQztJQUNsQyxrQ0FBa0M7SUFDbEMsa0NBQWtDO0lBQ2xDLGFBQWE7SUFDYixVQUFVO0lBQ1YsU0FBUztJQUNULGdDQUFnQztJQUNoQyxrQkFBa0I7SUFDbEIsOEJBQThCO0lBQzlCLCtCQUErQjtJQUMvQiwyQkFBMkI7SUFDM0IsNEJBQTRCO0lBQzVCLFdBQVc7SUFDWCxVQUFVO0lBQ1YsZ0NBQWdDO0lBQ2hDLHlEQUF5RDtJQUN6RCxNQUFNO0lBRU4sZUFBZTtJQUNULE1BQU0sQ0FDVixNQUFtQixFQUNuQixVQUF1Qjs7WUFFdkIsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUM1QixVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUMvQztZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO2dCQUNwQixNQUFNLENBQUMsUUFBUSxHQUFHLFNBQU0sRUFBRSxDQUFDO2FBQzVCO1lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7Z0JBQ3hCLE1BQU0sQ0FBQyxZQUFZLEdBQUcsdUJBQVcsQ0FBQyxNQUFNLENBQUM7YUFDMUM7WUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRTtnQkFDM0IsTUFBTSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUM7YUFDNUI7WUFFRCxtQ0FBbUM7WUFDbkMsTUFBTSxTQUFTLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUN4QyxlQUFlLElBQUksQ0FBQyxTQUFTOzt1Q0FFSSxFQUNqQztnQkFDRSxVQUFVLEVBQUU7b0JBQ1YsZ0NBQVksQ0FBQyxJQUFJO29CQUNqQixnQ0FBWSxDQUFDLE9BQU87b0JBQ3BCLGdDQUFZLENBQUMsT0FBTztvQkFDcEIsZ0NBQVksQ0FBQyxPQUFPO29CQUNwQixnQ0FBWSxDQUFDLE9BQU87b0JBQ3BCLGdDQUFZLENBQUMsT0FBTztvQkFDcEIsZ0NBQVksQ0FBQyxPQUFPO29CQUNwQixnQ0FBWSxDQUFDLE9BQU87aUJBQ3JCO2FBQ0YsQ0FDRixDQUFDO1lBRUYsTUFBTSxTQUFTLENBQUMsT0FBTyxDQUFDO2dCQUN0QixNQUFNLEVBQUU7b0JBQ04sTUFBTSxDQUFDLFFBQVE7b0JBQ2YsTUFBTSxDQUFDLFNBQVM7b0JBQ2hCLE1BQU0sQ0FBQyxTQUFTO29CQUNoQixNQUFNLENBQUMsSUFBSTtvQkFDWCxNQUFNLENBQUMsV0FBVztvQkFDbEIsTUFBTSxDQUFDLFFBQVE7b0JBQ2YsTUFBTSxDQUFDLGVBQWU7b0JBQ3RCLE1BQU0sQ0FBQyxZQUFZO2lCQUNwQjthQUNGLENBQUMsQ0FBQztZQUNILDRCQUE0QjtZQUM1Qiw4Q0FBOEM7WUFDOUMsMkJBQTJCO1lBQzNCLE1BQU0sSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUMsT0FBTyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMxRCxDQUFDO0tBQUE7SUFFSyxNQUFNLENBQUMsUUFBZ0IsRUFBRSxVQUF1Qjs7WUFDcEQsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUM1QixVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUMvQztZQUNELE1BQU0sU0FBUyxHQUFHLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FDeEMsZUFBZSxJQUFJLENBQUMsU0FBUyxvQkFBb0IsRUFDakQ7Z0JBQ0UsVUFBVSxFQUFFLENBQUMsZ0NBQVksQ0FBQyxPQUFPLENBQUM7YUFDbkMsQ0FDRixDQUFDO1lBQ0YsTUFBTSxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELENBQUM7S0FBQTtJQUVLLFFBQVEsQ0FDWixRQUFnQixFQUNoQixVQUF1Qjs7WUFFdkIsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUM1QixVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUMvQztZQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sVUFBVSxDQUFDLEtBQUssQ0FDbkMsaUJBQWlCLElBQUksQ0FBQyxTQUFTLHNCQUFzQixFQUNyRDtnQkFDRSxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7YUFDbkIsQ0FDRixDQUFDO1lBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztZQUV6QixJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sQ0FBYyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDbkQsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQzNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ25DO3FCQUFNO29CQUNMLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUMzRDtZQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxhQUFhO1lBQ3ZDLE9BQU8sQ0FBQyxDQUFDO1FBQ1gsQ0FBQztLQUFBO0lBRUQsa0JBQWtCLENBQUMsRUFBYztRQUMvQixNQUFNLEdBQUcsR0FBZ0I7WUFDdkIsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVc7WUFDNUIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVc7WUFDekIsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVc7WUFDekIsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQVc7U0FDM0IsQ0FBQztRQUNGLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUNELFlBQVksQ0FBQyxHQUFVO1FBQ3JCLElBQUksR0FBRyxHQUFrQixFQUFFLENBQUM7UUFDNUIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCx3Q0FBd0M7SUFDeEMsMENBQTBDO0lBQ3BDLGNBQWMsQ0FBQyxRQUFnQjs7WUFDbkMsSUFBSSxHQUFHLEdBQWEsRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sVUFBVSxHQUFHLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDcEQsSUFBSTtnQkFDRixvQ0FBb0M7Z0JBQ3BDLElBQUksT0FBTyxHQUFHLHlGQUF5RixRQUFRLGFBQWEsQ0FBQztnQkFDN0gsSUFBSSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzdELElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDO29CQUFFLE9BQU8sR0FBRyxDQUFDO2dCQUNoRCxtQ0FBbUM7Z0JBQ25DLElBQUksU0FBUyxHQUFHLDJGQUEyRixRQUFRLGFBQWEsQ0FBQztnQkFDakksSUFBSSxTQUFTLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2pFLElBQUksQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDO29CQUFFLE9BQU8sR0FBRyxDQUFDO2dCQUNwRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMxQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFJO29CQUM3RCxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRTt3QkFDL0MsTUFBTTtxQkFDUDtvQkFDRCwrQ0FBK0M7b0JBQy9DLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLEVBQUU7d0JBQ3pCLElBQUksQ0FBQyxpQkFBaUIsQ0FDcEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFDaEIsQ0FBQyxFQUNELHVCQUFXLENBQUMsU0FBUyxFQUNyQixVQUFVLENBQ1gsQ0FBQzt3QkFDRixDQUFDLEVBQUUsQ0FBQzt3QkFDSixTQUFTO3FCQUNWO29CQUNELElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxDQUFDLEVBQUU7d0JBQzNCLElBQUksQ0FBQyxpQkFBaUIsQ0FDcEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFDbEIsQ0FBQyxFQUNELHVCQUFXLENBQUMsU0FBUyxFQUNyQixVQUFVLENBQ1gsQ0FBQzt3QkFDRixDQUFDLEVBQUUsQ0FBQzt3QkFDSixTQUFTO3FCQUNWO29CQUVELElBQUksUUFBUSxHQUNWLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXO3dCQUNyQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDcEQsSUFBSSxRQUFRLEdBQVc7d0JBQ3JCLFNBQVMsRUFBRSxRQUFRO3dCQUNuQixLQUFLLEVBQUUsUUFBUTt3QkFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7d0JBQ3hELFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTt3QkFDM0IsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRO3FCQUMvQixDQUFDO29CQUNGLHFEQUFxRDtvQkFDckQsSUFBSSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDdEQsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDbkIsMkNBQTJDO29CQUMzQyxJQUFJLFNBQVMsR0FBRyx1QkFBVyxDQUFDLE1BQU0sQ0FBQztvQkFDbkMsSUFBSSxXQUFXLEdBQUcsdUJBQVcsQ0FBQyxNQUFNLENBQUM7b0JBQ3JDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFO3dCQUN6Qyx1QkFBdUI7d0JBQ3ZCLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO3dCQUNyQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUM7d0JBQ3hDLFNBQVMsR0FBRyx1QkFBVyxDQUFDLFNBQVMsQ0FBQzt3QkFDbEMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsRUFBRTs0QkFDM0IsV0FBVyxHQUFHLHVCQUFXLENBQUMsU0FBUyxDQUFDOzRCQUNwQyxDQUFDLEVBQUUsQ0FBQzt5QkFDTDt3QkFDRCxDQUFDLEVBQUUsQ0FBQztxQkFDTDt5QkFBTTt3QkFDTCx3QkFBd0I7d0JBQ3hCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO3dCQUN2QixJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUM7d0JBQ3RDLDZDQUE2Qzt3QkFDN0MsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsRUFBRTs0QkFDekIsU0FBUyxHQUFHLHVCQUFXLENBQUMsU0FBUyxDQUFDOzRCQUNsQyxDQUFDLEVBQUUsQ0FBQzt5QkFDTDt3QkFDRCxXQUFXLEdBQUcsdUJBQVcsQ0FBQyxTQUFTLENBQUM7d0JBQ3BDLENBQUMsRUFBRSxDQUFDO3FCQUNMO29CQUNELE1BQU0sSUFBSSxDQUFDLGlCQUFpQixDQUMxQixRQUFRLENBQUMsU0FBUyxFQUNsQixRQUFRLENBQUMsUUFBUSxFQUNqQixTQUFTLEVBQ1QsVUFBVSxDQUNYLENBQUM7b0JBQ0YsTUFBTSxJQUFJLENBQUMsaUJBQWlCLENBQzFCLFFBQVEsQ0FBQyxVQUFVLEVBQ25CLFFBQVEsQ0FBQyxRQUFRLEVBQ2pCLFdBQVcsRUFDWCxVQUFVLENBQ1gsQ0FBQztpQkFDSDthQUNGO29CQUFTO2dCQUNSLE1BQU0sVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQzFCO1lBRUQsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO0tBQUE7SUFFSyxpQkFBaUIsQ0FDckIsUUFBZ0IsRUFDaEIsUUFBZ0IsRUFDaEIsTUFBbUIsRUFDbkIsVUFBc0I7O1lBRXRCLE9BQU8sQ0FBQyxHQUFHLENBQ1QsZ0NBQWdDLFFBQVEscUJBQXFCLFFBQVEsS0FBSyxNQUFNLEVBQUUsQ0FDbkYsQ0FBQztZQUNGLElBQUk7Z0JBQ0YsTUFBTSxTQUFTLEdBQUcsTUFBTSxVQUFVLENBQUMsT0FBTyxDQUN4Qyw2RkFBNkYsRUFDN0Y7b0JBQ0UsVUFBVSxFQUFFO3dCQUNWLGdDQUFZLENBQUMsT0FBTzt3QkFDcEIsZ0NBQVksQ0FBQyxPQUFPO3dCQUNwQixnQ0FBWSxDQUFDLElBQUk7cUJBQ2xCO2lCQUNGLENBQ0YsQ0FBQztnQkFDRixNQUFNLFNBQVMsQ0FBQyxPQUFPLENBQUM7b0JBQ3RCLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDO2lCQUNyQyxDQUFDLENBQUM7YUFDSjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLFFBQVEsWUFBWSxHQUFHLEVBQUUsQ0FBQyxDQUFDO2FBQ2hFO1FBQ0gsQ0FBQztLQUFBO0lBRUssUUFBUSxDQUFDLFVBQXVCOztZQUNwQyxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQWdCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUNyRCxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNsRCxJQUFJLEdBQUcsR0FBa0IsRUFBRSxDQUFDO29CQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUU7d0JBQ3hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUNqQyxDQUFDLENBQUMsQ0FBQztvQkFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2Q7cUJBQU07b0JBQ0wsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUMsQ0FBQztpQkFDdkQ7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxDQUFDO1FBQ1gsQ0FBQztLQUFBO0NBQ0Y7QUF0VEQsb0RBc1RDO0FBRUQsa0JBQWUsb0JBQW9CLENBQUMifQ==