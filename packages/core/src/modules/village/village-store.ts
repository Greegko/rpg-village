import { injectable } from "inversify";
import { ObjectStore } from "@core/store";
import { VillageState } from "./interfaces";

@injectable()
export class VillageStore extends ObjectStore<VillageState> {}
