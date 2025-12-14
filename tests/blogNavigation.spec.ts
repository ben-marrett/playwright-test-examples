import { test, expect, Page } from '@playwright/test';

// Configurable base URL for privacy
const BASE_URL = process.env.TEST_BASE_URL || 'https://example.com/';

// Small selector constants to keep test easy to update
const BLOG_CONTAINER = '#_dynamic_list-199-247';
const TITLE_SEL = 'h2.ct-headline';

test('should navigate to blog from homepage', async ({ page }) => {
    await test.step('Navigate to homepage and handle cookie banner', async () => {
        await page.goto(BASE_URL);

        const acceptButton = page.getByRole('button', { name: 'Accept & Close' });
        if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await acceptButton.click();
        }

        await expect(page).toHaveTitle(/Sample App|Homepage|Welcome/);
    });

    let coursePage: Page;

    await test.step('Navigate to VR Training marketplace', async () => {
        const vrTrainingLink = page.getByRole('link', { name: 'VR Training' });
        await expect(vrTrainingLink).toBeVisible();
        await vrTrainingLink.click();
        await expect(page).toHaveURL(/marketplace/);
    });

    await test.step('Open training course in new tab', async () => {
        [coursePage] = await Promise.all([
            page.waitForEvent('popup'),
            page.getByRole('link', { name: 'DEMO Empowered Reality' }).click()
        ]);
        await coursePage.waitForLoadState('networkidle');
    });

    await test.step('Navigate to Blog via Resources menu', async () => {
        const mainMenu = coursePage.locator('#div_block-441-27102');
        const resourcesLink = mainMenu.getByText('Resources');
        await expect(resourcesLink).toBeVisible();
        await resourcesLink.click();

        const blogLink = coursePage.locator('.hosting-submenu-small-unit').filter({ hasText: 'Blog' });
        await expect(blogLink).toBeVisible();
        await blogLink.click();
    });

    await test.step('Verify blog listing page loads correctly', async () => {
        await expect(coursePage).toHaveURL(/\/blog/);
        const blogHeader = coursePage.getByText('Keep up with all things');
        await expect(blogHeader).toBeVisible();

        const blogContainer = coursePage.locator(BLOG_CONTAINER);
        await expect(blogContainer).toBeVisible();

        const blogTitles = blogContainer.locator(TITLE_SEL);
        const titles: string[] = await blogTitles.allTextContents();
        const blogPosts = blogContainer.locator('[data-id="div_block-202-247"]');

        // Assertions
        expect(titles.length).toBeGreaterThan(3);
        await expect(blogPosts.first()).toBeVisible();

        // Add to test report
        test.info().annotations.push({
            type: 'note',
            description: `Found ${titles.length} blog posts on the first page:\n${titles.map((t: string, i: number) => `${i + 1}. ${t.trim()}`).join('\n')}`
        });
    });
});