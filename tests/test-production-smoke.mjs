import { chromium } from 'playwright';

async function run() {
  console.log('Launching Chrome...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });

  const page = await browser.newPage();
  
  const consoleMessages = [];
  const errors = [];
  page.on('console', msg => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => errors.push(err.toString()));

  console.log('Navigating to https://riiqx.vercel.app...');
  const res = await page.goto('https://riiqx.vercel.app', { waitUntil: 'networkidle' });

  console.log('Final URL:', page.url());
  console.log('Response Status:', res?.status());
  console.log('Title:', await page.title());
  console.log('Errors:', errors);
  console.log('Console logs count:', consoleMessages.length);
  if (consoleMessages.length > 0) {
    console.log('Console logs (sample):', consoleMessages.slice(0, 10));
  }

  await browser.close();
  console.log('Done.');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

