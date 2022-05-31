import { injectable } from "inversify";

import { EntityStore } from "@core/store";

import { PortalID, PortalState } from "./interface";

@injectable()
export class PortalsStore extends EntityStore<PortalState, PortalID> {}
