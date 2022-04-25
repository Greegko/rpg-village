import { ItemID } from "@models/item";

export enum PortalsCommand {
  OpenPortal = "portals/open-portal",
}

export interface PortalsCommandOpenPortalArgs {
  dungeonKeyId: ItemID;
}

declare module "../../../../core/command/command-type" {
  interface CommandType {
    [PortalsCommand.OpenPortal]: PortalsCommandOpenPortalArgs;
  }
}
