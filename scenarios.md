
# Playwright Automation Challenge – Test Scenarios

## Scenario 1 – Blog Navigation
1. From the homepage, click **“VR Training”** (or the marketplace page).
2. Open any **Training Course**.
3. Navigate to the **Blog** page under Resources (or equivalent menu).
4. Verify that the blog listing page loads correctly (titles, images, or summaries appear).

## Scenario 2 – Blog Pagination
1. Verify that pagination buttons (Next/Previous or page numbers) work correctly.
2. Ensure the content updates correctly when moving between pages.

## Scenario 3 – Negative Sign-In
1. Navigate to the **Login / Sign-In** page.
2. Attempt to sign in with:
   - Empty email and password
   - Invalid email format (e.g., user@wrong)
   - Random valid-looking email (e.g., user@example.com) with password
3. Verify that:
   - The page remains on the login screen
   - Proper error messages are shown
   - No success or redirect occurs
