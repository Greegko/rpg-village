import { TrainingFieldActivity } from "@/features/village";

import { createState, test } from "@test/utils";

test("should get 25 xp for each turn", {
  initState: createState(({ party, activity, unit, village }) => [
    activity({
      name: TrainingFieldActivity.Train,
      targetId: village(),
      involvedTargetId: party({
        unitIds: [unit({ id: "unitId", xp: 10, level: 1 })],
      }),
    }),
  ]),
  turn: true,
  expectedState: { units: { unitId: { xp: 35 } } },
});

test("should level up after xp gained", {
  initState: createState(({ party, activity, unit, village }) => [
    activity({
      name: TrainingFieldActivity.Train,
      targetId: village(),
      involvedTargetId: party({
        unitIds: [unit({ id: "unitId", xp: 100, level: 1 })],
      }),
    }),
  ]),
  turn: true,
  expectedState: { units: { unitId: { xp: 0, level: 2 } } },
});
