import { Show, createComputed, createSignal } from "solid-js";

import { DungeonKey, ItemType, VillageBuildingCommand, VillageID } from "@rpg-village/bannerlords";

import { useGameExecuteCommand } from "@web/engine";
import { useGameStateSelector, villageByIdSelector } from "@web/store/game";

import { ItemList } from "./item-list";

export const OpenPortalPage = (props: { villageId: VillageID }) => {
  const executeCommand = useGameExecuteCommand();
  const village = useGameStateSelector(state => villageByIdSelector(state, props.villageId));
  const [dungeonKeys, setDungeonKeys] = createSignal<DungeonKey[]>([]);
  const [selectedDungeonKey, setSelectedDungeonKey] = createSignal<DungeonKey | undefined>();

  createComputed(() => {
    const keys = village().stash.items.filter(x => x.itemType === ItemType.DungeonKey);
    setDungeonKeys(keys as DungeonKey[]);
  });

  return (
    <div>
      <div>Open Portal Page</div>
      <Show when={selectedDungeonKey()}>
        <div>
          Dungeon Key details:
          <br />
          Name: {selectedDungeonKey()!.name}
          <button
            onClick={() =>
              executeCommand({
                command: VillageBuildingCommand.PortalSummoningStoneOpenPortal,
                args: { villageId: props.villageId, dungeonKeyId: selectedDungeonKey()!.id },
              })
            }
          >
            Open Portal
          </button>
        </div>
      </Show>
      <ItemList items={dungeonKeys()} listSize={60} onItemSelect={item => setSelectedDungeonKey(item as DungeonKey)} />
    </div>
  );
};
