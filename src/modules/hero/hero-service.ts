import { filter, keys, propEq } from 'ramda';
import { injectable, inject } from 'inversify';
import { HeroBase } from './interfaces';
import { UnitStore, UnitService, UnitID, UnitType } from '../unit';
import { StashService } from '../stash';
import { WithID } from '../../models';

@injectable()
export class HeroService<Hero extends HeroBase> {
  constructor(
    @inject('UnitStore') private unitStore: UnitStore<Hero>,
    @inject('UnitService') private unitService: UnitService<Hero>,
    @inject('StashService') private stashService: StashService
  ) { }

  createHero(heroProperties: Hero): UnitID {
    const unitId = this.unitService.createUnit(heroProperties, UnitType.Hero);
    const stashId = this.stashService.createStash();
    this.unitStore.update(unitId, { stashId } as Partial<Hero>);
    return unitId;
  }

  getHero(unitId: UnitID): Hero {
    return this.unitStore.get(unitId) as WithID<Hero>;
  }

  getNumberOfHeroes(): number {
    return keys(filter(propEq('type', UnitType.Hero), this.unitStore.getState())).length;
  }

  gainXp(unitId: UnitID, xp: number): void {
    const hero = this.getHero(unitId);
    this.unitStore.update(unitId, { xp: hero.xp + xp } as Partial<Hero>);
  }
}
