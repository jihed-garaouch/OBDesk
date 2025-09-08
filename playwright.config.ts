import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  projects: [
    {
      name: 'webkit',
      use: { 
        ...devices['iPhone 15'],
        browserName: 'webkit',
      },
    },
  ],
});