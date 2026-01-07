import {
  startTestBackend,
  mockServices
} from '@backstage/backend-test-utils';
import { proxmoxPlugin } from './plugin';
import request from 'supertest';


// TEMPLATE NOTE:
// Plugin tests are integration tests for your plugin, ensuring that all pieces
// work together end-to-end. You can still mock injected backend services
// however, just like anyone who installs your plugin might replace the
// services with their own implementations.
describe('plugin', () => {

  // TODO: Add plugin tests here:

  it('Should successfully start with config', async () => {
    const { server } = await startTestBackend({
      features: [
        proxmoxPlugin,
        // 2. Mock the rootConfig service to provide the missing value
        mockServices.rootConfig.factory({
          data: {
            proxmox: {
              host: 'test-host',
              port: 8006,
              user: 'test-user',
              realm: 'pam',
              tokenId: 'test-token',
              tokenSecret: 'test-secret',
            },
          },
        }),
      ],
    });

    expect(true).toEqual(true); // Only added to avoid errors since the file does not have any tests.
  });
});
