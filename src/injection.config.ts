import { Container, interfaces } from "inversify";

const container = new Container({ defaultScope: 'Singleton' });

container
  .bind("getActivityHandler")
  .toFactory((context: interfaces.Context) => (tag: string) => context.container.getTagged('ActivityHandlers', 'type', tag));

export { container };
