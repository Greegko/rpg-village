import { createDependencyInjectionContainer } from "@greegko/tiny-di";

export { type InjectableToken, type Type, createInjectableToken } from "@greegko/tiny-di";

const globalContainer = createDependencyInjectionContainer();

export const { inject, makeInjectable, injectable, clearInstances } = globalContainer;
