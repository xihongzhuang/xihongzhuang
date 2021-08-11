"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeRoutes = void 0;
const trade_controller_1 = __importDefault(require("../db/trade.controller"));
const common_route_config_1 = require("./common.route.config");
class TradeRoutes extends common_route_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, "trade");
        this._controller = new trade_controller_1.default();
    }
    configureRoutes() {
        this.app
            .route(`/trades`)
            .get((req, res) => {
            this._controller
                .QueryAll()
                .then((resp) => {
                res.status(200).json(resp);
            })
                .catch((err) => {
                res.status(500).send(`error: ${err}`);
            });
        })
            .post((req, res) => {
            let newTrade = req.body;
            this._controller
                .Insert(newTrade)
                .then((resp) => {
                res.status(200).json(resp);
            })
                .catch((err) => {
                res.status(500).send(`error: ${err}`);
            });
        });
        this.app
            .route(`/trades/:tradeId`)
            .get((req, res) => {
            this._controller
                .QueryOne(req.params.tradeId)
                .then((resp) => {
                res.status(200).json(resp);
            })
                .catch((err) => {
                res.status(500).send(`error:${err}`);
            });
        })
            .delete((req, res) => {
            this._controller
                .Delete(req.params.tradeId)
                .then((resp) => {
                res.status(200).send(`deleted tradeId: ${req.params.tradeId}`);
            })
                .catch((err) => {
                res
                    .status(500)
                    .send(`Failed to delete tradeId ${req.params.tradeId}, error:${err}`);
            });
        });
        return this.app;
    }
}
exports.TradeRoutes = TradeRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhZGUucm91dGUuY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcnMvdHJhZGUucm91dGUuY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLDhFQUFxRDtBQUNyRCwrREFBMkQ7QUFHM0QsTUFBYSxXQUFZLFNBQVEsd0NBQWtCO0lBR2pELFlBQVksR0FBd0I7UUFDbEMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUhkLGdCQUFXLEdBQUcsSUFBSSwwQkFBZSxFQUFFLENBQUM7SUFJNUMsQ0FBQztJQUNELGVBQWU7UUFDYixJQUFJLENBQUMsR0FBRzthQUNMLEtBQUssQ0FBQyxTQUFTLENBQUM7YUFDaEIsR0FBRyxDQUFDLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLEVBQUU7WUFDbkQsSUFBSSxDQUFDLFdBQVc7aUJBQ2IsUUFBUSxFQUFFO2lCQUNWLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDYixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsRUFBRTtZQUNwRCxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsSUFBYyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxXQUFXO2lCQUNiLE1BQU0sQ0FBQyxRQUFRLENBQUM7aUJBQ2hCLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDYixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVMLElBQUksQ0FBQyxHQUFHO2FBQ0wsS0FBSyxDQUFDLGtCQUFrQixDQUFDO2FBQ3pCLEdBQUcsQ0FBQyxDQUFDLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxFQUFFO1lBQ25ELElBQUksQ0FBQyxXQUFXO2lCQUNiLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztpQkFDNUIsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ2IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQzthQUNELE1BQU0sQ0FBQyxDQUFDLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxFQUFFO1lBQ3RELElBQUksQ0FBQyxXQUFXO2lCQUNiLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztpQkFDMUIsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ2IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNqRSxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2IsR0FBRztxQkFDQSxNQUFNLENBQUMsR0FBRyxDQUFDO3FCQUNYLElBQUksQ0FDSCw0QkFBNEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLFdBQVcsR0FBRyxFQUFFLENBQy9ELENBQUM7WUFDTixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUwsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQTVERCxrQ0E0REMifQ==