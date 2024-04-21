import { injectable } from "inversify";

import { commandHandler } from "@rpg-village/core";

import { MapCommand, MapCommandSetEntityDirectionArgs } from "./interface";
import { MapMoveDirectionStore } from "./map-move-direction-store";

@injectable()
export class MapCommandHandler {
  constructor(private mapMoveDirectionStore: MapMoveDirectionStore) {}

  @commandHandler(MapCommand.SetEntityDirection)
  setEntityDirection(args: MapCommandSetEntityDirectionArgs) {
    this.mapMoveDirectionStore.set(args.entityId, args.direction);
  }
}
