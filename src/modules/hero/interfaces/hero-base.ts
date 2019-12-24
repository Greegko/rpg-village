import { UnitType, UnitBase } from '../../unit/interfaces';
import { StashID } from '../../stash/interfaces';

export interface HeroBase extends UnitBase {
  xp: number;
  type: UnitType.Hero;
  stashId: StashID;
}
