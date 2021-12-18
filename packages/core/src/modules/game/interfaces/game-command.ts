export enum GameCommand {
  TurnCommand = "game/turn",
  NewGame = "game/newGame",
}

declare module "../../../core/command/command-type" {
  interface CommandType {
    [GameCommand.NewGame]: undefined;
    [GameCommand.TurnCommand]: undefined;
  }
}
