import { test, expect } from '@playwright/test';

test.describe('Form Submissions (PPDB & Alumni)', () => {
  test('Submit PPDB form successfully and receive registration number', async ({ page }) => {
    await page.goto('/ppdb');
    await page.waitForLoadState('networkidle');

    // Fill the PPDB form
    await page.locator('input[name="childFullName"]').fill('Ahmad Zaki Al-Farisi');
    await page.locator('select[name="gender"]').selectOption('Laki-laki');
    await page.locator('input[name="previousSchool"]').fill('TK Islam Al-Ikhlas Krian');
    await page.locator('input[name="birthPlace"]').fill('Sidoarjo');
    await page.locator('input[name="birthDate"]').fill('2019-05-14');
    await page.locator('input[name="parentName"]').fill('Bambang Sutrisno');
    await page.locator('input[name="whatsapp"]').fill('081234567891');
    await page.locator('textarea[name="address"]').fill('Jl. KH. Hasyim Asyari No. 45, Krian, Sidoarjo');

    // Submit form
    await page.locator('button[type="submit"]:has-text("Kirim Pendaftaran Santri Baru")').click();

    // Verify registration success screen appears with registration number
    await expect(page.locator('text=Pendaftaran Berhasil Dikirim!')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Nomor Registrasi Resmi', { exact: true })).toBeVisible();
    await expect(page.locator('text=PPDB-').first()).toBeVisible();
  });

  test('Submit Alumni form successfully and receive confirmation', async ({ page }) => {
    await page.goto('/alumni');
    await page.waitForLoadState('networkidle');

    // Click to go to Alumni Form
    const openFormBtn = page.locator('text=Isi Formulir Pendataan Alumni').first();
    await openFormBtn.click();
    await page.waitForTimeout(500);

    await expect(page.locator('text=Formulir Pendataan Alumni').first()).toBeVisible();

    // Fill form
    await page.locator('input[name="fullName"]').fill('Siti Fatimah Azzahra');
    await page.locator('input[name="graduationYear"]').fill('2018');
    await page.locator('input[name="jobRole"]').fill('Mahasiswi Kedokteran Unair');
    await page.locator('textarea[name="message"]').fill('Alhamdulillah berkat bimbingan para guru di MI AL-AHMAD dasar keilmuan saya terbangun kokoh.');

    // Submit
    const submitBtn = page.locator('button[type="submit"]:has-text("Simpan Data Alumni")').first();
    await submitBtn.click();

    // Verify feedback message
    await expect(page.locator('text=berhasil disimpan').first()).toBeVisible({ timeout: 10000 });
  });
});
