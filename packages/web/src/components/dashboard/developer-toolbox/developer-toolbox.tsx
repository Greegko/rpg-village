import { generate } from "shortid";
import { Show } from "solid-js";
import { unwrap } from "solid-js/store";

import {
  Armor,
  AttackEffectType,
  DebugCommand,
  DungeonKey,
  EffectType,
  ItemType,
  Rune,
  RuneAttackEffectType,
  Shield,
  VillageID,
  Weapon,
} from "@rpg-village/core";

import { sample } from "@lib/sample";
import { gameInstanceWrapper, useGameExecuteCommand } from "@web/engine";
import { gameStore } from "@web/store";
import {
  disableAI,
  enableAI,
  isAIEnabledSelector,
  pause,
  pausedSelector,
  resume,
  selectedVillageIdSelector,
  useGameUiStateSelector,
} from "@web/store/ui";

import "./developer-toolbox.scss";

export const DeveloperToolbox = () => {
  const isAIEnabled = useGameUiStateSelector(isAIEnabledSelector);
  const isPaused = useGameUiStateSelector(pausedSelector);
  const villageId = useGameUiStateSelector(selectedVillageIdSelector) as () => VillageID;
  const executeCommand = useGameExecuteCommand();

  const generateItem = (): Weapon | Armor | Shield => {
    const itemType = sample([ItemType.Armor, ItemType.Shield, ItemType.Weapon]) as
      | ItemType.Weapon
      | ItemType.Armor
      | ItemType.Shield;

    return {
      effects: [{ type: EffectType.Static, effectType: AttackEffectType.Dmg, value: 10, isPercentage: false }],
      id: generate(),
      name: generate(),
      itemType,
    };
  };

  const generateDungeonKey = (): DungeonKey => {
    return {
      effects: [],
      id: generate(),
      name: generate(),
      itemType: ItemType.DungeonKey,
    };
  };

  const generateRune = (): Rune => {
    return {
      id: generate(),
      name: generate(),
      itemType: ItemType.Rune,
      power: 100,
      soul: 10,
      effects: [{ type: EffectType.Dynamic, effectType: RuneAttackEffectType.Dmg }],
    };
  };

  return (
    <div class="developer-toolbox">
      <div>
        <Show when={isAIEnabled()}>
          <button class="block" onClick={disableAI}>
            Turn AI off
          </button>
        </Show>

        <Show when={!isAIEnabled()}>
          <button class="block" onClick={enableAI}>
            Turn AI on
          </button>
        </Show>

        <Show when={!isPaused()}>
          <button class="block" onClick={pause}>
            Pause
          </button>
        </Show>
        <Show when={isPaused()}>
          <button class="block" onClick={resume}>
            Resume
          </button>
        </Show>
        <button class="block" onClick={() => gameInstanceWrapper().localSave()}>
          Save
        </button>
        <button class="block" onClick={() => (gameInstanceWrapper().localReset(), window.location.reload())}>
          Reset
        </button>
        <button class="block" onClick={() => console.log(unwrap(gameStore))}>
          Log State
        </button>
      </div>
      <div>
        Turn:
        <button class="block" onClick={() => gameInstanceWrapper().fastForward(10)}>
          +10
        </button>
        <button class="block" onClick={() => gameInstanceWrapper().fastForward(100)}>
          +100
        </button>
        <button class="block" onClick={() => gameInstanceWrapper().fastForward(500)}>
          +500
        </button>
      </div>
      <Show when={villageId()} keyed>
        {villageId => (
          <>
            <div>
              Gold:
              <button
                class="block"
                onClick={() => executeCommand({ command: DebugCommand.GenerateGold, args: { villageId, gold: 10 } })}
              >
                +10
              </button>
              <button
                class="block"
                onClick={() => executeCommand({ command: DebugCommand.GenerateGold, args: { villageId, gold: 100 } })}
              >
                +100
              </button>
              <button
                class="block"
                onClick={() => executeCommand({ command: DebugCommand.GenerateGold, args: { villageId, gold: 1000 } })}
              >
                +1000
              </button>
            </div>
            <div>
              Soul:
              <button
                class="block"
                onClick={() => executeCommand({ command: DebugCommand.AddSoul, args: { villageId, soul: 10 } })}
              >
                +10
              </button>
              <button
                class="block"
                onClick={() => executeCommand({ command: DebugCommand.AddSoul, args: { villageId, soul: 100 } })}
              >
                +100
              </button>
              <button
                class="block"
                onClick={() => executeCommand({ command: DebugCommand.AddSoul, args: { villageId, soul: 1000 } })}
              >
                +1000
              </button>
            </div>
            <div>
              Items:
              <button
                class="block"
                onClick={() =>
                  executeCommand({ command: DebugCommand.AddItem, args: { villageId, item: generateRune() } })
                }
              >
                Add Rune
              </button>
              <button
                class="block"
                onClick={() =>
                  executeCommand({
                    command: DebugCommand.AddItem,
                    args: { villageId, item: generateDungeonKey() },
                  })
                }
              >
                Add Dungeon Key
              </button>
              <button
                class="block"
                onClick={() =>
                  executeCommand({ command: DebugCommand.AddItem, args: { villageId, item: generateItem() } })
                }
              >
                Add Item
              </button>
            </div>
          </>
        )}
      </Show>
    </div>
  );
};
