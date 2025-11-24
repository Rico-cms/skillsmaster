import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Trophy, Users, User, Check, XCircle, Plus, History, Award, ArrowRight, Info, CheckSquare, Volume2, VolumeX, BookOpen, Quote } from 'lucide-react';

// --- Configuration & Données ---

const COLORS = {
  background: 'bg-[#B02E68]',
  backgroundGradient: 'bg-gradient-to-br from-[#CF457A] to-[#8A1C4C]',
  cards: {
    communication: { main: 'bg-[#00A651]', text: 'text-white' },
    leadership: { main: 'bg-[#F26522]', text: 'text-white' },
    critical_thinking: { main: 'bg-[#EF4136]', text: 'text-white' },
    emotional_intelligence: { main: 'bg-[#00AEEF]', text: 'text-white' },
    creativity: { main: 'bg-[#FFC20E]', text: 'text-white' }
  }
};

const CATEGORIES = {
  COMMUNICATION: { id: 'communication', label: 'COMMUNICATION', colorClass: COLORS.cards.communication.main, icon: '🗣️' },
  LEADERSHIP: { id: 'leadership', label: 'LEADERSHIP', colorClass: COLORS.cards.leadership.main, icon: '🦁' },
  CRITICAL_THINKING: { id: 'critical_thinking', label: 'CRITICAL THINKING', colorClass: COLORS.cards.critical_thinking.main, icon: '🧠' },
  EMOTIONAL_INTELLIGENCE: { id: 'emotional_intelligence', label: 'EMOTIONAL INTELLIGENCE', colorClass: COLORS.cards.emotional_intelligence.main, icon: '❤️' },
  CREATIVITY: { id: 'creativity', label: 'CREATIVITY', colorClass: COLORS.cards.creativity.main, icon: '💡' }
};

const INITIAL_CARDS = [
  // --- Communication ---
  { 
    id: 'c1', categoryId: 'communication', type: 'challenge', 
    title: 'PRÉSENTATION EXPRESS', 
    scenario: 'Les réseaux sociaux : menace ou opportunité ? Mini-discours de 1 min.', 
    explanation: 'Conseil : Commencez par une accroche forte ("Saviez-vous que..."), donnez 2 arguments opposés, et concluez avec votre avis personnel.',
    duration: 60 
  },
  { 
    id: 'c2', categoryId: 'communication', type: 'challenge', 
    title: 'PITCH DE VENTE', 
    scenario: 'Vendez ce stylo (ou un objet proche) au jury en 45 secondes.', 
    explanation: 'Ne vendez pas l\'objet, vendez ce qu\'il permet de faire (ex: "Signer le contrat de votre vie"). Créez le besoin.',
    duration: 45 
  },
  { 
    id: 'c_quiz_1', categoryId: 'communication', type: 'quiz', 
    title: 'ÉCOUTE ACTIVE', 
    scenario: 'Quelle est la clé principale de l’écoute active ?', 
    options: ['Interrompre pour questionner', 'Reformuler ce que dit l’autre', 'Préparer sa réponse'], 
    correctIndex: 1, 
    explanation: 'La reformulation prouve que vous avez compris le message et invite l\'autre à préciser sa pensée.',
    duration: 30 
  },
  
  // --- Leadership ---
  { 
    id: 'l1', categoryId: 'leadership', type: 'challenge', 
    title: 'GÉRER UN CONFLIT', 
    scenario: 'Un collègue est toujours en retard. Dites-lui fermement mais poliment.', 
    explanation: 'Utilisez la méthode DESC : Décrire les faits, Exprimer votre ressenti, Suggérer une solution, Conclure sur les conséquences positives.',
    duration: 45 
  },
  { 
    id: 'l_quiz_1', categoryId: 'leadership', type: 'quiz', 
    title: 'STYLE DE LEADERSHIP', 
    scenario: 'Quel style implique le plus l’équipe dans la prise de décision ?', 
    options: ['Autoritaire', 'Démocratique', 'Laissez-faire'], 
    correctIndex: 1, 
    explanation: 'Le style démocratique (ou participatif) invite les collaborateurs à partager leur avis avant la décision finale.',
    duration: 30 
  },

  // --- Critical Thinking ---
  { 
    id: 'ct1', categoryId: 'critical_thinking', type: 'challenge', 
    title: 'SYSTÈME D', 
    scenario: 'Plus d\'internet 30 min avant le rendu ! Que faites-vous ?', 
    explanation: 'Priorité 1 : Prévenir (téléphone). Priorité 2 : Alternative (partage de connexion 4G, café voisin, clé USB).',
    duration: 60 
  },
  { 
    id: 'ct_quiz_1', categoryId: 'critical_thinking', type: 'quiz', 
    title: 'LOGIQUE', 
    scenario: 'Si "Tous les chats sont gris" est FAUX, alors...', 
    options: ['Aucun chat n\'est gris', 'Au moins un chat n\'est pas gris', 'Tous les chats sont noirs'], 
    correctIndex: 1, 
    explanation: 'La négation de "Tous" n\'est pas "Aucun", mais "Il existe au moins un contre-exemple".',
    duration: 45 
  },

  // --- Emotional Intelligence ---
  { 
    id: 'ei1', categoryId: 'emotional_intelligence', type: 'challenge', 
    title: 'EMPATHIE', 
    scenario: 'Un collègue pleure après une critique. Que dites-vous ?', 
    explanation: 'Évitez "Calme-toi". Dites plutôt : "Je vois que ça t\'a touché, tu veux en parler ou tu préfères être seul un moment ?"',
    duration: 45 
  },
  { 
    id: 'ei_quiz_1', categoryId: 'emotional_intelligence', type: 'quiz', 
    title: 'ÉMOTION', 
    scenario: 'À quoi sert la colère (fonction primaire) ?', 
    options: ['À faire peur', 'À signaler une injustice/obstacle', 'À rien'], 
    correctIndex: 1, 
    explanation: 'La colère est une réaction de défense face à une agression, une frustration ou une injustice perçue.',
    duration: 30 
  },

  // --- Creativity ---
  { 
    id: 'cr1', categoryId: 'creativity', type: 'challenge', 
    title: 'DÉTOURNEMENT', 
    scenario: '5 utilisations inhabituelles pour une brique rouge.', 
    explanation: 'Exemples : Cale-livre, piler des épices, chauffer un lit (brique chaude), faire de la poussière rouge pour peindre...',
    duration: 45 
  },
  { 
    id: 'cr_quiz_1', categoryId: 'creativity', type: 'quiz', 
    title: 'BRAINSTORMING', 
    scenario: 'La règle d\'or du brainstorming est :', 
    options: ['La qualité avant tout', 'Pas de critique immédiate', 'Parler chacun son tour'], 
    correctIndex: 1, 
    explanation: 'Le jugement tue la créativité. On vise la quantité d\'abord, on trie ensuite (CQFD : Censure Interdite).',
    duration: 30 
  }
];

// --- SOUND MANAGER (Audio Synthétisé) ---
const playSound = (type, volume = 0.5) => {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  const now = ctx.currentTime;
  
  if (type === 'win') {
    // Arpège ascendant joyeux
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // Do
    osc.frequency.linearRampToValueAtTime(659.25, now + 0.1); // Mi
    osc.frequency.linearRampToValueAtTime(783.99, now + 0.2); // Sol
    osc.frequency.linearRampToValueAtTime(1046.50, now + 0.3); // Do haut
    
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    
    osc.start(now);
    osc.stop(now + 0.6);
  } 
  else if (type === 'lose') {
    // Son descendant déçu
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.4);
    
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc.start(now);
    osc.stop(now + 0.4);
  }
  else if (type === 'flip') {
    // Bruit blanc court pour le flip
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(volume * 0.5, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  }
  else if (type === 'gameover') {
    // Fanfare simple
    osc.type = 'square';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.setValueAtTime(659.25, now + 0.2);
    osc.frequency.setValueAtTime(783.99, now + 0.4);
    osc.frequency.setValueAtTime(1046.50, now + 0.6);
    
    gain.gain.setValueAtTime(volume, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.8);
    gain.gain.linearRampToValueAtTime(0, now + 2);
    
    osc.start(now);
    osc.stop(now + 2);
  }
};

// --- CONFETTI MANAGER ---
const triggerConfetti = (isWin) => {
  if (window.confetti) {
    if (isWin) {
        window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        });
    }
  }
};

const triggerMassiveConfetti = () => {
    if (!window.confetti) return;
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        window.confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#B02E68', '#ffffff', '#FFC20E']
        });
        window.confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#B02E68', '#ffffff', '#FFC20E']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
};

// --- Composants Utilitaires ---

const Timer = ({ duration, onComplete, autoStart = false, isStopped = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(autoStart);
  
  useEffect(() => {
    if (isStopped || !isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsActive(false);
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isStopped, onComplete]);

  return (
    <div className="w-full mt-6 bg-black/20 p-3 rounded-xl backdrop-blur-sm transition-all">
      <div className="flex justify-between items-center mb-1 text-white font-bold">
        <span className="text-xs uppercase opacity-80 tracking-widest">Temps Restant</span>
        <span className={`${timeLeft < 10 ? 'text-red-200 animate-pulse' : 'text-white'} font-mono text-xl`}>{timeLeft}s</span>
      </div>
      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
        <div className="h-full bg-white transition-all duration-1000 ease-linear" style={{ width: `${(timeLeft / duration) * 100}%` }} />
      </div>
      {!isStopped && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setIsActive(!isActive)} className="p-2 bg-white text-black rounded-full hover:scale-105 transition">
            {isActive ? <Pause size={16} fill="black" /> : <Play size={16} fill="black" />}
          </button>
        </div>
      )}
    </div>
  );
};

const CardBack = ({ category, onClick, disabled }) => {
  const lines = [0, 1, 2, 3, 4, 5, 6]; 
  return (
    <button 
      onClick={() => {
          if(!disabled) {
              playSound('flip');
              onClick(category.id);
          }
      }}
      disabled={disabled}
      className={`relative w-full aspect-[2/3] rounded-2xl border-[3px] border-white shadow-xl overflow-hidden transition-transform duration-300 group flex flex-col items-center justify-center 
        ${disabled ? 'bg-gray-400 grayscale opacity-50 cursor-not-allowed' : `${category.colorClass} hover:scale-105 active:scale-95`}
      `}
    >
      <div className="flex flex-col items-center justify-center w-full h-full leading-none pointer-events-none select-none">
        {lines.map((i) => {
          const isCenter = i === 3;
          return (
            <div 
              key={i} 
              className={`font-black uppercase tracking-tighter w-full text-center
                ${isCenter ? 'text-white opacity-100 z-10' : 'text-transparent stroke-text opacity-30'}
              `}
              style={{ 
                fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', 
                WebkitTextStroke: isCenter ? '0px' : '1px rgba(255,255,255,0.7)',
                lineHeight: '0.85', 
                transform: isCenter ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              <div className="truncate px-1">
                 {category.label.split(' ')[0]}
                 {category.label.split(' ').length > 1 && <br/>}
                 {category.label.split(' ').slice(1).join(' ')}
              </div>
            </div>
          );
        })}
      </div>
      
      {!disabled && (
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
           <div className="bg-white text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all">
             Tirer
           </div>
        </div>
      )}
    </button>
  );
};

const CardFront = ({ card, category, onClose, onResult, playerName }) => {

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

    const isCorrect = index === card.correctIndex;
    handleResult(isCorrect);
  };

  const handleNext = () => {
      onResult(feedbackState === 'success', card);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in zoom-in duration-300">
      <div className={`relative w-full max-w-xl h-[70vh] min-h-[600px] rounded-3xl border-4 border-white shadow-2xl overflow-hidden text-white flex flex-col ${category.colorClass}`}>
        
        <div className="bg-black/30 w-full py-4 text-center border-b border-white/20 shrink-0">
            <span className="text-xs uppercase tracking-[0.2em] opacity-80 block mb-1">C'est au tour de</span>
            <span className="font-black text-2xl text-yellow-300 drop-shadow-md flex items-center justify-center gap-3">
               <User size={24} /> {playerName}
            </span>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar relative flex flex-col">
            
            {feedbackState && (
                <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                    {feedbackState === 'success' ? (
                        <div className="mb-6">
                            <CheckCircleIcon size={80} className="text-green-400 mx-auto mb-3 animate-bounce" />
                            <h2 className="text-5xl font-black text-green-400 italic">BRAVO !</h2>
                            <p className="font-bold text-white text-xl mt-2">+1 POINT</p>
                        </div>
                    ) : (
                        <div className="mb-6">
                            <XCircle size={80} className="text-red-400 mx-auto mb-3" />
                            <h2 className="text-5xl font-black text-red-400 italic">RATÉ...</h2>
                            <p className="font-bold text-white text-xl mt-2">Pas de point</p>
                        </div>
                    )}

                    <div className="bg-white/10 p-6 rounded-2xl border border-white/20 mb-8 w-full text-left shadow-lg">
                        <h4 className="text-yellow-300 text-sm font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Info size={16}/> L'Explication de l'expert
                        </h4>
                        <p className="text-base leading-relaxed text-white/95">
                            {card.explanation || "Pas d'explication disponible pour cette carte."}
                        </p>
                        {card.type === 'quiz' && feedbackState === 'failure' && (
                            <div className="mt-4 pt-3 border-t border-white/10">
                                <span className="text-xs text-green-300 font-bold block mb-1 uppercase tracking-wider">La bonne réponse était :</span>
                                <span className="text-base font-bold text-white">{card.options[card.correctIndex]}</span>
                            </div>
                        )}
                    </div>

                    <button onClick={handleNext} className="w-full bg-white text-black font-black py-4 rounded-xl hover:scale-105 transition flex items-center justify-center gap-2 text-xl shadow-xl">
                        CARTE SUIVANTE <ArrowRight size={28} />
                    </button>
                </div>
            )}

            <div className="p-8 text-center flex-grow flex flex-col justify-center">
                <div className="mb-3 flex justify-center text-5xl opacity-90 drop-shadow-sm">{category.icon}</div>
                <div className="inline-block px-3 py-1 bg-black/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6 mx-auto border border-white/10">
                    {card.type === 'quiz' ? 'Quiz • 1 Pt' : 'Défi • Jury'}
                </div>
                <h2 className="text-3xl font-black uppercase mb-4 leading-none drop-shadow-md">{card.title}</h2>
                <p className="text-xl font-medium leading-relaxed drop-shadow-sm mb-8">{card.scenario}</p>

                {card.type === 'quiz' && (
                    <div className="space-y-3 w-full text-left">
                    {card.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleQuizOptionClick(idx)}
                            disabled={isAnswerRevealed}
                            className={`w-full p-4 rounded-xl text-sm font-bold transition-all border-2 flex items-center gap-4 bg-white/10 hover:bg-white/20 border-white/30`}
                        >
                            <div className="w-8 h-8 rounded-full border-2 border-white/50 flex items-center justify-center shrink-0 text-xs font-black">{idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}</div>
                            <span className="text-lg">{option}</span>
                        </button>
                    ))}
                    </div>
                )}
            </div>
        </div>

        <div className="p-6 pt-0 mt-auto shrink-0 bg-gradient-to-t from-black/20 to-transparent z-10">
          <Timer duration={card.duration} isStopped={timerStopped || isAnswerRevealed} />
          {card.type === 'challenge' && !feedbackState && (
            <div className="flex gap-4 mt-6">
                <button onClick={() => handleResult(false)} className="flex-1 bg-red-500/90 hover:bg-red-500 text-white font-black py-4 rounded-xl transition flex items-center justify-center gap-2 text-base shadow-lg border-2 border-red-400/50">
                    <XCircle size={20} /> Raté
                </button>
                <button onClick={() => handleResult(true)} className="flex-1 bg-green-500/90 hover:bg-green-500 text-white font-black py-4 rounded-xl hover:scale-105 transition flex items-center justify-center gap-2 text-base shadow-lg border-2 border-green-400/50">
                    <Check size={20} /> Réussi
                </button>
            </div>
          )}
          {!feedbackState && (
            <div className="text-center mt-4">
                <button onClick={onClose} className="text-xs font-bold text-white/50 hover:text-white uppercase tracking-widest transition">Pause / Plateau</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- ECRAN HISTOIRE AMÉLIORÉ ---
const StoryScreen = ({ onBack }) => (
    <div className="w-full max-w-4xl h-[90vh] bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40 z-20">
             <div className="flex items-center gap-3 text-white">
                 <BookOpen className="text-[#B02E68]" size={28} />
                 <h2 className="text-2xl font-black uppercase tracking-widest">L'Histoire</h2>
             </div>
             <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition text-white">
                 <X size={24} />
             </button>
        </div>

        {/* Contenu Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 text-white relative z-10">
            <div className="max-w-3xl mx-auto">
                {/* Profil Auteur - Premium Card */}
                <div className="relative group mb-16 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#B02E68] to-[#F26522] opacity-20 blur-xl rounded-3xl transform -rotate-1 group-hover:rotate-1 transition duration-500"></div>
                    <div className="relative bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 backdrop-blur-md">
                        
                        {/* Photo de profil */}
                        <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#CF457A] to-[#8A1C4C] rounded-full blur opacity-70"></div>
                            <img 
                                src="https://media.licdn.com/dms/image/v2/D4E03AQGPhAtWKK7wpA/profile-displayphoto-scale_200_200/B4EZky1.SpHgAY-/0/1757494638506?e=2147483647&v=beta&t=1kTBlrqh-i_Zj3pG1zk4P1PE1djT7Ze5LU8e9J5_p8E" 
                                alt="Gabriel Emrick Tognimanbou DAHISSIHO" 
                                className="relative w-full h-full object-cover rounded-full border-4 border-white/20 shadow-2xl"
                            />
                            <div className="absolute bottom-2 right-2 bg-white text-[#B02E68] p-1.5 rounded-full shadow-lg">
                                <Award size={20} />
                            </div>
                        </div>

                        <div className="text-center md:text-left space-y-2">
                            <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight">Gabriel Emrick Tognimanbou DAHISSIHO</h3>
                            <div className="inline-block bg-[#B02E68]/20 px-3 py-1 rounded-full border border-[#B02E68]/30">
                                <p className="text-[#FFC20E] font-bold text-xs tracking-widest uppercase">Junior PMO | Digital Transformation</p>
                            </div>
                            <p className="text-white/70 text-sm italic pt-2 border-t border-white/10 mt-2 font-light">
                                "I combine project structure, creativity, and strategy to build digital solutions that drive lasting transformation."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Le Manifeste - Typographie Améliorée */}
                <div className="space-y-8 text-lg leading-relaxed font-light text-white/90">
                    <p className="text-xl md:text-2xl font-medium text-white">
                        On ne le répète jamais assez : <span className="text-[#B02E68] font-bold">les compétences techniques</span> t’ouvrent la porte d’une entreprise, mais ce sont <span className="text-green-400 font-bold">les compétences humaines</span> qui te font gravir les échelons.
                    </p>
                    
                    <div className="relative pl-8 py-2">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#B02E68] to-transparent"></div>
                        <p className="text-2xl italic font-serif text-white/80">
                            "La collaboration, l’écoute, la gestion de conflit, la prise de décision collective… tout ce qui fait qu’on réussit avec les autres."
                        </p>
                    </div>

                    <p>
                        Et pourtant, la majorité des formations universitaires n’enseignent pas ça. On passe des années à apprendre à résoudre des équations, mais presque jamais à résoudre un désaccord. On nous note sur nos résultats, rarement sur notre capacité à convaincre, à fédérer ou à gérer une tension en équipe.
                    </p>

                    <div className="bg-gradient-to-r from-[#B02E68]/20 to-transparent p-6 rounded-r-2xl border-l-4 border-[#B02E68]">
                        <p className="mb-2 font-bold uppercase text-sm tracking-widest text-[#B02E68]">La Solution</p>
                        <p className="text-xl">
                            C’est là que j’ai voulu agir. Pas avec une formation classique, mais avec une expérience vivante, ludique et impactante : 
                            <span className="font-black text-white block text-3xl mt-2 tracking-tighter">🎯 SKILLSMASTER</span>
                        </p>
                    </div>

                    <p>
                        Un jeu conçu pour développer les compétences essentielles à la réussite scolaire et professionnelle en Afrique et partout ailleurs. Chaque carte te place face à une situation concrète de communication, de leadership, de créativité ou d’intelligence émotionnelle.
                    </p>

                    <p className="font-bold text-white text-xl">
                        Tu as quelques secondes pour réagir, argumenter, convaincre, coopérer.
                        <br/><span className="text-[#FFC20E]">Et c’est là que tu découvres qui tu es vraiment dans l’action.</span>
                    </p>

                    <p>
                        Parce qu’au fond, les soft skills ne s’apprennent pas dans un tableau Excel. Elles se forgent dans le mouvement, dans l’échange, dans le feu de l’instant.
                    </p>

                    <div className="mt-16 p-8 bg-white text-[#B02E68] rounded-3xl shadow-[0_10px_40px_-10px_rgba(176,46,104,0.5)] text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-pink-500"></div>
                        <Quote className="mx-auto text-[#B02E68]/20 mb-4 transform scale-150" size={48} />
                        <p className="text-2xl font-black italic relative z-10">
                            "Et moi, j’ai décidé d’en faire un jeu. Un jeu sérieux, oui. Mais surtout, un jeu qui forme à être humain. 💡"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- Ecrans Menu, History, Setup ---
const MainMenu = ({ onNavigate }) => (
  <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
     <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter mb-2 text-white drop-shadow-xl">
          SKILLS<span className="text-pink-300">MASTER</span>
        </h1>
        <p className="text-white/80 uppercase tracking-[0.3em] text-xs md:text-sm">Le jeu des compétences ultimes</p>
     </div>
     <div className="w-full max-w-xs space-y-4">
       <button onClick={() => { playSound('flip'); onNavigate('setup'); }} className="w-full group bg-white text-[#B02E68] p-4 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-all flex items-center justify-between px-6">
         <span>JOUER</span> <Play className="group-hover:translate-x-1 transition" fill="#B02E68" />
       </button>
       
       <button onClick={() => { playSound('flip'); onNavigate('story'); }} className="w-full bg-[#B02E68]/20 hover:bg-[#B02E68]/40 border border-[#B02E68]/50 text-white p-4 rounded-2xl font-bold text-lg shadow-lg backdrop-blur-sm transition-all flex items-center justify-between px-6">
         <span>L'HISTOIRE</span> <BookOpen size={20} />
       </button>

       <button onClick={() => { playSound('flip'); onNavigate('history'); }} className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white p-4 rounded-2xl font-bold text-lg shadow-lg backdrop-blur-sm transition-all flex items-center justify-between px-6">
         <span>HISTORIQUE</span> <History size={20} />
       </button>
     </div>
  </div>
);

const HistoryScreen = ({ history, onBack }) => (
    <div className="w-full max-w-2xl bg-black/20 backdrop-blur-md rounded-3xl p-6 border border-white/10 animate-in zoom-in-95 duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white flex items-center gap-2"><History /> HISTORIQUE</h2>
        <button onClick={onBack} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20"><X size={20}/></button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
        {history.length === 0 ? <div className="text-center text-white/50 py-10 italic">Aucune partie jouée.</div> : 
            history.map((game, i) => (
                <div key={i} className="bg-white/10 p-4 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-white/60 uppercase">{new Date(game.date).toLocaleTimeString()}</span>
                        <span className="bg-[#B02E68] text-white text-xs px-2 py-1 rounded font-bold">{game.mode === 'solo' ? 'SOLO' : 'MULTI'}</span>
                    </div>
                    <div className="space-y-1">
                        {game.results.map((p, idx) => (
                            <div key={idx} className="flex justify-between text-white text-sm">
                                <span>{p.name}</span><span className="font-mono font-bold">{p.score} pts</span>
                            </div>
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
    playSound('win'); // Petit son de départ
    if (mode === 'solo') onStart([{ id: 1, name: soloName, score: 0 }], 'solo');
    else onStart(players.map((p, i) => ({ id: i + 1, name: p, score: 0 })), 'multi');
  };

  return (
    <div className="w-full max-w-md bg-black/20 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl animate-in slide-in-from-right-8 duration-300">
        <button onClick={!mode ? onBack : () => setMode(null)} className="absolute top-4 left-4 text-white/50 hover:text-white transition flex items-center gap-1 text-sm font-bold"><RotateCcw size={14} /> Retour</button>
        <h2 className="text-3xl font-black text-center text-white mb-6 mt-2">CONFIGURATION</h2>
        {!mode ? (
          <div className="space-y-4">
            <button onClick={() => setMode('solo')} className="w-full bg-white text-[#B02E68] font-black text-lg py-5 rounded-2xl hover:scale-105 transition shadow-lg flex items-center justify-center gap-3"><User size={24} /> SOLO</button>
            <button onClick={() => setMode('multi')} className="w-full bg-[#B02E68] border-2 border-white text-white font-black text-lg py-5 rounded-2xl hover:scale-105 transition shadow-lg flex items-center justify-center gap-3"><Users size={24} /> MULTI-JOUEURS</button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2">
             <div className="mb-6">
                <label className="text-white/70 text-sm font-bold mb-2 block uppercase">{mode === 'solo' ? 'Pseudo' : 'Participants'}</label>
                {mode === 'solo' ? (
                  <input type="text" value={soloName} onChange={(e) => setSoloName(e.target.value)} className="w-full bg-black/30 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition" />
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                    {players.map((p, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" value={p} onChange={(e) => updatePlayerName(i, e.target.value)} className="flex-1 bg-black/30 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white text-sm" />
                        {players.length > 2 && (<button onClick={() => removePlayer(i)} className="p-2 text-white/30 hover:text-red-300 transition"><X size={16} /></button>)}
                      </div>
                    ))}
                    <button onClick={addPlayer} className="w-full py-2 border border-dashed border-white/30 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition text-xs font-bold uppercase flex items-center justify-center gap-2"><Plus size={14} /> Ajouter</button>
                  </div>
                )}
             </div>
             <button onClick={handleStart} className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-xl hover:scale-105 transition shadow-lg flex items-center justify-center gap-2">C'EST PARTI <ArrowRight size={24} /></button>
          </div>
        )}
    </div>
  );
};

const ScoreBoard = ({ players, missedCards, onEndGame }) => {
    useEffect(() => {
        playSound('gameover');
        triggerMassiveConfetti();
    }, []);

    return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl bg-[#B02E68] rounded-3xl p-8 border-4 border-white text-white text-center shadow-2xl animate-in zoom-in duration-500 my-8">
            <Trophy className="mx-auto text-yellow-300 mb-4 drop-shadow-lg" size={64} />
            <h2 className="text-4xl font-black italic mb-6">RÉSULTATS</h2>
            
            {/* Classement */}
            <div className="space-y-3 mb-8">
                {[...players].sort((a,b) => b.score - a.score).map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <span className={`font-black text-xl w-8 h-8 flex items-center justify-center rounded-full ${i===0 ? 'bg-yellow-400 text-black' : 'bg-white/10'}`}>{i+1}</span>
                            <span className="font-bold text-lg">{p.name}</span>
                        </div>
                        <span className="font-mono text-xl">{p.score} pts</span>
                    </div>
                ))}
            </div>

            {/* SECTION BILAN PÉDAGOGIQUE */}
            {missedCards && missedCards.length > 0 && (
                <div className="mb-8 text-left bg-white text-black p-6 rounded-2xl">
                    <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                        <BookOpen size={24} className="text-[#B02E68]" /> 
                        🎓 Ce qu'il faut retenir
                    </h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar-dark pr-2">
                        {missedCards.map((card, idx) => (
                            <div key={idx} className="bg-gray-100 p-3 rounded-lg border border-gray-200">
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs font-bold text-[#B02E68] uppercase">{CATEGORIES[card.categoryId.toUpperCase()].label}</span>
                                    <span className="text-xs text-gray-500">{card.title}</span>
                                </div>
                                <p className="text-sm text-gray-700 italic">"{card.explanation}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button onClick={onEndGame} className="w-full bg-white text-[#B02E68] font-black py-4 rounded-xl hover:bg-gray-100 transition shadow-lg">RETOUR AU MENU</button>
        </div>
    </div>
    );
};

const CheckCircleIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

// --- Application Principale ---

export default function App() {
  const [view, setView] = useState('menu'); // menu, setup, playing, history, story
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

  // Chargement script confetti
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const startGame = (playerList, mode) => {
    setPlayers(playerList);
    setGameMode(mode);
    setView('playing');
    setCurrentPlayerIndex(0);
    setShowScoreboard(false);
    setRoundsPlayed(0);
    setPlayedCardIds([]);
    setMissedCards([]); // Reset bilan
  };

  const endGame = () => {
    const newHistoryEntry = {
        date: new Date().toISOString(),
        mode: gameMode,
        results: [...players].sort((a,b) => b.score - a.score)
    };
    setGameHistory([newHistoryEntry, ...gameHistory]);
    setShowScoreboard(false);
    setActiveCard(null);     
    setActiveCategory(null);
    setView('menu');
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
    
    if (nextRound >= MAX_ROUNDS) { 
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
    <div className={`min-h-screen ${COLORS.backgroundGradient} font-sans selection:bg-white/30 flex flex-col overflow-hidden relative`}>
      <style>{`
        .stroke-text { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5); color: transparent; }
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

      {view === 'setup' && (
          <div className="flex-1 flex items-center justify-center p-4">
            <SetupScreen onStart={startGame} onBack={() => setView('menu')} />
          </div>
      )}

      {/* VIEW: STORY */}
      {view === 'story' && (
          <div className="flex-1 flex items-center justify-center p-4 z-50">
              <StoryScreen onBack={() => setView('menu')} />
          </div>
      )}

      {view === 'history' && (
          <div className="flex-1 flex items-center justify-center p-4">
              <HistoryScreen history={gameHistory} onBack={() => setView('menu')} />
          </div>
      )}

      {view === 'playing' && (
        <>
          <nav className="px-4 py-2 md:px-8 flex justify-between items-center bg-black/10 backdrop-blur-sm border-b border-white/10 text-white sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-300" size={20} />
              <span className="font-black italic text-lg tracking-tighter hidden md:inline">SKILLSMASTER</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <CheckSquare size={16} className="text-white/80" />
                <span className="text-sm font-bold">{roundsPlayed} / {MAX_ROUNDS}</span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-[40vw]">
                {players.map((p, i) => (
                <div key={p.id} className={`flex-shrink-0 flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${i === currentPlayerIndex ? 'bg-white text-[#B02E68] border-white font-bold shadow-lg scale-105' : 'bg-black/20 border-transparent text-white/70'}`}>
                    <span className="text-xs uppercase truncate max-w-[80px]">{p.name}</span>
                    <span className="bg-black/10 px-1.5 rounded-full text-xs font-mono">{p.score}</span>
                </div>
                ))}
            </div>
            <button onClick={() => setShowScoreboard(true)} className="bg-white/10 hover:bg-red-500/80 p-2 rounded-lg transition text-white"><X size={20} /></button>
          </nav>

          <main className="flex-1 max-w-7xl mx-auto px-4 py-4 w-full flex flex-col">
            <div className="text-center mb-4 animate-in slide-in-from-top-4">
              <span className="text-white/60 text-xs uppercase tracking-widest font-bold">Tour de {players[currentPlayerIndex]?.name}</span>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase drop-shadow-md flex items-center justify-center gap-2 mt-1">
                 Choisissez une carte <span className="text-yellow-400 text-sm align-top"><Award size={16} /></span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 auto-rows-fr pb-20">
              {Object.values(CATEGORIES).map((cat) => (
                <CardBack 
                  key={cat.id} 
                  category={cat} 
                  onClick={drawCard} 
                  disabled={isCategoryEmpty(cat.id)}
                />
              ))}
            </div>
          </main>
        </>
      )}

      {activeCard && activeCategory && (
        <CardFront 
          key={activeCard.id}
          card={activeCard} 
          category={activeCategory} 
          onClose={() => { setActiveCard(null); setActiveCategory(null); }}
          onResult={handleCardResult}
          playerName={players[currentPlayerIndex]?.name}
        />
      )}

      {showScoreboard && <ScoreBoard players={players} missedCards={missedCards} onEndGame={endGame} />}
    </div>
  );
}
