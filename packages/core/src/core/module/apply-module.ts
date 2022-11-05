import { Container, interfaces } from "inversify";
import { forEach, juxt, pipe, propOr } from "ramda";

import { ModulActivity, ModulStore, Module, ModuleConfig, ProvideClass, ProvideValue } from "@core/module";

import { ActivityHandlersToken, ModuleConfigToken, StoresToken } from "./tokens";

export type ApplyModule = (container: Container) => (module: Module) => void;

export const applyModule: ApplyModule = (container: Container) =>
  juxt([
    applyStores(container),
    applyProviders(container),
    applyActivities(container),
    applyModuleConfig(container),
  ] as any);

const applyProviders = (container: Container) =>
  pipe(
    propOr([], "provides"),
    forEach<ProvideClass | ProvideValue>(provide => {
      if ("value" in provide) {
        container.bind(provide.provide).toConstantValue(provide.value);
      } else {
        container.bind(provide).toSelf();
      }
    }),
  );

const applyStores = (container: Container) =>
  pipe(
    propOr([], "stores"),
    forEach((storeModule: ModulStore) => {
      container.bind(storeModule.store).toSelf();
      container.bind(StoresToken).toDynamicValue((context: interfaces.Context) => ({
        scope: storeModule.scope,
        store: context.container.get(storeModule.store),
        initialState: storeModule.initialState,
      }));
    }),
  );

const applyActivities = (container: Container) =>
  pipe(
    propOr([], "activities"),
    forEach((activityModule: ModulActivity) => {
      container.bind(ActivityHandlersToken).to(activityModule.activity).whenTargetTagged("name", activityModule.name);
    }),
  );

const applyModuleConfig = (container: Container) =>
  pipe(propOr(null, "defaultConfig"), config => {
    if (config) container.bind(ModuleConfigToken).toConstantValue(config);
  });
