import { suite, test } from "@testdeck/mocha";
import * as _chai from "chai";
// import { mock, instance } from "ts-mockito";
import { qAllTickers } from "../src/db/psql";
_chai.should();
// @suite
class QueryAllTickersUnitTests {
  before() {
    qAllTickers()
      .then((resp) => {
        console.log("resp:", resp);
      })
      .catch((err) => {
        console.log("error:", err);
      });
  }

  // @test "should do something when call a method"() {
  //   // this.SUT.should.be.not.undefined;
  // }
}
