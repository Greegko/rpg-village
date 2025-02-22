import { Direction, EntityID, MapCommand, MapCommandSetEntityDirectionArgs, Point } from "../interface";

declare module "@rpg-village/core/extend" {
  interface GameState {
    map: Record<EntityID, Point>;
    mapMoveDirections: Record<EntityID, Direction>;
  }

  interface CommandType {
    [MapCommand.SetEntityDirection]: MapCommandSetEntityDirectionArgs;
  }
}
