import { createState, test } from "../utils";
import { BattleActivityType, UnitType } from "../../src";
import * as expect from 'expect';

describe('Battle Activity', () => {
  describe('Battle', () => {
    test('should finish correctly', {
      initState: createState(({ activity, party, unit, battle }) => [
        activity({
          id: 'battle-activity',
          type: BattleActivityType.Battle,
          state: {
            battleId: battle({
              attackerPartyId: party({ unitIds: [unit({ dmg: 100, hp: 100 })] }),
              defenderPartyId: party({ unitIds: [unit({ dmg: 1, hp: 1 })] }),
            }),
          }
        })
      ]),
      turn: true,
      expectedState: state => expect(state.activities).not.toHaveProperty('battle-activity')
    });

    test('should gain xp then winner heroes', {
      initState: createState(({ activity, party, unit, battle }) => [
        activity({
          type: BattleActivityType.Battle,
          state: {
            battleId: battle({
              attackerPartyId: party({ unitIds: [unit({ id: 'winner-unit', xp: 0, dmg: 100, hp: 100, type: UnitType.Unit })] }),
              defenderPartyId: party({ unitIds: [unit({ dmg: 1, hp: 1, level: 1 })] }),
            }),
          }
        })
      ]),
      turn: true,
      expectedState: { units: { 'winner-unit': { xp: 25 } } }
    });
  });
});
