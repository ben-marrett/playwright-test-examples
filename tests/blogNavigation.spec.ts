import { test, expect } from '@playwright/test';

test('should navigate to blog from homepage', async ({ page }) => {
	// 1. Navigate to homepage
	await page.goto('https://skillsvr.com/');

	// Handle cookie banner
	const acceptButton = page.getByRole('button', { name: 'Accept & Close' });
	if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
		await acceptButton.click();
	}

	await expect(page).toHaveTitle(/SkillsVR/);

	// 2. Navigate to VR Training marketplace
	const vrTrainingLink = page.getByRole('link', { name: 'VR Training' });
	await expect(vrTrainingLink).toBeVisible();
	await vrTrainingLink.click();
	await expect(page).toHaveURL(/marketplace/);

	// 3. Open training course in new tab
	const [coursePage] = await Promise.all([
		page.waitForEvent('popup'),
		page.getByRole('link', { name: 'DEMO Empowered Reality' }).click()
	]);
	await coursePage.waitForLoadState('networkidle');

	// 4. Navigate to Blog via Resources menu
	const mainMenu = coursePage.locator('#div_block-441-27102');
	const resourcesLink = mainMenu.getByText('Resources');
	await expect(resourcesLink).toBeVisible();
	await resourcesLink.click();

	const blogLink = coursePage.locator('.hosting-submenu-small-unit').filter({ hasText: 'Blog' });
	await expect(blogLink).toBeVisible();
	await blogLink.click();

	// 5. Verify blog listing page loads correctly
	await expect(coursePage).toHaveURL(/\/blog/);
	const blogHeader = coursePage.getByText('Keep up with all things');
	await expect(blogHeader).toBeVisible();

	// Verify blog posts loaded
	const blogContainer = coursePage.locator('#_dynamic_list-199-247');
	await expect(blogContainer).toBeVisible();

	const blogTitles = blogContainer.locator('h2.ct-headline');
	const titles = await blogTitles.allTextContents();
	const blogPosts = blogContainer.locator('[data-id="div_block-202-247"]');

	// Assertions
	expect(titles.length).toBeGreaterThan(3);
	await expect(blogPosts.first()).toBeVisible();

	// Add to test report
	test.info().annotations.push({
		type: 'note',
		description: `Found ${titles.length} blog posts on the first page:\n${titles.map((t, i) => `${i + 1}. ${t.trim()}`).join('\n')}`
	});

});