# Humee UI Automation

Playwright-based UI automation suite for Humee dashboard and related flows.

## Tech Stack
- Node.js (CommonJS project)
- Playwright Test

## Project Structure
- `tests/pages/` - page object classes
- `tests/test_scripts/smoke/` - smoke scenarios
- `tests/test_scripts/regression/` - regression scenarios
- `tests/utils/` - fixtures, helpers, data, uploads
- `playwright.config.js` - Playwright config (base URL, projects, reporter)

## Prerequisites
- Node.js 18+ (recommended)
- npm

## Installation
```bash
npm install
npx playwright install
```

## Run Tests

Run all tests:
```bash
npx playwright test
```

Run smoke suite:
```bash
npx playwright test tests/test_scripts/smoke
```

Run regression suite:
```bash
npx playwright test tests/test_scripts/regression
```

Run one spec file:
```bash
npx playwright test tests/test_scripts/regression/05_settingsPage/01_settingsPageTest.spec.js
```

Run in one browser project only:
```bash
npx playwright test --project=chromium
```

Run in headed mode:
```bash
npx playwright test --headed
```

## Reports
HTML report is enabled in config.

Open last report:
```bash
npx playwright show-report
```


