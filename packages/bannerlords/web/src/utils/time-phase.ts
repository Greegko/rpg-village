export const DAY_IN_TURN = 24;

export enum TimePhase {
  Midnight = 0,
  Dawn = 4,
  Night = 20,
}

export const getTimePhase = (turn: number): TimePhase | undefined => {
  const tick = turn % DAY_IN_TURN;
  switch (tick) {
    case TimePhase.Midnight:
      return TimePhase.Midnight;
    case TimePhase.Dawn:
      return TimePhase.Dawn;
    case TimePhase.Night:
      return TimePhase.Night;
  }
};
