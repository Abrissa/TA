import { test, expect } from '@playwright/test';

const pagesToTest = [
  { name: 'Home', path: '/' },
  { name: 'Visi Misi', path: '/visi-misi' },
  { name: 'Guru', path: '/guru' },
  { name: 'Prestasi', path: '/prestasi' },
  { name: 'Artikel', path: '/artikel' },
  { name: 'Alumni', path: '/alumni' },
  { name: 'PPDB', path: '/ppdb' },
];

test.describe('Image loading audit across all pages', () => {
  for (const p of pagesToTest) {
    test(`Images on ${p.name} page (${p.path}) load successfully without broken images`, async ({ page }) => {
      await page.goto(p.path);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Scroll to trigger any intersection observers
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(300);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);

      // Wait for all img elements to complete loading
      await page.evaluate(async () => {
        const imgs = Array.from(document.querySelectorAll('img'));
        await Promise.all(
          imgs.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.addEventListener('load', resolve, { once: true });
              img.addEventListener('error', resolve, { once: true });
            });
          })
        );
      });

      // Evaluate all <img> elements on the page
      const images = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.map((img) => ({
          src: img.getAttribute('src') || '',
          currentSrc: img.currentSrc,
          alt: img.getAttribute('alt') || '',
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        }));
      });

      expect(images.length, `Expected at least one image on ${p.name}`).toBeGreaterThan(0);

      const brokenImages: typeof images = [];
      for (const img of images) {
        const isLoaded = img.complete && img.naturalWidth > 0;
        console.log(`[${p.name}] Image [${img.alt || 'no-alt'}]: src="${img.src}" | loaded=${isLoaded} | size=${img.naturalWidth}x${img.naturalHeight}`);
        if (!isLoaded) {
          brokenImages.push(img);
        }
      }

      expect(brokenImages, `Found ${brokenImages.length} broken images on page ${p.name}: ${JSON.stringify(brokenImages)}`).toHaveLength(0);
    });
  }
});
