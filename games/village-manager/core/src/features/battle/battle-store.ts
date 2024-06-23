import { injectable } from "inversify";

import { EntityStore } from "@rpg-village/core";

import { BattleID, BattleStoreState } from "./interfaces";

@injectable()
export class BattleStore extends EntityStore<BattleID, BattleStoreState> {}
