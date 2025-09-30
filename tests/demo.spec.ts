import { test, expect } from '@playwright/test';

/**
 * FashionOS Advanced Features Demo Test
 * Demonstrates all Playwright advanced features
 */

test.describe('FashionOS Advanced Features', () => {
  
  test('Network Interception & Visual Testing', async ({ page }) => {
    console.log('Testing advanced features...');
    
    // Mock API responses
    await page.route('**/api/events', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', title: 'Fashion Week 2025', price: 299 }
        ])
      });
    });

    await page.goto('/');
    
    // Visual regression
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: true,
      animations: 'disabled'
    });
    
    expect(await page.title()).toContain('Fashion');
  });

  test('Mobile Responsiveness', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true
    });
    const page = await context.newPage();
    
    await page.goto('/');
    await page.screenshot({ path: 'mobile.png' });
    
    await context.close();
  });

  test('Performance Metrics', async ({ page }) => {
    await page.goto('/');
    
    const metrics = await page.evaluate(() => {
      const paint = performance.getEntriesByType('paint');
      return {
        fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };
    });
    
    expect(metrics.fcp).toBeLessThan(3000);
  });
});
