import { filter, partition, sum, values } from "rambda";

import {
  Command,
  GameState,
  MapCommand,
  MapLocationType,
  Party,
  PartyOwner,
  TrainingFieldCommand,
  VillageCommand,
  calculateUnitStrength,
} from "@rpg-village/core";
// TODO: Check this up!
import { PortalCommand } from "@rpg-village/core/dist/features/buildings/portal";

import { PartyAction, PartyActionType, PartyState } from "@web/store/ai";
import {
  entryPortalLocationForMapSelector,
  heroUnitsSelector,
  mapByPartyIdSelector,
  mapLocationByIdSelector,
  mapLocationByPartyIdSelector,
  mapLocationsByMapIdSelector,
  partiesOnLocationSelector,
  partiesSelector,
  unitsSelector,
  villagesSelector,
  worldMapIdSelector,
} from "@web/store/game";

import { sample } from "../lib";

export class PlayerPartyAI {
  execute(gameState: GameState, party: Party, partyState: PartyState): [PartyAction | null, Command | null] {
    const activeAction =
      (partyState.autoExplore && this.getNextPartyAction(gameState, party)) || partyState.action || null;

    if (activeAction === null) return [null, null];

    let clearAction = false;

    const command = this.getCommand(gameState, party, activeAction, () => (clearAction = true)) || null;

    if (!command) {
      console.warn("No command found for action: ", activeAction);
      return [null, null];
    }

    return [clearAction ? null : activeAction, command];
  }

  private getCommand(
    gameState: GameState,
    party: Party,
    partyAction: PartyAction,
    clearPartyAction: () => void,
  ): Command | undefined {
    const village = values(villagesSelector(gameState))[0];
    const currentMap = mapByPartyIdSelector(gameState, party.id)!;
    const worldMapId = worldMapIdSelector(gameState);
    const entryPortalLocationForMap = entryPortalLocationForMapSelector(gameState, currentMap.id);
    const partyMapLocation = mapLocationByPartyIdSelector(gameState, party.id);

    if (partyAction.type === PartyActionType.MoveToVillage) {
      if (currentMap.id !== worldMapId) {
        if (partyMapLocation.id !== entryPortalLocationForMap) {
          return {
            command: MapCommand.Travel,
            args: { partyId: party.id, targetLocationId: entryPortalLocationForMap },
          };
        }

        clearPartyAction();
        return {
          command: PortalCommand.EnterPortal,
          args: { portalId: village.buildings.portalSummoningStone?.portals[0].id!, partyId: party.id },
        };
      }

      clearPartyAction();

      if (village.locationId !== partyMapLocation.id) {
        return { command: MapCommand.Travel, args: { partyId: party.id, targetLocationId: village.locationId } };
      }
    }

    if (partyAction.type === PartyActionType.EnterPortal) {
      if (village.locationId !== partyMapLocation.id) {
        return { command: MapCommand.Travel, args: { partyId: party.id, targetLocationId: village.locationId } };
      }

      clearPartyAction();

      return {
        command: PortalCommand.EnterPortal,
        args: { portalId: village.buildings.portalSummoningStone?.portals[0].id!, partyId: party.id },
      };
    }

    if (partyAction.type === PartyActionType.Explore) {
      if (partyAction.args.targetLocationId !== partyMapLocation.id) {
        return {
          command: MapCommand.Travel,
          args: { partyId: party.id, targetLocationId: partyAction.args.targetLocationId },
        };
      }

      clearPartyAction();
      return { command: MapCommand.Explore, args: { partyId: party.id } };
    }

    if (partyAction.type === PartyActionType.Battle) {
      if (partyAction.args.targetLocationId !== partyMapLocation.id) {
        return {
          command: MapCommand.Travel,
          args: { partyId: party.id, targetLocationId: partyAction.args.targetLocationId },
        };
      }

      const targetLocation = mapLocationByIdSelector(gameState, partyAction.args.targetLocationId);
      if (!targetLocation.explored) {
        return { command: MapCommand.Explore, args: { partyId: party.id } };
      }

      clearPartyAction();
      return { command: MapCommand.Battle, args: { locationId: partyMapLocation.id } };
    }

    if (partyAction.type === PartyActionType.Heal) {
      if (village.locationId !== partyMapLocation.id) {
        return { command: MapCommand.Travel, args: { partyId: party.id, targetLocationId: village.locationId } };
      }

      clearPartyAction();
      return { command: VillageCommand.HealParty, args: { villageId: village.id, partyId: party.id } };
    }

    if (partyAction.type === PartyActionType.Training) {
      if (village.locationId !== partyMapLocation.id) {
        return { command: MapCommand.Travel, args: { partyId: party.id, targetLocationId: village.locationId } };
      }

      clearPartyAction();
      return { command: TrainingFieldCommand.Train, args: { villageId: village.id, partyId: party.id } };
    }

    if (partyAction.type === PartyActionType.Travel) {
      clearPartyAction();

      return {
        command: MapCommand.Travel,
        args: { partyId: party.id, targetLocationId: partyAction.args.targetLocationId },
      };
    }
  }

  private getNextPartyAction(gameState: GameState, party: Party): PartyAction | undefined {
    return (
      this.battleOnLocation(gameState, party) ||
      this.handlePartyHeal(gameState, party) ||
      this.searchWeakerEnemyLocation(gameState, party) ||
      this.searchUnexploredLocation(gameState, party) ||
      this.enterPortal(gameState, party)
    );
  }

  private battleOnLocation(gameState: GameState, party: Party): PartyAction | undefined {
    const partyMapLocation = mapLocationByPartyIdSelector(gameState, party.id);
    const isEnemyOnLocation = this.isEnemyOnTheLocation(gameState, partyMapLocation.id);
    if (isEnemyOnLocation) {
      return { type: PartyActionType.Battle, args: { targetLocationId: partyMapLocation.id } };
    }
  }

  private handlePartyHeal(gameState: GameState, party: Party): PartyAction | undefined {
    const heroes = heroUnitsSelector(gameState);
    if (party.unitIds.some(x => heroes[x].hp < heroes[x].maxhp * 0.1)) {
      return { type: PartyActionType.Heal };
    }
  }

  private searchUnexploredLocation(gameState: GameState, party: Party): PartyAction | undefined {
    const map = mapByPartyIdSelector(gameState, party.id);
    const mapLocations = mapLocationsByMapIdSelector(gameState, map!.id);

    const unexploredLocations = filter(
      location => !location.explored && location.type !== MapLocationType.Empty,
      mapLocations,
    );

    const newUnexploredLocation = sample(unexploredLocations);

    if (newUnexploredLocation) {
      return { type: PartyActionType.Explore, args: { targetLocationId: newUnexploredLocation.id } };
    }
  }

  private enterPortal(gameState: GameState, party: Party): PartyAction | undefined {
    return { type: PartyActionType.EnterPortal };
  }

  private searchWeakerEnemyLocation(gameState: GameState, party: Party): PartyAction | undefined {
    const map = mapByPartyIdSelector(gameState, party.id);
    const mapLocations = mapLocationsByMapIdSelector(gameState, map!.id);

    const partyStrength = this.getPartyStrength(gameState, party.id);

    const weakerUnitLocations = filter(location => {
      const [, [enemyParty]] = this.getPartiesOnLocation(gameState, location.id);

      if (!enemyParty) return false;

      const enemyPartyStrength = this.getPartyStrength(gameState, enemyParty.id);

      return partyStrength > enemyPartyStrength;
    }, mapLocations);

    const possibleLocations = weakerUnitLocations.filter(location => this.isEnemyOnTheLocation(gameState, location.id));

    const enemyLocation = sample(possibleLocations);

    if (enemyLocation) {
      return { type: PartyActionType.Battle, args: { targetLocationId: enemyLocation.id } };
    }
  }

  private getPartiesOnLocation(
    gameState: GameState,
    locationId: string,
  ): [UserParties: Party[], EnemyParties: Party[]] {
    const parties = partiesOnLocationSelector(gameState, locationId);

    return partition(party => party.owner === PartyOwner.Player, parties) as [Party[], Party[]];
  }

  private getPartyStrength(gameState: GameState, partyId: string) {
    const parties = partiesSelector(gameState);
    const units = unitsSelector(gameState);

    const partyUnits = (parties[partyId] as Party).unitIds.filter(unitId => units[unitId]).map(unitId => units[unitId]);

    return sum(partyUnits.map(calculateUnitStrength));
  }

  private isEnemyOnTheLocation(gameState: GameState, mapLocationId: string): boolean {
    return this.getPartiesOnLocation(gameState, mapLocationId)[1].length > 0;
  }
}
