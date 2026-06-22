const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to mobile
  await page.setViewportSize({ width: 375, height: 812 });

  // Test Home Page
  await page.goto('file://' + path.resolve('index.html'));
  await page.screenshot({ path: 'verification/mobile_home.png', fullPage: true });

  // Test Dashboard
  await page.goto('file://' + path.resolve('dashboard.html'));
  await page.screenshot({ path: 'verification/mobile_dashboard.png', fullPage: true });

  await browser.close();
})();
