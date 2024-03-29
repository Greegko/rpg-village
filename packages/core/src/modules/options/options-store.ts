import { injectable } from "inversify";

import { EntityStore } from "@core";

import { OptionID, OptionState } from "./interfaces";

@injectable()
export class OptionStore extends EntityStore<OptionID, OptionState> {}
