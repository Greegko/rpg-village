import { forEach, groupBy, values } from "remeda";
import { createStore } from "solid-js/store";

import { Command, GameState, MapCommand, VillageCommand } from "@rpg-village/bannerlords";

import { PartyType, PartyTypes, getPartyType } from "../utils/party-type";
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
  villages: Record<string, VillageState>;
  villagers: Record<string, VillagerState>;
}

const [aiState, setAiState] = createStore<AIState>({
  villages: {},
  villagers: {},
});

export const executeAI = (gameState: GameState) => {
  const commands = [] as Command[];
  const turn = gameState.general.turn;
  const villages = gameState.villages;
  const partyGroups = groupBy(values(gameState.parties), x =>
    getPartyType(gameState, x.belongTo),
  ) as unknown as PartyTypes;

  forEach(values(villages), village => {
    if (aiState.villages[village.id] === undefined) {
      setAiState("villages", village.id, {});
    }
  });

  forEach(values(villages), village => {
    if (getTimePhase(turn) === TimePhase.Dawn) {
      commands.push({ command: VillageCommand.SpawnVillager, args: { villageId: village.id } });
    }
  });

  forEach(partyGroups[PartyType.Villager] || [], villager => {
    if (aiState.villagers[villager.id] === undefined) {
      setAiState("villagers", villager.id, {});
    }
  });

  forEach(partyGroups[PartyType.Villager] || [], villager => {
    const village = gameState.villages[villager.belongTo];
    const town = gameState.towns[village.belongTo];
    const townMapPosition = gameState.map[town.id];
    const villagerMapPosition = gameState.map[village.id];

    if (getVectorDistance(townMapPosition, villagerMapPosition) > 5) {
      commands.push({
        command: MapCommand.SetEntityDirection,
        args: { entityId: villager.id, direction: getVectorAngle(villagerMapPosition, townMapPosition) },
      });
    }
  });

  return commands;
};
