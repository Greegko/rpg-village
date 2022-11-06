import { identity } from "ramda";
import { useEffect, useMemo, useState } from "react";

import {
  BlacksmithCommand,
  Item,
  ItemType,
  RuneWorkshopCommand,
  StashLocation,
  UnitCommand,
  UnitID,
} from "@rpg-village/core";

import { useGameExecuteCommand } from "@web/react-hooks";
import { unitByIdSelector, useGameStateSelector, villageSelector } from "@web/store/game";

import { ItemList } from "./item-list";
import { ItemStats } from "./item-stats";

import "./character-sheet.scss";

interface CharacterSheetProperties {
  unitId: UnitID;
}

export const CharacterSheet = ({ unitId }: CharacterSheetProperties) => {
  const unit = useGameStateSelector(state => unitByIdSelector(state, unitId));

  const village = useGameStateSelector(villageSelector);

  const executeCommand = useGameExecuteCommand();

  useEffect(() => {
    setCharacterSelectedItem(null);
    setStashSelectedItem(null);
  }, [unit.equipment, village.stash]);

  const [characterSelectedItem, setCharacterSelectedItem] = useState<Item | null>();
  const [stashSelectedItem, setStashSelectedItem] = useState<Item | null>();

  const userEquipment = useMemo(
    () => [unit.equipment.leftHand, unit.equipment.rightHand, unit.equipment.torso].filter(identity) as Item[],
    [unit.equipment],
  );

  return (
    <div className="character-sheet">
      <div>Character Sheet</div>
      <div>{unit.name}</div>
      {characterSelectedItem && <ItemStats item={characterSelectedItem} />}
      <ItemList
        items={userEquipment}
        onItemSelect={setCharacterSelectedItem}
        listSize={3}
        smallDisplay={true}
      ></ItemList>
      {characterSelectedItem && (
        <>
          <button
            onClick={() =>
              executeCommand({
                command: BlacksmithCommand.UpgradeItem,
                args: { unitId: unit.id, itemId: characterSelectedItem.id },
              })
            }
          >
            Upgrade
          </button>
          <button
            onClick={() => {
              executeCommand({
                command: UnitCommand.UnequipItem,
                args: {
                  unitId: unit.id,
                  itemId: characterSelectedItem.id,
                  stash: StashLocation.Village,
                },
              });

              setCharacterSelectedItem(null);
            }}
          >
            Unequipe
          </button>
        </>
      )}
      <div>
        <div>
          Village Stash:
          <ItemList listSize={128} items={village.stash.items} onItemSelect={setStashSelectedItem} />
        </div>
        <div>
          {stashSelectedItem && (
            <>
              <ItemStats item={stashSelectedItem} />

              <button
                onClick={() =>
                  executeCommand({
                    command: UnitCommand.EquipItem,
                    args: {
                      unitId: unit.id,
                      itemId: stashSelectedItem.id,
                      stash: StashLocation.Village,
                    },
                  })
                }
              >
                Equipe
              </button>

              {stashSelectedItem.itemType === ItemType.Rune && (
                <button
                  onClick={() =>
                    executeCommand({
                      command: RuneWorkshopCommand.EmpowerRune,
                      args: {
                        runeId: stashSelectedItem.id,
                        soul: 1,
                      },
                    })
                  }
                >
                  Empower
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
