# qa-automation-challenge
QA specialist automation challenge

## Objective
Automate key workflows on the SkillsVR Website (https://skillsvr.com/) to demonstrate ability to:
* Write maintainable automated tests
* Handle dynamic UI elements
* Validate error and success flows
* Produce clear test reports

## Tools & Language
* **Framework:** Playwright
* **Language:** TypeScript
* **Browsers:** Chromium, Firefox, WebKit

## Scenarios Automated
See [scenarios.md](scenarios.md) for full details:

### 1. Blog Navigation
- Navigates from homepage → VR Training → Training Course → Blog
- Verifies blog posts load correctly with titles and dates
- Handles popup windows and dynamic menus

### 2. Blog Pagination
- Tests pagination controls (arrows and page numbers)
- Validates content updates between pages
- Verifies chronological date ordering (newest → oldest)

### 3. Negative Sign-In
- Empty form submission validation
- Invalid email format error handling  
- Invalid credentials error messaging
- Verifies no redirect on failed login

---

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)

### Installation

1. **Clone and navigate to the project:**
```bash
   git clone 
   cd qa-automation-challenge
```

2. **Install dependencies:**
```bash
   npm install
```

3. **Install Playwright browsers:**
```bash
   npx playwright install
```
---

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run a specific test
```bash
npx playwright test tests/blogNavigation.spec.ts
npx playwright test tests/blogPagination.spec.ts
npx playwright test tests/negativeSignIn.spec.ts
```

### Browser-specific execution
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Development / Debugging

Run in headed mode (watch browser):
```bash
npx playwright test --headed
```

Debug mode (step through):
```bash
npx playwright test --debug
```

Interactive UI mode:
```bash
npx playwright test --ui
```

---

## Test Reports

### Viewing Reports
After running tests, view the HTML report:
```bash
npx playwright show-report reports/playwright-report
```

### What's Included
- Test execution results (pass/fail)
- Test annotations with captured data (blog titles, dates, error messages)
- Screenshots on failure
- Execution time and browser information

### Artifacts Location
- **HTML Report:** `reports/playwright-report/`
- **Screenshots:** `reports/test-results/`

---

## Project Structure
```
qa-automation-challenge/
├── tests/
│   ├── blogNavigation.spec.ts    # Scenario 1
│   ├── blogPagination.spec.ts    # Scenario 2
│   └── negativeSignIn.spec.ts    # Scenario 3
├── reports/
│   ├── playwright-report/        # HTML reports
│   └── test-results/             # Screenshots & artifacts
├── playwright.config.ts          # Test configuration
├── package.json                  # Dependencies
├── scenarios.md                  # Test scenarios
└── README.md                     # This file
```

---

## Implementation Details

- TypeScript for type safety
- Cross-browser testing (Chromium, Firefox, WebKit)
- Test steps for structured reporting
- Screenshots captured on failure
- Test annotations with captured data

---

## Notes

- **No credentials required:** Negative sign-in tests validate error handling only
- **Cross-browser compatible:** All tests verified on Chromium, Firefox, and WebKit
- **Test isolation:** Each test runs independently for reliability
- **All dependencies:** Listed in `package.json` and installed via `npm install`

---

## Author

**Branch:** `ben-marrett`