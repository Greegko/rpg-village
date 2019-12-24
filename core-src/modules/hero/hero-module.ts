import { Module } from "../../../src/models";
import { HeroService } from "./hero-service";

export const heroModule: Module = {
  provides: [HeroService]
};
