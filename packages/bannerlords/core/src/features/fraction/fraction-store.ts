import { injectable } from "inversify";

import { EntityStore } from "@rpg-village/core";

import { Fraction, FractionID } from "./interface";

@injectable()
export class FractionStore extends EntityStore<FractionID, Fraction> {}
