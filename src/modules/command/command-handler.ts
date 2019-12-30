import { inject, injectable } from 'inversify';
import { Command } from './interfaces';
import { WithID } from "../../models";
import { GetActivityHandlerByTag, ActivityStore } from '../activity';
import { filter, values, propEq } from 'ramda';
import { CommandStore } from './command-store';
import { PartyID } from '../party';

@injectable()
export class CommandHandler {

  constructor(
    @inject('getActivityHandler') private getActivityHandler: GetActivityHandlerByTag,
    @inject('ActivityStore') private activityStore: ActivityStore,
    @inject('CommandStore') private commandStore: CommandStore
  ) { }

  executeCommands() {
    const commands = values(this.commandStore.getState());

    const commandsToExecute = filter(command => this.getPartyActivity(command.partyId) === undefined, commands);
    commandsToExecute.forEach(command => this._executeCommand(command));
  }

  private _executeCommand(command: WithID<Command>) {
    const activity = this.getActivityHandler(command.command).start(command.partyId, command.args);
    this.activityStore.add(activity);

    this.commandStore.remove(command.id);
  }

  private getPartyActivity(partyId: PartyID) {
    return values(this.activityStore.getState()).findIndex(propEq('partyId', partyId)) > -1;
  }

}
