export enum PartyPreference {
  Idle,
  AutoExplore,
  MoveToVillage,
}

export interface GameAIState {
  partyPreferences: Record<string, PartyPreference>;
}
