export enum GameCommand {
  TurnCommand = "game/turn",
  NewGame = "game/newGame",
}

declare module "@core/command" {
  interface CommandType {
    [GameCommand.NewGame]: undefined;
    [GameCommand.TurnCommand]: undefined;
  }
}
