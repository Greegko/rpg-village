import { AttackEffectType, DefenseEffectType } from './battle-effect';

export const heroEffectPropertyMap: { [key: number]: string } = {
  [AttackEffectType.Dmg]: 'dmg',
  [AttackEffectType.Bash]: 'bashChance',
  [AttackEffectType.CriticalChance]: 'criticalChance',
  [DefenseEffectType.Evasion]: 'evasion',
  [DefenseEffectType.Armor]: 'armor'
}
