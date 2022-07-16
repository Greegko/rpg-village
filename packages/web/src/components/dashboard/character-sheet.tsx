import { identity } from "ramda";
import { useState } from "react";

import { BlacksmithCommand, EquipmentSlot, Item, UnitID } from "@rpg-village/core";

import { unitByIdSelector, useGameStateSelector, villageSelector } from "@web/store/game";
import { useExecuteCommandDispatch } from "@web/store/game-command";

import { ItemList } from "./item-list";
import { ItemStats } from "./item-stats";

import "./character-sheet.scss";

interface CharacterSheetProperties {
  unitId: UnitID;
}

export const CharacterSheet = ({ unitId }: CharacterSheetProperties) => {
  const unit = useGameStateSelector(state => unitByIdSelector(state, unitId));
  const village = useGameStateSelector(villageSelector);

  const executeCommand = useExecuteCommandDispatch();

  const [characterSelectedItem, setCharacterSelectedItem] = useState<Item | null>();
  const [stashSelectedItem, setStashSelectedItem] = useState<Item | null>();

  return (
    <div className="character-sheet">
      <div>Character Sheet</div>
      <div>{unit.name}</div>
      {characterSelectedItem && <ItemStats item={characterSelectedItem} />}
      <ItemList
        items={[unit.equipment.leftHand, unit.equipment.rightHand, unit.equipment.torso].filter(identity) as Item[]}
        onItemSelect={setCharacterSelectedItem}
        listSize={3}
        smallDisplay={true}
      ></ItemList>
      {characterSelectedItem && (
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
      <div>
        <div>
          Village Stash:
          <ItemList listSize={128} items={village.stash.items} onItemSelect={setStashSelectedItem} />
        </div>
        <div>{stashSelectedItem && <ItemStats item={stashSelectedItem} />}</div>
      </div>
    </div>
  );
};
