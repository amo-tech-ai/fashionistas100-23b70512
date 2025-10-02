import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for Mobile Testing
 * 
 * Tests run against the local dev server or production
 * Includes mobile device emulation for comprehensive testing
 */
export default defineConfig({
  testDir: './tests',
  
  // Test timeout
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail fast on CI
  forbidOnly: !!process.env.CI,
  
  // Retry on CI
  retries: process.env.CI ? 2 : 0,
  
  // Worker configuration
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  
  // Shared settings for all projects
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Device-specific test projects
  projects: [
    // === Mobile Devices ===
    
    // iPhone SE (smallest modern iPhone)
    {
      name: 'iPhone SE',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 375, height: 667 },
      },
    },
    
    // iPhone 12
    {
      name: 'iPhone 12',
      use: {
        ...devices['iPhone 12'],
        viewport: { width: 390, height: 844 },
      },
    },
    
    // iPhone 13 Pro Max
    {
      name: 'iPhone 13 Pro Max',
      use: {
        ...devices['iPhone 13 Pro Max'],
        viewport: { width: 428, height: 926 },
      },
    },
    
    // Samsung Galaxy S21
    {
      name: 'Galaxy S21',
      use: {
        ...devices['Galaxy S9+'],
        viewport: { width: 360, height: 800 },
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
      },
    },
    
    // Samsung Galaxy S21 Ultra
    {
      name: 'Galaxy S21 Ultra',
      use: {
        ...devices['Galaxy S9+'],
        viewport: { width: 384, height: 854 },
        userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G998B) AppleWebKit/537.36',
      },
    },
    
    // === Tablets ===
    
    // iPad Mini
    {
      name: 'iPad Mini',
      use: {
        ...devices['iPad Mini'],
        viewport: { width: 768, height: 1024 },
      },
    },
    
    // iPad Pro 11"
    {
      name: 'iPad Pro 11',
      use: {
        ...devices['iPad Pro 11'],
        viewport: { width: 834, height: 1194 },
      },
    },
    
    // === Desktop ===
    
    // Desktop Chrome
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    
    // Desktop Firefox
    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    
    // Desktop Safari
    {
      name: 'Desktop Safari',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },
  ],

  // Local dev server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
