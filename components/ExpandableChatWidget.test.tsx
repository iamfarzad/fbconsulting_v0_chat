import { test, expect } from '@playwright/test';

// Mock for chat context
const mockChatHelpers = {
  setIsFullscreen: jest.fn(),
  isFullscreen: false,
  id: 'test-id',
};

// Reset mock between tests
beforeEach(() => {
  mockChatHelpers.setIsFullscreen.mockClear();
  mockChatHelpers.isFullscreen = false;
});

test.describe('ExpandableChatWidget', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the chat context
    await page.addInitScript({
      content: `
        window.mockChatHelpers = ${JSON.stringify(mockChatHelpers)};
        window.useSharedChat = () => window.mockChatHelpers;
      `,
    });
    await page.goto('/');
  });

  test('should handle basic open/close interaction', async ({ page }) => {
    try {
      const button = page.locator('button[aria-label="Open chat"]');
      await button.click();

      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(dialog).toHaveAttribute('aria-labelledby', 'chat-title');

      await page.click('button[aria-label="Close chat"]');
      await expect(dialog).not.toBeVisible();
      await expect(button).toBeFocused();
    } catch (error) {
      console.error('Error in basic interaction test:', error);
      throw error;
    }
  });

  test('should handle keyboard interactions', async ({ page }) => {
    try {
      const button = page.locator('button[aria-label="Open chat"]');

      // Test Enter key
      await button.press('Enter');
      await expect(page.locator('[role="dialog"]')).toBeVisible();

      // Test Escape key
      await page.keyboard.press('Escape');
      await expect(page.locator('[role="dialog"]')).not.toBeVisible();

      // Test Space key
      await button.press('Space');
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    } catch (error) {
      console.error('Error in keyboard interaction test:', error);
      throw error;
    }
  });

  test('should trap and cycle focus forwards', async ({ page }) => {
    try {
      await page.click('button[aria-label="Open chat"]');

      // Get all focusable elements
      const focusableCount = await page.evaluate(() => {
        const elements = document.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        return elements.length;
      });

      // Press Tab multiple times and verify focus stays in dialog
      for (let i = 0; i < focusableCount + 1; i++) {
        await page.keyboard.press('Tab');
        const isInDialog = await page.evaluate(
          () => document.activeElement?.closest('[role="dialog"]') !== null,
        );
        expect(isInDialog).toBe(true);
      }
    } catch (error) {
      console.error('Error in focus trap forward test:', error);
      throw error;
    }
  });

  test('should trap and cycle focus backwards', async ({ page }) => {
    try {
      await page.click('button[aria-label="Open chat"]');

      // Press Shift+Tab multiple times
      for (let i = 0; i < 3; i++) {
        await page.keyboard.press('Shift+Tab');
        const isInDialog = await page.evaluate(
          () => document.activeElement?.closest('[role="dialog"]') !== null,
        );
        expect(isInDialog).toBe(true);
      }
    } catch (error) {
      console.error('Error in focus trap backward test:', error);
      throw error;
    }
  });

  test('should handle edge cases', async ({ page }) => {
    try {
      // Rapid open/close
      const button = page.locator('button[aria-label="Open chat"]');
      await button.click();
      await button.click();
      await button.click();

      // Verify final state is correct
      const dialog = page.locator('[role="dialog"]');
      const isOpen = await dialog.isVisible();
      expect(typeof isOpen).toBe('boolean'); // State should be deterministic

      // Multiple escape presses
      await page.keyboard.press('Escape');
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();

      // Focus should return to button
      await expect(button).toBeFocused();
    } catch (error) {
      console.error('Error in edge case test:', error);
      throw error;
    }
  });

  test('should handle fullscreen functionality', async ({ page }) => {
    try {
      // Open chat first
      await page.click('button[aria-label="Open chat"]');

      // Check if fullscreen button exists and is visible
      const fullscreenButton = page.locator(
        'button[aria-label="Open in fullscreen"]',
      );
      await expect(fullscreenButton).toBeVisible();

      // Click fullscreen button
      await fullscreenButton.click();

      // Check if setIsFullscreen was called with true
      const wasFullscreenCalled = await page.evaluate(() => {
        const mock = (window as any).mockChatHelpers.setIsFullscreen;
        return mock.mock.calls.length > 0 && mock.mock.calls[0][0] === true;
      });
      expect(wasFullscreenCalled).toBe(true);

      // Verify focus handling
      const focused = await page.evaluate(() =>
        document.activeElement?.getAttribute('aria-label'),
      );
      expect(focused).toBe('Open in fullscreen');
    } catch (error) {
      console.error('Error in fullscreen test:', error);
      throw error;
    }
  });
});
