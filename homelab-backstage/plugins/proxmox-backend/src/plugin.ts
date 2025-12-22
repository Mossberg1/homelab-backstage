import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';

/**
 * proxmoxPlugin backend plugin
 *
 * @public
 */
export const proxmoxPlugin = createBackendPlugin({
  pluginId: 'proxmox',
  register(env) {
    env.registerInit({
      deps: {
        httpRouter: coreServices.httpRouter,
        config: coreServices.rootConfig,
      },
      async init({ httpRouter, config }) {
        httpRouter.use(
          await createRouter({
            config,
          }),
        );

        /** 
         * Unauthenticated policies for development
         * until i figure out how to test authenticated endpoints.
         */
        httpRouter.addAuthPolicy({
          path: '/nodes',
          allow: 'unauthenticated',
        });
      },
    });
  },
});
