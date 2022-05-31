import { forEach } from "ramda";
import { injectable } from "inversify";
import { PartyService, PartyID, PartyStore } from "@modules/party";
import { UnitStore } from "@modules/unit";
import { Battle } from "./battle";
import { BattleID, BattleStoreState } from "./interfaces";
import { BattleStore } from "./battle-store";
import { MapLocationID } from "@modules/map";

@injectable()
export class BattleService {
  private battleInstances: Record<BattleID, Battle> = {};

  constructor(
    private battleStore: BattleStore,
    private partyService: PartyService,
    private unitStore: UnitStore,
    private partyStore: PartyStore,
  ) {}

  getBattle(battleId: BattleID): BattleStoreState {
    return this.battleStore.get(battleId);
  }

  getBattleLocation(battleId: BattleID): MapLocationID {
    const partyId = this.battleStore.get(battleId).partyId;
    const party = this.partyStore.get(partyId);
    return party.locationId;
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
