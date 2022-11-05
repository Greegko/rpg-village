export enum VillageConfig {
  DirectLootToVillage = "village/direct-loot-to-village",
}

declare module "@core/global-type/module-config" {
  interface ModuleConfig {
    [VillageConfig.DirectLootToVillage]: boolean;
  }
}
