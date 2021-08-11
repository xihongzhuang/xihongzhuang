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
exports.BaseDbController = exports.ClosePool = void 0;
const postgresql_client_1 = require("postgresql-client");
const dburl = "postgres://xihongzhuang:xh123456@localhost:5432/tradeweb";
const dbpool = new postgresql_client_1.Pool(dburl);
function ClosePool() {
    return __awaiter(this, void 0, void 0, function* () {
        yield dbpool.close();
    });
}
exports.ClosePool = ClosePool;
class BaseDbController {
    constructor(tableName) {
        this.tableName = tableName;
    }
    AcquireDBConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield dbpool.acquire();
        });
    }
    ExecSQL(sqlStatement, connection, closeConnection = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (connection === undefined) {
                connection = yield this.AcquireDBConnection();
            }
            console.log(`executing sql: ${sqlStatement}`);
            const result = yield connection.query(sqlStatement);
            const rows = result.rows;
            console.log(`get result:`, rows);
            if (closeConnection) {
                yield connection.close(); // Disconnect
            }
            return rows;
        });
    }
    doQueryAll(connection, condition) {
        return __awaiter(this, void 0, void 0, function* () {
            let sqlStatement = `select * from ${this.tableName}`;
            if (condition !== undefined) {
                sqlStatement += " where " + condition;
            }
            return this.ExecSQL(sqlStatement);
        });
    }
}
exports.BaseDbController = BaseDbController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5kYi5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2RiL2Jhc2UuZGIuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx5REFBcUQ7QUFFckQsTUFBTSxLQUFLLEdBQUcsMERBQTBELENBQUM7QUFDekUsTUFBTSxNQUFNLEdBQUcsSUFBSSx3QkFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLFNBQXNCLFNBQVM7O1FBQzdCLE1BQU0sTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3ZCLENBQUM7Q0FBQTtBQUZELDhCQUVDO0FBRUQsTUFBYSxnQkFBZ0I7SUFDM0IsWUFBc0IsU0FBaUI7UUFBakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtJQUFHLENBQUM7SUFFckMsbUJBQW1COztZQUN2QixPQUFPLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2hDLENBQUM7S0FBQTtJQUVLLE9BQU8sQ0FDWCxZQUFvQixFQUNwQixVQUF1QixFQUN2QixlQUFlLEdBQUcsSUFBSTs7WUFFdEIsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUM1QixVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzthQUMvQztZQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLFlBQVksRUFBRSxDQUFDLENBQUM7WUFDOUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxVQUFVLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3BELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakMsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLE1BQU0sVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsYUFBYTthQUN4QztZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztLQUFBO0lBRUssVUFBVSxDQUNkLFVBQXVCLEVBQ3ZCLFNBQWtCOztZQUVsQixJQUFJLFlBQVksR0FBRyxpQkFBaUIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3JELElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRTtnQkFDM0IsWUFBWSxJQUFJLFNBQVMsR0FBRyxTQUFTLENBQUM7YUFDdkM7WUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDcEMsQ0FBQztLQUFBO0NBQ0Y7QUFuQ0QsNENBbUNDIn0=