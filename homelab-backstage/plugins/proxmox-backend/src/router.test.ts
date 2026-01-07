import {
  mockCredentials,
  mockErrorHandler,
  mockServices,
} from '@backstage/backend-test-utils';
import express from 'express';
import request from 'supertest';

import { createRouter } from './router';
import { todoListServiceRef } from '../dev/examples/TodoListService';

const mockConfig = {
  getString: (key: string) => {
    const values: Record<string, string> = {
      'proxmox.host': 'test-host',
      'proxmox.user': 'test-user',
      'proxmox.realm': 'pam',
      'proxmox.tokenId': 'test-token',
      'proxmox.tokenSecret': 'test-secret',
    };
    return values[key];
  },
  getNumber: (key: string) => {
    if (key === 'proxmox.port') return 8006;
    return 0;
  },
};

// TEMPLATE NOTE:
// Testing the router directly allows you to write a unit test that mocks the provided options.
describe('createRouter', () => {
  let app: express.Express;


  beforeEach(async () => {
    const router = await createRouter({
      config: mockConfig as any
    });
    app = express();
    app.use(router);
    app.use(mockErrorHandler());
  });

  // TODO: Add tests for routes here: 
  test('test', () => { expect(true).toEqual(true) }); // Just added to avoid erros since this file does not have any tests.

});
