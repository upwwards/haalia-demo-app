import { expect, test } from '@playwright/test';
import { DEFAULT_THEME_ID, emberThemes } from '../src/themes/themes.js';

const themeIds = emberThemes.map((theme) => theme.id);

async function gotoUnlocked(page) {
  await page.addInitScript(() => localStorage.setItem('ember-pin-unlocked', 'true'));
  await page.goto('/');
}

async function openSettings(page) {
  await page.getByTestId('settings-button').click();
  await expect(page.getByTestId('settings-drawer')).toHaveClass(/open/);
}

async function closeSettings(page) {
  await page.getByRole('button', { name: 'Close settings' }).click();
  await expect(page.getByTestId('settings-drawer')).not.toHaveClass(/open/);
}

test.describe('Ember guest app', () => {
  test('PIN gate unlocks with the table code and persists', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Enter PIN' })).toBeVisible();

    for (const digit of ['9', '0', '4', '8']) {
      await page.getByRole('button', { name: digit }).click();
    }

    await expect(page.getByRole('heading', { name: /Hungry/i })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { name: /Hungry/i })).toBeVisible();
  });

  test('first theme flow and mobile layout work', async ({ page, isMobile }) => {
    await gotoUnlocked(page);
    await expect(page.getByRole('heading', { name: /Hungry/i })).toBeVisible();
    await page.getByRole('button', { name: /See the full menu/i }).click();
    await expect(page.getByRole('heading', { name: /Tonight's menu/i })).toBeVisible();

    await page.locator('.menu-item').first().getByRole('button').first().click();
    await expect(page.locator('[data-screen="item"] h2')).toBeVisible();
    await page.getByRole('button', { name: /Add to order/i }).click();
    await page.getByRole('button', { name: /View order/i }).click();
    await expect(page.getByRole('heading', { name: 'Your order' })).toBeVisible();
    await page.getByRole('button', { name: /Send to the kitchen/i }).click();
    await expect(page.getByRole('heading', { name: 'Order sent' })).toBeVisible();
    await page.getByRole('button', { name: /Track my order/i }).click();
    await expect(page.getByRole('heading', { name: 'MY ORDER' })).toBeVisible();

    if (isMobile) {
      await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    }
  });

  test('theme switching persists across navigation and refresh', async ({ page }) => {
    await gotoUnlocked(page);
    await page.getByRole('button', { name: /See the full menu/i }).click();
    await openSettings(page);
    await page.getByTestId('theme-option-ember-crystal').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'ember-crystal');
    await closeSettings(page);

    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('button', { name: 'Help' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'ember-crystal');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'ember-crystal');
  });

  test('invalid stored theme falls back to the default theme', async ({ page }) => {
    await gotoUnlocked(page);
    await page.evaluate(() => localStorage.setItem('ember-theme', 'not-a-real-theme'));
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', DEFAULT_THEME_ID);
  });

  test('theme switching preserves search state and route', async ({ page }) => {
    await gotoUnlocked(page);
    await page.getByRole('button', { name: /See the full menu/i }).click();
    await page.getByRole('button', { name: 'Search menu' }).click();
    await page.getByTestId('search-page-input').fill('chicken');
    await page.getByRole('button', { name: 'Back to menu' }).click();
    await expect(page.locator('.search-launch')).toContainText('chicken');

    await openSettings(page);
    await page.getByTestId('theme-option-ember-4').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'ember-4');
    await expect(page.getByRole('heading', { name: /Tonight's menu/i })).toBeVisible();
    await expect(page.locator('.search-launch')).toContainText('chicken');
  });

  test('menu search opens a dedicated mobile-style search page', async ({ page, isMobile }) => {
    await gotoUnlocked(page);
    await page.getByRole('button', { name: /See the full menu/i }).click();

    await page.getByRole('button', { name: 'Search menu' }).click();
    await expect(page.locator('[data-screen="search"]')).toBeVisible();
    if (isMobile) {
      await expect(page.getByTestId('search-page-input')).not.toBeFocused();
    } else {
      await expect(page.getByTestId('search-page-input')).toBeFocused();
    }

    await page.getByTestId('search-page-input').fill('chicken');
    await expect(page.locator('.search-result').first()).toBeVisible();
    const resultName = await page.locator('.search-result strong').first().innerText();
    await page.locator('.search-result').first().click();
    await expect(page.locator('[data-screen="item"] h2')).toContainText(resultName);

    await page.getByRole('button', { name: 'Back to menu' }).click();
    await expect(page.locator('.search-launch')).toContainText('chicken');
  });

  test('no internet page appears without resetting the current screen', async ({ page, context }) => {
    await gotoUnlocked(page);
    await page.getByRole('button', { name: /See the full menu/i }).click();
    await expect(page.getByRole('heading', { name: /Tonight's menu/i })).toBeVisible();

    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await expect(page.getByRole('heading', { name: 'No internet connection' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();

    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await expect(page.getByRole('heading', { name: /Tonight's menu/i })).toBeVisible();
  });

  test('all theme options are visible and can be applied', async ({ page }) => {
    await gotoUnlocked(page);
    await page.getByRole('button', { name: /See the full menu/i }).click();
    await openSettings(page);
    for (const themeId of themeIds) {
      await expect(page.getByTestId(`theme-option-${themeId}`)).toBeVisible();
      await page.getByTestId(`theme-option-${themeId}`).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', themeId);
      await expect(page.getByTestId(`theme-option-${themeId}`)).toHaveAttribute('aria-checked', 'true');
    }
  });

  test('theme selector stays inside the mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await gotoUnlocked(page);
    await page.getByRole('button', { name: /See the full menu/i }).click();
    await openSettings(page);

    const viewportWidth = page.viewportSize().width;
    const drawerBox = await page.getByTestId('settings-drawer').boundingBox();
    expect(drawerBox.x).toBeGreaterThanOrEqual(0);
    expect(drawerBox.x + drawerBox.width).toBeLessThanOrEqual(viewportWidth);

    for (const themeId of themeIds) {
      await expect(page.getByTestId(`theme-option-${themeId}`)).toBeVisible();
    }
  });

  test('themes do not create horizontal overflow at target widths', async ({ page }) => {
    const widths = [320, 375, 768, 1024, 1440];

    for (const width of widths) {
      await page.setViewportSize({ width, height: 800 });
      await gotoUnlocked(page);
      await page.getByRole('button', { name: /See the full menu/i }).click();
      await openSettings(page);

      for (const themeId of themeIds) {
        await page.getByTestId(`theme-option-${themeId}`).click();
        await expect(page.locator('html')).toHaveAttribute('data-theme', themeId);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        expect(overflow).toBe(false);
      }
    }
  });

  test('theme visual smoke screenshots', async ({ page }, testInfo) => {
    await gotoUnlocked(page);
    await page.getByRole('button', { name: /See the full menu/i }).click();
    await openSettings(page);

    for (const theme of emberThemes) {
      await page.getByTestId(`theme-option-${theme.id}`).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme.id);
      const fileName = `theme-${theme.name.toLowerCase().replaceAll(' ', '-')}.png`;
      await page.screenshot({ path: testInfo.outputPath(fileName), fullPage: true });
    }
  });
});
