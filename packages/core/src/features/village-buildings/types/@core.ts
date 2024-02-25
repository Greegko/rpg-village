import { VillageBuildingsCommand } from "../interfaces";

declare module "@core" {
  interface CommandType {
    [VillageBuildingsCommand.BuildBlacksmith]: undefined;
    [VillageBuildingsCommand.BuildTrainingField]: undefined;
    [VillageBuildingsCommand.BuildRuneWorkshop]: undefined;
    [VillageBuildingsCommand.BuildPortalSummonerStone]: undefined;
    [VillageBuildingsCommand.BuildShop]: undefined;
  }
}
