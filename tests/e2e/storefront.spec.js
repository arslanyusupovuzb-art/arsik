import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('loads the entire catalog without runtime errors', async ({page}, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Your next idea.Without limits.');
  await expect(page.getByTestId('product-card')).toHaveCount(13);
  await expect(page.locator('[data-product-id="chatgpt-sprint"] .price')).toHaveAttribute('data-cents','900');
  await expect(page.locator('[data-product-id="cursor-ultra"]')).toContainText('No Warranty');
  await page.evaluate(() => document.fonts.ready);
  expect(errors).toEqual([]);
  await testInfo.attach('storefront', {body:await page.screenshot({fullPage:true}),contentType:'image/png'});
});

test('category filters and numeric price sorting work', async ({page}) => {
  await page.goto('/');
  for (const [name, count] of [['ChatGPT',4],['Claude',2],['Grok',5],['Cursor',2],['All',13]]) {
    const button = page.getByRole('button',{name:new RegExp('^'+name+'\\s*\\d+$')});
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed','true');
    await expect(page.getByTestId('product-card')).toHaveCount(count);
  }
  await page.getByLabel('Sort products').selectOption('price-asc');
  await expect(page.getByTestId('product-card').first()).toHaveAttribute('data-product-id','grok-trial');
  await page.getByLabel('Sort products').selectOption('price-desc');
  await expect(page.getByTestId('product-card').first()).toHaveAttribute('data-product-id','claude-compute');
});

test('command search supports shortcuts, empty results, and selection', async ({page}) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog')).toBeVisible();
  const input = page.getByRole('combobox');
  await expect(input).toBeFocused();
  await input.fill('unlikely-nonexistent-plan-xyz');
  await expect(page.getByText('No tools found')).toBeVisible();
  await input.fill('Cursor');
  await expect(page.getByRole('option')).toHaveCount(2);
  await page.getByRole('option',{name:/Cursor Pro/}).click();
  await expect(page.getByRole('dialog')).toContainText('Cursor Pro — 2-Month Developer Pass');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Search products',exact:true})).toBeFocused();
});

test('drawer validates input, calculates quantities, and copies a real specification', async ({page,context}) => {
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/');
  const buy = page.getByRole('button',{name:'Buy ChatGPT Plus — 5H Sprint Pass',exact:true});
  await buy.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Shared / Instant Access');
  await dialog.getByRole('button',{name:'Copy order spec',exact:true}).click();
  await expect(page.getByLabel('Delivery email')).toBeFocused();
  await page.getByLabel('Delivery email').fill('buyer@example.com');
  await page.getByRole('button',{name:'Increase quantity'}).click();
  await expect(dialog.locator('.total-price')).toHaveAttribute('data-cents','1800');
  await dialog.getByRole('button',{name:'Copy order spec',exact:true}).click();
  await expect(page.getByText('Order spec copied',{exact:true})).toBeVisible();
  const spec = await page.evaluate(() => navigator.clipboard.readText());
  expect(spec).toContain('Total: $18.00');
  expect(spec).toContain('Listed coverage: 5 Hours Warranty');
  expect(spec).toContain('Delivery email: buyer@example.com');
  expect(spec).toContain('not a payment receipt or confirmation');
  await dialog.getByRole('button',{name:'Close dialog'}).click();
  await expect(buy).toBeFocused();
});

test('no warranty requires acknowledgment and quantities remain bounded', async ({page,context}) => {
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await page.goto('/');
  await page.getByRole('button',{name:'Buy Cursor Ultra — 1-Month Uncapped Power',exact:true}).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('This plan is sold as-is with no warranty');
  await expect(dialog.getByRole('button',{name:'Decrease quantity'})).toBeDisabled();
  await page.getByLabel('Delivery email').fill('buyer@example.com');
  await dialog.getByRole('button',{name:'Copy order spec',exact:true}).click();
  await expect(dialog.getByRole('checkbox')).toBeFocused();
  await dialog.getByRole('checkbox').check();
  for(let i=0;i<4;i++) await dialog.getByRole('button',{name:'Increase quantity'}).click();
  await expect(dialog.getByRole('button',{name:'Increase quantity'})).toBeDisabled();
  await expect(dialog.locator('.total-price')).toHaveAttribute('data-cents','59945');
  await dialog.getByRole('button',{name:'Copy order spec',exact:true}).click();
  await expect(page.getByText('Order spec copied',{exact:true})).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('Listed coverage: No Warranty');
});

test('clipboard failure exposes a selectable order instead of losing it', async ({page}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async () => {throw new Error('denied');}}});
  });
  await page.goto('/');
  await page.getByRole('button',{name:'Buy ChatGPT Go — Personal Lite Activation',exact:true}).click();
  await page.getByLabel('Delivery email').fill('buyer@example.com');
  await page.getByRole('button',{name:'Copy order spec',exact:true}).click();
  const spec = page.getByLabel('Your order specification');
  await expect(spec).toBeVisible();
  await expect(spec).toHaveValue(/Personal account activation instructions by email/);
  await expect(spec).toHaveValue(/Total: \$6\.99/);
});

test('responsive layouts avoid horizontal overflow and respect reduced motion', async ({page}) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Buy ChatGPT Plus — Personal Account Upgrade',exact:true}).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const box = await dialog.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x+box.width).toBeLessThanOrEqual(391);
  expect(box.y+box.height).toBeLessThanOrEqual(845);
  const duration = await dialog.evaluate(el => parseFloat(getComputedStyle(el).animationDuration));
  expect(duration).toBeLessThanOrEqual(.01);
});

test('home and checkout have no serious accessibility violations', async ({page}) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const home = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(home.violations).toEqual([]);
  await page.getByRole('button',{name:'Buy ChatGPT Plus — Personal Account Upgrade',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const checkout = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(checkout.violations).toEqual([]);
  await expect(page.locator('input[type="password"]')).toHaveCount(0);
});
