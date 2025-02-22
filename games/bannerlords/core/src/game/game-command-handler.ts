import { forEach } from "remeda";

import { inject, injectable } from "@rpg-village/core";
import { GameCommand, commandHandler } from "@rpg-village/core";

import { CastleStore } from "@features/castle";
import { ClanStore } from "@features/clan";
import { FractionStore } from "@features/fraction";
import { LordStore } from "@features/lord";
import { MapStore } from "@features/map";
import { PartyStore } from "@features/party";
import { TownStore } from "@features/town";
import { VillageStore } from "@features/village";

import { initialMapData } from "./map";

@injectable()
export class GameCommandHandler {
  private mapStore = inject(MapStore);
  private fractionStore = inject(FractionStore);
  private lordStore = inject(LordStore);
  private clanStore = inject(ClanStore);
  private castleStore = inject(CastleStore);
  private villageStore = inject(VillageStore);
  private townStore = inject(TownStore);
  private partyStore = inject(PartyStore);

  @commandHandler(GameCommand.NewGame)
  initGame() {
    const data = initialMapData;

    const virtualIdMap: Record<string, string> = {};

    forEach(data.fractions, fractionInput => {
      const { id: virtualId, ...fraction } = fractionInput;
      const entityId = this.fractionStore.add(fraction).id;
      virtualIdMap[virtualId] = entityId;
    });

    forEach(data.clans, clanInput => {
      const { id: virtualId, ...clan } = clanInput;
      clan.belongTo = virtualIdMap[clan.belongTo];
      const entityId = this.clanStore.add(clan).id;
      virtualIdMap[virtualId] = entityId;
    });

    forEach(data.lords, lordInput => {
      const { position, id: virtualId, ...lord } = lordInput;
      lord.belongTo = virtualIdMap[lord.belongTo];
      const entityId = this.lordStore.add(lord).id;
      virtualIdMap[virtualId] = entityId;
      const party = this.partyStore.add({ belongTo: entityId, stash: { gold: 0, items: [] }, units: [] });
      this.mapStore.set(party.id, position);
    });

    forEach(data.towns, townInput => {
      const { position, id: virtualId, ...town } = townInput;
      town.belongTo = virtualIdMap[town.belongTo];
      const entityId = this.townStore.add(town).id;
      virtualIdMap[virtualId] = entityId;
      this.mapStore.set(entityId, position);
    });

    forEach(data.villages, villageInput => {
      const { position, id: virtualId, ...village } = villageInput;
      village.belongTo = virtualIdMap[village.belongTo];
      const entityId = this.villageStore.add(village).id;
      virtualIdMap[virtualId] = entityId;
      this.mapStore.set(entityId, position);
    });

    forEach(data.castles, castleInput => {
      const { position, id: virtualId, ...castle } = castleInput;
      castle.belongTo = virtualIdMap[castle.belongTo];
      const entityId = this.castleStore.add(castle).id;
      virtualIdMap[virtualId] = entityId;
      this.mapStore.set(entityId, position);
    });
  }
}
