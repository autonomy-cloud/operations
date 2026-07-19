import NotContains from "../../../Types/BaseDatabase/NotContains";
import BadDataException from "../../../Types/Exception/BadDataException";
import { JSONObject } from "../../../Types/JSON";
import { describe, expect, it } from "@jest/globals";

describe("NotContains", () => {
  it("should create a NotContains object with a valid value", () => {
    const value: string = "cast-operations";
    const obj: NotContains<string> = new NotContains<string>(value);
    expect(obj.value).toBe(value);
  });

  it("should get and set the value property", () => {
    const obj: NotContains<string> = new NotContains<string>("oldValue");
    obj.value = "newValue";
    expect(obj.value).toBe("newValue");
  });

  it("should return the value using toString", () => {
    const obj: NotContains<string> = new NotContains<string>("cast-operations");
    expect(obj.toString()).toBe("cast-operations");
  });

  it("should generate the correct JSON representation using toJSON", () => {
    const obj: NotContains<string> = new NotContains<string>("cast-operations");
    const expectedJSON: JSONObject = {
      _type: "NotContains",
      value: "cast-operations",
    };
    expect(obj.toJSON()).toEqual(expectedJSON);
  });

  it("should create a NotContains object from valid JSON input", () => {
    const jsonInput: JSONObject = {
      _type: "NotContains",
      value: "cast-operations",
    };
    const obj: NotContains<string> = NotContains.fromJSON(jsonInput);
    expect(obj.value).toBe("cast-operations");
  });

  it("should default to an empty string when the JSON value is missing", () => {
    const jsonInput: JSONObject = {
      _type: "NotContains",
    };
    const obj: NotContains<string> = NotContains.fromJSON(jsonInput);
    expect(obj.value).toBe("");
  });

  it("should throw a BadDataException when using invalid JSON input", () => {
    const jsonInput: JSONObject = {
      _type: "InvalidType",
      value: "cast-operations",
    };
    expect(() => {
      return NotContains.fromJSON(jsonInput);
    }).toThrow(BadDataException);
  });

  it("should be an instance of NotContains", () => {
    const obj: NotContains<string> = new NotContains<string>("cast-operations");
    expect(obj).toBeInstanceOf(NotContains);
  });
});
