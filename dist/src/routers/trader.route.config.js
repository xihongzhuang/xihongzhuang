"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraderRoutes = void 0;
const trader_controller_1 = require("../db/trader.controller");
const common_route_config_1 = require("./common.route.config");
class TraderRoutes extends common_route_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, "TraderRoutes");
        this._controller = new trader_controller_1.TraderController();
    }
    configureRoutes() {
        this.app
            .route(`/traders`)
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
            let newTrader = req.body;
            console.log("decoded=>", newTrader);
            this._controller
                .Insert(newTrader)
                .then((resp) => {
                res.status(200).json(resp);
            })
                .catch((err) => {
                res.status(500).send(`error: ${err}`);
            });
        });
        this.app
            .route(`/traders/:traderId`)
            .get((req, res) => {
            const trader_id = +req.params.traderId;
            this._controller
                .QueryOne(trader_id)
                .then((resp) => {
                res.status(200).json(resp);
            })
                .catch((err) => {
                res.status(500).send(`error:${err}`);
            });
        })
            .delete((req, res) => {
            const trader_id = +req.params.traderId;
            this._controller
                .Delete(trader_id)
                .then((resp) => {
                res.status(200).send(`DELETED TraderId: ${req.params.traderId}`);
            })
                .catch((err) => {
                res.status(500).send(`error:${err}`);
            });
        });
        return this.app;
    }
}
exports.TraderRoutes = TraderRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhZGVyLnJvdXRlLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXJzL3RyYWRlci5yb3V0ZS5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsK0RBQTJEO0FBQzNELCtEQUEyRDtBQUczRCxNQUFhLFlBQWEsU0FBUSx3Q0FBa0I7SUFFbEQsWUFBWSxHQUF3QjtRQUNsQyxLQUFLLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRnJCLGdCQUFXLEdBQUcsSUFBSSxvQ0FBZ0IsRUFBRSxDQUFDO0lBRzdDLENBQUM7SUFDRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLEdBQUc7YUFDTCxLQUFLLENBQUMsVUFBVSxDQUFDO2FBQ2pCLEdBQUcsQ0FBQyxDQUFDLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxFQUFFO1lBQ25ELElBQUksQ0FBQyxXQUFXO2lCQUNiLFFBQVEsRUFBRTtpQkFDVixJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDYixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLEVBQUU7WUFDcEQsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQWUsQ0FBQztZQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNwQyxJQUFJLENBQUMsV0FBVztpQkFDYixNQUFNLENBQUMsU0FBUyxDQUFDO2lCQUNqQixJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDYixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFTCxJQUFJLENBQUMsR0FBRzthQUNMLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQzthQUMzQixHQUFHLENBQUMsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsRUFBRTtZQUNuRCxNQUFNLFNBQVMsR0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQy9DLElBQUksQ0FBQyxXQUFXO2lCQUNiLFFBQVEsQ0FBQyxTQUFTLENBQUM7aUJBQ25CLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDYixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7YUFDRCxNQUFNLENBQUMsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsRUFBRTtZQUN0RCxNQUFNLFNBQVMsR0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQy9DLElBQUksQ0FBQyxXQUFXO2lCQUNiLE1BQU0sQ0FBQyxTQUFTLENBQUM7aUJBQ2pCLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDbkUsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUwsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQTFERCxvQ0EwREMifQ==