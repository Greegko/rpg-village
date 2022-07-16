import { identity } from "ramda";
import { useState } from "react";

import { BlacksmithCommand, EquipmentSlot, Item, UnitID } from "@rpg-village/core";

import { unitByIdSelector, useGameStateSelector } from "@web/store/game";
import { useExecuteCommandDispatch } from "@web/store/game-command";

import { ItemList } from "./item-list";
import { ItemStats } from "./item-stats";

import "./character-sheet.scss";

interface CharacterSheetProperties {
  unitId: UnitID;
}

export const CharacterSheet = ({ unitId }: CharacterSheetProperties) => {
  const unit = useGameStateSelector(state => unitByIdSelector(state, unitId));
  const executeCommand = useExecuteCommandDispatch();

  const [selectedItem, setSelectedItem] = useState<Item>();

  return (
    <div className="character-sheet">
      <div>Character Sheet</div>
      <div>{unit.name}</div>

      {selectedItem && <ItemStats item={selectedItem} />}

      <ItemList
        items={[unit.equipment.leftHand, unit.equipment.rightHand, unit.equipment.torso].filter(identity) as Item[]}
        onItemSelect={setSelectedItem}
        listSize={6}
        selectable={true}
        smallDisplay={true}
      ></ItemList>

      {selectedItem && (
        <button
          onClick={() =>
            executeCommand({
              command: BlacksmithCommand.UpgradeItem,
              args: { unitId: unit.id, equipmentSlot: EquipmentSlot.Torso },
            })
          }
        >
          Upgrade
        </button>
      )}
    </div>
  );
};
