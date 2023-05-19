import "@core/command";

import { UnitCommand, UnitCommandEquipItemArgs, UnitCommandUnequipItemArgs } from "../interfaces";

declare module "@core/command" {
  interface CommandType {
    [UnitCommand.EquipItem]: UnitCommandEquipItemArgs;
    [UnitCommand.UnequipItem]: UnitCommandUnequipItemArgs;
  }
}
