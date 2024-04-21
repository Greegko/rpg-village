import { injectable } from "inversify";
import { forEach } from "remeda";

import { GameCommand, commandHandler } from "@rpg-village/core";

import { CastleStore } from "@features/castle";
import { ClanStore } from "@features/clan";
import { FractionStore } from "@features/fraction";
import { LordStore } from "@features/lord";
import { MapStore, Position } from "@features/map";
import { TownStore } from "@features/town";
import { VillageStore } from "@features/village";

import { initialMapData } from "./map";

const toPositionString = (x: Position) => `${x.x},${x.y}` as const;

@injectable()
export class GameCommandHandler {
  constructor(
    private mapStore: MapStore,
    private fractionStore: FractionStore,
    private lordStore: LordStore,
    private clanStore: ClanStore,
    private castleStore: CastleStore,
    private villageStore: VillageStore,
    private townStore: TownStore,
  ) {}

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
      this.mapStore.update(toPositionString(position), { entityId });
    });

    forEach(data.villages, villageInput => {
      const { position, id: virtualId, ...village } = villageInput;
      village.belongTo = virtualIdMap[village.belongTo];
      const entityId = this.villageStore.add(village).id;
      virtualIdMap[virtualId] = entityId;
      this.mapStore.update(toPositionString(position), { entityId });
    });

    forEach(data.castles, castleInput => {
      const { position, id: virtualId, ...castle } = castleInput;
      castle.belongTo = virtualIdMap[castle.belongTo];
      const entityId = this.castleStore.add(castle).id;
      virtualIdMap[virtualId] = entityId;
      this.mapStore.update(toPositionString(position), { entityId });
    });

    forEach(data.towns, townInput => {
      const { position, id: virtualId, ...town } = townInput;
      town.belongTo = virtualIdMap[town.belongTo];
      const entityId = this.townStore.add(town).id;
      virtualIdMap[virtualId] = entityId;
      this.mapStore.update(toPositionString(position), { entityId });
    });
  }
}
