import { isIncidentStateOrderTransitionAllowed } from "Common/Server/Utils/IncidentStateTransition";
import { describe, expect, test } from "@jest/globals";

describe("incident state transition ordering", () => {
  test("accepts forward progress", () => {
    expect(
      isIncidentStateOrderTransitionAllowed({
        previousOrder: 1,
        previousIsResolved: false,
        nextOrder: 2,
        nextIsResolved: false,
      }),
    ).toBe(true);
  });

  test("accepts reopening a resolved incident", () => {
    expect(
      isIncidentStateOrderTransitionAllowed({
        previousOrder: 3,
        previousIsResolved: true,
        nextOrder: 1,
        nextIsResolved: false,
      }),
    ).toBe(true);
  });

  test("rejects every other backwards transition", () => {
    expect(
      isIncidentStateOrderTransitionAllowed({
        previousOrder: 2,
        previousIsResolved: false,
        nextOrder: 1,
        nextIsResolved: false,
      }),
    ).toBe(false);
    expect(
      isIncidentStateOrderTransitionAllowed({
        previousOrder: 3,
        previousIsResolved: true,
        nextOrder: 3,
        nextIsResolved: true,
      }),
    ).toBe(false);
  });
});
