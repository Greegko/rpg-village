import { useDispatch } from "react-redux";
import { generate } from "shortid";

import { Armor, AttackEffectType, DebugCommand, DungeonKey, ItemType, Rune, Shield, Weapon } from "@rpg-village/core";

import { sample } from "@lib/sample";
import { fastForward, logState, reset, save, useExecuteCommandDispatch } from "@web/store/game-command";
import {
  disableAI,
  enableAI,
  isAIEnabledSelector,
  pause,
  pausedSelector,
  resume,
  useGameUISelector,
} from "@web/store/game-ui";

import "./developer-toolbox.scss";

export const DeveloperToolbox = () => {
  const isAIEnabled = useGameUISelector(isAIEnabledSelector);
  const isPaused = useGameUISelector(pausedSelector);
  const dispatch = useDispatch();
  const executeCommand = useExecuteCommandDispatch();

  const generateItem = (): Weapon | Armor | Shield => {
    const itemType = sample([ItemType.Armor, ItemType.Shield, ItemType.Weapon]) as
      | ItemType.Weapon
      | ItemType.Armor
      | ItemType.Shield;

    return {
      effects: [{ type: AttackEffectType.Dmg, value: 10, isPercentage: false }],
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
      effects: [],
      id: generate(),
      name: generate(),
      itemType: ItemType.Rune,
    };
  };

  return (
    <div className="developer-toolbox">
      <div>
        {isAIEnabled && <button onClick={() => dispatch(disableAI())}>Turn AI off</button>}
        {!isAIEnabled && <button onClick={() => dispatch(enableAI())}>Turn AI on</button>}
        {!isPaused && <button onClick={() => dispatch(pause())}>Pause</button>}
        {isPaused && <button onClick={() => dispatch(resume())}>Resume</button>}
        <button onClick={() => dispatch(save())}>Save</button>
        <button onClick={() => dispatch(reset())}>Reset</button>
        <button onClick={() => dispatch(logState())}>Log State</button>
      </div>
      <div>
        Turn:
        <button onClick={() => dispatch(fastForward(10))}>+10</button>
        <button onClick={() => dispatch(fastForward(100))}>+100</button>
        <button onClick={() => dispatch(fastForward(500))}>+500</button>
      </div>
      <div>
        Gold:
        <button onClick={() => executeCommand({ command: DebugCommand.GenerateGold, args: { gold: 10 } })}>+10</button>
        <button onClick={() => executeCommand({ command: DebugCommand.GenerateGold, args: { gold: 100 } })}>
          +100
        </button>
        <button onClick={() => executeCommand({ command: DebugCommand.GenerateGold, args: { gold: 1000 } })}>
          +1000
        </button>
      </div>
      <div>
        Items:
        <button onClick={() => executeCommand({ command: DebugCommand.AddItem, args: { item: generateRune() } })}>
          Add Rune
        </button>
        <button onClick={() => executeCommand({ command: DebugCommand.AddItem, args: { item: generateDungeonKey() } })}>
          Add Dungeon Key
        </button>
        <button onClick={() => executeCommand({ command: DebugCommand.AddItem, args: { item: generateItem() } })}>
          Add Item
        </button>
      </div>
    </div>
  );
};
