import { createState, test } from "../../../utils";

import { TrainingFieldActivity } from "../../../../public-api";

test("should get 25 xp for each turn", {
  initState: createState(({ party, activity, unit }) => [
    activity({
      name: TrainingFieldActivity.Train,
      state: {
        partyId: party({
          unitIds: [unit({ id: "unit-id", xp: 10 })],
        }),
      },
    }),
  ]),
  turn: true,
  expectedState: { units: { "unit-id": { xp: 35 } } },
});
