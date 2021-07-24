import { VillageCommand } from "../../../public-api";
import { test } from "../../utils";

const initState = {
  village: { stash: { resource: { gold: 25 } }, houses: 1, heroes: [] },
};

test("should reduce village gold capacity by cost amount", {
  initState,
  commands: [VillageCommand.HireHero],
  expectedState: { village: { stash: { resource: { gold: 5 } } } },
});

test("should add to village heroes list", {
  initState,
  commands: [VillageCommand.HireHero],
  expectedState: (state, t) => t.notDeepEqual(state.village.heroes, []),
});

test("should store in units list", {
  initState,
  commands: [VillageCommand.HireHero],
  expectedState: (state, t) => t.notDeepEqual(state.units, {}),
});

test("should assign to a new party", {
  initState,
  commands: [VillageCommand.HireHero],
  expectedState: (state, t) => t.notDeepEqual(state.parties, {}),
});
