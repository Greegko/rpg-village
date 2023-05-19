import { ItemID } from "@models/item";
import { MapLocationID } from "@modules/map";
import { PartyID } from "@modules/party";

export enum PortalCommand {
  OpenPortal = "portal/open-portal",
  EnterPortal = "portal/enter-portal",
  LeavePortal = "portal/leave-portal",
}

export interface PortalCommandOpenPortalArgs {
  dungeonKeyId: ItemID;
}

export interface PortalCommandEnterPortalArgs {
  partyId: PartyID;
  portalLocationId: MapLocationID;
}

export interface PortalCommandLeavePortalArgs {
  partyId: PartyID;
  portalLocationId: MapLocationID;
}

declare module "@core/command" {
  export interface CommandType {
    [PortalCommand.OpenPortal]: PortalCommandOpenPortalArgs;
    [PortalCommand.EnterPortal]: PortalCommandEnterPortalArgs;
    [PortalCommand.LeavePortal]: PortalCommandLeavePortalArgs;
  }
}
