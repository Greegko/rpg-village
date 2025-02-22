import { injectable } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Castle, CastleID } from "./interface";

@injectable()
export class CastleStore extends EntityStore<CastleID, Castle> {}
