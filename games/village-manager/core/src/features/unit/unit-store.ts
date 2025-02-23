import { injectableStore } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Unit, UnitID } from "./interfaces";

@injectableStore("units", {})
export class UnitStore extends EntityStore<UnitID, Unit> {}
