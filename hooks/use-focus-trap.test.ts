import { test, expect } from '@playwright/test';
import { useFocusTrap } from './use-focus-trap';

// Helper function to simulate react hook
function useHook(ref: { current: HTMLElement | null }) {
  const hook = useFocusTrap(ref);
  return { result: hook };
}

test.describe('useFocusTrap', () => {
  let container: HTMLDivElement;
  let firstButton: HTMLButtonElement;
  let lastButton: HTMLButtonElement;

  test.beforeEach(async ({ page }) => {
    await page.setContent(`
      <div id="container">
        <button id="first">First</button>
        <button id="last">Last</button>
      </div>
    `);

    container = (await page.$('#container')) as unknown as HTMLDivElement;
    firstButton = (await page.$('#first')) as unknown as HTMLButtonElement;
    lastButton = (await page.$('#last')) as unknown as HTMLButtonElement;
  });

  test('should trap focus within container', async ({ page }) => {
    const { result } = useHook({ current: container });

    try {
      await result.trap();
      await firstButton.focus();
      await page.keyboard.press('Tab');

      const focused = await page.evaluate(() => document.activeElement?.id);
      expect(focused).toBe('last');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('should release focus trap when called', async ({ page }) => {
    const { result } = useHook({ current: container });

    try {
      await result.trap();
      await result.release();
      await firstButton.focus();
      await page.keyboard.press('Tab');

      const focused = await page.evaluate(() => document.activeElement?.id);
      expect(focused).not.toBe('last');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });

  test('should handle shift+tab navigation', async ({ page }) => {
    const { result } = useHook({ current: container });

    try {
      await result.trap();
      await lastButton.focus();
      await page.keyboard.press('Shift+Tab');

      const focused = await page.evaluate(() => document.activeElement?.id);
      expect(focused).toBe('first');
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
