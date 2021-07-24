import { VillageCommand } from "../../../public-api";
import { test } from "../../utils";

test("should generate 5 gold pieces", {
  initState: { village: { stash: { resource: { gold: 20 } } } },
  commands: [VillageCommand.GenerateGold],
  expectedState: { village: { stash: { resource: { gold: 25 } } } },
});
