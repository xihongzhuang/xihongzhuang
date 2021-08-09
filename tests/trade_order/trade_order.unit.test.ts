import { v4 as uuidv4 } from "uuid";
import * as _chai from "chai";
_chai.should();
let newid = uuidv4();
console.log("newid=", newid, ",=>", newid.toString());
// @suite
class GenTradeIDUnitTests {
  before() {
    let newid = uuidv4();
    console.log("newid=", newid);
  }
}
