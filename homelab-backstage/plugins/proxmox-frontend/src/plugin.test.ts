import { proxmoxFrontendPlugin } from './plugin';

describe('proxmox-frontend', () => {
  it('should export plugin', () => {
    expect(proxmoxFrontendPlugin).toBeDefined();
  });
});
