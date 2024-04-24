import { forEach, pickBy, values } from "remeda";
import { createComputed, untrack } from "solid-js";
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

interface VillagerState {
  action: VillagerAction;
}

interface AIState {
  commands: Command[];
}

export const createAiHandler = (initialGameState: GameState) => {
  const [gameState, setAIGameState] = createStore<GameState>(initialGameState);

  const [aiState, setAiState] = createStore<AIState>({
    commands: [],
  });

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
    pickBy(gameState.parties, party => untrack(() => getPartyType(gameState, party.belongTo) === PartyType.Villager));

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

  const executeAI = (gameState: GameState) => {
    setAIGameState(gameState);

    const commands = unwrap(aiState.commands);
    setAiState("commands", []);

    return commands;
  };

  return { executeAI };
};
