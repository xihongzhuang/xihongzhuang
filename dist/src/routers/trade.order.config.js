"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeOrderRoutes = void 0;
const trade_order_controller_1 = __importDefault(require("../db/trade.order.controller"));
const common_route_config_1 = require("./common.route.config");
class TradeOrderRoutes extends common_route_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, "TradeOrderRoutes");
        this.tradeOrderCtl = new trade_order_controller_1.default();
    }
    configureRoutes() {
        this.app
            .route(`/orders`)
            .get((req, res) => {
            this.tradeOrderCtl
                .QueryAll()
                .then((resp) => {
                res.status(200).json(resp);
            })
                .catch((err) => {
                res.status(500).send(`error: ${err}`);
            });
        })
            .post((req, res) => {
            // console.log("req.body=>", req.body);
            const newOrder = req.body;
            console.log("newOrder=>", newOrder);
            this.tradeOrderCtl
                .Insert(newOrder)
                .then((resp) => {
                res.status(200).json(resp);
            })
                .catch((err) => {
                res.status(500).send(`error: ${err}`);
            });
        });
        this.app
            .route(`/orders/:orderId`)
            .get((req, res) => {
            this.tradeOrderCtl
                .QueryOne(req.params.orderId)
                .then((resp) => {
                res.status(200).json(resp);
            })
                .catch((err) => {
                res.status(500).send(`error:${err}`);
            });
        })
            .delete((req, res) => {
            this.tradeOrderCtl
                .Delete(req.params.orderId)
                .then((resp) => {
                res.status(200).json(resp);
            })
                .catch((err) => {
                res
                    .status(500)
                    .send(`DELETE on orderId: ${req.params.orderId}, error:${err}`);
            });
        });
        return this.app;
    }
}
exports.TradeOrderRoutes = TradeOrderRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhZGUub3JkZXIuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcnMvdHJhZGUub3JkZXIuY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDBGQUFnRTtBQUNoRSwrREFBMkQ7QUFJM0QsTUFBYSxnQkFBaUIsU0FBUSx3Q0FBa0I7SUFFdEQsWUFBWSxHQUF3QjtRQUNsQyxLQUFLLENBQUMsR0FBRyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFGekIsa0JBQWEsR0FBRyxJQUFJLGdDQUFvQixFQUFFLENBQUM7SUFHbkQsQ0FBQztJQUNELGVBQWU7UUFDYixJQUFJLENBQUMsR0FBRzthQUNMLEtBQUssQ0FBQyxTQUFTLENBQUM7YUFDaEIsR0FBRyxDQUFDLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLEVBQUU7WUFDbkQsSUFBSSxDQUFDLGFBQWE7aUJBQ2YsUUFBUSxFQUFFO2lCQUNWLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDYixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsRUFBRTtZQUNwRCx1Q0FBdUM7WUFDdkMsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLElBQW1CLENBQUM7WUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLGFBQWE7aUJBQ2YsTUFBTSxDQUFDLFFBQVEsQ0FBQztpQkFDaEIsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ2IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUwsSUFBSSxDQUFDLEdBQUc7YUFDTCxLQUFLLENBQUMsa0JBQWtCLENBQUM7YUFDekIsR0FBRyxDQUFDLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLEVBQUU7WUFDbkQsSUFBSSxDQUFDLGFBQWE7aUJBQ2YsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2lCQUM1QixJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDYixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDO2FBQ0QsTUFBTSxDQUFDLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLEVBQUU7WUFDdEQsSUFBSSxDQUFDLGFBQWE7aUJBQ2YsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2lCQUMxQixJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDYixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2IsR0FBRztxQkFDQSxNQUFNLENBQUMsR0FBRyxDQUFDO3FCQUNYLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLFdBQVcsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNwRSxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUwsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQTNERCw0Q0EyREMifQ==