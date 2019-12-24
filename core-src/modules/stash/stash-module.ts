import { Module } from "../../models";
import { StashStore } from "./stash-store";
import { StashService } from "./stash-service";

export const stashModule: Module = {
  stores: [{ scope: 'stash', store: StashStore }],
  provides: [StashService]
};
