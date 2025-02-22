import { createContainer } from "./dependency-injection-container";

export type { InjectableToken, Type } from "./dependency-injection-container";

const globalContainer = createContainer();

export const inject = globalContainer.inject;
export const createInjectableToken = globalContainer.createInjectableToken;
export const makeInjectable = globalContainer.makeInjectable;
export const injectable = globalContainer.injectable;
