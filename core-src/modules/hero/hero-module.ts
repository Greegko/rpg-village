import { Module } from "../../models";
import { HeroService } from "./hero-service";

export const heroModule: Module = {
  provides: [HeroService]
};
