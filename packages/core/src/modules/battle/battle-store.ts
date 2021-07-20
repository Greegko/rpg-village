import { injectable } from "inversify";
import { EntityStore } from "@core/store";
import { BattleStoreState, BattleID } from "./interfaces";

@injectable()
export class BattleStore extends EntityStore<BattleStoreState, BattleID> {}
