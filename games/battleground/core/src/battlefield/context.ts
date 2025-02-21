import { Random } from "../utils";
import { AiController } from "./controllers/ai";
import { EffectsContext } from "./effects";
import { BattlefieldConfig, ResourceManager } from "./interface";
import { MapContext } from "./map";
import { SpellsContext } from "./spells";
import { UnitContext } from "./unit";

export type Context = {
  aiController: AiController;
  config: BattlefieldConfig;
  random: Random;
  unit: UnitContext;
  effect: EffectsContext;
  resourceManager: ResourceManager;
  map: MapContext;
  spells: SpellsContext;
};
