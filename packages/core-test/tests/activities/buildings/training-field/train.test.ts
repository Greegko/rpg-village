import { TrainingFieldActivity } from "@rpg-village/core";

import { createState, test } from "../../../utils";

test("should get 25 xp for each turn", {
  initState: createState(({ party, activity, unit }) => [
    activity({
      name: TrainingFieldActivity.Train,
      state: {
        partyId: party({
          unitIds: [unit({ id: "unit-id", xp: 10, level: 1 })],
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: { units: { "unit-id": { xp: 35 } } },
});

test("should level up after xp gained", {
  initState: createState(({ party, activity, unit }) => [
    activity({
      name: TrainingFieldActivity.Train,
      state: {
        partyId: party({
          unitIds: [unit({ id: "unit-id", xp: 100, level: 1 })],
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: { units: { "unit-id": { xp: 0, level: 2 } } },
});
