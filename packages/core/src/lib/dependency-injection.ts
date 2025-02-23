import { createDependencyInjectionContainer } from "@greegko/tiny-di";

export type { InjectableToken, Type } from "@greegko/tiny-di";

const globalContainer = createDependencyInjectionContainer();

export const inject = globalContainer.inject;
export const createInjectableToken = globalContainer.createInjectableToken;
export const makeInjectable = globalContainer.makeInjectable;
export const injectable = globalContainer.injectable;
