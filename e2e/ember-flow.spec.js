import { expect, test } from '@playwright/test';

async function openSettings(page) {
  await page.getByTestId('settings-button').click();
  await expect(page.getByTestId('settings-drawer')).toHaveClass(/open/);
}

async function closeSettings(page) {
  await page.getByRole('button', { name: 'Close settings' }).click();
  await expect(page.getByTestId('settings-drawer')).not.toHaveClass(/open/);
}

test.describe('Ember guest app', () => {
  test('first theme flow and mobile layout work', async ({ page, isMobile }) => {
    await page.goto('/');
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
    await expect(page.getByRole('heading', { name: 'Your orders' })).toBeVisible();

    if (isMobile) {
      await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    }
  });

  test('theme switching persists across navigation and refresh', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /See the full menu/i }).click();
    await openSettings(page);
    await page.getByTestId('theme-option-ember-2').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'ember-2');
    await closeSettings(page);

    await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('button', { name: 'Help' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'ember-2');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'ember-2');
  });

  test('theme switching preserves form state and route', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Call a server/i }).click();
    await expect(page.getByRole('heading', { name: /How can we help/i })).toBeVisible();
    await page.getByTestId('request-note').fill('Sparkling water for the table');
    await openSettings(page);
    await page.getByTestId('theme-option-ember-4').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'ember-4');
    await expect(page.getByRole('heading', { name: /How can we help/i })).toBeVisible();
    await expect(page.getByTestId('request-note')).toHaveValue('Sparkling water for the table');
  });

  test('menu search opens a dedicated mobile-style search page', async ({ page, isMobile }) => {
    await page.goto('/');
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
    await page.goto('/');
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

  test('all seven themes can be applied', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /See the full menu/i }).click();
    await openSettings(page);
    for (let index = 1; index <= 7; index += 1) {
      const themeId = `ember-${index}`;
      await page.getByTestId(`theme-option-${themeId}`).click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', themeId);
    }
  });
});
