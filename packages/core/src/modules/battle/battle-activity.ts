import { inject, injectable } from "inversify";
import { add, complement, mergeDeepWith, prop } from "ramda";

import { ModuleConfig } from "@core/global-type";
import { ModuleConfigToken } from "@core/module/tokens";

import { Activity, IActivityHandler } from "@modules/activity";
import { PartyID, PartyService } from "@modules/party";
import { isAlive } from "@modules/unit";
import { VillageStashService } from "@modules/village";
import { VillageConfig } from "@modules/village/interfaces/village-config";

import { BattleService } from "./battle-service";
import { BattleID } from "./interfaces";
import { calculateLoot, calculateXpGain } from "./lib";

export type BattleState = { battleId: BattleID };
export type BattleStartArgs = { partyId: PartyID; involvedPartyId: PartyID };

@injectable()
export class BattleActivity implements IActivityHandler<BattleStartArgs, BattleState> {
  constructor(
    private partyService: PartyService,
    private battleService: BattleService,
    private villageStashService: VillageStashService,
    @inject(ModuleConfigToken) private config: ModuleConfig,
  ) {}

  start({ partyId, involvedPartyId }: BattleStartArgs): BattleState {
    return {
      battleId: this.battleService.startBattle(partyId, involvedPartyId),
    };
  }

  isRunnable({ partyId, involvedPartyId }: BattleStartArgs) {
    return this.partyService.isPartyAlive(partyId) && this.partyService.isPartyAlive(involvedPartyId);
  }

  execute(activity: Activity<BattleState>): BattleState {
    this.battleService.turnBattle(activity.state.battleId);

    return activity.state;
  }

  isDone({ state: { battleId } }: Activity<BattleState>): boolean {
    return this.battleService.isDoneBattle(battleId);
  }

  resolve({ state }: Activity<BattleState>) {
    const battle = this.battleService.getBattle(state.battleId);

    const [winnerPartyId, looserPartyId] = this.partyService.isPartyAlive(battle.partyId)
      ? [battle.partyId, battle.defenderPartyId]
      : [battle.defenderPartyId, battle.partyId];

    const winnerUnits = this.partyService.getPartyUnits(winnerPartyId);
    const looserUnits = this.partyService.getPartyUnits(looserPartyId);
    const loot = calculateLoot(looserUnits);
    const xpGain = calculateXpGain(looserUnits);

    this.partyService.gainXp(winnerPartyId, xpGain);

    if (this.config[VillageConfig.DirectLootToVillage]) {
      if (loot.resource) this.villageStashService.addResource(loot.resource);
      if (loot.items) this.villageStashService.addItems(loot.items);
    } else {
      const partyStash = this.partyService.clearPartyStash(looserPartyId);
      const mergedLoot = mergeDeepWith(add, loot, partyStash) as typeof loot & typeof partyStash;

      this.partyService.collectLoot(winnerPartyId, mergedLoot);
    }

    const diedWinnerUnits = winnerUnits.filter(complement(isAlive));

    this.partyService.removeUnitFromParty(winnerPartyId, diedWinnerUnits.map(prop("id")));
    this.partyService.removeUnitFromParty(looserPartyId, looserUnits.map(prop("id")));

    this.partyService.removeParty(looserPartyId);
    this.battleService.removeBattle(state.battleId);
  }
}
