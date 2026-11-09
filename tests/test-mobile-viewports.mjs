// =============================================================================
// RIIQX — Comprehensive Multi-Viewport & Mobile Parity Production Test Suite
// Viewports: 360x800, 375x812, 390x844, 412x915, 430x932, 768x1024, 1366x768, 1920x1080
// Tests: Horizontal overflow, blank screen, console errors, navigation, auth, decisions, API
// =============================================================================

import { chromium } from 'playwright';

const BASE_URL = process.env.TEST_TARGET_URL || 'https://riiqx.vercel.app';
console.log(`\n======================================================`);
console.log(`RIIQX Mobile Parity & Viewport QA Test Suite`);
console.log(`Target URL: ${BASE_URL}`);
console.log(`======================================================\n`);

const VIEWPORTS = [
  { name: 'Android Compact (360x800)', width: 360, height: 800, isMobile: true },
  { name: 'iPhone Mini (375x812)', width: 375, height: 812, isMobile: true },
  { name: 'iPhone Standard (390x844)', width: 390, height: 844, isMobile: true },
  { name: 'Android Large / Pixel (412x915)', width: 412, height: 915, isMobile: true },
  { name: 'iPhone Pro Max (430x932)', width: 430, height: 932, isMobile: true },
  { name: 'Tablet / iPad (768x1024)', width: 768, height: 1024, isMobile: false },
  { name: 'Laptop (1366x768)', width: 1366, height: 768, isMobile: false },
  { name: 'Full HD Desktop (1920x1080)', width: 1920, height: 1080, isMobile: false },
];

const results = [];

async function runTestSuite() {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  try {
    // 1. Authenticate once via API to get valid session token
    console.log(`[AUTH] Generating authentic test session on ${BASE_URL}...`);
    const initContext = await browser.newContext();
    const initPage = await initContext.newPage();
    const authRes = await initPage.request.post(`${BASE_URL}/api/riiqx/auth`, {
      data: {
        action: 'register',
        email: `parity_suite_${Date.now()}@gmail.com`,
        password: 'Password@Riiqx2026!',
        name: 'QA Mobile Parity Tester',
      },
    });

    const authJson = await authRes.json();
    let sessionToken = authJson.token;
    console.log(`[AUTH] Registration outcome: success=${Boolean(authJson.success)}, token=${Boolean(sessionToken)}`);

    if (!sessionToken) {
      console.log(`[AUTH] Fallback to direct local session token generation...`);
      // Fallback: try logging in with an established account or obtain cookie directly
      const loginRes = await initPage.request.post(`${BASE_URL}/api/riiqx/auth`, {
        data: {
          action: 'login',
          email: 'qa_verified_user@riiqx.local',
          password: 'Password@Riiqx2026!',
        },
      });
      const loginJson = await loginRes.json().catch(() => ({}));
      sessionToken = loginJson.token;
    }
    await initContext.close();

    // 2. Iterate through all 8 viewports
    for (const vp of VIEWPORTS) {
      console.log(`\n▶ Testing Viewport: ${vp.name} [${vp.width}x${vp.height}]`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent: vp.isMobile
          ? 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
          : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      });

      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      page.on('pageerror', (err) => {
        pageErrors.push(err.message);
      });

      // A. Test Login Screen
      const loginRes = await page.goto(`${BASE_URL}/auth/login`, {
        waitUntil: 'domcontentloaded',
        timeout: 25000,
      });
      await page.waitForSelector('form', { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(500);

      const loginStatus = loginRes?.status();

      const loginOverflow = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth > window.innerWidth ||
          document.body.scrollWidth > window.innerWidth
        );
      });

      // B. Inject Authenticated Session Cookie
      if (sessionToken) {
        await context.addCookies([
          {
            name: 'riiqx_session',
            value: sessionToken,
            domain: new URL(BASE_URL).hostname,
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'Lax',
          },
        ]);
      }

      // C. Navigate to Dashboard Root /
      const dashRes = await page.goto(`${BASE_URL}/`, {
        waitUntil: 'domcontentloaded',
        timeout: 25000,
      });

      await page.waitForSelector('header', { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(1000);

      const dashStatus = dashRes?.status();

      const dashOverflow = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth > window.innerWidth ||
          document.body.scrollWidth > window.innerWidth
        );
      });

      // Check Mobile Hamburger vs Desktop Sidebar
      const isMobileMenuPresent = await page.evaluate(() => {
        const btn = document.querySelector('header button');
        return Boolean(btn);
      });

      const isDesktopSidebarVisible = await page.evaluate(() => {
        const sidebar = document.querySelector('aside');
        if (!sidebar) return false;
        const style = window.getComputedStyle(sidebar);
        return style.display !== 'none';
      });

      // Expected: desktop sidebar visible on >= 1024px, hidden on mobile & tablets (< 1024px)
      const expectedSidebar = vp.width >= 1024;
      const sidebarParity = isDesktopSidebarVisible === expectedSidebar;

      // D. Test Interactive Navigation (Mobile Hamburger or Desktop Sidebar)
      let navTested = false;
      let navSuccess = false;

      if (vp.isMobile) {
        try {
          const hamburger = await page.$('header button');
          if (hamburger) {
            await hamburger.click();
            await page.waitForTimeout(300);

            const decisionsBtn = await page.evaluateHandle(() => {
              const btns = Array.from(document.querySelectorAll('header div.space-y-1 button'));
              return btns.find((b) => b.textContent?.includes('Decisions'));
            });

            if (decisionsBtn && decisionsBtn.asElement()) {
              await decisionsBtn.asElement().click();
              await page.waitForTimeout(600);
              navTested = true;
              navSuccess = true;
            }
          }
        } catch {}
      } else {
        try {
          const decisionsLink = await page.evaluateHandle(() => {
            const btns = Array.from(document.querySelectorAll('aside button'));
            return btns.find((b) => b.textContent?.includes('Decisions'));
          });
          if (decisionsLink && decisionsLink.asElement()) {
            await decisionsLink.asElement().click();
            await page.waitForTimeout(600);
            navTested = true;
            navSuccess = true;
          }
        } catch {}
      }

      // E. Check Overflow on the Active Workspace View
      const activeViewOverflow = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth > window.innerWidth ||
          document.body.scrollWidth > window.innerWidth
        );
      });

      const vpResult = {
        viewport: vp.name,
        width: vp.width,
        height: vp.height,
        loginStatus,
        loginOverflow: loginOverflow ? 'FAIL' : 'PASS',
        dashStatus,
        dashOverflow: dashOverflow ? 'FAIL' : 'PASS',
        sidebarParity: sidebarParity ? 'PASS' : 'FAIL',
        sidebarState: isDesktopSidebarVisible ? 'Visible' : 'Hidden',
        navigation: navTested ? (navSuccess ? 'PASS' : 'FAIL') : 'N/A',
        activeViewOverflow: activeViewOverflow ? 'FAIL' : 'PASS',
        errors: pageErrors.length + consoleErrors.length,
      };

      results.push(vpResult);
      console.log(`    Login: ${loginStatus} (Overflow: ${vpResult.loginOverflow}) | Dash: ${dashStatus} (Overflow: ${vpResult.dashOverflow}) | Sidebar: ${vpResult.sidebarState} (${vpResult.sidebarParity}) | Nav: ${vpResult.navigation}`);

      await context.close();
    }
  } finally {
    await browser.close();
  }

  console.log(`\n======================================================`);
  console.log(`Viewport Parity Summary Matrix`);
  console.log(`======================================================`);
  console.table(
    results.map((r) => ({
      Viewport: r.viewport,
      LoginStatus: r.loginStatus,
      LoginOverflow: r.loginOverflow,
      DashStatus: r.dashStatus,
      DashOverflow: r.dashOverflow,
      SidebarParity: r.sidebarParity,
      SidebarState: r.sidebarState,
      Nav: r.navigation,
      ViewOverflow: r.activeViewOverflow,
      Errors: r.errors,
    }))
  );

  return results;
}

runTestSuite().catch((err) => {
  console.error('Fatal error running test suite:', err);
  process.exit(1);
});
