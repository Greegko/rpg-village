import { inject, injectable } from 'inversify';
import { prop, flatten, pathOr, map } from 'ramda';
import { Unit } from "../unit";
import { Effect } from '../../models';
import { SkillID, Skill } from './interfaces';

@injectable()
export class EffectService {

  constructor(@inject('availableSkills') private available_skills: Skill[]) { }

  getUnitEffects(unit: Unit): Effect[] {
    return flatten<any>([
      map(this.getEffectsBySkillId.bind(this), unit.skillIds),
      pathOr([], ['equipment', 'rightHand', 'effects'], unit),
      pathOr([], ['equipment', 'leftHand', 'effects'], unit),
      pathOr([], ['equipment', 'torso', 'effects'], unit)
    ]);
  }

  getEffectsBySkillId(skillId: SkillID): Effect[] {
    return this.available_skills.find(prop('id', skillId)).effects;
  }

};
