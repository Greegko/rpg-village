import { Module } from "../../models";

export const configModule: Module = {
  provides: [{ provide: 'availableSkills', value: [] }]
}
