import { Container, interfaces } from "inversify";
import { forEach, pipe, propOr, juxt } from 'ramda';
import { Module, ModulActivity, ModulStore, ProvideClass, ProvideValue } from "../models";

export type ApplyModule = (container: Container) => (module: Module) => void;

export const applyModule: ApplyModule = (container: Container) =>
  juxt([
    applyStores(container),
    applyCommandHandlers(container),
    applyEventHandlers(container),
    applyProviders(container),
    applyActivities(container),
  ] as any);

const applyProviders = (container: Container) =>
  pipe(
    propOr([], 'provides'),
    forEach<ProvideClass | ProvideValue>(provide => {
      if ('value' in provide) {
        container.bind(provide.provide).toConstantValue(provide.value);
      } else {
        container.bind(provide.name).to(provide);
      }
    })
  );

const applyStores = (container: Container) =>
  pipe(
    propOr([], 'stores'),
    forEach((storeModule: ModulStore) => {
      container.bind(storeModule.store.name).to(storeModule.store);
      container.bind('Stores').toDynamicValue((context: interfaces.Context) => ({
        scope: storeModule.scope,
        store: context.container.get(storeModule.store.name),
        initialState: storeModule.initialState
      }));
    })
  );

const applyCommandHandlers = (container: Container) => (modul: Module) => {
  if (modul.commandHandler) {
    container.bind('commandHandlers').to(modul.commandHandler)
  }
}

const applyEventHandlers = (container: Container) => (modul: Module) => {
  if (modul.eventHandler) {
    container.bind('eventHandlers').to(modul.eventHandler)
  }
}

const applyActivities = (container: Container) =>
  pipe(
    propOr([], 'activities'),
    forEach((activityModule: ModulActivity) => {
      container.bind(activityModule.activity.name).to(activityModule.activity);
      container.bind('ActivityHandlers').to(activityModule.activity).whenTargetTagged('type', activityModule.type);
    })
  );
