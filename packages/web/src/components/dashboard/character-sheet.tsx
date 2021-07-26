import { values } from "ramda";
import { connect } from "react-redux";
import {
  AttackEffectType,
  BlacksmithCommand,
  DefenseEffectType,
  EquipmentSlot,
  Item,
  Unit,
  UnitID,
} from "@rpg-village/core";
import { ExecuteCommand, GameStoreState, heroUnitsSelector, translate } from "../../game";

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
    <ItemStats item={unit.equipment.rightHand} />

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
    <ItemStats item={unit.equipment.leftHand} />
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
    <ItemStats item={unit.equipment.torso} />
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

const ItemStats = ({ item }: { item: Item }) => (
  <div>
    <div>Name: {item.name}</div>
    <div>Stats</div>
    {item.effects.map((effect, i) => (
      <div key={i}>
        <span>
          {AttackEffectType[effect.type] && translate("core.model.attackEffectType")[effect.type as AttackEffectType]}
          {DefenseEffectType[effect.type] &&
            translate("core.model.defenseEffectType")[effect.type as DefenseEffectType]}
        </span>
        <span>{effect.value}</span>
      </div>
    ))}
  </div>
);
