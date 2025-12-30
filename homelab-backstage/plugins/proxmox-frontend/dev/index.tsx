import { createDevApp } from '@backstage/dev-utils';
import { proxmoxFrontendPlugin, ProxmoxFrontendPage } from '../src/plugin';

createDevApp()
  .registerPlugin(proxmoxFrontendPlugin)
  .addPage({
    element: <ProxmoxFrontendPage />,
    title: 'Root Page',
    path: '/proxmox-frontend',
  })
  .render();
