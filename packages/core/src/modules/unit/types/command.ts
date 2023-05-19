import { UnitCommand, UnitCommandEquipItemArgs, UnitCommandUnequipItemArgs } from "../interfaces";

declare module "@core" {
  export interface CommandType {
    [UnitCommand.EquipItem]: UnitCommandEquipItemArgs;
    [UnitCommand.UnequipItem]: UnitCommandUnequipItemArgs;
  }
}
