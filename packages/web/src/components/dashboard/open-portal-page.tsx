import { useEffect, useState } from "react";

import { DungeonKey, ItemType, PortalsCommand } from "@rpg-village/core";

import { useGameStateSelector, villageSelector } from "@web/store/game";
import { useExecuteCommandDispatch } from "@web/store/game-command";

import { ItemList } from "./item-list";

export const OpenPortalPage = () => {
  const village = useGameStateSelector(villageSelector);
  const executeCommand = useExecuteCommandDispatch();
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
              executeCommand({ command: PortalsCommand.OpenPortal, args: { dungeonKeyId: selectedDungeonKey.id } })
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
