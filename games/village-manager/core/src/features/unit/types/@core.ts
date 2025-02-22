import { Unit, UnitCommand, UnitCommandEquipItemArgs, UnitCommandUnequipItemArgs, UnitID } from "../interfaces";

declare module "@rpg-village/core/extend" {
  interface CommandType {
    [UnitCommand.EquipItem]: UnitCommandEquipItemArgs;
    [UnitCommand.UnequipItem]: UnitCommandUnequipItemArgs;
  }

  interface GameState {
    units: Record<UnitID, Unit>;
  }
}
