import { forEach, juxt, pipe, propOr } from "rambda";

import { inject, makeInjectable } from "@lib/dependency-injection";

import { Module } from "@rpg-village/core/extend";

import { ModulStore, ProvideClass, ProvideValue } from "./module";
import { ActivityHandlersToken, ModuleDefaultConfigToken, StoresToken } from "./tokens";

export type ApplyModule = () => (module: Module) => void;

export const applyModule: ApplyModule = () => juxt([applyStores(), applyProviders(), applyActivities(), applyModuleConfig()] as any);

const applyProviders = () =>
  pipe(
    propOr([], "provides"),
    forEach<ProvideClass | ProvideValue>(provide => {
      if ("value" in provide) {
        makeInjectable(provide.provide, provide.value);
      } else {
        makeInjectable(provide);
      }
    }),
  );

const applyStores = () =>
  pipe(
    propOr([], "stores"),
    forEach((storeModule: ModulStore) => {
      makeInjectable(storeModule.store);

      makeInjectable(
        StoresToken,
        () => ({
          scope: storeModule.scope as any,
          store: inject(storeModule.store),
          initialState: storeModule.initialState,
        }),
        { multi: true },
      );
    }),
  );

const applyActivities = () =>
  pipe(
    propOr([], "activities"),
    forEach((activityModule: any) => makeInjectable(ActivityHandlersToken, activityModule.activity, { name: activityModule.name })),
  );

const applyModuleConfig = () =>
  pipe(propOr(null, "defaultConfig"), config => {
    if (config) makeInjectable(ModuleDefaultConfigToken, config);
  });
