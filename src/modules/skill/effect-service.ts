import { inject, injectable } from 'inversify';
import { prop, flatten, pathOr, map, chain } from 'ramda';
import { isHero, Hero } from "../hero";
import { Entity, Effect } from '../../models';
import { SkillID, Skill } from './interfaces';

@injectable()
export class EffectService {

  constructor(@inject('availableSkills') private available_skills: Skill[]) { }

  getUnitEffects(unit: Entity): Effect[] {
    if (isHero(unit)) {
      return this.getHeroEffects(unit as Hero);
    }

    return chain(this.getEffectsBySkillId.bind(this), unit.skillIds);
  }

  getHeroEffects(hero: Hero): Effect[] {
    return flatten<any>([
      map(this.getEffectsBySkillId.bind(this), hero.skillIds),
      pathOr([], ['equipment', 'rightHand', 'effects'], hero),
      pathOr([], ['equipment', 'leftHand', 'effects'], hero),
      pathOr([], ['equipment', 'torso', 'effects'], hero)
    ]);
  }

  getEffectsBySkillId(skillId: SkillID): Effect[] {
    return this.available_skills.find(prop('id', skillId)).effects;
  }

};
