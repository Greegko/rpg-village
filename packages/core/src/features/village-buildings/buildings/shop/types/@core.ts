import { VillageBuildingsCommand } from "../../../interfaces";

declare module "@core" {
  interface CommandType {
    [VillageBuildingsCommand.GenerateShopItems]: undefined;
  }
}
