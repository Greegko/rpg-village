import { VillageCommand } from "../../../public-api";
import { test } from "../../utils";

const initState = {
  village: { stash: { resource: { gold: 100 } }, trainingField: 0 },
};

test("should build a trainingField", {
  initState,
  commands: [VillageCommand.BuildTrainingField],
  expectedState: { village: { trainingField: 1 } },
});

test("should reduce the village resouce by the trainingField cost", {
  initState,
  commands: [VillageCommand.BuildTrainingField],
  expectedState: { village: { stash: { resource: { gold: 0 } } } },
});
