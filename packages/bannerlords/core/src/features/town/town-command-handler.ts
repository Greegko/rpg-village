import { injectable } from "inversify";
import { evolve } from "remeda";

import { commandHandler } from "@rpg-village/core";
import { withoutBy } from "@rpg-village/core/lib/without-by";

import { MapStore, Point } from "@features/map";
import { MapMoveDirectionStore } from "@features/map/map-move-direction-store";

import { TownCommand, TownCommandEnterTownArgs, TownCommandLeaveTownArgs } from "./interface";
import { TownStore } from "./town-store";

export const getPointDistance = (a: Point, b: Point) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

@injectable()
export class TownCommandHandler {
  constructor(
    private townStore: TownStore,
    private mapMoveDirectionStore: MapMoveDirectionStore,
    private mapStore: MapStore,
  ) {}

  @commandHandler(TownCommand.EnterTown)
  enterTown(args: TownCommandEnterTownArgs) {
    const townPosition = this.mapStore.get(args.townId)!;
    const partyPosition = this.mapStore.get(args.partyId)!;

    if (getPointDistance(townPosition, partyPosition) > 2) return;

    this.townStore.update(args.townId, evolve({ parties: x => [...x, args.partyId] }));
    this.mapMoveDirectionStore.remove(args.partyId);
    this.mapStore.remove(args.partyId);
  }

  @commandHandler(TownCommand.LeaveTown)
  leaveTown(args: TownCommandLeaveTownArgs) {
    const townPosition = this.mapStore.get(args.townId)!;

    if (!this.townStore.get(args.townId).parties.includes(args.partyId)) return;

    this.townStore.update(
      args.townId,
      evolve({ parties: parties => withoutBy<string>(parties, [args.partyId], x => x) }),
    );

    this.mapStore.set(args.partyId, townPosition);
  }
}
