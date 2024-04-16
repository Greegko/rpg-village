import { PartyID } from "@features/party";

import { PortalID } from "./portal";

export enum PortalCommand {
  EnterPortal = "portal/enter-portal",
}

export interface PortalCommandEnterPortalArgs {
  partyId: PartyID;
  portalId: PortalID;
}
