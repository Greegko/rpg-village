import { Activity } from './activity';
import { PartyID } from '../../party';

export interface IActivityHandler<S, T> {
  start(party: PartyID, startArgs: S): Activity<any>;
  isRunnable(party: PartyID, startArgs: Partial<S>): boolean;
  isDone(activity: Activity<T>): boolean;
  execute(activity: Activity<T>): T;
  resolve(activity: Activity<T>);
}
