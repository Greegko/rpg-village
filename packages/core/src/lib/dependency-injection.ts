import { createDependencyInjectionContainer } from "@greegko/tiny-di";

export type { InjectableToken, Type } from "@greegko/tiny-di";

const globalContainer = createDependencyInjectionContainer();

export const { inject, createInjectableToken, makeInjectable, injectable, clearInstances } = globalContainer;
