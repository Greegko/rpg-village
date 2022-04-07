import { VillageCommand } from "../../../public-api";
import { test } from "../../utils";

const initState = {
  village: { stash: { resource: { gold: 100 } }, blacksmith: 0 },
};

test("should build a blacksmith", {
  initState,
  commands: [VillageCommand.BuildBlacksmith],
  expectedState: { village: { blacksmith: 1 } },
});

test("should reduce the village resouce by the blacksmith cost", {
  initState,
  commands: [VillageCommand.BuildBlacksmith],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
