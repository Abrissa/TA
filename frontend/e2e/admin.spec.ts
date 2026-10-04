import { test, expect } from '@playwright/test';

test.describe('Admin Portal & CMS Tests', () => {
  test('Admin login and input editing/deletion check', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    // 1. Visit /portal-admin
    await page.goto('/portal-admin');
    await page.waitForLoadState('networkidle');

    expect(pageErrors).toEqual([]);
    await expect(page.locator('text=Portal Administrator').first()).toBeVisible();

    // 2. Fill login form
    await page.locator('input[type="email"]').fill('admin@mialahmad.sch.id');
    await page.locator('input[type="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();

    // 3. Wait for Admin Dashboard to appear
    await expect(page.locator('text=Ringkasan Dashboard').first()).toBeVisible({ timeout: 10000 });

    // 4. Navigate to CMS / Pusat Kendali tab
    const cmsTabBtn = page.locator('text=Konten Website & CMS').first();
    await expect(cmsTabBtn).toBeVisible();
    await cmsTabBtn.click();

    // 5. Test text input editing and clearing/deletion (verify reported bug)
    // Find the school name or school tagline input
    const schoolNameInput = page.locator('input[placeholder="MI AL-AHMAD"], input[value*="MI AL-AHMAD"]').first();
    if (await schoolNameInput.isVisible()) {
      const originalValue = await schoolNameInput.inputValue();
      
      // Select all and clear
      await schoolNameInput.click();
      await schoolNameInput.fill('');
      
      // Verify value is actually empty and NOT locked or reverting back immediately
      const clearedValue = await schoolNameInput.inputValue();
      expect(clearedValue).toBe('');

      // Type new text
      await schoolNameInput.fill('MI AL-AHMAD Test');
      expect(await schoolNameInput.inputValue()).toBe('MI AL-AHMAD Test');

      // Revert back
      await schoolNameInput.fill(originalValue);
    }
  });

  test('Alumni moderation tab shows Hapus button for approved submissions and renders without errors', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    // 1. Log in to admin
    await page.goto('/portal-admin');
    await page.waitForLoadState('networkidle');

    if (await page.locator('input[type="email"]').isVisible()) {
      await page.locator('input[type="email"]').fill('admin@mialahmad.sch.id');
      await page.locator('input[type="password"]').fill('admin123');
      await page.locator('button[type="submit"]').click();
      await expect(page.locator('text=Ringkasan Dashboard').first()).toBeVisible({ timeout: 10000 });
    }

    // 2. Navigate to Alumni tab
    const alumniTabBtn = page.locator('button:has-text("Form & Direktori Alumni"), button:has-text("Alumni")').first();
    await expect(alumniTabBtn).toBeVisible({ timeout: 10000 });
    await alumniTabBtn.click();
    await page.waitForTimeout(600);

    // Verify no runtime errors occurred
    expect(pageErrors).toEqual([]);

    // Check directory subtab as well
    const directorySubTab = page.locator('button:has-text("Direktori Publik")').first();
    if (await directorySubTab.isVisible()) {
      await directorySubTab.click();
      await page.waitForTimeout(600);
      expect(pageErrors).toEqual([]);
    }

    // Switch back to submissions
    const submissionsSubTab = page.locator('button:has-text("Form Masuk")').first();
    if (await submissionsSubTab.isVisible()) {
      await submissionsSubTab.click();
      await page.waitForTimeout(600);
      expect(pageErrors).toEqual([]);
    }

    // Verify that if any item has status 'approved', its action button is 'Hapus'
    const approvedBadges = page.locator('text=approved');
    const count = await approvedBadges.count();
    if (count > 0) {
      const approvedRow = approvedBadges.first().locator('xpath=ancestor::div[contains(@class, "hover:bg-slate-50")]');
      if (await approvedRow.isVisible()) {
        await expect(approvedRow.locator('text=Hapus')).toBeVisible();
        await expect(approvedRow.locator('text=Setujui & Tampilkan')).not.toBeVisible();
        await expect(approvedRow.locator('text=Tolak')).not.toBeVisible();
      }
    }
  });
});
