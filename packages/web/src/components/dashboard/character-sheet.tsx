import { values } from "ramda";
import { connect } from "react-redux";
import { BlacksmithCommand, EquipmentSlot, Unit, UnitID } from "@rpg-village/core";
import { ExecuteCommand, GameStoreState, heroUnitsSelector } from "../../game";

interface CharacterSheetProperties {
  unitId: UnitID;
}

const propertyMapper = (state: GameStoreState, props: CharacterSheetProperties): CharacterSheetState => ({
  unit: values(heroUnitsSelector(state.game)).find(({ id }) => id === props.unitId)!,
});

interface CharacterSheetState {
  unit: Unit;
}

import "./character-sheet.scss";
export const CharacterSheet = connect(
  propertyMapper,
  ExecuteCommand,
)(({ unit, executeCommand }: CharacterSheetState & ExecuteCommand) => (
  <div className="character-sheet">
    <div>Character Sheet</div>
    <div>{unit.name}</div>
    <div>Equipment</div>
    <div>Right Hand: {unit.equipment.rightHand.name}</div>
    <button
      onClick={() =>
        executeCommand({
          command: BlacksmithCommand.UpgradeItem,
          args: { unitId: unit.id, equipmentSlot: EquipmentSlot.RightHand },
        })
      }
    >
      Upgrade {unit.equipment.rightHand.name}
    </button>
    <div>Left Hand: {unit.equipment.leftHand.name}</div>
    <button
      onClick={() =>
        executeCommand({
          command: BlacksmithCommand.UpgradeItem,
          args: { unitId: unit.id, equipmentSlot: EquipmentSlot.LeftHand },
        })
      }
    >
      Upgrade {unit.equipment.leftHand.name}
    </button>
    <div>Torso: {unit.equipment.torso.name}</div>
    <button
      onClick={() =>
        executeCommand({
          command: BlacksmithCommand.UpgradeItem,
          args: { unitId: unit.id, equipmentSlot: EquipmentSlot.Torso },
        })
      }
    >
      Upgrade {unit.equipment.torso.name}
    </button>
  </div>
));
