import { Hero, UnitType } from '@greegko/rpg-model';
import { sample } from './sample';
import { generate } from 'shortid';

const lastname = ['Emperor', 'Monk', 'Lord', 'Prince', 'Chancellor', 'Earl', 'Yeoman', 'Landgrave', 'King', 'Queen', 'Princess', 'Consort', 'Duchess', 'Grand', 'Peasant', 'Maiden', 'Dame', 'Reeve'];
const male = ['Bernar', 'Bruiant', 'Reginald', 'Wilcock', 'Oggery', 'Louve', 'Jeremimum', 'Helie', 'Tibald', 'Otebon'];
const female = ['Maalot', 'Tillote', 'Sarey', 'Jossy', 'Susanna', 'Missa', 'Aleneite', 'Iseldis', 'Sapphira', 'Crystina'];

export function heroFactory(): Hero {
  const firstNames = Math.random() > 0.5 ? male : female;

  return {
    id: generate(),
    level: 1,
    type: UnitType.Hero,
    name: sample(lastname) +" "+ sample(firstNames),
    hp: 100,
    maxhp: 100,
    equipment: {},
    armor: 0,
    skillIds: [],
    dmg: 5,
    xp: 0
  };
}
