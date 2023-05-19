export enum VillageConfig {
  DirectLootToVillage = "village/direct-loot-to-village",
}

declare module "@core/module" {
  interface ModuleConfig {
    [VillageConfig.DirectLootToVillage]: boolean;
  }
}
