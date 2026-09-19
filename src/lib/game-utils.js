export const GAME_VERSION = 2;

export const createPlayer = (id, name) => ({
  id,
  name: name.trim() || `Joueur ${id}`,
  score: 0,
  scoreByCategory: {},
});

export const validateCard = (card, categoryIds) => {
  const errors = [];
  if (!card || typeof card !== 'object') return ['La carte doit être un objet.'];
  if (!String(card.title || '').trim()) errors.push('Le titre est obligatoire.');
  if (!String(card.scenario || '').trim()) errors.push('Le scénario est obligatoire.');
  if (!categoryIds.includes(card.categoryId)) errors.push('La catégorie est inconnue.');
  if (!['quiz', 'challenge'].includes(card.type)) errors.push('Le type doit être quiz ou challenge.');
  if (!Number.isFinite(Number(card.duration)) || Number(card.duration) < 10) errors.push('La durée doit être d’au moins 10 secondes.');
  if (!Number.isFinite(Number(card.points)) || Number(card.points) < 1) errors.push('Les points doivent être supérieurs à zéro.');
  if (card.type === 'quiz') {
    if (!Array.isArray(card.options) || card.options.length < 2) errors.push('Un quiz doit contenir au moins deux réponses.');
    if (!Number.isInteger(Number(card.correctIndex)) || Number(card.correctIndex) < 0 || Number(card.correctIndex) >= (card.options?.length || 0)) {
      errors.push('La bonne réponse est invalide.');
    }
  }
  return errors;
};

export const normalizeImportedCards = (value, categoryIds) => {
  const cards = Array.isArray(value) ? value : value?.cards;
  if (!Array.isArray(cards)) throw new Error('Le JSON doit contenir un tableau de cartes.');
  return cards.map((card, index) => {
    const normalized = {
      ...card,
      id: String(card.id || `custom-${Date.now()}-${index}`),
      title: String(card.title || '').trim(),
      scenario: String(card.scenario || '').trim(),
      explanation: String(card.explanation || '').trim(),
      duration: Number(card.duration || 30),
      points: Number(card.points || 1),
      correctIndex: card.type === 'quiz' ? Number(card.correctIndex) : undefined,
      options: card.type === 'quiz' ? card.options?.map(String) : undefined,
      custom: true,
    };
    const errors = validateCard(normalized, categoryIds);
    if (errors.length) throw new Error(`Carte ${index + 1} : ${errors.join(' ')}`);
    return normalized;
  });
};

export const buildHistoryEntry = ({ players, mode, roundsPlayed, maxRounds, deckFilter, missedCards }) => ({
  id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  date: new Date().toISOString(),
  mode,
  roundsPlayed,
  maxRounds,
  deckFilter,
  missedCount: missedCards.length,
  results: [...players].sort((a, b) => b.score - a.score),
});

export const makeReportText = (entry) => {
  const title = `SKILLSMASTER — Rapport du ${new Date(entry.date).toLocaleString('fr-FR')}`;
  const details = `Mode : ${entry.mode} · Deck : ${entry.deckFilter || 'all'} · Tours : ${entry.roundsPlayed ?? entry.maxRounds ?? 0}/${entry.maxRounds ?? entry.roundsPlayed ?? 0}`;
  const ranking = entry.results.map((player, index) => `${index + 1}. ${player.name} — ${player.score} pts`).join('\n');
  return `${title}\n${details}\n\nClassement\n${ranking}\n\nCartes à réviser : ${entry.missedCount || 0}`;
};

export const downloadText = (filename, content, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
