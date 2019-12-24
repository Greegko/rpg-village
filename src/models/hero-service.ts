import { HeroService as ExternalHeroService } from '../../core-src';
import { Hero } from './hero';

export type HeroService = ExternalHeroService<Hero>;
