import { useEffect, useState } from "react";

import { DungeonKey, ItemType, VillageBuildingCommand, VillageID } from "@rpg-village/core";

import { useGameExecuteCommand } from "@web/react-hooks";
import { useGameStateSelector, villageByIdSelector } from "@web/store/game";

import { ItemList } from "./item-list";

export const OpenPortalPage = (props: { villageId: VillageID }) => {
  const village = useGameStateSelector(state => villageByIdSelector(state, props.villageId));
  const executeCommand = useGameExecuteCommand();
  const [dungeonKeys, setDungeonKeys] = useState<DungeonKey[]>([]);
  const [selectedDungeonKey, setSelectedDungeonKey] = useState<DungeonKey | undefined>();

  useEffect(() => {
    const keys = village.stash.items.filter(x => x.itemType === ItemType.DungeonKey);
    setDungeonKeys(keys as DungeonKey[]);
  }, [village.stash.items]);

  return (
    <div>
      <div>Open Portal Page</div>

      {selectedDungeonKey && (
        <div>
          Dungeon Key details:
          <br />
          Name: {selectedDungeonKey.name}
          <button
            onClick={() =>
              executeCommand({
                command: VillageBuildingCommand.PortalSummoningStoneOpenPortal,
                args: { villageId: props.villageId, dungeonKeyId: selectedDungeonKey.id },
              })
            }
          >
            Open Portal
          </button>
        </div>
      )}

      <ItemList items={dungeonKeys} listSize={60} onItemSelect={item => setSelectedDungeonKey(item as DungeonKey)} />
    </div>
  );
};
