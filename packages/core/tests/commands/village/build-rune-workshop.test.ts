import { VillageCommand } from "../../../public-api";
import { test } from "../../utils";

const initState = {
  village: { stash: { resource: { gold: 100 } }, runeWorkshop: 0 },
};

test("should build a runeWorkshop", {
  initState,
  commands: [VillageCommand.BuildRuneWorkshop],
  expectedState: { village: { runeWorkshop: 1 } },
});

test("should reduce the village resouce by the runeWorkshop cost", {
  initState,
  commands: [VillageCommand.BuildRuneWorkshop],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
