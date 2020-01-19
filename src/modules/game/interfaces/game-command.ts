export enum GameCommand {
  TurnCommand = 'game/turn',
  FastForward = 'game/fast-forward',
  NewGame = 'game/newGame',
}

export type FastForwardCommandArgs = { turns: number; };
