import { injectable } from "inversify";

import { EntityStore } from "@core/store";

import { OptionID, OptionState } from "./interfaces/options-store";

@injectable()
export class OptionStore extends EntityStore<OptionID, OptionState> {}
