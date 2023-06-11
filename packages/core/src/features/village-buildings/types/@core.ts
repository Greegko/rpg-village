import { VillageBuildingsCommand } from "../interfaces";

declare module "@core" {
  export interface CommandType {
    [VillageBuildingsCommand.BuildBlacksmith]: undefined;
    [VillageBuildingsCommand.BuildTrainingField]: undefined;
    [VillageBuildingsCommand.BuildRuneWorkshop]: undefined;
    [VillageBuildingsCommand.BuildPortalSummonerStone]: undefined;
    [VillageBuildingsCommand.BuildShop]: undefined;
  }
}
