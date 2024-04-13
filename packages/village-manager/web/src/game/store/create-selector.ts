import { last } from "rambda";

import { CreateSelectorFunction } from "./create-selector.types";

export const createSelectorFactory: <T>() => CreateSelectorFunction<T> =
  (): any =>
  (...selectors: any[]): any => {
    const inputSelectors = selectors.slice(0, -1);
    const mapper = last(selectors);

    return (...inputs: any[]) => {
      const mapperInputs = inputSelectors.map(input => input(...inputs));

      return mapper(...mapperInputs);
    };
  };

export const selectorProperty = <P>(state: any, property: P): P => property;
