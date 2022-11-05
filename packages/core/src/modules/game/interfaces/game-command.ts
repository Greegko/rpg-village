export enum GameCommand {
  TurnCommand = "game/turn",
  NewGame = "game/newGame",
}

declare module "@core/global-type/command-type" {
  interface CommandType {
    [GameCommand.NewGame]: undefined;
    [GameCommand.TurnCommand]: undefined;
  }
}
