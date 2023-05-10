import { PortalActivity } from "@rpg-village/core";

import { createState, test } from "../../utils";

test("should add resource on activity ends", {
  initState: createState(({ activity, village }) => [
    village({ stash: { resource: { gold: 0 } } }),
    activity({
      name: PortalActivity.GatherResourceFromPortal,
      state: { progress: 1 },
      startArgs: { resource: { gold: 10 } } as any,
    }),
  ]),
  turn: true,
  expectedState: { village: { stash: { resource: { gold: 10 } } } },
});
