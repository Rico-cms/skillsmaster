import { useRef, useState } from 'react';
import { ArrowRight, Download, Plus, Trash2, Upload, X } from 'lucide-react';
import { downloadText, normalizeImportedCards, validateCard } from '../lib/game-utils.js';

const EMPTY_CARD = { title: '', scenario: '', explanation: '', categoryId: 'communication', type: 'challenge', duration: 45, points: 1, options: ['Réponse A', 'Réponse B'], correctIndex: 0 };

export default function CardLibraryScreen({ cards, categories, onChange, onBack }) {
  const [draft, setDraft] = useState(EMPTY_CARD);
  const [message, setMessage] = useState('');
  const fileRef = useRef(null);
  const categoryIds = categories.map(category => category.id);

  const addCard = () => {
    const card = { ...draft, id: `custom-${Date.now()}`, duration: Number(draft.duration), points: Number(draft.points), correctIndex: Number(draft.correctIndex), custom: true };
    const errors = validateCard(card, categoryIds);
    if (errors.length) return setMessage(errors.join(' '));
    onChange([...cards, card]);
    setDraft(EMPTY_CARD);
    setMessage('Carte ajoutée au paquet personnalisé.');
  };

  const importCards = async event => {
    try {
      const parsed = JSON.parse(await event.target.files[0].text());
      const imported = normalizeImportedCards(parsed, categoryIds);
      onChange([...cards, ...imported]);
      setMessage(`${imported.length} carte(s) importée(s).`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      event.target.value = '';
    }
  };

  return <div className="w-full max-w-5xl h-[100dvh] sm:h-[92vh] bg-black/70 sm:rounded-[2rem] border border-white/10 text-white flex flex-col overflow-hidden">
    <header className="p-4 sm:p-5 border-b border-white/10 flex items-start justify-between gap-3">
      <div><h2 className="text-xl sm:text-2xl font-black">ATELIER DE CARTES</h2><p className="text-white/60 text-xs sm:text-sm">Créez, importez et exportez vos propres défis.</p></div>
      <button aria-label="Retour au menu" onClick={onBack} className="p-2 rounded-full hover:bg-white/10"><X /></button>
    </header>
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid lg:grid-cols-2 gap-8">
      <section className="space-y-4">
        <h3 className="font-black text-[#FFC20E]">NOUVELLE CARTE</h3>
        <input aria-label="Titre" placeholder="Titre" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} className="field" />
        <textarea aria-label="Scénario" placeholder="Scénario" value={draft.scenario} onChange={e => setDraft({...draft, scenario: e.target.value})} className="field min-h-24" />
        <textarea aria-label="Explication" placeholder="Explication / conseil" value={draft.explanation} onChange={e => setDraft({...draft, explanation: e.target.value})} className="field min-h-20" />
        <div className="grid sm:grid-cols-2 gap-3">
          <select aria-label="Catégorie" value={draft.categoryId} onChange={e => setDraft({...draft, categoryId: e.target.value})} className="field">{categories.map(c => <option className="text-black" key={c.id} value={c.id}>{c.label.replace('<br/>', ' ')}</option>)}</select>
          <select aria-label="Type" value={draft.type} onChange={e => setDraft({...draft, type: e.target.value})} className="field"><option className="text-black" value="challenge">Défi</option><option className="text-black" value="quiz">Quiz</option></select>
          <input aria-label="Durée" type="number" min="10" value={draft.duration} onChange={e => setDraft({...draft, duration: e.target.value})} className="field" />
          <input aria-label="Points" type="number" min="1" value={draft.points} onChange={e => setDraft({...draft, points: e.target.value})} className="field" />
        </div>
        {draft.type === 'quiz' && <div className="space-y-2">{draft.options.map((option, index) => <div key={index} className="flex gap-2"><input type="radio" name="correct" checked={Number(draft.correctIndex) === index} onChange={() => setDraft({...draft, correctIndex: index})}/><input aria-label={`Réponse ${index + 1}`} value={option} onChange={e => setDraft({...draft, options: draft.options.map((item, i) => i === index ? e.target.value : item)})} className="field" /></div>)}<button onClick={() => setDraft({...draft, options: [...draft.options, `Réponse ${draft.options.length + 1}`]})} className="text-sm text-[#FFC20E]">+ Ajouter une réponse</button></div>}
        {message && <p role="status" className="text-sm text-white/70">{message}</p>}
        <button onClick={addCard} className="primary-button"><Plus size={18}/> Ajouter la carte</button>
      </section>
      <section>
        <div className="flex flex-wrap gap-2 mb-5">
          <button onClick={() => fileRef.current?.click()} className="secondary-button"><Upload size={16}/> Importer JSON</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importCards}/>
          <button disabled={!cards.length} onClick={() => downloadText('skillsmaster-cartes.json', JSON.stringify({ cards }, null, 2), 'application/json')} className="secondary-button disabled:opacity-40"><Download size={16}/> Exporter</button>
        </div>
        <h3 className="font-black mb-3">PAQUET PERSONNALISÉ ({cards.length})</h3>
        {!cards.length ? <p className="text-white/50">Aucune carte personnalisée pour le moment.</p> : <div className="space-y-3">{cards.map(card => <article key={card.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-3 justify-between"><div><p className="font-bold">{card.title}</p><p className="text-xs text-white/50">{card.categoryId} · {card.type} · {card.points} pt(s)</p></div><button aria-label={`Supprimer ${card.title}`} onClick={() => onChange(cards.filter(item => item.id !== card.id))} className="text-red-300 hover:text-red-200"><Trash2 size={18}/></button></article>)}</div>}
      </section>
    </div>
    <button onClick={onBack} className="m-5 ml-auto secondary-button">Terminé <ArrowRight size={16}/></button>
  </div>;
}
