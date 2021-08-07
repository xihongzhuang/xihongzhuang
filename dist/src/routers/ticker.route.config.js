"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TickerRoutes = void 0;
// import { v4 as uuidv4 } from "uuid";
const psql_1 = require("../db/psql");
const common_route_config_1 = require("./common.route.config");
class TickerRoutes extends common_route_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, "TickerRoutes");
    }
    configureRoutes() {
        this.app
            .route(`/tickers`)
            .get((req, res) => {
            psql_1.qAllTickers()
                .then((resp) => {
                res.status(200).json(resp);
            })
                .catch((err) => {
                res.status(500).send(`error: ${err}`);
            });
        })
            .post((req, res) => {
            res.status(200).send(`Created mew ticker`);
            // let newGameId = uuidv4();
            // createGame(newGameId)
            //   .then((resp) => {
            //     res
            //       .status(200)
            //       .send(`New Game created: ${newGameId}, resp:${resp}`);
            //   })
            //   .catch((err) => console.log(err));
        });
        this.app
            .route(`/tickers/:tickerId`)
            .get((req, res) => {
            psql_1.qTicker(req.params.tickerId)
                .then((resp) => {
                res.status(200).json(resp);
            })
                .catch((err) => {
                res.status(500).send(`error:${err}`);
            });
        })
            .delete((req, res) => {
            res
                .status(200)
                .send(`DELETE request for tickerId: ${req.params.tickerId}`);
        });
        return this.app;
    }
}
exports.TickerRoutes = TickerRoutes;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGlja2VyLnJvdXRlLmNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXJzL3RpY2tlci5yb3V0ZS5jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQXVDO0FBQ3ZDLHFDQUFrRDtBQUNsRCwrREFBMkQ7QUFHM0QsTUFBYSxZQUFhLFNBQVEsd0NBQWtCO0lBQ2xELFlBQVksR0FBd0I7UUFDbEMsS0FBSyxDQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsZUFBZTtRQUNiLElBQUksQ0FBQyxHQUFHO2FBQ0wsS0FBSyxDQUFDLFVBQVUsQ0FBQzthQUNqQixHQUFHLENBQUMsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsRUFBRTtZQUNuRCxrQkFBVyxFQUFFO2lCQUNWLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDYixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsRUFBRTtZQUNwRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQzNDLDRCQUE0QjtZQUM1Qix3QkFBd0I7WUFDeEIsc0JBQXNCO1lBQ3RCLFVBQVU7WUFDVixxQkFBcUI7WUFDckIsK0RBQStEO1lBQy9ELE9BQU87WUFDUCx1Q0FBdUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFTCxJQUFJLENBQUMsR0FBRzthQUNMLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQzthQUMzQixHQUFHLENBQUMsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsRUFBRTtZQUNuRCxjQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7aUJBQ3pCLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDYixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7YUFDRCxNQUFNLENBQUMsQ0FBQyxHQUFvQixFQUFFLEdBQXFCLEVBQUUsRUFBRTtZQUN0RCxHQUFHO2lCQUNBLE1BQU0sQ0FBQyxHQUFHLENBQUM7aUJBQ1gsSUFBSSxDQUFDLGdDQUFnQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDLENBQUM7UUFFTCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDbEIsQ0FBQztDQUNGO0FBL0NELG9DQStDQyJ9