import { createDependencyInjectionContainer } from "@greegko/tiny-di";

const container = createDependencyInjectionContainer();

export const { clearInstances, createInjectableToken, inject, injectable, makeInjectable } = container;
