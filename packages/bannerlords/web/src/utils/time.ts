export const DAY_IN_TURN = 24;

export enum TimePhase {
  Midnight = 0,
  Dawn = 4,
  Dusk = 16,
  Night = 20,
}

export const getTime = (turn: number): number => {
  return turn % DAY_IN_TURN;
};

export const getTimePhase = (turn: number): TimePhase | undefined => {
  const time = getTime(turn);

  switch (time) {
    case TimePhase.Midnight:
      return TimePhase.Midnight;
    case TimePhase.Dawn:
      return TimePhase.Dawn;
    case TimePhase.Dusk:
      return TimePhase.Dusk;
    case TimePhase.Night:
      return TimePhase.Night;
  }
};
