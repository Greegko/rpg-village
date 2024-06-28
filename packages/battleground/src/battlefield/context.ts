import { BattlefieldConfig, ResourceManager } from "./interface";
import { Random } from "../utils";
import { EffectsContext } from "./effects";
import { MapContext } from "./map";
import { SpellsContext } from "./spells";
import { UnitContext } from "./unit";

export type Context = {
  config: BattlefieldConfig;
  random: Random;
  unit: UnitContext;
  effect: EffectsContext;
  resourceManager: ResourceManager;
  map: MapContext;
  spells: SpellsContext;
};
