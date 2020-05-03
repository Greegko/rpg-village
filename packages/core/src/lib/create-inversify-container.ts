import { Container, interfaces } from "inversify";

export function createInvesifyContainer() {
  const container = new Container({ defaultScope: 'Singleton' });

  container
    .bind("getActivityHandler")
    .toFactory((context: interfaces.Context) => (name: string) => context.container.getTagged('ActivityHandlers', 'name', name));

  return container;
}
