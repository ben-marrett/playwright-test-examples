import { test, expect, Page } from '@playwright/test';

// Configurable base URL for privacy
const BASE_URL = process.env.TEST_BASE_URL || 'https://example.com/';

// Selector constants for login form
const EMAIL_SEL = '[placeholder="Email Address"], input[name="email"]';
const PASSWORD_SEL = '[placeholder="Password"], input[name="password"]';
const ERROR_EMPTY_EMAIL = 'Please enter your Email';
const ERROR_EMPTY_PASSWORD = 'Please enter your password';
const ERROR_INVALID_FORMAT = 'Please enter a valid email';
const ERROR_INVALID_CREDENTIALS = 'Email or password is invalid.';

test('should handle negative sign-in scenarios correctly', async ({ page }) => {
    let loginPage: Page;

    await test.step('Navigate and open sign-in popup', async () => {
    await page.goto(BASE_URL);

        const acceptButton = page.getByRole('button', { name: 'Accept & Close' });
        if (await acceptButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await acceptButton.click();
        }

        [loginPage] = await Promise.all([
            page.waitForEvent('popup'),
            page.getByRole('link', { name: 'Sign In' }).click()
        ]);

        await loginPage.waitForLoadState('networkidle');

        // Handle region selection screen
    const regionHeader = loginPage.getByText(/Log in to (.+)/);
        if (await regionHeader.isVisible({ timeout: 3000 }).catch(() => false)) {
            // Click the action button to proceed (region already selected)
            await loginPage.locator('[data-test-id="ActionBtn"]').click();
        }

        // Now we should be on the actual sign-in page
        await expect(loginPage.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    });

    await test.step('Scenario 1: Empty email and password', async () => {
        await loginPage.getByRole('button', { name: 'Sign in' }).click();

        await expect(loginPage.getByText(ERROR_EMPTY_EMAIL)).toBeVisible();
        await expect(loginPage.getByText(ERROR_EMPTY_PASSWORD)).toBeVisible();
        await expect(loginPage.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    });

    await test.step('Scenario 2: Invalid email format', async () => {
        await loginPage.locator(EMAIL_SEL).fill('user@wrong');
        await loginPage.locator(PASSWORD_SEL).fill('password123');
        await loginPage.getByRole('button', { name: 'Sign in' }).click();

        await expect(loginPage.getByText(ERROR_INVALID_FORMAT)).toBeVisible();

        // Clear for next scenario
        await loginPage.locator(EMAIL_SEL).clear();
        await loginPage.locator(PASSWORD_SEL).clear();
    });

    await test.step('Scenario 3: Valid format but invalid credentials', async () => {
        await loginPage.locator(EMAIL_SEL).fill('test@gmail.com');
        await loginPage.locator(PASSWORD_SEL).fill('WrongPassword123!');
        await loginPage.getByRole('button', { name: 'Sign in' }).click();

        await expect(loginPage.getByText(ERROR_INVALID_CREDENTIALS)).toBeVisible({ timeout: 10000 });
    });

    await test.step('Verify no redirect occurred', async () => {
        // Verify we're still on the login/auth page
        await expect(loginPage).toHaveURL(/login|signin|auth/);

        // Verify login heading still visible (additional check)
        await expect(loginPage.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    });

    test.info().annotations.push({
        type: 'note',
        description: `Negative sign-in scenarios verified:
            - Empty fields → Validation errors shown
            - Invalid format (user@wrong) → Format error shown
            - Invalid credentials (test@gmail.com) → Auth error shown
            - All scenarios remained on login page`
    });
});