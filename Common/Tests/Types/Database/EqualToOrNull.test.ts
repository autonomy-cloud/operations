import EqualToOrNull from "../../../Types/BaseDatabase/EqualToOrNull";
import BadDataException from "../../../Types/Exception/BadDataException";
import { JSONObject } from "../../../Types/JSON";
import { describe, expect, it } from "@jest/globals";

describe("EqualToOrNull", () => {
  it("should create an EqualToOrNull object with a valid value", () => {
    const value: string = "cast-operations";
    const equalObj: EqualToOrNull<string> = new EqualToOrNull<string>(value);
    expect(equalObj.value).toBe(value);
  });

  it("should get the value property of an EqualToOrNull object", () => {
    const value: string = "cast-operations";
    const equalObj: EqualToOrNull<string> = new EqualToOrNull<string>(value);
    expect(equalObj.value).toBe(value);
  });

  it("should set the value property of an EqualToOrNull object", () => {
    const equalObj: EqualToOrNull<string> = new EqualToOrNull<string>(
      "oldValue",
    );
    equalObj.value = "newValue";
    expect(equalObj.value).toBe("newValue");
  });

  it("should return the correct string representation using toString method", () => {
    const equalObj: EqualToOrNull<string> = new EqualToOrNull<string>(
      "cast-operations",
    );
    expect(equalObj.toString()).toBe("cast-operations");
  });

  it("should generate the correct JSON representation using toJSON method", () => {
    const equalObj: EqualToOrNull<string> = new EqualToOrNull<string>(
      "cast-operations",
    );
    const expectedJSON: JSONObject = {
      _type: "EqualToOrNull",
      value: "cast-operations",
    };
    expect(equalObj.toJSON()).toEqual(expectedJSON);
  });

  it("should create an EqualToOrNull object from valid JSON input", () => {
    const jsonInput: JSONObject = {
      _type: "EqualToOrNull",
      value: "cast-operations",
    };
    const equalObj: EqualToOrNull<string> = EqualToOrNull.fromJSON(jsonInput);
    expect(equalObj.value).toBe("cast-operations");
  });

  it("should throw a BadDataException when using invalid JSON input", () => {
    const jsonInput: JSONObject = {
      _type: "InvalidType",
      value: "cast-operations",
    };
    expect(() => {
      return EqualToOrNull.fromJSON(jsonInput);
    }).toThrow(BadDataException);
  });

  it("should be a type of EqualToOrNull", () => {
    const equalObj: EqualToOrNull<string> = new EqualToOrNull(
      "cast-operations",
    );
    expect(equalObj).toBeInstanceOf(EqualToOrNull);
  });

  it("should handle null value when using fromJSON method", () => {
    const jsonInput: JSONObject = {
      _type: "EqualToOrNull",
      value: null,
    };
    const equalObj: EqualToOrNull<string> = EqualToOrNull.fromJSON(jsonInput);
    expect(equalObj.value).toBeNull();
  });
});
