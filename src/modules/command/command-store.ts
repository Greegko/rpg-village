import { injectable } from 'inversify';
import { Command } from './interfaces';
import { EntityStore } from '@greegko/rpg-model';

@injectable()
export class CommandStore extends EntityStore<Command> { };
