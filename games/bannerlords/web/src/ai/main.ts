import { forEach, pickBy, values } from "remeda";
import { filter } from "rxjs";
import { createSignal, untrack } from "solid-js";
import { createStore } from "solid-js/store";

import { Command, GameState, MapCommand, TownCommand, VillageCommand } from "@rpg-village/bannerlords-core";
import { Actor } from "@rpg-village/utils/actor";
import { MapObservator } from "@rpg-village/utils/map-observator";
import { getVectorAngle } from "@rpg-village/utils/node";

import { PartyType, getPartyType } from "../utils/party-type";
import { asObservable, onEvent, onKeyAdded, onValueChanges } from "../utils/signal";
import { TimePhase, getTimePhase } from "../utils/time";
import { villagerActorFactory } from "./actors/villager-actor";

export const createAiHandler = (initialGameState: GameState) => {
  const [gameState, setAIGameState] = createStore<GameState>(initialGameState);
  const mapObservator = new MapObservator();

  const [aiCommands, setAiCommands] = createSignal<Command[]>([]);

  const gameTimePhase = () => getTimePhase(gameState.general.turn);

  const queueCommand = (command: Command) => setAiCommands(commands => [...commands, command]);

  onEvent(
    () => gameTimePhase() === TimePhase.Dawn,
    () => {
      forEach(values(gameState.villages), village => {
        queueCommand({ command: VillageCommand.SpawnVillager, args: { villageId: village.id } });
      });
    },
  );

  const villagerParties = () =>
    pickBy(gameState.parties, party => untrack(() => getPartyType(gameState, party.belongTo) === PartyType.Villager));

  onKeyAdded(
    () => gameState.parties,
    partyId => mapObservator.moveEntity(partyId, gameState.map[partyId]),
  );

  const actors: Actor<any, any>[] = [];

  onKeyAdded(
    () => villagerParties(),
    (villagerId, villager) => {
      const villagerActor = villagerActorFactory(
        {
          getMapPosition: (entityId: string) => gameState.map[entityId],
        },
        {
          pickUpResouceFromVillage: ({}, { villagerId, villageId }) =>
            queueCommand({ command: VillageCommand.TakeResource, args: { villageId, villagerId } }),
          disband: ({}, { villagerId, villageId }) =>
            queueCommand({ command: VillageCommand.DisbandVillager, args: { villageId, villagerId } }),
          travelToTown: ({ getMapPosition }, { villagerId, townId }) =>
            queueCommand({
              command: MapCommand.SetEntityDirection,
              args: {
                entityId: villagerId,
                direction: getVectorAngle(getMapPosition(villagerId), getMapPosition(townId)),
              },
            }),
          leaveTown: ({}, { villagerId, townId }) =>
            queueCommand({
              command: TownCommand.LeaveTown,
              args: { partyId: villagerId, townId },
            }),
          leaveVillage: ({}, { villagerId, villageId }) =>
            queueCommand({
              command: VillageCommand.LeaveVillage,
              args: { partyId: villagerId, villageId },
            }),
          travelToVillage: ({ getMapPosition }, { villagerId, villageId }) =>
            queueCommand({
              command: MapCommand.SetEntityDirection,
              args: {
                entityId: villagerId,
                direction: getVectorAngle(getMapPosition(villagerId), getMapPosition(villageId)),
              },
            }),
          enterTown: ({}, { villagerId, townId }) =>
            queueCommand({ command: TownCommand.EnterTown, args: { partyId: villagerId, townId } }),
          enterVillage: ({}, { villagerId, villageId }) =>
            queueCommand({
              command: VillageCommand.EnterVillage,
              args: { partyId: villagerId, villageId },
            }),
        },
        {
          townInEntryDistance: ({ getMapPosition }, { villagerId, townId }) =>
            mapObservator.onEventByPosition(getMapPosition(townId), 2).pipe(filter(x => x.entityId === villagerId)),
          villageInEntryDistance: ({ getMapPosition }, { villagerId, villageId }) =>
            mapObservator.onEventByPosition(getMapPosition(villageId), 2).pipe(filter(x => x.entityId === villagerId)),

          resourcePickedFromVillage: ({}, { villagerId }) => asObservable(() => gameState.parties[villagerId].stash.items.length > 0),
          enteredInTown: ({}, { villagerId, townId }) =>
            asObservable(() => gameState.towns[townId].parties.includes(villagerId)).pipe(filter(x => x)),
          enteredInVillage: ({}, { villagerId, villageId }) =>
            asObservable(() => gameState.villages[villageId].parties.includes(villagerId)).pipe(filter(x => x)),
          townLeft: ({}, { villagerId, townId }) =>
            asObservable(() => !gameState.towns[townId].parties.includes(villagerId)).pipe(filter(x => x)),
          villageLeft: ({}, { villagerId, villageId }) =>
            asObservable(() => !gameState.villages[villageId].parties.includes(villagerId)).pipe(filter(x => x)),

          onDusk: () => asObservable(gameTimePhase).pipe(filter(x => x === TimePhase.Dusk)),
        },
        {
          villageId: villager.belongTo,
          villagerId,
          townId: gameState.villages[villager.belongTo].belongTo,
          marketFinished: false,
        },
      );

      villagerActor.start();
      actors.push(villagerActor);
    },
  );

  onKeyAdded(
    () => gameState.towns,
    townId => mapObservator.moveEntity(townId, gameState.map[townId]),
  );

  onKeyAdded(
    () => gameState.villages,
    villageId => mapObservator.moveEntity(villageId, gameState.map[villageId]),
  );

  onKeyAdded(
    () => villagerParties(),
    villagerId => mapObservator.moveEntity(villagerId, gameState.map[villagerId]),
  );

  onValueChanges(
    () => gameState.map,
    (entityId, position) => mapObservator.moveEntity(entityId, position),
  );

  const executeAI = (gameState: GameState) => {
    setAIGameState(gameState);

    const commands = aiCommands();

    setAiCommands([]);

    return commands;
  };

  return { executeAI };
};
