import { identity, values } from "rambda";
import { Show, createComputed, createSignal, on } from "solid-js";

import { BlacksmithCommand, Item, ItemType, RuneWorkshopCommand, UnitCommand, UnitID } from "@rpg-village/core";

import { useGameExecuteCommand } from "@web/engine";
import { unitByIdSelector, useGameStateSelector, villageByIdSelector } from "@web/store/game";
import { selectedVillageIdSelector, useGameUiStateSelector } from "@web/store/ui";

import { ItemList } from "./item-list";
import { ItemStats } from "./item-stats";

import "./character-sheet.scss";

interface CharacterSheetProperties {
  unitId: UnitID;
}

export const CharacterSheet = (props: CharacterSheetProperties) => {
  const [characterSelectedItem, setCharacterSelectedItem] = createSignal<Item | null>();
  const [stashSelectedItem, setStashSelectedItem] = createSignal<Item | null>();

  const unit = useGameStateSelector(state => unitByIdSelector(state, props.unitId));

  const villageId = useGameUiStateSelector(selectedVillageIdSelector);

  const village = useGameStateSelector(state => villageByIdSelector(state, villageId()!));

  const executeCommand = useGameExecuteCommand();

  createComputed(
    on([unit, village], () => {
      setCharacterSelectedItem(null);
      setStashSelectedItem(null);
    }),
  );

  const userEquipment = () => values(unit().equipment).filter(identity) as Item[];

  return (
    <div class="character-sheet">
      <div>Character Sheet</div>
      <div>{unit().name}</div>

      <Show when={characterSelectedItem()} keyed>
        {characterSelectedItem => <ItemStats item={characterSelectedItem} />}
      </Show>

      <ItemList
        items={userEquipment()}
        onItemSelect={setCharacterSelectedItem}
        listSize={6}
        smallDisplay={true}
        hideEmpty={true}
      ></ItemList>

      <Show when={characterSelectedItem()} keyed>
        {characterSelectedItem => (
          <>
            <button
              onClick={() =>
                executeCommand({
                  command: BlacksmithCommand.UpgradeItem,
                  args: { unitId: unit().id, itemId: characterSelectedItem.id },
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
                    unitId: unit().id,
                    itemId: characterSelectedItem.id,
                  },
                });

                setCharacterSelectedItem(null);
              }}
            >
              Unequipe
            </button>
          </>
        )}
      </Show>

      <Show when={villageId()} keyed>
        {villageId => (
          <>
            <div>
              Village Stash:
              <ItemList listSize={128} items={village().stash.items} onItemSelect={setStashSelectedItem} />
            </div>
            <div>
              <Show when={stashSelectedItem()} keyed>
                {stashSelectedItem => (
                  <>
                    <ItemStats item={stashSelectedItem} />

                    <button
                      onClick={() =>
                        executeCommand({
                          command: UnitCommand.EquipItem,
                          args: { unitId: unit().id, itemId: stashSelectedItem.id },
                        })
                      }
                    >
                      Equipe
                    </button>

                    <Show when={stashSelectedItem.itemType === ItemType.Rune}>
                      <button
                        onClick={() =>
                          executeCommand({
                            command: RuneWorkshopCommand.EmpowerRune,
                            args: { villageId: villageId, runeId: stashSelectedItem.id, soul: 1 },
                          })
                        }
                      >
                        Empower
                      </button>

                      <button
                        onClick={() =>
                          executeCommand({
                            command: RuneWorkshopCommand.DismantleRune,
                            args: { villageId: villageId, runeId: stashSelectedItem.id },
                          })
                        }
                      >
                        Dismantle
                      </button>
                    </Show>
                  </>
                )}
              </Show>
            </div>
          </>
        )}
      </Show>
    </div>
  );
};
