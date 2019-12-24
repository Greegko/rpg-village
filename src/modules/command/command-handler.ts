import { inject, injectable } from 'inversify';
import { Command } from './interfaces';
import { WithID } from '@greegko/rpg-model';
import { GetActivityHandlerByTag, ActivityService } from '../activity';
import { filter, values } from 'ramda';
import { CommandStore } from './command-store';

@injectable()
export class CommandHandler {

  constructor(
    @inject('getActivityHandler') private getActivityHandler: GetActivityHandlerByTag,
    @inject('ActivityService') private activityService: ActivityService,
    @inject('CommandStore') private commandStore: CommandStore
  ) { }

  executeCommands() {
    const commands = values(this.commandStore.getState());

    const commandsToExecute = filter(command => this.activityService.getPartyActivity(command.partyId) === undefined, commands);
    commandsToExecute.forEach(command => this._executeCommand(command));
  }

  private _executeCommand(command: WithID<Command>) {
    const activityTask = this.getActivityHandler(command.command).start(command.partyId, command.args);
    this.activityService.startActivity(activityTask);

    this.commandStore.remove(command.id);
  }

}
