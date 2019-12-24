import { injectable } from 'inversify';
import { Command } from './interfaces';
import { EntityStore } from "../../../core-src";

@injectable()
export class CommandStore extends EntityStore<Command> { };
