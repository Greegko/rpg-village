import { injectable } from "inversify";

import { EntityStore } from "@core";

import { Unit, UnitID } from "./interfaces";

@injectable()
export class UnitStore extends EntityStore<UnitID, Unit> {}
