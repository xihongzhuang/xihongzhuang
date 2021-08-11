"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { v4 as uuidv4 } from "uuid";
const _chai = __importStar(require("chai"));
// import { ITicker } from "../src/db/datamodel";
// import { mock, instance } from "ts-mockito";
const ticker_controller_1 = __importDefault(require("../src/db/ticker.controller"));
_chai.should();
// @suite
let testTicker = new ticker_controller_1.default();
class QueryAllTickersUnitTests {
    before() {
        testTicker
            .QueryAll()
            .then((resp) => {
            console.log("resp:", JSON.stringify(resp));
        })
            .catch((err) => {
            console.log("error:", err);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHNxbC51bml0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0cy9wc3FsLnVuaXQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBdUM7QUFDdkMsNENBQThCO0FBQzlCLGlEQUFpRDtBQUNqRCwrQ0FBK0M7QUFDL0Msb0ZBQTJEO0FBQzNELEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNmLFNBQVM7QUFFVCxJQUFJLFVBQVUsR0FBRyxJQUFJLDJCQUFnQixFQUFFLENBQUM7QUFFeEMsTUFBTSx3QkFBd0I7SUFDNUIsTUFBTTtRQUNKLFVBQVU7YUFDUCxRQUFRLEVBQUU7YUFDVixJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQVFGIn0=