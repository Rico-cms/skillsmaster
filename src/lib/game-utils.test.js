import test from 'node:test';
import assert from 'node:assert/strict';
import { makeReportText, normalizeImportedCards, validateCard } from './game-utils.js';

const categories = ['communication', 'leadership'];

test('valide une carte défi complète', () => {
  assert.deepEqual(validateCard({ title: 'Test', scenario: 'Agir', categoryId: 'communication', type: 'challenge', duration: 30, points: 1 }, categories), []);
});

test('refuse un quiz sans bonne réponse valide', () => {
  const errors = validateCard({ title: 'Test', scenario: 'Question', categoryId: 'communication', type: 'quiz', duration: 30, points: 1, options: ['A', 'B'], correctIndex: 4 }, categories);
  assert.ok(errors.includes('La bonne réponse est invalide.'));
});

test('normalise un paquet importé', () => {
  const [card] = normalizeImportedCards([{ title: ' Défi ', scenario: ' Faire ', categoryId: 'leadership', type: 'challenge', duration: '45', points: '2' }], categories);
  assert.equal(card.title, 'Défi');
  assert.equal(card.duration, 45);
  assert.equal(card.custom, true);
});

test('génère un rapport lisible', () => {
  const report = makeReportText({ date: '2026-01-01T12:00:00.000Z', mode: 'solo', deckFilter: 'all', roundsPlayed: 2, maxRounds: 2, missedCount: 1, results: [{ name: 'Ada', score: 3 }] });
  assert.match(report, /Ada — 3 pts/);
  assert.match(report, /Cartes à réviser : 1/);
});
