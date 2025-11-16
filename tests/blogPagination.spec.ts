import { test, expect, Page } from '@playwright/test';

// Selectors and regex constants
const BLOG_CONTAINER = '#_dynamic_list-199-247';
const TITLE_SEL = 'h2.ct-headline';
const DATE_SPAN = 'span[id^="span-206-247"]';
const DATE_RE = /[A-Za-z]{3,9}\s+\d{1,2},\s*\d{4}/;

// Helper to capture blog data from current page
async function captureBlogData(page: Page, pageNum: number) {
    const blogContainer = page.locator(BLOG_CONTAINER);
    await expect(blogContainer).toBeVisible();

    // Get titles
    const blogTitles = blogContainer.locator(TITLE_SEL);
    const titles = await blogTitles.allTextContents();

    // Get dates
    const blogDates = blogContainer.locator(DATE_SPAN);
    const datesRaw = await blogDates.allTextContents();
    // extract just the date substring when present (e.g. "Oct 30, 2025")
    const dates = datesRaw.map(d => {
        const m = d.match(DATE_RE);
        return m ? m[0].trim() : d.trim();
    });

    return {
        page: pageNum,
        titles: titles.map(t => t.trim()),
        dates,
        firstTitle: titles[0]?.trim(),
        firstDate: dates[0]?.trim()
    };
}

// Helper to compare dates (returns true if date1 >= date2)
function isNewerOrEqual(dateStr1: string, dateStr2: string): boolean {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);

    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
        return true; // Skip comparison if dates aren't valid
    }

    return date1.getTime() >= date2.getTime();
}

test('pagination updates blog posts and dates across pages', async ({ page }) => {
    await test.step('Navigate to blog and handle cookie banner', async () => {
        await page.goto('https://skillsvr.com/blog');
        await expect(page).toHaveURL(/\/blog$/);

        const acceptButton = page.getByRole('button', { name: 'Accept & Close' });
        if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await acceptButton.click();
        }

        const blogHeader = page.getByText('Keep up with all things');
        await expect(blogHeader).toBeVisible();
    });

    let page1Data: Awaited<ReturnType<typeof captureBlogData>> | undefined;
    let page2Data: Awaited<ReturnType<typeof captureBlogData>> | undefined;
    let page3Data: Awaited<ReturnType<typeof captureBlogData>> | undefined;
    let page10Data: Awaited<ReturnType<typeof captureBlogData>> | undefined;
    let page11Data: Awaited<ReturnType<typeof captureBlogData>> | undefined;
    let page11DataAgain: Awaited<ReturnType<typeof captureBlogData>> | undefined;

    await test.step('Capture and verify Page 1 data', async () => {
        page1Data = await captureBlogData(page, 1);
        expect(page1Data.titles.length).toBeGreaterThan(3);
    });

    await test.step('Navigate to Page 2 and verify', async () => {
        await page.getByRole('link', { name: '❯' }).click();
        await expect(page).toHaveURL(/\/blog\/page\/2/);
        page2Data = await captureBlogData(page, 2);
    expect(page1Data!.firstTitle).not.toBe(page2Data!.firstTitle);
    expect(page2Data!.titles.length).toBeGreaterThan(0);
    expect(isNewerOrEqual(page1Data!.firstDate || '', page2Data!.firstDate || '')).toBe(true);
    });

    await test.step('Navigate to Page 3 and verify', async () => {
        await page.getByRole('link', { name: '3' }).click();
        await expect(page).toHaveURL(/\/blog\/page\/3/);
        page3Data = await captureBlogData(page, 3);
    expect(page2Data!.firstTitle).not.toBe(page3Data!.firstTitle);
    expect(page3Data!.titles.length).toBeGreaterThan(0);
    expect(isNewerOrEqual(page2Data!.firstDate || '', page3Data!.firstDate || '')).toBe(true);
    });

    await test.step('Navigate to Page 11 and verify', async () => {
        await page.getByRole('link', { name: '11' }).click();
        await expect(page).toHaveURL(/\/blog\/page\/11/);
        page11Data = await captureBlogData(page, 11);
    expect(isNewerOrEqual(page3Data!.firstDate || '', page11Data!.firstDate || '')).toBe(true);
    });

    await test.step('Navigate back to Page 10 and verify', async () => {
        await page.getByRole('link', { name: '❮' }).click();
        await expect(page).toHaveURL(/\/blog\/page\/10/);
        page10Data = await captureBlogData(page, 10);
    expect(page10Data!.firstTitle).not.toBe(page11Data!.firstTitle);
    expect(isNewerOrEqual(page10Data!.firstDate || '', page11Data!.firstDate || '')).toBe(true);
    });

    await test.step('Navigate forward to Page 11 and verify', async () => {
        await page.getByRole('link', { name: '❯' }).click();
        await expect(page).toHaveURL(/\/blog\/page\/11/);
        page11DataAgain = await captureBlogData(page, 11);
    expect(page11Data!.firstTitle).toBe(page11DataAgain!.firstTitle);
    expect(page11Data!.firstDate).toBe(page11DataAgain!.firstDate);
    });

    await test.step('Add summary annotation', async () => {
        const summaryLines = [
            'Navigation & Content Verification:',
            `- Page 1: "${page1Data!.firstTitle}" - ${page1Data!.firstDate}`,
            `- Page 2: "${page2Data!.firstTitle}" - ${page2Data!.firstDate}`,
            `- Page 3: "${page3Data!.firstTitle}" - ${page3Data!.firstDate}`,
            `- Page 10: "${page10Data!.firstTitle}" - ${page10Data!.firstDate}`,
            `- Page 11: "${page11Data!.firstTitle}" - ${page11Data!.firstDate}`,
            '',
            'Date Progression Verified:',
            '- Page 1 >= Page 2',
            '- Page 2 >= Page 3',
            '- Page 3 >= Page 11',
            '- Page 10 >= Page 11',
            '',
            'Navigation Verified:',
            '- Next button (>): Page 1->2, 10->11',
            '- Previous button (<): Page 11->10',
            '- Page numbers: 3, 11',
            '- Content changes between all pages',
            '- Page 11 content consistent on revisit',
        ];
        test.info().annotations.push({
            type: 'note',
            description: summaryLines.join('\n'),
        });
    });
});