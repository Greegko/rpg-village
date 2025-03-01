import { createDependencyInjectionContainer } from "@greegko/tiny-di";

const container = createDependencyInjectionContainer();

export const { clearInstances, inject, injectable, makeInjectable } = container;
