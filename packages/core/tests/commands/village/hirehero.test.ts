import { VillageCommand } from "@rpg-village/core";

import { createState, test } from "../../utils";

test("should reduce village gold capacity by cost amount", {
  initState: createState(({ village }) => [
    village({
      id: "villageId",
      stash: { resource: { gold: 25 } },
      buildings: { houses: 1 },
      heroes: [],
      locationId: "village",
    }),
  ]),
  commands: [{ command: VillageCommand.HireHero, args: { villageId: "villageId" } }],
  expectedState: { villages: { villageId: { stash: { resource: { gold: 5 } } } } },
});

test("should add to village heroes list", {
  initState: createState(({ village }) => [
    village({
      id: "villageId",
      stash: { resource: { gold: 25 } },
      buildings: { houses: 1 },
      heroes: [],
      locationId: "village",
    }),
  ]),
  commands: [{ command: VillageCommand.HireHero, args: { villageId: "villageId" } }],
  expectedState: (state, t) => t.notDeepEqual(state.villages.villageId.heroes, []),
});

test("should store in units list", {
  initState: createState(({ village }) => [
    village({
      id: "villageId",
      stash: { resource: { gold: 25 } },
      buildings: { houses: 1 },
      heroes: [],
      locationId: "village",
    }),
  ]),
  commands: [{ command: VillageCommand.HireHero, args: { villageId: "villageId" } }],
  expectedState: (state, t) => t.notDeepEqual(state.units, {}),
});

test("should assign to a new party", {
  initState: createState(({ village }) => [
    village({
      id: "villageId",
      stash: { resource: { gold: 25 } },
      buildings: { houses: 1 },
      heroes: [],
      locationId: "village",
    }),
  ]),
  commands: [{ command: VillageCommand.HireHero, args: { villageId: "villageId" } }],
  expectedState: (state, t) => t.notDeepEqual(state.parties, {}),
});
