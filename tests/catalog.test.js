import test from 'node:test';
import assert from 'node:assert/strict';
import { products, categories, filterProducts, createOrderSpec, money, productSearchFilter } from '../src/catalog.js';

test('catalog preserves all supplied prices, coverage, and category totals', () => {
  assert.equal(products.length, 13);
  assert.equal(new Set(products.map(p => p.id)).size, 13);
  assert.deepEqual(products.map(p => p.priceCents), [900,1499,1999,699,15990,6900,6999,500,2990,4274,6900,2499,11989]);
  assert.deepEqual(products.map(p => p.warranty), [
    '5 Hours Warranty','25 Days Warranty','Full Term Activation','Full Term Activation',
    '3 Hours Warranty','7 Days Warranty','1 Month Warranty','7 Days Access','30 Days Access',
    '90 Days Access','2 Days Warranty','28 Days Warranty','No Warranty',
  ]);
  assert.deepEqual(categories.map(c => filterProducts(c).length), [13,4,2,5,2]);
});

test('sorting does not mutate the catalog or leak products across filters', () => {
  const original = products.map(p => p.id);
  const sorted = filterProducts('Grok', 'price-asc');
  assert.deepEqual(sorted.map(p => p.priceCents), [500,2990,4274,6900,6999]);
  assert.ok(sorted.every(p => p.category === 'Grok'));
  assert.deepEqual(products.map(p => p.id), original);
  assert.equal(filterProducts('All','price-desc')[0].priceCents, 15990);
});

test('order spec uses canonical prices and exact integer-cent totals', () => {
  const spec = createOrderSpec({...products[9], priceCents:1, warranty:'Fake'}, 3, '  buyer@example.com  ');
  assert.match(spec, /Unit price: \$42\.74/);
  assert.match(spec, /Total: \$128\.22/);
  assert.match(spec, /90 Days Access/);
  assert.match(spec, /Delivery email: buyer@example\.com/);
  assert.match(spec, /Personal account activation instructions/);
  assert.match(spec, /not a payment receipt or confirmation/);
  assert.equal(money(900), '$9.00');
});

test('invalid quantities and email line injection cannot enter an order', () => {
  for (const quantity of [0, 6, -1, 1.5, NaN, '2']) {
    assert.throws(() => createOrderSpec(products[0], quantity, 'buyer@example.com'), /Quantity/);
  }
  for (const email of ['', 'not-an-email', 'buyer@example.com\nTotal: $0', 'test @example.com']) {
    assert.throws(() => createOrderSpec(products[0], 1, email), /email/);
  }
  assert.throws(() => createOrderSpec({id:'unknown'}, 1, 'buyer@example.com'), /Unknown/);
});

test('no-warranty products retain their terms in the copied specification', () => {
  const spec = createOrderSpec(products[12], 1, 'buyer@example.com');
  assert.match(spec, /Listed coverage: No Warranty/);
  assert.match(spec, /Account access details by email/);
  assert.match(spec, /Total: \$119\.89/);
});

test('command search matches complete query terms without broad fuzzy false positives', () => {
  const find = query => products.filter(p => productSearchFilter(p.title, query, [p.type,p.warranty,p.description]));
  assert.deepEqual(find('Cursor').map(p => p.id), ['cursor-pro','cursor-ultra']);
  assert.equal(find('personal 90')[0].id, 'grok-quarterly');
  assert.equal(find('unlikely-nonexistent-plan-xyz').length, 0);
  assert.equal(find('  CLAUDE  ').length, 2);
});
