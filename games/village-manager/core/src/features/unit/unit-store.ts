import { injectable } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Unit, UnitID } from "./interfaces";

@injectable()
export class UnitStore extends EntityStore<UnitID, Unit> {}
