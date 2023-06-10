import { injectable } from "inversify";

import { EntityStore } from "@core";

import { BattleID, BattleStoreState } from "./interfaces";

@injectable()
export class BattleStore extends EntityStore<BattleID, BattleStoreState> {}
