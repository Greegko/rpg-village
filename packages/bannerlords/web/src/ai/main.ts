import { forEach, keys, pickBy, values } from "remeda";
import { createComputed } from "solid-js";
import { createStore, unwrap } from "solid-js/store";

import { Command, GameState, MapCommand, VillageCommand } from "@rpg-village/bannerlords";

import { PartyType, getPartyType } from "../utils/party-type";
import { TimePhase, getTimePhase } from "../utils/time-phase";
import { getVectorAngle, getVectorDistance } from "../utils/vector";

enum VillagerAction {
  Idle,
  Travel,
  TradeInMarket,
  Disband,
}

type PartyID = string;

interface VillageState {
  activeVillagerId: PartyID | null;
}

interface VillagerState {
  action: VillagerAction;
}

interface AIState {
  commands: Command[];
  villages: Record<string, VillageState>;
  villagers: Record<string, VillagerState>;
}

const onKeyAdded = <K extends string, V>(path: () => Record<K, V>, fn: (key: K, value: V) => void) => {
  let prevState = {} as Record<K, V>;

  createComputed(() => {
    const currentState = path();

    forEach(keys(currentState) as K[], (currentStateKey: K) => {
      if (prevState[currentStateKey] === undefined) {
        fn(currentStateKey, currentState[currentStateKey]);
      }
    });

    prevState = currentState;
  });
};

const onKeyRemoved = <K extends string, V>(path: () => Record<K, V>, fn: (key: K, value: V) => void) => {
  let prevState = {} as Record<K, V>;

  createComputed(() => {
    const currentState = path();

    forEach(keys(prevState) as K[], (prevStateKey: K) => {
      if (currentState[prevStateKey] === undefined) {
        fn(prevStateKey, currentState[prevStateKey]);
      }
    });

    prevState = currentState;
  });
};

export const createAiHandler = (initialGameState: GameState) => {
  const [gameState, setAIGameState] = createStore<GameState>(initialGameState);

  const [aiState, setAiState] = createStore<AIState>({
    commands: [],
    villages: {},
    villagers: {},
  });

  onKeyAdded(
    () => gameState.villages,
    villageId => setAiState("villages", villageId, {}),
  );

  createComputed(() => {
    forEach(values(gameState.villages), village => {
      if (getTimePhase(gameState.general.turn) === TimePhase.Dawn) {
        setAiState("commands", commands => [
          ...commands,
          { command: VillageCommand.SpawnVillager, args: { villageId: village.id } },
        ]);
      }
    });
  });

  const villagerParties = () =>
    pickBy(gameState.parties, party => getPartyType(gameState, party.belongTo) === PartyType.Villager);

  onKeyAdded(
    () => villagerParties(),
    villagerId => setAiState("villages", villagerId, {}),
  );

  createComputed(() => {
    forEach(values(villagerParties()), villager => {
      const village = gameState.villages[villager.belongTo];
      const town = gameState.towns[village.belongTo];
      const townMapPosition = gameState.map[town.id];
      const villagerMapPosition = gameState.map[village.id];

      if (getVectorDistance(townMapPosition, villagerMapPosition) > 5) {
        setAiState("commands", commands => [
          ...commands,
          {
            command: MapCommand.SetEntityDirection,
            args: { entityId: villager.id, direction: getVectorAngle(villagerMapPosition, townMapPosition) },
          },
        ]);
      }
    });
  });

  const executeAI = (_gameState: GameState) => {
    setAIGameState(_gameState);

    const commands = unwrap(aiState.commands);
    setAiState("commands", []);

    return commands;
  };

  return { executeAI };
};
