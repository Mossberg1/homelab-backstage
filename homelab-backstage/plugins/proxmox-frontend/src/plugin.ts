import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

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
      import('./components/ExampleComponent').then(m => m.ExampleComponent),
    mountPoint: rootRouteRef,
  }),
);
