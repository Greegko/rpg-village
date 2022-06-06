import { AttackEffectType, BlacksmithCommand, DefenseEffectType, EquipmentSlot, Item, UnitID } from "@rpg-village/core";

import { unitByIdSelector, useGameStateSelector } from "@web/store/game";
import { useExecuteCommandDispatch } from "@web/store/game-command";

import { translate } from "../../game";

import "./character-sheet.scss";

interface CharacterSheetProperties {
  unitId: UnitID;
}

export const CharacterSheet = ({ unitId }: CharacterSheetProperties) => {
  const unit = useGameStateSelector(state => unitByIdSelector(state, unitId));
  const executeCommand = useExecuteCommandDispatch();

  return (
    <div className="character-sheet">
      <div>Character Sheet</div>
      <div>{unit.name}</div>
      <div>Equipment</div>

      {unit.equipment.rightHand && (
        <>
          <ItemStats item={unit.equipment.rightHand} />

          <button
            onClick={() =>
              executeCommand({
                command: BlacksmithCommand.UpgradeItem,
                args: { unitId: unit.id, equipmentSlot: EquipmentSlot.RightHand },
              })
            }
          >
            Upgrade {unit.equipment.rightHand?.name}
          </button>
        </>
      )}

      {unit.equipment.leftHand && (
        <>
          <ItemStats item={unit.equipment.leftHand} />
          <button
            onClick={() =>
              executeCommand({
                command: BlacksmithCommand.UpgradeItem,
                args: { unitId: unit.id, equipmentSlot: EquipmentSlot.LeftHand },
              })
            }
          >
            Upgrade {unit.equipment.leftHand?.name}
          </button>
        </>
      )}

      {unit.equipment.torso && (
        <>
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
        </>
      )}
    </div>
  );
};

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
