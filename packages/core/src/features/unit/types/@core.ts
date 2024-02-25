import { Unit, UnitID } from "../interfaces";
import { UnitCommand, UnitCommandEquipItemArgs, UnitCommandUnequipItemArgs } from "../interfaces";

declare module "@core" {
  interface CommandType {
    [UnitCommand.EquipItem]: UnitCommandEquipItemArgs;
    [UnitCommand.UnequipItem]: UnitCommandUnequipItemArgs;
  }

  interface GameState {
    units: Record<UnitID, Unit>;
  }
}
