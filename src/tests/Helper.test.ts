import { describe, expect, it } from "bun:test";
import { Helper } from "../utils/Helper";

describe("Helper Test Kit.", () => {
  it("Should return the sum of two number.", () => {
    const sum = Helper.sum(5, 10);
    expect(sum).toBe(15);
  });

  it("Should return the concat string.", () => {
    const result = Helper.concat("Apple", "Cat");
    expect(result).toBe("AppleCat");
  });
});
