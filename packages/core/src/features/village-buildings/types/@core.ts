import {
  VillageBuildingBuildShopArgs,
  VillageBuildingCommandBuildBlacksmithArgs,
  VillageBuildingCommandBuildPortalSummonerStoneArgs,
  VillageBuildingCommandBuildRuneWorkshopArgs,
  VillageBuildingCommandBuildTrainingFieldArgs,
  VillageBuildingsCommand,
} from "../interfaces";

declare module "@core" {
  interface CommandType {
    [VillageBuildingsCommand.BuildBlacksmith]: VillageBuildingCommandBuildBlacksmithArgs;
    [VillageBuildingsCommand.BuildTrainingField]: VillageBuildingCommandBuildRuneWorkshopArgs;
    [VillageBuildingsCommand.BuildRuneWorkshop]: VillageBuildingBuildShopArgs;
    [VillageBuildingsCommand.BuildPortalSummonerStone]: VillageBuildingCommandBuildTrainingFieldArgs;
    [VillageBuildingsCommand.BuildShop]: VillageBuildingCommandBuildPortalSummonerStoneArgs;
  }
}
