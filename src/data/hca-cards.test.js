import test from 'node:test';
import assert from 'node:assert/strict';
import { HCA_CARDS } from './hca-cards.js';
import { validateCard } from '../lib/game-utils.js';

test('les deux quiz HCA contiennent 18 cartes valides chacun', () => {
  const kids = HCA_CARDS.filter(card => card.categoryId === 'hca_kids');
  const facilitators = HCA_CARDS.filter(card => card.categoryId === 'hca_facilitators');
  assert.equal(kids.length, 18);
  assert.equal(facilitators.length, 18);
  for (const card of HCA_CARDS) {
    assert.deepEqual(validateCard(card, ['hca_kids', 'hca_facilitators']), [], card.id);
  }
});

test('les identifiants HCA sont uniques', () => {
  assert.equal(new Set(HCA_CARDS.map(card => card.id)).size, HCA_CARDS.length);
});
