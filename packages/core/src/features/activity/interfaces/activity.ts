export type ActivityID = string;

export type ActivityTargetIDsConditionalsArgs<
  TargetID extends string | null,
  InvolvedTargetID extends string | null,
> = TargetID extends string
  ? InvolvedTargetID extends string
    ? { targetId: TargetID; involvedTargetId: InvolvedTargetID }
    : { targetId: TargetID }
  : InvolvedTargetID extends string
  ? { involvedTargetId: InvolvedTargetID }
  : {};

export type Activity<
  State,
  TargetID extends string | null,
  InvolvedTargetID extends string | null,
  StartingArgs extends ActivityTargetIDsConditionalsArgs<TargetID, InvolvedTargetID>,
> = {
  id: ActivityID;
  name: string;
  state: State;
  targetId: TargetID;
  involvedTargetId: InvolvedTargetID;
  startArgs: StartingArgs;
};

export type AnyActivity = Activity<any, any, any, any>;
