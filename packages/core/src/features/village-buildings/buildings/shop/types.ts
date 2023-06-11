import { VillageBuildingsCommand } from "../../interfaces";

declare module "@core" {
  export interface CommandType {
    [VillageBuildingsCommand.GenerateShopItems]: undefined;
  }
}
