export enum GameEvent {
  IncreaseDifficulty = "gameEvent/increaseDifficulty",
}

export interface IncreaseDifficultyEventArgs {
  difficulty: number;
}
