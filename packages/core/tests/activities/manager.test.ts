import { MapActivity } from "@features/map";
import { VillageActivity } from "@features/village";

import { createState, test } from "../utils";

test("should resolve activity result", {
  initState: createState(({ activity, village }) => [
    village({ houses: 0 }),
    activity({
      id: "testActivityId",
      name: VillageActivity.Build,
      startArgs: { targetBuilding: "houses" },
      state: { progress: 1 },
    }),
  ]),
  turn: true,
  expectedState: { village: { houses: 1 } },
});

test("should decrease progress counter when not finished", {
  initState: {
    activities: {
      "test-activity-id": {
        id: "test-activity-id",
        name: MapActivity.Travel,
        state: { progress: 2 },
      },
    },
  },
  turn: true,
  expectedState: {
    activities: {
      "test-activity-id": {
        id: "test-activity-id",
        name: MapActivity.Travel,
        state: { progress: 1 },
      },
    },
  },
});

test("should remove old activity on finish", {
  initState: createState(({ activity, village }) => [
    village({ houses: 0 }),
    activity({
      id: "testActivityId",
      name: VillageActivity.Build,
      state: { progress: 1, buildingType: "house" },
    }),
  ]),
  turn: true,
  expectedState: (state, t) => t.falsy(state.activities.testActivityId),
});
