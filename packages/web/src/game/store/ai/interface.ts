export enum PartyActionType {
  Heal = "heal",
  Explore = "explore",
  Battle = "battle",
  Travel = "travel",
  MoveToVillage = "move-to-village",
  Training = "training",
  EnterPortal = "enter-portal",
}

export interface PartyAction {
  type: PartyActionType;
  args?: any;
}

export interface PartyState {
  action: PartyAction | null;
  autoExplore: boolean;
}

export interface GameAIState {
  partyStates: Record<string, PartyState>;
}
