import { VillageCommand } from "../../../public-api";
import { test } from "../../utils";

const initState = {
  village: { stash: { resource: { gold: 20 } }, houses: 0 },
};

test("should build a house", {
  initState,
  commands: [VillageCommand.BuildHouse],
  expectedState: { village: { houses: 1 } },
});

test("should reduce the village resouce by the house cost", {
  initState,
  commands: [VillageCommand.BuildHouse],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
