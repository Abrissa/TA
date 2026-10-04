import { test, expect } from '@playwright/test';

test.describe('Public Website & Pages Verification', () => {
  test('HomePage loads without JS console errors and displays core elements', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out expected benign warnings or favicon 404s if any
    const realErrors = consoleErrors.filter(
      (msg) => !msg.includes('favicon') && !msg.includes('status of 404')
    );
    expect(realErrors).toEqual([]);

    // Check School Branding
    await expect(page.locator('text=MI AL-AHMAD').first()).toBeVisible();

    // Check Footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Supported by RPL SMK Krian 1 Sidoarjo');
    await expect(footer).toContainText('MI AL-AHMAD Sidoarjo');
  });

  test('Navigate to Visi Misi page without errors', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/visi-misi');
    await page.waitForLoadState('networkidle');

    expect(pageErrors).toEqual([]);
    await expect(page.locator('text=Visi, Misi & Landasan').first()).toBeVisible();
  });

  test('Navigate to Guru & Staff page without errors', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/guru');
    await page.waitForLoadState('networkidle');

    expect(pageErrors).toEqual([]);
    await expect(page.locator('text=Dewan Guru & Tenaga Kependidikan').first()).toBeVisible();
  });

  test('Navigate to Prestasi page and verify Stacked Card Carousel', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/prestasi');
    await page.waitForLoadState('networkidle');

    expect(pageErrors).toEqual([]);
    await expect(page.locator('text=Etalase Prestasi Gemilang').first()).toBeVisible();

    // Verify stacked cards or achievement items render
    const achievementSection = page.locator('text=Semua Koleksi Prestasi').first();
    await expect(achievementSection).toBeVisible();
  });

  test('Navigate to Berita / Artikel page without errors', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/artikel');
    await page.waitForLoadState('networkidle');

    expect(pageErrors).toEqual([]);
    await expect(page.getByRole('heading', { name: 'Berita, Artikel & Kabar Prestasi' })).toBeVisible();
  });

  test('Navigate to Alumni page and Form Alumni without errors', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/alumni');
    await page.waitForLoadState('networkidle');

    expect(pageErrors).toEqual([]);
    await expect(page.locator('text=Jejak Langkah Alumni').first()).toBeVisible();

    // Check button to alumni submission form
    const formBtn = page.locator('text=Isi Formulir Pendataan Alumni').first();
    if (await formBtn.isVisible()) {
      await formBtn.click();
      await page.waitForTimeout(500);
      await expect(page.locator('text=Formulir Pendataan Alumni').first()).toBeVisible();
    }
  });

  test('PPDB page is a dedicated page without robotic numbered headers', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto('/ppdb');
    await page.waitForLoadState('networkidle');

    expect(pageErrors).toEqual([]);

    // Check that it does NOT contain AI cliches like "1. Biodata Lengkap"
    const content = await page.content();
    expect(content).not.toContain('1. Biodata Lengkap Calon Santri');
    expect(content).not.toContain('1. Data Calon Siswa');

    // Check form fields exist
    await expect(page.locator('input[name="childFullName"], input[placeholder*="Muhammad Rayhan"]').first()).toBeVisible();
  });
});
