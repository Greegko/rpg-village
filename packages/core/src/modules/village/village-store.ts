import { injectable } from "inversify";

import { ObjectStore } from "@core";

import { VillageState } from "./interfaces";

@injectable()
export class VillageStore extends ObjectStore<VillageState> {}
