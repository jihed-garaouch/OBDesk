import { test, devices } from '@playwright/test';

test('Debug Orbit Desk in WebKit', async ({ page }) => {
  // 1. Capture Console Logs (The "Smoking Gun")
  page.on('console', msg => {
    console.log(`BROWSER LOG [${msg.type()}]: ${msg.text()}`);
  });

  // 2. Capture Page Errors (Crashes)
  page.on('pageerror', error => {
    console.error(`BROWSER CRASH: ${error.message}`);
  });

  // 3. Emulate an iPhone 15
  const iPhone = devices['iPhone 15'];
  await page.setViewportSize(iPhone.viewport);
  
  // 4. Go to your local dev URL or your Vercel URL
  // Use your local URL to test fixes instantly: http://localhost:5173
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

  // 5. Keep the browser open so you can look at it
  await page.pause(); 
});