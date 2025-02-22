import { createDependencyInjectionContainer } from "@rpg-village/utils";

export type { InjectableToken, Type } from "@rpg-village/utils";

const globalContainer = createDependencyInjectionContainer();

export const inject = globalContainer.inject;
export const createInjectableToken = globalContainer.createInjectableToken;
export const makeInjectable = globalContainer.makeInjectable;
export const injectable = globalContainer.injectable;
