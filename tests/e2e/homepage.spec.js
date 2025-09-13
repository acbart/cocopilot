import { test, expect } from '@playwright/test';

test.describe('CocoPilot Homepage', () => {
  test('should load homepage successfully', async({ page }) => {
    await page.goto('/');

    // Check that the page loads
    await expect(page).toHaveTitle('CocoPilot - Self-Updating Repository');

    // Check main heading
    await expect(page.getByRole('heading', { name: /Hello from CocoPilot/i })).toBeVisible();

    // Check that the status indicator is present
    await expect(page.getByText('🟢 Active & Self-Improving')).toBeVisible();
  });

  test('should have working theme toggle', async({ page }) => {
    await page.goto('/');

    // Find and click the theme toggle button
    const themeButton = page.getByRole('button', { name: /Toggle between light and dark theme/i });
    await expect(themeButton).toBeVisible();

    // Check initial theme (should be light by default)
    const body = page.locator('body');
    await expect(body).not.toHaveAttribute('data-theme', 'dark');

    // Click to toggle to dark theme
    await themeButton.click();
    await expect(body).toHaveAttribute('data-theme', 'dark');

    // Click again to toggle back to light theme
    await themeButton.click();
    await expect(body).not.toHaveAttribute('data-theme', 'dark');
  });

  test('should have working navigation links', async({ page }) => {
    await page.goto('/');

    // Check that GitHub link is present and has correct URL
    const githubLink = page.getByRole('link', { name: /View on GitHub/i });
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/acbart/cocopilot');

    // Check issues link
    const issuesLink = page.getByRole('link', { name: /See Daily Issues/i });
    await expect(issuesLink).toBeVisible();
    await expect(issuesLink).toHaveAttribute('href', 'https://github.com/acbart/cocopilot/issues');
  });

  test('should display repository statistics section', async({ page }) => {
    await page.goto('/');

    // Check that stats section is present (even if showing offline fallback)
    const statsSection = page.locator('[role="status"]');
    await expect(statsSection).toBeVisible();

    // Should show either real stats or fallback infinity symbols
    const starCount = page.getByText('∞').or(page.locator('[title*="star"]'));
    await expect(starCount.first()).toBeVisible();
  });

  test('should be responsive on mobile', async({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check that content is still visible and accessible
    await expect(page.getByRole('heading', { name: /Hello from CocoPilot/i })).toBeVisible();
    await expect(page.getByText('🟢 Active & Self-Improving')).toBeVisible();

    // Check that theme toggle is still accessible
    const themeButton = page.getByRole('button', { name: /Toggle between light and dark theme/i });
    await expect(themeButton).toBeVisible();
  });

  test('should have proper PWA manifest', async({ page }) => {
    await page.goto('/');

    // Check that manifest link is present
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toHaveAttribute('href', 'manifest.json');
  });

  test('should register service worker', async({ page }) => {
    await page.goto('/');

    // Wait for service worker registration
    const swRegistered = await page.evaluate(() => {
      return new Promise((resolve) => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(() => resolve(true));
          // Fallback timeout
          setTimeout(() => resolve(false), 5000);
        } else {
          resolve(false);
        }
      });
    });

    expect(swRegistered).toBe(true);
  });

  test('should have accessible content', async({ page }) => {
    await page.goto('/');

    // Check that page has proper heading structure
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();

    // Check that theme toggle has proper aria attributes
    const themeButton = page.getByRole('button', { name: /Toggle between light and dark theme/i });
    await expect(themeButton).toHaveAttribute('aria-label');

    // Check that links have proper text or aria-labels
    const links = page.getByRole('link');
    const linkCount = await links.count();

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const hasText = (await link.textContent())?.trim().length > 0;
      const hasAriaLabel = await link.getAttribute('aria-label');
      expect(hasText || hasAriaLabel).toBeTruthy();
    }
  });
});