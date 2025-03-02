declare module "./create-node" {
  interface CreateNodeState {}
  interface CreateNodeInterface {}

  type Plugin<State, PublicInterface> = (publicInterface: CreateNodeInterface) => { onStateUpdate?(state: State): void } & PublicInterface;
  type PluginFactory<Config, State, PublicInterface> = (config?: Config) => Plugin<State, PublicInterface>;

  type Node = { setState(state: CreateNodeState): void } & CreateNodeInterface;
}

export function createNodePlugin<Config, State, PublicInterface>(fn: (config?: Config) => Plugin<State, PublicInterface>) {
  return fn as PluginFactory<Config, State, PublicInterface>;
}

export const createNodeFactory =
  <Plugins extends Plugin<any, any>[]>(plugins: Plugins) =>
  (): Node => {
    const publicInterfaces = {};

    const onStateUpdates = plugins
      .map(plugin => {
        const { onStateUpdate, ...interfaces } = plugin(publicInterfaces as CreateNodeInterface);

        Object.assign(publicInterfaces, interfaces);

        return onStateUpdate;
      })
      .filter(x => x);

    const setState = (state: CreateNodeState) => onStateUpdates.forEach(onStateUpdate => onStateUpdate(state));

    return { setState, ...publicInterfaces } as Node;
  };
