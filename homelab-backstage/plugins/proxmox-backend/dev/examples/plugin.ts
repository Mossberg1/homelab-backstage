import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { todoListServiceRef } from '../dev/examples/TodoListService';

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
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        todoList: todoListServiceRef,
      },
      async init({ httpAuth, httpRouter, todoList }) {
        httpRouter.use(
          await createRouter({
            httpAuth,
            todoList,
          }),
        );
      },
    });
  },
});
