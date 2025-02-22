import { injectable } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { OptionID, OptionState } from "./interfaces";

@injectable()
export class OptionStore extends EntityStore<OptionID, OptionState> {}
