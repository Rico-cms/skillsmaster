import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Trophy, Users, User, Check, CheckCircle, XCircle, Plus, History, Award, ArrowRight, Info, CheckSquare, Volume2, VolumeX, BookOpen, Quote, Sparkles, Brain, Heart, Lightbulb, MessageCircle, Crown, Zap } from 'lucide-react';

// --- Configuration & Données ---

const COLORS = {
  background: 'bg-[#B02E68]',
  backgroundGradient: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#db4d86] via-[#B02E68] to-[#6d133b]',
  cards: {
    communication: { 
        main: 'bg-[#00A651]', 
        gradient: 'bg-gradient-to-br from-[#00d468] to-[#007a3b]',
        shadow: 'shadow-green-500/40',
        text: 'text-white' 
    },
    leadership: { 
        main: 'bg-[#F26522]', 
        gradient: 'bg-gradient-to-br from-[#ff8c55] to-[#c4460b]',
        shadow: 'shadow-orange-500/40',
        text: 'text-white' 
    },
    critical_thinking: { 
        main: 'bg-[#EF4136]', 
        gradient: 'bg-gradient-to-br from-[#ff6b61] to-[#b32016]',
        shadow: 'shadow-red-500/40',
        text: 'text-white' 
    },
    emotional_intelligence: { 
        main: 'bg-[#00AEEF]', 
        gradient: 'bg-gradient-to-br from-[#4dd4ff] to-[#0086b8]',
        shadow: 'shadow-sky-500/40',
        text: 'text-white' 
    },
    creativity: { 
        main: 'bg-[#FFC20E]', 
        gradient: 'bg-gradient-to-br from-[#ffe066] to-[#cca300]',
        shadow: 'shadow-yellow-500/40',
        text: 'text-white' 
    }
  }
};

// Mise à jour des icônes pour un look Premium (Composants Lucide au lieu d'Emojis)
const CATEGORIES = {
  COMMUNICATION: { id: 'communication', label: 'COMMUNICATION', colorData: COLORS.cards.communication, icon: MessageCircle },
  LEADERSHIP: { id: 'leadership', label: 'LEADERSHIP', colorData: COLORS.cards.leadership, icon: Crown },
  CRITICAL_THINKING: { id: 'critical_thinking', label: 'CRITICAL THINKING', colorData: COLORS.cards.critical_thinking, icon: Brain },
  EMOTIONAL_INTELLIGENCE: { id: 'emotional_intelligence', label: 'INTELLIGENCE ÉMOTIONNELLE', colorData: COLORS.cards.emotional_intelligence, icon: Heart },
  CREATIVITY: { id: 'creativity', label: 'CRÉATIVITÉ', colorData: COLORS.cards.creativity, icon: Lightbulb }
};

const INITIAL_CARDS = [
  // --- Communication ---
  { id: 'c1', categoryId: 'communication', type: 'challenge', title: 'PRÉSENTATION EXPRESS', scenario: 'Les réseaux sociaux : menace ou opportunité ? Mini-discours de 1 min.', explanation: 'Conseil : Commencez par une accroche forte ("Saviez-vous que..."), donnez 2 arguments opposés, et concluez avec votre avis personnel.', duration: 60 },
  { id: 'c2', categoryId: 'communication', type: 'challenge', title: 'PITCH DE VENTE', scenario: 'Vendez ce stylo (ou un objet proche) au jury en 45 secondes.', explanation: 'Ne vendez pas l\'objet, vendez ce qu\'il permet de faire (ex: "Signer le contrat de votre vie"). Créez le besoin.', duration: 45 },
  { id: 'c3', categoryId: 'communication', type: 'challenge', title: 'SILENCE RADIO', scenario: 'Faites deviner "Projet en retard" sans parler, uniquement avec des gestes.', explanation: 'La communication non-verbale représente plus de 50% du message.', duration: 45 },
  { id: 'c_quiz_1', categoryId: 'communication', type: 'quiz', title: 'ÉCOUTE ACTIVE', scenario: 'Quelle est la clé principale de l’écoute active ?', options: ['Interrompre pour questionner', 'Reformuler ce que dit l’autre', 'Préparer sa réponse'], correctIndex: 1, explanation: 'La reformulation prouve que vous avez compris le message et invite l\'autre à préciser sa pensée.', duration: 30 },
  
  // --- Leadership ---
  { id: 'l1', categoryId: 'leadership', type: 'challenge', title: 'GÉRER UN CONFLIT', scenario: 'Un collègue est toujours en retard. Dites-lui fermement mais poliment.', explanation: 'Utilisez la méthode DESC : Décrire les faits, Exprimer votre ressenti, Suggérer une solution, Conclure sur les conséquences positives.', duration: 45 },
  { id: 'l2', categoryId: 'leadership', type: 'challenge', title: 'MOTIVATION', scenario: 'Votre équipe est découragée après un échec. Remotivez-les en 1 min.', explanation: 'Reconnaissez l\'effort, dédramatisez l\'échec, et focalisez sur la prochaine étape.', duration: 60 },
  { id: 'l_quiz_1', categoryId: 'leadership', type: 'quiz', title: 'STYLE DE LEADERSHIP', scenario: 'Quel style implique le plus l’équipe dans la prise de décision ?', options: ['Autoritaire', 'Démocratique', 'Laissez-faire'], correctIndex: 1, explanation: 'Le style démocratique (ou participatif) invite les collaborateurs à partager leur avis avant la décision finale.', duration: 30 },
  { id: 'l_quiz_2', categoryId: 'leadership', type: 'quiz', title: 'DÉLÉGATION', scenario: 'Pourquoi déléguer est-il important ?', options: ['Pour moins travailler', 'Pour responsabiliser et former', 'Pour éviter les tâches ingrates'], correctIndex: 1, explanation: 'Déléguer fait grandir vos collaborateurs.', duration: 30 },

  // --- Critical Thinking ---
  { id: 'ct1', categoryId: 'critical_thinking', type: 'challenge', title: 'SYSTÈME D', scenario: 'Plus d\'internet 30 min avant le rendu ! Que faites-vous ?', explanation: 'Priorité 1 : Prévenir (téléphone). Priorité 2 : Alternative (partage de connexion 4G, café voisin, clé USB).', duration: 60 },
  { id: 'ct2', categoryId: 'critical_thinking', type: 'challenge', title: 'FAKE NEWS', scenario: 'Analysez cette info : "Une étude dit que dormir 2h suffit". Vrai ou Faux ?', explanation: 'Vérifiez la source, l\'échantillon et le consensus scientifique.', duration: 45 },
  { id: 'ct_quiz_1', categoryId: 'critical_thinking', type: 'quiz', title: 'LOGIQUE', scenario: 'Si "Tous les chats sont gris" est FAUX, alors...', options: ['Aucun chat n\'est gris', 'Au moins un chat n\'est pas gris', 'Tous les chats sont noirs'], correctIndex: 1, explanation: 'La négation de "Tous" n\'est pas "Aucun", mais "Il existe au moins un contre-exemple".', duration: 45 },

  // --- Emotional Intelligence ---
  { id: 'ei1', categoryId: 'emotional_intelligence', type: 'challenge', title: 'EMPATHIE', scenario: 'Un collègue pleure après une critique. Que dites-vous ?', explanation: 'Évitez "Calme-toi". Dites plutôt : "Je vois que ça t\'a touché, tu veux en parler ou tu préfères être seul un moment ?"', duration: 45 },
  { id: 'ei2', categoryId: 'emotional_intelligence', type: 'challenge', title: 'AUTO-CONTRÔLE', scenario: 'Un client vous hurle dessus injustement. Réagissez.', explanation: 'Ne le prenez pas personnellement. Gardez une voix calme et basse.', duration: 45 },
  { id: 'ei_quiz_1', categoryId: 'emotional_intelligence', type: 'quiz', title: 'ÉMOTION', scenario: 'À quoi sert la colère (fonction primaire) ?', options: ['À faire peur', 'À signaler une injustice/obstacle', 'À rien'], correctIndex: 1, explanation: 'La colère est une réaction de défense face à une agression, une frustration ou une injustice perçue.', duration: 30 },

  // --- Creativity ---
  { id: 'cr1', categoryId: 'creativity', type: 'challenge', title: 'DÉTOURNEMENT', scenario: '5 utilisations inhabituelles pour une brique rouge.', explanation: 'Exemples : Cale-livre, piler des épices, chauffer un lit (brique chaude), faire de la poussière rouge pour peindre...', duration: 45 },
  { id: 'cr2', categoryId: 'creativity', type: 'challenge', title: 'MOTS INTERDITS', scenario: 'Décrivez un "Smartphone" sans dire : Tel, Écran, Appli, Internet.', explanation: 'Utilisez des métaphores : "Ardoise magique connectée", "Lien vers le monde"...', duration: 60 },
  { id: 'cr_quiz_1', categoryId: 'creativity', type: 'quiz', title: 'BRAINSTORMING', scenario: 'La règle d\'or du brainstorming est :', options: ['La qualité avant tout', 'Pas de critique immédiate', 'Parler chacun son tour'], correctIndex: 1, explanation: 'Le jugement tue la créativité. On vise la quantité d\'abord, on trie ensuite (CQFD : Censure Interdite).', duration: 30 }
];

// --- SOUND MANAGER ---
const playSound = (type, volume = 0.5) => {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  const now = ctx.currentTime;
  
  if (type === 'win') {
    osc.type = 'triangle'; osc.frequency.setValueAtTime(523.25, now); osc.frequency.linearRampToValueAtTime(659.25, now + 0.1); osc.frequency.linearRampToValueAtTime(783.99, now + 0.2); osc.frequency.linearRampToValueAtTime(1046.50, now + 0.3); gain.gain.setValueAtTime(volume, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6); osc.start(now); osc.stop(now + 0.6);
  } else if (type === 'lose') {
    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(50, now + 0.4); gain.gain.setValueAtTime(volume, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4); osc.start(now); osc.stop(now + 0.4);
  } else if (type === 'flip') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.1); gain.gain.setValueAtTime(volume * 0.5, now); gain.gain.linearRampToValueAtTime(0, now + 0.1); osc.start(now); osc.stop(now + 0.1);
  } else if (type === 'gameover') {
    osc.type = 'square'; osc.frequency.setValueAtTime(523.25, now); osc.frequency.setValueAtTime(659.25, now + 0.2); osc.frequency.setValueAtTime(783.99, now + 0.4); osc.frequency.setValueAtTime(1046.50, now + 0.6); gain.gain.setValueAtTime(volume, now); gain.gain.linearRampToValueAtTime(volume, now + 0.8); gain.gain.linearRampToValueAtTime(0, now + 2); osc.start(now); osc.stop(now + 2);
  }
};

const triggerConfetti = (isWin) => {
  if (window.confetti && isWin) { window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'] }); }
};

const triggerMassiveConfetti = () => {
    if (!window.confetti) return;
    const duration = 3000; const end = Date.now() + duration;
    (function frame() { window.confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#B02E68', '#ffffff', '#FFC20E'] }); window.confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#B02E68', '#ffffff', '#FFC20E'] }); if (Date.now() < end) requestAnimationFrame(frame); }());
};

// --- Composants UI ---

const Timer = ({ duration, onComplete, autoStart = false, isStopped = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(autoStart);
  
  useEffect(() => {
    if (isStopped) { setIsActive(false); return; }
    let interval = null;
    if (isActive && timeLeft > 0) interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    else if (timeLeft === 0) { setIsActive(false); onComplete && onComplete(); }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete, isStopped]);

  return (
    <div className="w-full bg-black/10 p-4 rounded-2xl backdrop-blur-sm transition-all border border-white/10 shadow-inner">
      <div className="flex justify-between items-center mb-2 px-1 text-white">
        <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Temps</span>
        <span className={`${timeLeft < 10 ? 'text-red-300 animate-pulse' : 'text-white'} font-mono text-3xl font-bold tabular-nums`}>{timeLeft}s</span>
      </div>
      <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden mb-3 shadow-inner">
        <div className={`h-full transition-all duration-1000 ease-linear rounded-full ${timeLeft < 10 ? 'bg-red-400' : 'bg-white'}`} style={{ width: `${(timeLeft / duration) * 100}%` }} />
      </div>
      {!isStopped && (
        <div className="flex justify-center">
          <button onClick={() => setIsActive(!isActive)} className="w-10 h-10 flex items-center justify-center bg-white text-black rounded-full hover:scale-110 transition shadow-lg">
            {isActive ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
        </div>
      )}
    </div>
  );
};

// --- NOUVEAU DESIGN PREMIUM POUR LE DOS DES CARTES ---
const CardBack = ({ category, onClick, disabled }) => {
  const Icon = category.icon;
  
  return (
    <button 
      onClick={() => { if(!disabled) { playSound('flip'); onClick(category.id); }}}
      disabled={disabled}
      className={`relative w-full aspect-[3/4] rounded-[2.5rem] transition-all duration-500 group perspective-1000
        ${disabled ? 'opacity-40 grayscale cursor-not-allowed scale-95' : 'hover:scale-[1.03] hover:-translate-y-2 cursor-pointer'}
      `}
    >
      {/* Container Principal avec Gradient */}
      <div className={`absolute inset-0 rounded-[2.5rem] bg-gradient-to-br ${category.colorData.gradient} p-[3px] shadow-xl overflow-hidden`}>
          
          {/* Surface de la carte */}
          <div className="absolute inset-0 bg-black/10 rounded-[2.3rem] flex flex-col items-center justify-between p-6 relative overflow-hidden backdrop-blur-sm">
             
             {/* Background Effects */}
             <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/20 pointer-events-none"></div>
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

             {/* Top Decoration */}
             <div className="w-12 h-1 bg-white/30 rounded-full mb-4"></div>

             {/* Icone Centrale Premium */}
             <div className="relative z-10 flex-grow flex items-center justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 animate-pulse"></div>
                    <div className="w-24 h-24 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Icon size={48} className="text-white drop-shadow-md" strokeWidth={1.5} />
                    </div>
                </div>
             </div>

             {/* Label Category */}
             <div className="relative z-10 w-full text-center mt-4">
                <h3 className="text-white font-black text-lg md:text-xl tracking-tight uppercase leading-tight drop-shadow-lg">
                    {category.label}
                </h3>
                <div className="w-8 h-1 bg-white/40 rounded-full mx-auto mt-3 group-hover:w-16 transition-all duration-500"></div>
             </div>

             {/* Shine Effect Overlay */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out pointer-events-none z-20"></div>
          </div>
      </div>
      
      {/* Badge "Tirer" au survol */}
      {!disabled && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-30">
           <div className="bg-white text-black text-xs font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform">
             <Plus size={14} strokeWidth={4} className="text-[#B02E68]" /> JOUER
           </div>
        </div>
      )}
    </button>
  );
};

const CardFront = ({ card, category, onClose, onResult, playerName }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [timerStopped, setTimerStopped] = useState(false);
  const [feedbackState, setFeedbackState] = useState(null);

  if (!card || !category) return null;

  const handleResult = (isSuccess) => {
    setTimerStopped(true);
    setIsAnswerRevealed(true);
    setFeedbackState(isSuccess ? 'success' : 'failure');
    if (isSuccess) { playSound('win'); triggerConfetti(true); } else { playSound('lose'); }
  };

  const handleQuizOptionClick = (index) => {
    if (isAnswerRevealed) return;
    setSelectedOption(index);
    const isCorrect = index === card.correctIndex;
    handleResult(isCorrect);
  };

  const handleNext = () => onResult(feedbackState === 'success', card);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-in fade-in zoom-in duration-300">
      <div className={`relative w-full md:max-w-6xl h-[90vh] md:h-[80vh] rounded-[2.5rem] shadow-[0_0_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden text-white flex flex-col ${category.colorData.gradient} ring-4 ring-white/20`}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>

        <div className="bg-black/20 backdrop-blur-md w-full py-3 px-6 border-b border-white/10 shrink-0 flex justify-between items-center z-20 h-16">
            <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/20"><User size={16} /></div>
                 <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-60 block leading-none mb-1">Joueur</span>
                    <span className="font-black text-lg text-white leading-none">{playerName}</span>
                 </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                    <span className="text-[10px] uppercase tracking-[0.2em] opacity-60 block leading-none mb-1">Catégorie</span>
                    <span className="font-bold text-sm text-white leading-none">{category.label}</span>
                </div>
                <div className="text-3xl bg-white/10 w-10 h-10 flex items-center justify-center rounded-xl">{/* Ici on utilise l'icone Lucide */} <category.icon size={24} /></div>
                <button onClick={onClose} className="ml-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition"><X size={20}/></button>
            </div>
        </div>

        <div className="flex-grow flex flex-col md:flex-row overflow-hidden relative z-10">
            {feedbackState && (
                <div className="absolute inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                    <div className="max-w-2xl w-full">
                        {feedbackState === 'success' ? (
                            <div className="mb-6 transform animate-bounce">
                                <h2 className="text-5xl font-black text-green-400 italic tracking-tighter flex items-center justify-center gap-3"><CheckCircle size={48} className="text-green-400" /> EXCELLENT !</h2>
                                <p className="font-bold text-white text-xl mt-2 tracking-widest">+1 POINT</p>
                            </div>
                        ) : (
                            <div className="mb-6">
                                <h2 className="text-5xl font-black text-red-400 italic tracking-tighter flex items-center justify-center gap-3"><XCircle size={48} className="text-red-400" /> OUPS...</h2>
                                <p className="font-bold text-white text-xl mt-2 tracking-widest">PAS DE POINT</p>
                            </div>
                        )}
                        <div className="bg-white/10 p-6 rounded-2xl border border-white/10 mb-8 w-full text-left shadow-2xl backdrop-blur-md max-h-[40vh] overflow-y-auto custom-scrollbar">
                            <h4 className="text-yellow-400 text-xs font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><Info size={14}/> L'Explication de l'expert</h4>
                            <p className="text-lg leading-relaxed text-white/90 font-medium">{card.explanation}</p>
                            {card.type === 'quiz' && feedbackState === 'failure' && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <span className="text-xs text-green-300 font-bold block mb-1 uppercase tracking-wider">Réponse correcte :</span>
                                    <span className="text-lg font-bold text-white">{card.options[card.correctIndex]}</span>
                                </div>
                            )}
                        </div>
                        <button onClick={handleNext} className="w-full bg-white text-black font-black py-4 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-xl shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]">CONTINUER <ArrowRight size={24} strokeWidth={3} /></button>
                    </div>
                </div>
            )}

            <div className="flex-1 p-6 md:p-10 flex flex-col justify-center items-center text-center overflow-y-auto custom-scrollbar md:border-r border-white/10">
                <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-black/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/10 shadow-sm shrink-0">
                    {card.type === 'quiz' ? <><Sparkles size={12} className="text-yellow-300"/> Quiz • 1 Pt</> : <><Users size={12} className="text-yellow-300"/> Défi • Jury</>}
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase mb-8 leading-[0.9] drop-shadow-lg tracking-tighter w-full">{card.title}</h2>
                <div className="bg-black/10 p-6 md:p-8 rounded-3xl border border-white/5 backdrop-blur-sm w-full max-w-2xl">
                    <p className="text-xl md:text-3xl font-medium leading-snug drop-shadow-sm font-serif italic text-white/90">"{card.scenario}"</p>
                </div>
            </div>

            <div className="md:w-[420px] bg-black/10 flex flex-col shrink-0 border-t md:border-t-0 md:border-l border-white/5 relative h-full">
                 <div className="flex-grow p-6 flex flex-col justify-center overflow-y-auto custom-scrollbar">
                    {card.type === 'quiz' ? (
                        <div className="space-y-3 w-full">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block text-center">Choisissez la bonne réponse</span>
                            {card.options.map((option, idx) => (
                                <button key={idx} onClick={() => handleQuizOptionClick(idx)} disabled={isAnswerRevealed} className={`w-full p-4 rounded-xl text-left text-base font-bold transition-all border-2 flex items-center gap-4 group relative overflow-hidden ${selectedOption === idx ? (idx === card.correctIndex ? 'bg-green-500 border-green-400 text-white' : 'bg-red-500 border-red-400 text-white') : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 active:scale-[0.98]'}`}>
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-black transition-colors ${selectedOption === idx ? 'border-white bg-white/20' : 'border-white/30 bg-white/5 group-hover:border-white group-hover:bg-white text-white group-hover:text-black'}`}>{idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}</div>
                                    <span className="leading-tight z-10 relative">{option}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-white/60 text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4"><Info size={32} className="opacity-50"/></div>
                            <p className="text-sm italic px-4">"Prenez le temps d'analyser la situation avant de présenter votre solution au jury ou aux autres joueurs."</p>
                         </div>
                    )}
                 </div>
                 <div className="p-6 bg-black/20 border-t border-white/5 mt-auto">
                    <Timer duration={card.duration} isStopped={timerStopped || isAnswerRevealed} />
                    {card.type === 'challenge' && !feedbackState && (
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => handleResult(false)} className="flex-1 group bg-red-500/10 hover:bg-red-500 text-white border border-red-500/30 hover:border-red-500 font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"><XCircle size={20} className="group-hover:scale-110 transition"/> Raté</button>
                            <button onClick={() => handleResult(true)} className="flex-1 group bg-green-500/10 hover:bg-green-500 text-white border border-green-500/30 hover:border-green-500 font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"><Check size={20} className="group-hover:scale-110 transition"/> Réussi</button>
                        </div>
                    )}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- ECRAN HISTOIRE ---
const StoryScreen = ({ onBack }) => (
    <div className="w-full max-w-4xl h-[90vh] bg-black/60 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40 z-20">
             <div className="flex items-center gap-3 text-white"><BookOpen className="text-[#B02E68]" size={28} /><h2 className="text-2xl font-black uppercase tracking-widest">L'Histoire</h2></div>
             <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition text-white"><X size={24} /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 text-white relative z-10">
            <div className="max-w-3xl mx-auto">
                <div className="relative group mb-16 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#B02E68] to-[#F26522] opacity-20 blur-xl rounded-3xl transform -rotate-1 group-hover:rotate-1 transition duration-500"></div>
                    <div className="relative bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 backdrop-blur-md">
                        <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#CF457A] to-[#8A1C4C] rounded-full blur opacity-70"></div>
                            <img src="https://media.licdn.com/dms/image/v2/D4E03AQGPhAtWKK7wpA/profile-displayphoto-scale_200_200/B4EZky1.SpHgAY-/0/1757494638506?e=2147483647&v=beta&t=1kTBlrqh-i_Zj3pG1zk4P1PE1djT7Ze5LU8e9J5_p8E" alt="Gabriel Emrick Tognimanbou DAHISSIHO" className="relative w-full h-full object-cover rounded-full border-4 border-white/20 shadow-2xl"/>
                            <div className="absolute bottom-2 right-2 bg-white text-[#B02E68] p-1.5 rounded-full shadow-lg"><Award size={20} /></div>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight">Gabriel Emrick Tognimanbou DAHISSIHO</h3>
                            <div className="inline-block bg-[#B02E68]/20 px-3 py-1 rounded-full border border-[#B02E68]/30"><p className="text-[#FFC20E] font-bold text-xs tracking-widest uppercase">Junior PMO | Digital Transformation</p></div>
                            <p className="text-white/70 text-sm italic pt-2 border-t border-white/10 mt-2 font-light">"I combine project structure, creativity, and strategy to build digital solutions that drive lasting transformation."</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-8 text-lg leading-relaxed font-light text-white/90">
                    <p className="text-xl md:text-2xl font-medium text-white">On ne le répète jamais assez : <span className="text-[#B02E68] font-bold">les compétences techniques</span> t’ouvrent la porte d’une entreprise, mais ce sont <span className="text-green-400 font-bold">les compétences humaines</span> qui te font gravir les échelons.</p>
                    <div className="relative pl-8 py-2"><div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#B02E68] to-transparent"></div><p className="text-2xl italic font-serif text-white/80">"La collaboration, l’écoute, la gestion de conflit, la prise de décision collective… tout ce qui fait qu’on réussit avec les autres."</p></div>
                    <p>Et pourtant, la majorité des formations universitaires n’enseignent pas ça. On passe des années à apprendre à résoudre des équations, mais presque jamais à résoudre un désaccord. On nous note sur nos résultats, rarement sur notre capacité à convaincre, à fédérer ou à gérer une tension en équipe.</p>
                    <div className="bg-gradient-to-r from-[#B02E68]/20 to-transparent p-6 rounded-r-2xl border-l-4 border-[#B02E68]"><p className="mb-2 font-bold uppercase text-sm tracking-widest text-[#B02E68]">La Solution</p><p className="text-xl">C’est là que j’ai voulu agir. Pas avec une formation classique, mais avec une expérience vivante, ludique et impactante : <span className="font-black text-white block text-3xl mt-2 tracking-tighter">🎯 SKILLSMASTER</span></p></div>
                    <p>Un jeu conçu pour développer les compétences essentielles à la réussite scolaire et professionnelle en Afrique et partout ailleurs. Chaque carte te place face à une situation concrète de communication, de leadership, de créativité ou d’intelligence émotionnelle.</p>
                    <p className="font-bold text-white text-xl">Tu as quelques secondes pour réagir, argumenter, convaincre, coopérer.<br/><span className="text-[#FFC20E]">Et c’est là que tu découvres qui tu es vraiment dans l’action.</span></p>
                    <div className="mt-16 p-8 bg-white text-[#B02E68] rounded-3xl shadow-[0_10px_40px_-10px_rgba(176,46,104,0.5)] text-center relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-pink-500"></div><Quote className="mx-auto text-[#B02E68]/20 mb-4 transform scale-150" size={48} /><p className="text-2xl font-black italic relative z-10">"Et moi, j’ai décidé d’en faire un jeu. Un jeu sérieux, oui. Mais surtout, un jeu qui forme à être humain. 💡"</p></div>
                </div>
            </div>
        </div>
    </div>
);

// --- Ecrans Menu, History, Setup ---
const MainMenu = ({ onNavigate }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
     <div className="text-center mb-8 relative">
        <div className="absolute -inset-10 bg-gradient-to-r from-[#FFC20E] to-[#B02E68] blur-3xl opacity-20 animate-pulse"></div>
        <h1 className="relative text-6xl md:text-8xl font-black italic tracking-tighter mb-2 text-white drop-shadow-2xl">SKILLS<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC20E] to-white">MASTER</span></h1>
        <p className="text-white/80 uppercase tracking-[0.5em] text-xs md:text-sm font-bold">Le jeu des compétences ultimes</p>
     </div>
     <div className="w-full max-w-xs space-y-4 relative z-10">
       <button onClick={() => { playSound('flip'); onNavigate('setup'); }} className="w-full group bg-white text-[#B02E68] p-5 rounded-3xl font-black text-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:scale-105 hover:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.3)] transition-all flex items-center justify-between px-8 border-4 border-transparent hover:border-[#FFC20E]"><span>JOUER</span> <Play className="group-hover:translate-x-1 transition fill-current" /></button>
       <button onClick={() => { playSound('flip'); onNavigate('story'); }} className="w-full bg-[#B02E68]/40 hover:bg-[#B02E68]/60 border border-white/20 text-white p-5 rounded-3xl font-bold text-lg shadow-lg backdrop-blur-md transition-all flex items-center justify-between px-8 hover:border-white/50"><span>L'HISTOIRE</span> <BookOpen size={20} /></button>
       <button onClick={() => { playSound('flip'); onNavigate('history'); }} className="w-full bg-black/20 hover:bg-black/40 border border-white/10 text-white p-5 rounded-3xl font-bold text-lg shadow-lg backdrop-blur-md transition-all flex items-center justify-between px-8 hover:border-white/30"><span>HISTORIQUE</span> <History size={20} /></button>
     </div>
  </div>
);

const HistoryScreen = ({ history, onBack }) => (
    <div className="w-full max-w-2xl bg-black/30 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 animate-in zoom-in-95 duration-300 h-[80vh] flex flex-col shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-white flex items-center gap-3"><History size={32} className="text-[#FFC20E]"/> HISTORIQUE</h2>
        <button onClick={onBack} className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition hover:rotate-90"><X size={24}/></button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
        {history.length === 0 ? <div className="text-center text-white/40 py-20 italic text-xl">Aucune partie jouée.</div> : 
            history.map((game, i) => (
                <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-white/20 transition">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-white/60 uppercase font-bold tracking-widest">{new Date(game.date).toLocaleDateString()} • {new Date(game.date).toLocaleTimeString()}</span>
                        <span className="bg-[#B02E68] text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-wider">{game.mode === 'solo' ? 'SOLO' : 'MULTI'}</span>
                    </div>
                    <div className="space-y-2">
                        {game.results.map((p, idx) => (
                            <div key={idx} className="flex justify-between text-white items-center bg-black/20 p-3 rounded-xl"><span className="font-bold flex items-center gap-2">{idx === 0 && <Trophy size={14} className="text-yellow-400"/>}{p.name}</span><span className="font-mono font-black text-[#FFC20E]">{p.score} pts</span></div>
                        ))}
                    </div>
                </div>
            ))
        }
      </div>
    </div>
);

const SetupScreen = ({ onStart, onBack }) => {
  const [mode, setMode] = useState(null);
  const [players, setPlayers] = useState(['Joueur 1', 'Joueur 2']);
  const [soloName, setSoloName] = useState('Joueur 1');

  const addPlayer = () => setPlayers([...players, `Joueur ${players.length + 1}`]);
  const removePlayer = (index) => setPlayers(players.filter((_, i) => i !== index));
  const updatePlayerName = (index, name) => { const newP = [...players]; newP[index] = name; setPlayers(newP); };
  
  const handleStart = () => {
    playSound('win'); 
    if (mode === 'solo') onStart([{ id: 1, name: soloName, score: 0 }], 'solo');
    else onStart(players.map((p, i) => ({ id: i + 1, name: p, score: 0 })), 'multi');
  };

  return (
    <div className="w-full max-w-lg bg-black/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl animate-in slide-in-from-right-8 duration-300 relative overflow-hidden">
        <button onClick={!mode ? onBack : () => setMode(null)} className="absolute top-6 left-6 text-white/50 hover:text-white transition flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><RotateCcw size={14} /> Retour</button>
        <h2 className="text-4xl font-black text-center text-white mb-10 mt-6 tracking-tighter">CONFIGURATION</h2>
        {!mode ? (
          <div className="space-y-4">
            <button onClick={() => setMode('solo')} className="w-full bg-white text-[#B02E68] font-black text-xl py-6 rounded-3xl hover:scale-105 transition shadow-xl flex items-center justify-center gap-4"><User size={28} /> MODE SOLO</button>
            <button onClick={() => setMode('multi')} className="w-full bg-[#B02E68] border-2 border-white/20 text-white font-black text-xl py-6 rounded-3xl hover:scale-105 transition shadow-xl flex items-center justify-center gap-4 hover:border-white"><Users size={28} /> MODE MULTI</button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4">
             <div className="mb-8">
                <label className="text-white/60 text-xs font-bold mb-4 block uppercase tracking-widest pl-2">{mode === 'solo' ? 'Pseudo du champion' : 'Participants'}</label>
                {mode === 'solo' ? (
                  <input type="text" value={soloName} onChange={(e) => setSoloName(e.target.value)} className="w-full bg-white/10 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-lg focus:outline-none focus:border-[#FFC20E] transition placeholder-white/20" placeholder="Entrez votre nom..." />
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    {players.map((p, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <span className="text-white/40 font-black text-sm w-4">{i+1}</span>
                        <input type="text" value={p} onChange={(e) => updatePlayerName(i, e.target.value)} className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white text-sm font-bold" />
                        {players.length > 2 && (<button onClick={() => removePlayer(i)} className="p-3 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500 hover:text-white transition"><X size={16} /></button>)}
                      </div>
                    ))}
                    <button onClick={addPlayer} className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-white/50 hover:bg-white/10 hover:text-white hover:border-white/50 transition text-xs font-black uppercase flex items-center justify-center gap-2 mt-2"><Plus size={14} /> Ajouter un joueur</button>
                  </div>
                )}
             </div>
             <button onClick={handleStart} className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#FFC20E] to-[#ff9900] text-black font-black text-xl hover:scale-105 transition shadow-[0_0_30px_-5px_rgba(255,194,14,0.4)] flex items-center justify-center gap-3">C'EST PARTI <ArrowRight size={24} strokeWidth={3} /></button>
          </div>
        )}
    </div>
  );
};

const ScoreBoard = ({ players, missedCards, onEndGame }) => {
    useEffect(() => { playSound('gameover'); triggerMassiveConfetti(); }, []);
    return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl bg-[#B02E68] rounded-[3rem] p-10 border-4 border-white/20 text-white text-center shadow-2xl animate-in zoom-in duration-500 my-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            <Trophy className="mx-auto text-yellow-300 mb-6 drop-shadow-lg animate-bounce" size={80} strokeWidth={1.5} />
            <h2 className="text-5xl font-black italic mb-8 tracking-tighter">RÉSULTATS FINAUX</h2>
            <div className="space-y-3 mb-10 relative z-10">
                {[...players].sort((a,b) => b.score - a.score).map((p, i) => (
                    <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${i===0 ? 'bg-white text-[#B02E68] border-transparent scale-105 shadow-xl' : 'bg-black/20 border-white/10 text-white'}`}>
                        <div className="flex items-center gap-4">
                            <span className={`font-black text-2xl w-10 h-10 flex items-center justify-center rounded-full ${i===0 ? 'bg-[#B02E68] text-white' : 'bg-white/10'}`}>{i+1}</span>
                            <span className="font-black text-xl tracking-tight">{p.name}</span>
                        </div>
                        <span className="font-mono text-2xl font-bold">{p.score} pts</span>
                    </div>
                ))}
            </div>
            {missedCards && missedCards.length > 0 && (
                <div className="mb-10 text-left bg-white text-black p-8 rounded-[2rem] shadow-xl relative z-10">
                    <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3 border-b-2 border-gray-100 pb-4 text-[#B02E68]"><BookOpen size={28} /> 🎓 Points à réviser</h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar-dark pr-2">
                        {missedCards.map((card, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex flex-col mb-2">
                                    <span className="text-[10px] font-black text-[#B02E68] uppercase tracking-widest mb-1">{CATEGORIES[card.categoryId.toUpperCase()].label}</span>
                                    <span className="text-sm font-bold text-gray-900">{card.title}</span>
                                </div>
                                <p className="text-sm text-gray-600 italic leading-relaxed">"{card.explanation}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <button onClick={onEndGame} className="w-full bg-white text-[#B02E68] font-black py-5 rounded-2xl hover:bg-gray-100 transition shadow-xl relative z-10 uppercase tracking-widest">Retour au menu</button>
        </div>
    </div>
    );
};

// --- Application Principale ---

export default function App() {
  const [view, setView] = useState('menu');
  const [players, setPlayers] = useState([]);
  const [gameMode, setGameMode] = useState('solo');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showScoreboard, setShowScoreboard] = useState(false);
  
  const MAX_ROUNDS = 15;
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [playedCardIds, setPlayedCardIds] = useState([]);
  const [missedCards, setMissedCards] = useState([]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); }
  }, []);

  const startGame = (playerList, mode) => {
    setPlayers(playerList); setGameMode(mode); setView('playing');
    setCurrentPlayerIndex(0); setShowScoreboard(false); setRoundsPlayed(0);
    setPlayedCardIds([]); setMissedCards([]);
  };

  const endGame = () => {
    const newHistoryEntry = { date: new Date().toISOString(), mode: gameMode, results: [...players].sort((a,b) => b.score - a.score) };
    setGameHistory([newHistoryEntry, ...gameHistory]);
    setShowScoreboard(false); setActiveCard(null); setActiveCategory(null); setView('menu');
  };

  const drawRandomNextCard = () => {
     const availableCards = INITIAL_CARDS.filter(c => !playedCardIds.includes(c.id));
     if (availableCards.length === 0) { 
        setActiveCard(null); 
        setActiveCategory(null);
        setShowScoreboard(true); 
        return; 
     }
     const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
     setActiveCategory(Object.values(CATEGORIES).find(c => c.id === randomCard.categoryId));
     setActiveCard(randomCard);
     setPlayedCardIds(prev => [...prev, randomCard.id]);
  };

  const drawCard = (categoryId) => {
    const categoryCards = INITIAL_CARDS.filter(c => c.categoryId === categoryId && !playedCardIds.includes(c.id));
    if (categoryCards.length === 0) { alert("Plus de cartes disponibles dans cette catégorie !"); return; }
    const randomCard = categoryCards[Math.floor(Math.random() * categoryCards.length)];
    setActiveCategory(Object.values(CATEGORIES).find(c => c.id === categoryId));
    setActiveCard(randomCard);
    setPlayedCardIds(prev => [...prev, randomCard.id]);
  };

  const handleCardResult = (success, cardData) => {
    const currentPlayers = [...players];
    if (success) { 
        currentPlayers[currentPlayerIndex].score += 1; 
        setPlayers(currentPlayers); 
    } else { 
        if (cardData) setMissedCards(prev => [...prev, cardData]); 
    }
    
    const nextRound = roundsPlayed + 1;
    setRoundsPlayed(nextRound);
    
    const availableCards = INITIAL_CARDS.filter(c => !playedCardIds.includes(c.id));
    
    if (nextRound >= MAX_ROUNDS || availableCards.length === 0) { 
        setActiveCard(null); 
        setActiveCategory(null);
        setShowScoreboard(true); 
    } else { 
        setCurrentPlayerIndex((currentPlayerIndex + 1) % currentPlayers.length); 
        drawRandomNextCard();
    }
  };

  const isCategoryEmpty = (categoryId) => {
      const remaining = INITIAL_CARDS.filter(c => c.categoryId === categoryId && !playedCardIds.includes(c.id));
      return remaining.length === 0;
  };

  return (
    <div className={`min-h-screen ${COLORS.backgroundGradient} font-sans selection:bg-[#FFC20E] selection:text-black flex flex-col overflow-hidden relative text-white`}>
      <style>{`
        .stroke-text { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4); color: transparent; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .custom-scrollbar-dark::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-dark::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {view === 'menu' && <MainMenu onNavigate={setView} />}
      {view === 'setup' && <div className="flex-1 flex items-center justify-center p-4"><SetupScreen onStart={startGame} onBack={() => setView('menu')} /></div>}
      {view === 'story' && <div className="flex-1 flex items-center justify-center p-4 z-50"><StoryScreen onBack={() => setView('menu')} /></div>}
      {view === 'history' && <div className="flex-1 flex items-center justify-center p-4"><HistoryScreen history={gameHistory} onBack={() => setView('menu')} /></div>}

      {view === 'playing' && (
        <>
          <nav className="px-6 py-4 flex justify-between items-center bg-black/10 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 p-1.5 rounded-lg text-black shadow-lg shadow-yellow-400/20"><Trophy size={20} strokeWidth={2.5}/></div>
              <span className="font-black italic text-xl tracking-tighter hidden md:inline">SKILLS<span className="text-[#FFC20E]">MASTER</span></span>
            </div>
            <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-full border border-white/10 shadow-inner">
                <CheckSquare size={16} className="text-white/60" />
                <span className="text-sm font-black tracking-widest">{roundsPlayed} / {MAX_ROUNDS}</span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-[40vw]">
                {players.map((p, i) => (
                <div key={p.id} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${i === currentPlayerIndex ? 'bg-white text-[#B02E68] border-white font-black shadow-lg scale-105' : 'bg-black/20 border-transparent text-white/50'}`}>
                    <span className="text-xs uppercase truncate max-w-[80px]">{p.name}</span>
                    <span className="bg-black/10 px-2 rounded-full text-xs font-mono">{p.score}</span>
                </div>
                ))}
            </div>
            <button onClick={() => setShowScoreboard(true)} className="bg-white/10 hover:bg-red-500 hover:text-white p-2.5 rounded-xl transition text-white/70"><X size={20} strokeWidth={3} /></button>
          </nav>

          <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full flex flex-col">
            <div className="text-center mb-8 animate-in slide-in-from-top-4">
              <div className="inline-block bg-black/20 backdrop-blur px-4 py-1 rounded-full mb-3 border border-white/10">
                <span className="text-white/80 text-[10px] uppercase tracking-[0.3em] font-bold">C'est le tour de {players[currentPlayerIndex]?.name}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase drop-shadow-xl flex items-center justify-center gap-3 tracking-tighter">
                 Choisissez une carte <span className="text-[#FFC20E] animate-pulse"><Award size={32} /></span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 auto-rows-fr pb-20">
              {Object.values(CATEGORIES).map((cat) => (
                <CardBack key={cat.id} category={cat} onClick={drawCard} disabled={isCategoryEmpty(cat.id)} />
              ))}
            </div>
          </main>
        </>
      )}

      {activeCard && activeCategory && (
        <CardFront key={activeCard.id} card={activeCard} category={activeCategory} onClose={() => { setActiveCard(null); setActiveCategory(null); }} onResult={handleCardResult} playerName={players[currentPlayerIndex]?.name} />
      )}

      {showScoreboard && <ScoreBoard players={players} missedCards={missedCards} onEndGame={endGame} />}
    </div>
  );
}
