import { HeroService as ExternalHeroService } from '@greegko/rpg-model';
import { Hero } from './hero';

export type HeroService = ExternalHeroService<Hero>;
