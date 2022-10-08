import { filter, partition, sum, values } from "ramda";

import {
  Command,
  GameState,
  MapCommand,
  Party,
  PartyOwner,
  VillageCommand,
  calculateUnitStrength,
} from "@rpg-village/core";

import { PartyAction, PartyActionType, PartyState } from "@web/store/ai";
import {
  heroUnitsSelector,
  mapByPartyIdSelector,
  mapLocationByIdSelector,
  mapLocationsByMapIdSelector,
  partiesSelector,
  unitsSelector,
  villageSelector,
} from "@web/store/game";

import { sample } from "../lib";

export class PlayerPartyAI {
  execute(gameState: GameState, party: Party, partyState: PartyState): [PartyAction, Command] | null {
    const activeAction = (partyState.autoExplore && this.getNextPartyAction(gameState, party)) || null;

    if (activeAction === null) return null;

    const command = this.getCommand(gameState, party, activeAction);

    if (!command) {
      console.warn("No command found for action: ", activeAction);
      return null;
    }

    return [activeAction, command];
  }

  private getCommand(gameState: GameState, party: Party, partyAction: PartyAction): Command | undefined {
    const village = villageSelector(gameState);

    if (partyAction.type === PartyActionType.MoveToVillage) {
      if (village.locationId !== party.locationId) {
        return { command: MapCommand.Travel, args: { partyId: party.id, targetLocationId: village.locationId } };
      }
    }

    if (partyAction.type === PartyActionType.Explore) {
      if (partyAction.args.targetLocationId !== party.locationId) {
        return {
          command: MapCommand.Travel,
          args: { partyId: party.id, targetLocationId: partyAction.args.targetLocationId },
        };
      }

      return { command: MapCommand.Explore, args: { partyId: party.id } };
    }

    if (partyAction.type === PartyActionType.Battle) {
      if (partyAction.args.targetLocationId !== party.locationId) {
        return {
          command: MapCommand.Travel,
          args: { partyId: party.id, targetLocationId: partyAction.args.targetLocationId },
        };
      }

      const targetLocation = mapLocationByIdSelector(gameState, partyAction.args.targetLocationId);
      if (!targetLocation.explored) {
        return { command: MapCommand.Explore, args: { partyId: party.id } };
      }

      return { command: MapCommand.Battle, args: { locationId: party.locationId } };
    }

    if (partyAction.type === PartyActionType.Heal) {
      if (village.locationId !== party.locationId) {
        return { command: MapCommand.Travel, args: { partyId: party.id, targetLocationId: village.locationId } };
      }

      return { command: VillageCommand.HealParty, args: { partyId: party.id } };
    }

    if (partyAction.type === PartyActionType.Travel) {
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
      this.searchUnexploredLocation(gameState, party)
    );
  }

  private battleOnLocation(gameState: GameState, party: Party): PartyAction | undefined {
    const isEnemyOnLocation = this.isEnemyOnTheLocation(gameState, party.locationId);
    if (isEnemyOnLocation) {
      return { type: PartyActionType.Battle, args: { targetLocationId: party.locationId } };
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

    const unexploredLocations = filter(location => !location.explored, mapLocations);

    const newUnexploredLocation = sample(unexploredLocations);

    if (newUnexploredLocation) {
      return { type: PartyActionType.Explore, args: { targetLocationId: newUnexploredLocation.id } };
    }
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
    const parties = partiesSelector(gameState);

    return partition(
      party => party.owner === PartyOwner.Player,
      values(parties).filter(x => x.locationId === locationId),
    ) as [Party[], Party[]];
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
