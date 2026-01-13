import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

// Take incpiration from this: https://www.youtube.com/watch?v=SUkAnJBKTtQ&t=4s

export const proxmoxFrontendPlugin = createPlugin({
  id: 'proxmox-frontend',
  routes: {
    root: rootRouteRef,
  },
});

export const ProxmoxFrontendPage = proxmoxFrontendPlugin.provide(
  createRoutableExtension({
    name: 'ProxmoxFrontendPage',
    component: () =>
      import('../dev/examples/components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);


