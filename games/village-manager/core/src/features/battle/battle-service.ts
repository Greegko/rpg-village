import { forEach } from "rambda";

import { inject, injectable } from "@rpg-village/core";

import { PartyID, PartyService } from "@features/party";
import { UnitStore } from "@features/unit";

import { Battle } from "./battle";
import { BattleStore } from "./battle-store";
import { BattleID, BattleStoreState } from "./interfaces";

@injectable()
export class BattleService {
  private battleInstances: Record<BattleID, Battle> = {};

  private battleStore = inject(BattleStore);
  private partyService = inject(PartyService);
  private unitStore = inject(UnitStore);

  getBattle(battleId: BattleID): BattleStoreState {
    return this.battleStore.get(battleId);
  }

  startBattle(partyId: PartyID, defenderPartyId: PartyID): BattleID {
    return this.battleStore.add({ partyId, defenderPartyId }).id;
  }

  isDoneBattle(battleId: BattleID): boolean {
    return this.getBattleInstance(battleId).isDone();
  }

  turnBattle(battleId: BattleID): void {
    const battle = this.getBattleInstance(battleId);
    const battleState = battle.turn();

    forEach(unit => this.unitStore.update(unit.id, { hp: unit.hp }), battleState.attackerParty);
    forEach(unit => this.unitStore.update(unit.id, { hp: unit.hp }), battleState.defenderParty);
  }

  removeBattle(battleId: BattleID): void {
    this.battleStore.remove(battleId);
    delete this.battleInstances[battleId];
  }

  private getBattleInstance(battleId: BattleID): Battle {
    if (!this.battleInstances[battleId]) {
      const battleState = this.battleStore.get(battleId);

      this.battleInstances[battleId] = new Battle(
        this.partyService.getPartyUnits(battleState.partyId),
        this.partyService.getPartyUnits(battleState.defenderPartyId),
      );
    }

    return this.battleInstances[battleId];
  }
}
