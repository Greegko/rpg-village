import { VillageCommand } from "../../../public-api";
import { test } from "../../utils";

const initState = {
  village: { stash: { resource: { gold: 100 } }, portals: 0 },
};

test("should build a portals", {
  initState,
  commands: [VillageCommand.BuildPortals],
  expectedState: { village: { portals: 1 } },
});

test("should reduce the village resouce by the portals cost", {
  initState,
  commands: [VillageCommand.BuildPortals],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
