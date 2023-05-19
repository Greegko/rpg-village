import { injectable } from "inversify";

import { ObjectStore } from "@core";

import { GeneralGameStoreState } from "./interfaces";

@injectable()
export class GeneralGameStore extends ObjectStore<GeneralGameStoreState> {}
