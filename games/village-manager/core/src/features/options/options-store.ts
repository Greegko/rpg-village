import { injectableStore } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { OptionID, OptionState } from "./interfaces";

@injectableStore("options", {})
export class OptionStore extends EntityStore<OptionID, OptionState> {}
