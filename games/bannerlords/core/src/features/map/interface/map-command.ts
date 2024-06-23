import { Direction } from "./direction";
import { EntityID } from "./entity-id";

export interface MapCommandSetEntityDirectionArgs {
  entityId: EntityID;
  direction: Direction;
}

export enum MapCommand {
  SetEntityDirection = "map/set-entity-direction",
}
