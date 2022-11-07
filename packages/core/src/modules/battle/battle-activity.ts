import { inject, injectable } from "inversify";
import { complement, prop } from "ramda";

import { ModuleConfig } from "@core/global-type";
import { ModuleConfigToken } from "@core/module/tokens";

import { IActivityHandler, PartyActivity } from "@modules/activity";
import { PartyID, PartyService } from "@modules/party";
import { isAlive } from "@modules/unit";
import { VillageStashService } from "@modules/village";
import { VillageConfig } from "@modules/village/interfaces/village-config";

import { BattleService } from "./battle-service";
import { BattleID } from "./interfaces";
import { calculateLoot, calculateXpGain } from "./lib";

type BattleState = { battleId: BattleID };
type BattleStartArgs = { partyId: PartyID; involvedPartyId: PartyID };

@injectable()
export class BattleActivity implements IActivityHandler<PartyActivity<BattleState, BattleStartArgs>> {
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

  execute(activity: PartyActivity<BattleState>): BattleState {
    this.battleService.turnBattle(activity.state.battleId);

    return activity.state;
  }

  isDone({ state: { battleId } }: PartyActivity<BattleState>): boolean {
    return this.battleService.isDoneBattle(battleId);
  }

  resolve({ state }: PartyActivity<BattleState>) {
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
      this.partyService.collectLoot(winnerPartyId, loot);
    }

    const diedWinnerUnits = winnerUnits.filter(complement(isAlive));

    this.partyService.removeUnitFromParty(winnerPartyId, diedWinnerUnits.map(prop("id")));
    this.partyService.removeUnitFromParty(looserPartyId, looserUnits.map(prop("id")));

    this.partyService.removeParty(looserPartyId);
    this.battleService.removeBattle(state.battleId);
  }
}
