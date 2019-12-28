import { Container, interfaces } from "inversify";

export function createInvesifyContainer() {
  const container = new Container({ defaultScope: 'Singleton' });

  container
    .bind("getActivityHandler")
    .toFactory((context: interfaces.Context) => (tag: string) => context.container.getTagged('ActivityHandlers', 'type', tag));

  return container;
}
