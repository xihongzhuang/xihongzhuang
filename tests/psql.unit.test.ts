import { suite, test } from "@testdeck/mocha";
// import { v4 as uuidv4 } from "uuid";
import * as _chai from "chai";
// import { ITicker } from "../src/db/datamodel";
// import { mock, instance } from "ts-mockito";
import TickerController from "../src/db/ticker.controller";
_chai.should();
// @suite

let testTicker = new TickerController();

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

  // jsstr = `{"id":"GOOG","name":"google","email":"support@gmail.com","created_at":"2021-08-06T23:41:21.989Z"}`;
  // let tk : ITicker = JSON.parse(jsstr);
  // @test "should do something when call a method"() {
  //   // console.log("newid=", newid);
  //   // this.SUT.should.be.not.undefined;
  // }
}
