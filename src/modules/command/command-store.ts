import { injectable } from 'inversify';
import { Command } from './interfaces';
import { EntityStore } from "../../lib/entity-store";

@injectable()
export class CommandStore extends EntityStore<Command> { };
