import { injectable } from "@rpg-village/core";
import { EntityStore } from "@rpg-village/core";

import { Fraction, FractionID } from "./interface";

@injectable()
export class FractionStore extends EntityStore<FractionID, Fraction> {}
