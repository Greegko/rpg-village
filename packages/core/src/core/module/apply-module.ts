import { Container, interfaces } from "inversify";
import { forEach, pipe, propOr, juxt } from "ramda";
import { Module, ModulActivity, ModulStore, ProvideClass, ProvideValue } from "@core/module";

export type ApplyModule = (container: Container) => (module: Module) => void;

export const applyModule: ApplyModule = (container: Container) =>
  juxt([applyStores(container), applyProviders(container), applyActivities(container)] as any);

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
      container.bind("Stores").toDynamicValue((context: interfaces.Context) => ({
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
      container.bind("ActivityHandlers").to(activityModule.activity).whenTargetTagged("name", activityModule.name);
    }),
  );
