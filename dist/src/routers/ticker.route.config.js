"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickerRoutes = void 0;
const ticker_controller_1 = __importDefault(require("../db/ticker.controller"));
const common_route_config_1 = require("./common.route.config");
class TickerRoutes extends common_route_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, "ticker");
        this._controller = new ticker_controller_1.default();
    }
    configureRoutes() {
        this.app
            .route(`/tickers`)
            .get((req, res) => {
            this._controller
                .QueryAll()
                .then((resp) => {
                res.status(200).json(resp);
            })
                .catch((err) => {
                res.status(404).send(`error: ${err}`);
            });
        })
            .post((req, res) => {
            let newTicker = req.body;
            // console.log("get newTicker POST", newTicker);
            this._controller
                .Insert(newTicker)
                .then((resp) => {
                res.status(200).json(resp);
            })
                .catch((err) => {
                res.status(404).send(`error: ${err}`);
            });
        });
        this.app
            .route(`/tickers/:tickerId`)
            .get((req, res) => {
            this._controller
                .QueryOne(req.params.tickerId)
                .then((resp) => {
                // res.status(200).send(JSON.stringify(resp));
                res.status(200).json(resp);
            })
                .catch((err) => {
                res.status(404).send(`error:${err}`);
            });
        })
            .delete((req, res) => {
            this._controller
                .Delete(req.params.tickerId)
                .then((resp) => {
                res.status(200).send(`deleted tickerId: ${req.params.tickerId}`);
            })
                .catch((err) => {
                res
                    .status(404)
                    .send(`Failed to delete tickerId ${req.params.tickerId}, error:${err}`);
            });
        });
        return this.app;
    }
}
exports.TickerRoutes = TickerRoutes;
exports.default = ticker_controller_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlja2VyLnJvdXRlLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXJzL3RpY2tlci5yb3V0ZS5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsZ0ZBQXVEO0FBQ3ZELCtEQUEyRDtBQUczRCxNQUFhLFlBQWEsU0FBUSx3Q0FBa0I7SUFHbEQsWUFBWSxHQUF3QjtRQUNsQyxLQUFLLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBSGYsZ0JBQVcsR0FBRyxJQUFJLDJCQUFnQixFQUFFLENBQUM7SUFJN0MsQ0FBQztJQUNELGVBQWU7UUFDYixJQUFJLENBQUMsR0FBRzthQUNMLEtBQUssQ0FBQyxVQUFVLENBQUM7YUFDakIsR0FBRyxDQUFDLENBQUMsR0FBb0IsRUFBRSxHQUFxQixFQUFFLEVBQUU7WUFDbkQsSUFBSSxDQUFDLFdBQVc7aUJBQ2IsUUFBUSxFQUFFO2lCQUNWLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDYixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsRUFBRTtZQUNwRCxJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUMsSUFBZSxDQUFDO1lBQ3BDLGdEQUFnRDtZQUNoRCxJQUFJLENBQUMsV0FBVztpQkFDYixNQUFNLENBQUMsU0FBUyxDQUFDO2lCQUNqQixJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDYixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFTCxJQUFJLENBQUMsR0FBRzthQUNMLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQzthQUMzQixHQUFHLENBQUMsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsRUFBRTtZQUNuRCxJQUFJLENBQUMsV0FBVztpQkFDYixRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7aUJBQzdCLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNiLDhDQUE4QztnQkFDOUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQzthQUNELE1BQU0sQ0FBQyxDQUFDLEdBQW9CLEVBQUUsR0FBcUIsRUFBRSxFQUFFO1lBQ3RELElBQUksQ0FBQyxXQUFXO2lCQUNiLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztpQkFDM0IsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ2IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUNuRSxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2IsR0FBRztxQkFDQSxNQUFNLENBQUMsR0FBRyxDQUFDO3FCQUNYLElBQUksQ0FDSCw2QkFBNkIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLFdBQVcsR0FBRyxFQUFFLENBQ2pFLENBQUM7WUFDTixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUwsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7Q0FDRjtBQTlERCxvQ0E4REM7QUFFRCxrQkFBZSwyQkFBZ0IsQ0FBQyJ9