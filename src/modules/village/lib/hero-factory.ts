import { Unit } from '../../unit';
import { UnitType } from "../../unit";
import { sample } from '../../../lib/sample';


const lastname = ['Emperor', 'Monk', 'Lord', 'Prince', 'Chancellor', 'Earl', 'Yeoman', 'Landgrave', 'King', 'Queen', 'Princess', 'Consort', 'Duchess', 'Grand', 'Peasant', 'Maiden', 'Dame', 'Reeve'];
const male = ['Bernar', 'Bruiant', 'Reginald', 'Wilcock', 'Oggery', 'Louve', 'Jeremimum', 'Helie', 'Tibald', 'Otebon'];
const female = ['Maalot', 'Tillote', 'Sarey', 'Jossy', 'Susanna', 'Missa', 'Aleneite', 'Iseldis', 'Sapphira', 'Crystina'];

export function heroFactory(): Unit {
  const firstNames = Math.random() > 0.5 ? male : female;

  return {
    level: 1,
    name: sample(lastname) + " " + sample(firstNames),
    hp: 100,
    maxhp: 100,
    equipment: {},
    armor: 0,
    skillIds: [],
    dmg: 5,
    xp: 0,
    type: UnitType.Unit,
    stashId: undefined
  };
}
