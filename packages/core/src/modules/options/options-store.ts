import { injectable } from "inversify";

import { EntityStore } from "@core";

import { OptionID, OptionState } from "./interfaces/options-store";

@injectable()
export class OptionStore extends EntityStore<OptionID, OptionState> {}
