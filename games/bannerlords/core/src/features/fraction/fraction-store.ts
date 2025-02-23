import { injectableStore } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Fraction, FractionID } from "./interface";

@injectableStore("fractions", {})
export class FractionStore extends EntityStore<FractionID, Fraction> {}
