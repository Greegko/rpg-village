import { test, createState } from "../utils";
import { WorldActivity } from "../../public-api";
import * as expect from "expect";

describe("Activities", () => {
  describe("Smoke Test", () => {
    test("should resolve activity result", {
      initState: {
        activities: {
          "test-activity-id": {
            name: WorldActivity.Travel,
            startArgs: {
              partyId: "test-party",
            },
            state: {
              partyId: "test-party",
              progress: 1,
              targetLocationId: "location-2",
            },
          },
        },
        parties: { "test-party": { locationId: "location-1" } },
      },
      turn: true,
      expectedState: {
        parties: { "test-party": { locationId: "location-2" } },
      },
    });

    test("should decrease progress counter when not finished", {
      initState: {
        activities: {
          "test-activity-id": {
            id: "test-activity-id",
            name: WorldActivity.Travel,
            state: { progress: 2 },
          },
        },
      },
      turn: true,
      expectedState: {
        activities: {
          "test-activity-id": {
            name: WorldActivity.Travel,
            state: { progress: 1 },
          },
        },
      },
    });

    test("should remove old activity on finish", {
      initState: createState(({ activity }) => [
        activity({
          id: "test-activity-id",
          name: WorldActivity.Travel,
          state: { progress: 1 },
        }),
      ]),
      turn: true,
      expectedState: state => expect(state.activities).not.toHaveProperty("test-activity-id"),
    });
  });
});
