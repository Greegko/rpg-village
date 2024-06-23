import { injectable } from "inversify";

import { EntityStore } from "@rpg-village/core";

import { Lord, LordID } from "./interface";

@injectable()
export class LordStore extends EntityStore<LordID, Lord> {}
