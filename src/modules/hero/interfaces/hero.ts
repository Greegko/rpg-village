import { HeroBase } from "./hero-base";
import { Unit } from "../../unit/interfaces";
import { HeroEquipment } from "../hero-equipment";

export type Hero = { equipment: HeroEquipment } & Unit & HeroBase;