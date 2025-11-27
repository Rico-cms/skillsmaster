import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, X, Trophy, Users, User, Check, CheckCircle, XCircle, Plus, History, Award, ArrowRight, Info, CheckSquare, Volume2, VolumeX, BookOpen, Quote, Sparkles, Brain, Heart, Lightbulb, MessageCircle, Crown, Zap, Tractor, TrendingUp } from 'lucide-react';

// --- Configuration & Données ---

// Palette de couleurs structurée pour éviter les problèmes de purge Tailwind en production
const COLORS = {
  // MISE À JOUR : Style par défaut (Rose/Violet)
  defaultBackgroundStyle: {
    background: 'radial-gradient(ellipse at top, #db4d86, #B02E68, #6d133b)',
    backgroundColor: '#B02E68',
    minHeight: '100vh'
  },
  // NOUVEAU : Style pour le mode Logistique (Vert/Noir)
  logisticsBackgroundStyle: {
    background: 'radial-gradient(ellipse at top, #059669, #065F46, #000000)', 
    backgroundColor: '#065F46',
    minHeight: '100vh'
  },
  cards: {
    communication: { 
        id: 'communication',
        hex: '#00d468', // Couleur principale pour les ombres/bordures
        gradient: 'linear-gradient(135deg, rgba(0,212,104,0.2) 0%, rgba(0,122,59,0.4) 100%)',
        accentGradient: 'linear-gradient(90deg, #00d468, #007a3b)',
        border: '1px solid rgba(0,212,104,0.3)',
        text: 'text-white' 
    },
    leadership: { 
        id: 'leadership',
        hex: '#ff8c55',
        gradient: 'linear-gradient(135deg, rgba(255,140,85,0.2) 0%, rgba(196,70,11,0.4) 100%)',
        accentGradient: 'linear-gradient(90deg, #ff8c55, #c4460b)',
        border: '1px solid rgba(255,140,85,0.3)',
        text: 'text-white' 
    },
    critical_thinking: { 
        id: 'critical_thinking',
        hex: '#ff6b61',
        gradient: 'linear-gradient(135deg, rgba(255,107,97,0.2) 0%, rgba(179,32,22,0.4) 100%)',
        accentGradient: 'linear-gradient(90deg, #ff6b61, #b32016)',
        border: '1px solid rgba(255,107,97,0.3)',
        text: 'text-white' 
    },
    emotional_intelligence: { 
        id: 'emotional_intelligence',
        hex: '#4dd4ff',
        gradient: 'linear-gradient(135deg, rgba(77,212,255,0.2) 0%, rgba(0,134,184,0.4) 100%)',
        accentGradient: 'linear-gradient(90deg, #4dd4ff, #0086b8)',
        border: '1px solid rgba(77,212,255,0.3)',
        text: 'text-white' 
    },
    creativity: { 
        id: 'creativity',
        hex: '#ffe066',
        gradient: 'linear-gradient(135deg, rgba(255,224,102,0.2) 0%, rgba(204,163,0,0.4) 100%)',
        accentGradient: 'linear-gradient(90deg, #ffe066, #cca300)',
        border: '1px solid rgba(255,224,102,0.3)',
        text: 'text-white' 
    },
    logistics: { // COULEUR LOGISTIQUE : Vert Émeraude / Séquoia
        id: 'logistics',
        hex: '#059669', 
        gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.4) 100%)',
        accentGradient: 'linear-gradient(90deg, #059669, #065F46)',
        border: '1px solid rgba(5,150,105,0.3)',
        text: 'text-white'
    },
    math_wild: { // NOUVELLE COULEUR MATHS (ORANGE FLASH)
        id: 'math_wild',
        hex: '#ffa62d',
        gradient: 'linear-gradient(135deg, rgba(255,166,45,0.3) 0%, rgba(255,94,0,0.5) 100%)',
        accentGradient: 'linear-gradient(90deg, #ffa62d, #ff5e00)',
        border: '1px solid rgba(255,166,45,0.5)',
        text: 'text-white'
    }
  }
};

const CATEGORIES = {
  COMMUNICATION: { id: 'communication', label: 'COMMUNICATION', colorData: COLORS.cards.communication, icon: MessageCircle },
  LEADERSHIP: { id: 'leadership', label: 'LEADERSHIP', colorData: COLORS.cards.leadership, icon: Crown },
  CRITICAL_THINKING: { id: 'critical_thinking', label: 'CRITICAL THINKING', colorData: COLORS.cards.critical_thinking, icon: Brain },
  EMOTIONAL_INTELLIGENCE: { id: 'emotional_intelligence', label: 'INTELLIGENCE ÉMOTIONNELLE', colorData: COLORS.cards.emotional_intelligence, icon: Heart },
  // CORRECTION : Suppression de l'accent pour une correspondance propre avec .toUpperCase() lors de la recherche de clé
  CREATIVITE: { id: 'creativity', label: 'CRÉATIVITÉ', colorData: COLORS.cards.creativity, icon: Lightbulb }, 
  LOGISTICS: { id: 'logistics', label: 'LOGISTIQUE<br/>OPÉRATIONS', colorData: COLORS.cards.logistics, icon: Tractor }, // CORRECTION ICI : Ajout du <br/>
  MATH_WILD: { id: 'math_wild', label: 'DÉFI MATHS<br/>(WILD CARD)', colorData: COLORS.cards.math_wild, icon: Zap }, // NOUVELLE CATÉGORIE WILD
};

// VALEUR EN POINTS POUR LES CARTES
const DEFAULT_POINTS = 1;
const WILD_POINTS = 10; // 10 points pour les cartes mathématiques

const INITIAL_CARDS = [
  // --- Communication (13 cartes) ---
  { id: 'c1', categoryId: 'communication', type: 'challenge', title: 'PRÉSENTATION EXPRESS', scenario: 'Les réseaux sociaux : menace ou opportunité ? Mini-discours de 1 min.', explanation: 'Conseil : Commencez par une accroche forte ("Saviez-vous que..."), donnez 2 arguments opposés, et concluez avec votre avis personnel.', duration: 60, points: DEFAULT_POINTS },
  { id: 'c2', categoryId: 'communication', type: 'challenge', title: 'PITCH DE VENTE', scenario: 'Vendez ce stylo (ou un objet proche) au jury en 45 secondes.', explanation: 'Ne vendez pas l\'objet, vendez ce qu\'il permet de faire (ex: "Signer le contrat de votre vie"). Créez le besoin.', duration: 45, points: DEFAULT_POINTS },
  { id: 'c3', categoryId: 'communication', type: 'challenge', title: 'SILENCE RADIO', scenario: 'Faites deviner "Projet en retard" sans parler, uniquement avec des gestes.', explanation: 'La communication non-verbale représente plus de 50% du message.', duration: 45, points: DEFAULT_POINTS },
  { id: 'c4', categoryId: 'communication', type: 'challenge', title: 'STORYTELLING', scenario: 'Racontez une anecdote personnelle qui vous a appris une leçon, en 1 minute.', explanation: 'Une bonne histoire a une structure : Situation initiale, Élément perturbateur, Péripéties, Résolution.', duration: 60, points: DEFAULT_POINTS },
  { id: 'c5', categoryId: 'communication', type: 'challenge', title: 'FEEDBACK SANDWICH', scenario: 'Faites un retour critique à un collègue sur son travail bâclé.', explanation: 'Commencez par un point positif, abordez le point à améliorer, et finissez par un encouragement.', duration: 45, points: DEFAULT_POINTS },
  { id: 'c_quiz_1', categoryId: 'communication', type: 'quiz', title: 'ÉCOUTE ACTIVE', scenario: 'Quelle est la clé principale de l’écoute active ?', options: ['Interrompre pour questionner', 'Reformuler ce que dit l’autre', 'Préparer sa réponse'], correctIndex: 1, explanation: 'La reformulation prouve que vous avez compris le message et invite l\'autre à préciser sa pensée.', duration: 30, points: DEFAULT_POINTS },
  { id: 'c_quiz_2', categoryId: 'communication', type: 'quiz', title: 'COMMUNICATION NON-VERBALE', scenario: 'Quel pourcentage du message passe par le non-verbal (voix + corps) ?', options: ['Environ 30%', 'Environ 50%', 'Plus de 90%'], correctIndex: 2, explanation: 'Selon la règle de Mehrabian, 93% de la communication est non-verbale (ton + gestes) lors de l\'expression d\'émotions.', duration: 30, points: DEFAULT_POINTS },
  { id: 'c_quiz_3', categoryId: 'communication', type: 'quiz', title: 'QUESTION OUVERTE', scenario: 'Laquelle est une question ouverte ?', options: ['As-tu fini ?', 'Es-tu d\'accord ?', 'Qu\'en penses-tu ?'], correctIndex: 2, explanation: 'Une question ouverte ne peut pas être répondue par Oui ou Non, elle encourage le dialogue.', duration: 30, points: DEFAULT_POINTS },
  // NOUVELLES CARTES COMMUNICATION (5)
  { id: 'c6', categoryId: 'communication', type: 'challenge', title: 'MESSAGE DIFFUSÉ', scenario: 'Expliquez en 30 secondes un concept complexe (ex: la blockchain) à quelqu\'un qui n\'y connaît rien.', explanation: 'Utilisez des métaphores simples et des analogies pour rendre le concept accessible.', duration: 30, points: DEFAULT_POINTS },
  { id: 'c7', categoryId: 'communication', type: 'challenge', title: 'GÉRER L\'INTERRUPTION', scenario: 'Vous êtes interrompu pendant votre explication. Gérez la situation poliment et reprenez votre point.', explanation: 'Reconnaissez l\'interruption, et utilisez une phrase de transition ferme : "Merci, mais pour finir mon idée..."', duration: 45, points: DEFAULT_POINTS },
  { id: 'c_quiz_4', categoryId: 'communication', type: 'quiz', title: 'LE CANAL', scenario: 'Quel canal de communication est le plus riche en informations non-verbales ?', options: ['E-mail', 'Appel téléphonique', 'Réunion en personne'], correctIndex: 2, explanation: 'La réunion en personne permet de capter la voix, le langage corporel et les expressions faciales.', duration: 30, points: DEFAULT_POINTS },
  { id: 'c_quiz_5', categoryId: 'communication', type: 'quiz', title: 'ASSURANCE', scenario: 'Quel comportement exprime l\'assurance et la crédibilité ?', options: ['Parler vite et fort', 'Maintenir un contact visuel modéré', 'Croiser les bras'], correctIndex: 1, explanation: 'Le contact visuel démontre l\'engagement et la sincérité sans intimider.', duration: 30, points: DEFAULT_POINTS },
  { id: 'c_quiz_6', categoryId: 'communication', type: 'quiz', title: 'LE BIAIS', scenario: 'Le fait de juger un message uniquement par son émetteur est un biais de...', options: ['Confirmation', 'Halo', 'Ancrage'], correctIndex: 1, explanation: 'Le biais de Halo fait que l\'opinion positive ou négative sur une personne influence le jugement sur tout ce qui la concerne.', duration: 30, points: DEFAULT_POINTS },
  
  // --- Leadership (13 cartes) ---
  { id: 'l1', categoryId: 'leadership', type: 'challenge', title: 'GÉRER UN CONFLIT', scenario: 'Un collègue est toujours en retard. Dites-lui fermement mais poliment.', explanation: 'Utilisez la méthode DESC : Décrire les faits, Exprimer votre ressenti, Suggérer une solution, Conclure sur les conséquences positives.', duration: 45, points: DEFAULT_POINTS },
  { id: 'l2', categoryId: 'leadership', type: 'challenge', title: 'MOTIVATION', scenario: 'Votre équipe est découragée après un échec. Remotivez-les en 1 min.', explanation: 'Reconnaissez l\'effort, dédramatisez l\'échec, et focalisez sur la prochaine étape.', duration: 60, points: DEFAULT_POINTS },
  { id: 'l3', categoryId: 'leadership', type: 'challenge', title: 'PRISE DE DÉCISION', scenario: 'Urgence : Vous devez couper le budget de 10% immédiatement. Annoncez-le à l\'équipe.', explanation: 'Soyez transparent sur les raisons, ferme sur la décision, mais ouvert à la discussion sur la mise en œuvre.', duration: 60, points: DEFAULT_POINTS },
  { id: 'l4', categoryId: 'leadership', type: 'challenge', title: 'VISION', scenario: 'Décrivez votre vision de l\'entreprise idéale en 3 phrases inspirantes.', explanation: 'Une vision doit être claire, ambitieuse et inspirante pour fédérer.', duration: 60, points: DEFAULT_POINTS },
  { id: 'l_quiz_1', categoryId: 'leadership', type: 'quiz', title: 'STYLE DE LEADERSHIP', scenario: 'Quel style implique le plus l’équipe dans la prise de décision ?', options: ['Autoritaire', 'Démocratique', 'Laissez-faire'], correctIndex: 1, explanation: 'Le style démocratique (ou participatif) invite les collaborateurs à partager leur avis avant la décision finale.', duration: 30, points: DEFAULT_POINTS },
  { id: 'l_quiz_2', categoryId: 'leadership', type: 'quiz', title: 'DÉLÉGATION', scenario: 'Pourquoi déléguer est-il important ?', options: ['Pour moins travailler', 'Pour responsabiliser et former', 'Pour éviter les tâches ingrates'], correctIndex: 1, explanation: 'Déléguer fait grandir vos collaborateurs et vous libère du temps pour la stratégie.', duration: 30, points: DEFAULT_POINTS },
  { id: 'l_quiz_3', categoryId: 'leadership', type: 'quiz', title: 'FEEDBACK', scenario: 'Le but principal d\'un feedback correctif est :', options: ['De sanctionner une erreur', 'D\'améliorer la performance future', 'De montrer qui est le chef'], correctIndex: 1, explanation: 'Le feedback est un outil de développement, pas de punition.', duration: 30, points: DEFAULT_POINTS },
  { id: 'l_quiz_4', categoryId: 'leadership', type: 'quiz', title: 'CONFIANCE', scenario: 'Comment bâtir la confiance rapidement ?', options: ['En contrôlant tout', 'En tenant ses promesses', 'En étant ami avec tout le monde'], correctIndex: 1, explanation: 'La cohérence entre les paroles et les actes est le fondement de la confiance.', duration: 30, points: DEFAULT_POINTS },
  // NOUVELLES CARTES LEADERSHIP (5)
  { id: 'l5', categoryId: 'leadership', type: 'challenge', title: 'CRÉER L\'ENGAGEMENT', scenario: 'Un collègue est démotivé et fait le strict minimum. Proposez-lui un plan d\'action pour le réengager.', explanation: 'Utilisez la motivation intrinsèque (reconnaissance, autonomie, maîtrise) plutôt que la motivation extrinsèque (argent).', duration: 60, points: DEFAULT_POINTS },
  { id: 'l6', categoryId: 'leadership', type: 'challenge', title: 'ÉTABLIR LES PRIORITÉS', scenario: 'Votre équipe a trop de projets. Décidez des 3 projets prioritaires et justifiez en 45s.', explanation: 'Utilisez un critère objectif (impact vs effort) et communiquez clairement les projets qui seront mis en pause.', duration: 45, points: DEFAULT_POINTS },
  { id: 'l_quiz_5', categoryId: 'leadership', type: 'quiz', title: 'LEADERSHIP SITUATIONNEL', scenario: 'Face à un junior, quel style de leadership est le plus adapté au début ?', options: ['Délégatif', 'Participatif', 'Directif'], correctIndex: 2, explanation: 'Un débutant a besoin d\'instructions claires et d\'une supervision rapprochée (style directif).', duration: 30, points: DEFAULT_POINTS },
  { id: 'l_quiz_6', categoryId: 'leadership', type: 'quiz', title: 'COHÉSION', scenario: 'Quelle est la meilleure façon de renforcer la cohésion d\'équipe ?', options: ['Organiser des fêtes régulières', 'Célébrer les succès collectifs', 'Augmenter les salaires'], correctIndex: 1, explanation: 'La célébration des réussites partagées renforce l\'identité du groupe et la reconnaissance mutuelle.', duration: 30, points: DEFAULT_POINTS },
  { id: 'l_quiz_7', categoryId: 'leadership', type: 'quiz', title: 'L\'EXEMPLE', scenario: 'Le leadership commence par...', options: ['La stratégie', 'L\'exemple personnel', 'Les règles claires'], correctIndex: 1, explanation: 'Un leader doit incarner les valeurs et les comportements qu\'il attend des autres (lead by example).', duration: 30, points: DEFAULT_POINTS },

  // --- Critical Thinking (13 cartes) ---
  { id: 'ct1', categoryId: 'critical_thinking', type: 'challenge', title: 'SYSTÈME D', scenario: 'Plus d\'internet 30 min avant le rendu ! Que faites-vous ?', explanation: 'Priorité 1 : Prévenir (téléphone). Priorité 2 : Alternative (partage de connexion 4G, café voisin, clé USB).', duration: 60, points: DEFAULT_POINTS },
  { id: 'ct2', categoryId: 'critical_thinking', type: 'challenge', title: 'FAKE NEWS', scenario: 'Analysez cette info : "Une étude dit que dormir 2h suffit". Vrai ou Faux ?', explanation: 'Vérifiez la source, l\'échantillon et le consensus scientifique. C\'est biologiquement improbable pour la majorité.', duration: 45, points: DEFAULT_POINTS },
  { id: 'ct3', categoryId: 'critical_thinking', type: 'challenge', title: 'AVOCAT DU DIABLE', scenario: 'Défendez l\'idée que "L\'échec est la meilleure chose qui puisse arriver".', explanation: 'Cherchez les arguments contre-intuitifs : apprentissage, résilience, innovation forcée.', duration: 60, points: DEFAULT_POINTS },
  { id: 'ct4', categoryId: 'critical_thinking', type: 'challenge', title: 'PRIORISATION', scenario: 'Vous avez 5 tâches urgentes. Comment choisissez-vous ?', explanation: 'Matrice d\'Eisenhower : Important vs Urgent. Commencez par ce qui est Important ET Urgent.', duration: 45, points: DEFAULT_POINTS },
  { id: 'ct_quiz_1', categoryId: 'critical_thinking', type: 'quiz', title: 'LOGIQUE', scenario: 'Si "Tous les chats sont gris" est FAUX, alors...', options: ['Aucun chat n\'est gris', 'Au moins un chat n\'est pas gris', 'Tous les chats sont noirs'], correctIndex: 1, explanation: 'La négation de "Tous" n\'est pas "Aucun", mais "Il existe au moins un contre-exemple".', duration: 45, points: DEFAULT_POINTS },
  { id: 'ct_quiz_2', categoryId: 'critical_thinking', type: 'quiz', title: 'BIAIS COGNITIF', scenario: 'Qu\'est-ce que le biais de confirmation ?', options: ['Croire tout ce qu\'on lit', 'Ne chercher que les infos qui confirment nos croyances', 'Toujours douter de soi'], correctIndex: 1, explanation: 'Notre cerveau filtre naturellement les informations pour conforter ce qu\'il pense déjà.', duration: 30, points: DEFAULT_POINTS },
  { id: 'ct_quiz_3', categoryId: 'critical_thinking', type: 'quiz', title: 'CORRÉLATION', scenario: 'Corrélation n\'est pas...', options: ['Causalité', 'Statistique', 'Information'], correctIndex: 0, explanation: 'Ce n\'est pas parce que deux événements arrivent en même temps que l\'un cause l\'autre (ex: ventes de glaces et coups de soleil).', duration: 30, points: DEFAULT_POINTS },
  { id: 'ct_quiz_4', categoryId: 'critical_thinking', type: 'quiz', title: 'ARGUMENTATION', scenario: 'Qu\'est-ce qu\'un argument "Ad Hominem" ?', options: ['Une attaque contre la personne', 'Un argument basé sur l\'émotion', 'Une preuve scientifique'], correctIndex: 0, explanation: 'C\'est attaquer celui qui parle plutôt que ses arguments.', duration: 30, points: DEFAULT_POINTS },
  // NOUVELLES CARTES CRITICAL THINKING (5)
  { id: 'ct5', categoryId: 'critical_thinking', type: 'challenge', title: 'JUGEMENT DE VALEUR', scenario: 'Votre collègue dit: "C\'est la seule façon de faire ce projet." Remettez cette affirmation en question.', explanation: 'Posez des questions qui ouvrent des alternatives : "Y a-t-il un scénario où cela échouerait ? Quelles sont les hypothèses derrière cette affirmation ?"', duration: 45, points: DEFAULT_POINTS },
  { id: 'ct6', categoryId: 'critical_thinking', type: 'challenge', title: 'LE PROBLÈME RACINE', scenario: 'L\'équipe est en retard sur 3 projets. Quel est le problème racine le plus probable ?', explanation: 'Utilisez la méthode des 5 Pourquoi (5 Whys) : Manque de ressources ? Mauvaise priorisation ? Estimation initiale incorrecte ?', duration: 60, points: DEFAULT_POINTS },
  { id: 'ct_quiz_5', categoryId: 'critical_thinking', type: 'quiz', title: 'PENSÉE SYSTÉMIQUE', scenario: 'Voir un problème dans son contexte global et non de manière isolée est la...', options: ['Pensée divergente', 'Pensée linéaire', 'Pensée systémique'], correctIndex: 2, explanation: 'La pensée systémique permet de comprendre les interactions et les conséquences indirectes des décisions.', duration: 30, points: DEFAULT_POINTS },
  { id: 'ct_quiz_6', categoryId: 'critical_thinking', type: 'quiz', title: 'FALLACE', scenario: 'Affirmer qu\'un produit est bon parce qu\'il est cher est une fallace de...', options: ['Pente glissante', 'Appel à l\'autorité', 'Prix/Valeur'], correctIndex: 2, explanation: 'C\'est un raccourci mental qui associe, souvent à tort, le coût à la qualité.', duration: 30, points: DEFAULT_POINTS },
  { id: 'ct_quiz_7', categoryId: 'critical_thinking', type: 'quiz', title: 'HYPOTHÈSE', scenario: 'Une hypothèse de travail doit être...', options: ['Prouvée immédiatement', 'Fausse', 'Testable et réfutable'], correctIndex: 2, explanation: 'La base de la démarche scientifique est de pouvoir tester une hypothèse, et potentiellement la réfuter.', duration: 30, points: DEFAULT_POINTS },

  // --- Emotional Intelligence (13 cartes) ---
  { id: 'ei1', categoryId: 'emotional_intelligence', type: 'challenge', title: 'EMPATHIE', scenario: 'Un collègue pleure après une critique. Que dites-vous ?', explanation: 'Évitez "Calme-toi". Dites plutôt : "Je vois que ça t\'a touché, tu veux en parler ou tu préfères être seul un moment ?"', duration: 45, points: DEFAULT_POINTS },
  { id: 'ei2', categoryId: 'emotional_intelligence', type: 'challenge', title: 'AUTO-CONTRÔLE', scenario: 'Un client vous hurle dessus injustement. Réagissez.', explanation: 'Ne le prenez pas personnellement. Gardez une voix calme et basse. "Je comprends votre frustration, cherchons une solution."', duration: 45, points: DEFAULT_POINTS },
  { id: 'ei3', categoryId: 'emotional_intelligence', type: 'challenge', title: 'GESTION DU STRESS', scenario: 'Grosse présentation dans 5 min, vous paniquez. Que faites-vous ?', explanation: 'Respiration carrée (4s inspirer, 4s bloquer, 4s expirer, 4s bloquer). Visualisation positive.', duration: 45, points: DEFAULT_POINTS },
  { id: 'ei4', categoryId: 'emotional_intelligence', type: 'challenge', title: 'MÉDIATION', scenario: 'Deux amis se disputent violemment devant vous. Intervenez.', explanation: 'Restez neutre. "On ne va rien résoudre en criant. Chacun son tour, qu\'est-ce qui se passe ?"', duration: 60, points: DEFAULT_POINTS },
  { id: 'ei_quiz_1', categoryId: 'emotional_intelligence', type: 'quiz', title: 'ÉMOTION', scenario: 'À quoi sert la colère (fonction primaire) ?', options: ['À faire peur', 'À signaler une injustice/obstacle', 'À rien'], correctIndex: 1, explanation: 'La colère est une réaction de défense face à une agression, une frustration ou une injustice perçue.', duration: 30, points: DEFAULT_POINTS },
  { id: 'ei_quiz_2', categoryId: 'emotional_intelligence', type: 'quiz', title: 'EMPATHIE vs SYMPATHIE', scenario: 'La différence clé est...', options: ['L\'empathie comprend, la sympathie partage', 'C\'est la même chose', 'L\'empathie c\'est pour les psychologues'], correctIndex: 0, explanation: 'L\'empathie est la capacité de comprendre l\'émotion de l\'autre sans forcément la ressentir soi-même.', duration: 30, points: DEFAULT_POINTS },
  { id: 'ei_quiz_3', categoryId: 'emotional_intelligence', type: 'quiz', title: 'ASSERTIVITÉ', scenario: 'Être assertif, c\'est...', options: ['Imposer son point de vue', 'Ne jamais dire non', 'S\'affirmer en respectant l\'autre'], correctIndex: 2, explanation: 'Ni hérisson (agressif), ni paillasson (passif). L\'assertivité est l\'équilibre.', duration: 30, points: DEFAULT_POINTS },
  { id: 'ei_quiz_4', categoryId: 'emotional_intelligence', type: 'quiz', title: 'SIGNES DE STRESS', scenario: 'Lequel est un signe physique de stress ?', options: ['Mains moites', 'Faim excessive', 'Les deux'], correctIndex: 2, explanation: 'Le corps réagit au danger perçu par de nombreux signaux physiologiques.', duration: 30, points: DEFAULT_POINTS },
  // NOUVELLES CARTES INTELLIGENCE ÉMOTIONNELLE (5)
  { id: 'ei5', categoryId: 'emotional_intelligence', type: 'challenge', title: 'AUTO-RÉFLEXION', scenario: 'Décrivez une situation où votre réaction émotionnelle a été excessive et ce que vous avez appris.', explanation: 'L\'auto-réflexion est la base de l\'intelligence émotionnelle. Montrez la capacité d\'analyse et de croissance.', duration: 60, points: DEFAULT_POINTS },
  { id: 'ei6', categoryId: 'emotional_intelligence', type: 'challenge', title: 'COMPRENDRE LES SIGNES', scenario: 'Votre chef semble tendu. Listez 3 signes non-verbaux qui pourraient l\'indiquer et comment réagiriez-vous.', explanation: 'Ex: Posture rigide, mâchoire serrée, silence. Réponse : Demander calmement s\'il a 5 minutes pour discuter d\'un point important.', duration: 45, points: DEFAULT_POINTS },
  { id: 'ei_quiz_5', categoryId: 'emotional_intelligence', type: 'quiz', title: 'DÉCLENCHEURS', scenario: 'Identifier ses propres "déclencheurs" émotionnels est une compétence de...', options: ['Gestion sociale', 'Conscience de soi', 'Motivation'], correctIndex: 1, explanation: 'La conscience de soi permet de comprendre pourquoi certaines situations provoquent des réactions fortes.', duration: 30, points: DEFAULT_POINTS },
  { id: 'ei_quiz_6', categoryId: 'emotional_intelligence', type: 'quiz', title: 'LE BIEN-ÊTRE', scenario: 'Le meilleur outil contre le burnout est...', options: ['Augmenter ses heures', 'Fixer des limites claires', 'Changer de travail'], correctIndex: 1, explanation: 'La gestion des limites (dire non) est essentielle pour préserver son énergie et son bien-être.', duration: 30, points: DEFAULT_POINTS },
  { id: 'ei_quiz_7', categoryId: 'emotional_intelligence', type: 'quiz', title: 'LE REGARD', scenario: 'Le fait de ne pas maintenir de contact visuel en situation de conflit est souvent perçu comme...', options: ['Du respect', 'De la soumission', 'De l\'ennui'], correctIndex: 1, explanation: 'C\'est un signe de faible assertivité ou de tentative d\'évitement du conflit.', duration: 30, points: DEFAULT_POINTS },

  // --- Creativity (13 cartes) ---
  // Toutes les cartes de créativité utilisent déjà l'ID 'creativity'
  { id: 'cr1', categoryId: 'creativity', type: 'challenge', title: 'DÉTOURNEMENT', scenario: '5 utilisations inhabituelles pour une brique rouge.', explanation: 'Exemples : Cale-livre, piler des épices, chauffer un lit (brique chaude), faire de la poussière rouge pour peindre...', duration: 45, points: DEFAULT_POINTS },
  { id: 'cr2', categoryId: 'creativity', type: 'challenge', title: 'MOTS INTERDITS', scenario: 'Décrivez un "Smartphone" sans dire : Tel, Écran, Appli, Internet.', explanation: 'Utilisez des métaphores : "Ardoise magique connectée", "Lien vers le monde", "Miroir numérique"...', duration: 60, points: DEFAULT_POINTS },
  { id: 'cr3', categoryId: 'creativity', type: 'challenge', title: 'SCAMPER', scenario: 'Comment améliorer une "Chaise" ? (Ajouter, Modifier, etc.)', explanation: 'Ajouter des roues ? La rendre gonflable ? La faire chauffante ? La transformer en sac à dos ?', duration: 45, points: DEFAULT_POINTS },
  { id: 'cr4', categoryId: 'creativity', type: 'challenge', title: 'PENSÉE LATÉRALE', scenario: 'Un homme entre dans un bar et demande un verre d\'eau. Le barman sort un fusil. L\'homme dit merci et part. Pourquoi ?', explanation: 'L\'homme avait le hoquet. Le barman lui a fait peur pour le guérir. L\'homme a compris et l\'a remercié.', duration: 60, points: DEFAULT_POINTS },
  { id: 'cr_quiz_1', categoryId: 'creativity', type: 'quiz', title: 'BRAINSTORMING', scenario: 'La règle d\'or du brainstorming est :', options: ['La qualité avant tout', 'Pas de critique immédiate', 'Parler chacun son tour'], correctIndex: 1, explanation: 'Le jugement tue la créativité. On vise la quantité d\'abord, on trie ensuite (CQFD : Censure Interdite).', duration: 30, points: DEFAULT_POINTS },
  { id: 'cr_quiz_2', categoryId: 'creativity', type: 'quiz', title: 'INNOVATION', scenario: 'Qu\'est-ce que la "sérendipité" ?', options: ['Une méthode de gestion', 'Trouver quelque chose qu\'on ne cherchait pas', 'Une sorte de colle'], correctIndex: 1, explanation: 'C\'est l\'art de faire des découvertes heureuses par hasard (ex: le Post-it, la Pénicilline).', duration: 30, points: DEFAULT_POINTS },
  { id: 'cr_quiz_3', categoryId: 'creativity', type: 'quiz', title: 'OBSTACLE', scenario: 'Le pire ennemi de la créativité est...', options: ['Le manque de temps', 'La peur du ridicule', 'Le manque d\'argent'], correctIndex: 1, explanation: 'La peur du jugement des autres bride l\'imagination.', duration: 30, points: DEFAULT_POINTS },
  { id: 'cr_quiz_4', categoryId: 'creativity', type: 'quiz', title: 'DESIGN THINKING', scenario: 'La première étape du Design Thinking est...', options: ['Prototyper', 'L\'Empathie', 'Définir'], correctIndex: 1, explanation: 'Il faut d\'abord comprendre profondément les besoins de l\'utilisateur.', duration: 30, points: DEFAULT_POINTS },
  // NOUVELLES CARTES CRÉATIVITÉ (5)
  { id: 'cr5', categoryId: 'creativity', type: 'challenge', title: 'LIAISON FORCÉE', scenario: 'Imaginez un lien entre "Montre" et "Tapis de course". (Ex: une montre qui motive à courir)', explanation: 'La liaison forcée consiste à créer une connexion entre deux objets sans rapport pour générer une idée nouvelle.', duration: 45, points: DEFAULT_POINTS },
  { id: 'cr6', categoryId: 'creativity', type: 'challenge', title: 'CHANGER LA PERSPECTIVE', scenario: 'Comment un enfant de 5 ans résoudrait-il le problème des embouteillages ?', explanation: 'Utilisez la pensée des enfants (naïve, sans contraintes) pour générer des idées radicalement différentes.', duration: 60, points: DEFAULT_POINTS },
  { id: 'cr_quiz_5', categoryId: 'creativity', type: 'quiz', title: 'FLUIDITÉ', scenario: 'La fluidité, en créativité, c\'est la capacité à...', options: ['Trouver une seule idée parfaite', 'Générer beaucoup d\'idées', 'Résoudre des problèmes mathématiques'], correctIndex: 1, explanation: 'La fluidité est la quantité : produire le plus d\'options possible.', duration: 30, points: DEFAULT_POINTS },
  { id: 'cr_quiz_6', categoryId: 'creativity', type: 'quiz', title: 'PENSÉE DIVERGENTE', scenario: 'La pensée divergente consiste à...', options: ['Choisir la meilleure solution', 'Évaluer les solutions', 'Explorer plusieurs solutions'], correctIndex: 2, explanation: 'C\'est l\'exploration créative, l\'opposé de la pensée convergente (choix).', duration: 30, points: DEFAULT_POINTS },
  { id: 'cr_quiz_7', categoryId: 'creativity', type: 'quiz', title: 'BLOCAGE', scenario: 'Quel type de blocage est lié à la rigidité des règles établies ?', options: ['Blocage émotionnel', 'Blocage culturel/environnemental', 'Blocage perceptuel'], correctIndex: 1, explanation: 'Les normes sociales ou organisationnelles empêchent souvent de penser différemment.', duration: 30, points: DEFAULT_POINTS },

  // --- Logistique/Opérations (12 cartes de base pour le défi 53) ---
  { id: 'log1', categoryId: 'logistics', type: 'challenge', title: 'PRIORISATION IMMÉDIATE', scenario: 'Cinq tâches urgentes sur votre bureau. Ordonnez-les et justifiez votre choix en 30s.', explanation: 'Utilisez la matrice Urgent/Important (Eisenhower). Concentrez-vous d\'abord sur ce qui est Important ET Urgent.', duration: 30, points: DEFAULT_POINTS },
  { id: 'log2', categoryId: 'logistics', type: 'challenge', title: 'DÉLÉGUER UNE TÂCHE', scenario: 'Vous devez former un collègue pour reprendre une tâche complexe. Expliquez la méthode en 45s.', explanation: 'Méthode : Expliquer le pourquoi, montrer le comment, laisser faire, et vérifier/corriger.', duration: 45, points: DEFAULT_POINTS },
  { id: 'log3', categoryId: 'logistics', type: 'challenge', title: 'CLIENT INSATISFAIT', scenario: 'Un client menace de partir. Comment regagnez-vous sa confiance ?', explanation: 'Écoute active, excuses sincères, proposition de solution immédiate, et offre compensatoire (geste commercial).', duration: 60, points: DEFAULT_POINTS },
  { id: 'log4', categoryId: 'logistics', type: 'challenge', title: 'EFFICACITÉ RÉUNION', scenario: 'La réunion est inutile. Prenez la parole pour la recentrer ou y mettre fin poliment.', explanation: 'Soyez précis : "Pour être efficaces, revenons à l\'objectif initial. Avons-nous pris une décision sur le point X ?"', duration: 45, points: DEFAULT_POINTS },
  { id: 'log5', categoryId: 'logistics', type: 'challenge', title: 'AMÉLIORATION CONTINUE', scenario: 'Identifiez une perte de temps dans votre routine et proposez une solution en 30s.', explanation: 'La clé est la mesure (combien de temps perdu ?) et la proposition de solution concrète (ex: Automatiser, Regrouper les tâches).', duration: 30, points: DEFAULT_POINTS },
  { id: 'log_quiz_1', categoryId: 'logistics', type: 'quiz', title: 'MATRICE EISENHOWER', scenario: 'Où placer une tâche "Non Urgente mais Importante" ?', options: ['À faire immédiatement (Urgent)', 'À planifier (Planifier)', 'À déléguer (Déléguer)'], correctIndex: 1, explanation: 'C\'est la zone de l\'excellence où l\'on fait de la stratégie (Planification).', duration: 30, points: DEFAULT_POINTS },
  { id: 'log_quiz_2', categoryId: 'logistics', type: 'quiz', title: 'TEAMWORK', scenario: 'Quelle est la principale cause d\'inefficacité en équipe ?', options: ['Manque de ressources', 'Objectifs flous', 'Conflits de personnalité'], correctIndex: 1, explanation: 'Des objectifs clairs (SMART) alignent l\'énergie de l\'équipe et évitent les efforts inutiles.', duration: 30, points: DEFAULT_POINTS },
  { id: 'log_quiz_3', categoryId: 'logistics', type: 'quiz', title: 'SATISFACTION CLIENT', scenario: 'Le meilleur moment pour demander un feedback client est...', options: ['Avant l\'achat', 'Immédiatement après le service', 'Un mois après l\'achat'], correctIndex: 1, explanation: 'Le client est le plus engagé émotionnellement juste après l\'expérience.', duration: 30, points: DEFAULT_POINTS },
  { id: 'log_quiz_4', categoryId: 'logistics', type: 'quiz', title: 'GESTION DE PROJET', scenario: 'La méthode Agile met l\'accent sur :', options: ['La documentation exhaustive', 'L\'adaptabilité et la collaboration client', 'Le respect strict du plan initial'], correctIndex: 1, explanation: 'Agile privilégie les interactions et le logiciel fonctionnel sur la documentation et le contrat.', duration: 30, points: DEFAULT_POINTS },
  { id: 'log_quiz_5', categoryId: 'logistics', type: 'quiz', title: 'PRODUCTIVITÉ', scenario: 'Quel est le principe de Pareto (80/20) ?', options: ['80% des tâches prennent 20% du temps', '20% des efforts produisent 80% des résultats', '80% des clients sont satisfaits'], correctIndex: 1, explanation: 'Il faut identifier les 20% d\'actions qui ont le plus grand impact.', duration: 30, points: DEFAULT_POINTS },
  { id: 'log_quiz_6', categoryId: 'logistics', type: 'quiz', title: 'DÉLÉGATION', scenario: 'Déléguer la responsabilité sans déléguer l\'autorité mène à :', options: ['Plus d\'efficacité', 'De la confusion et de la frustration', 'Une meilleure formation'], correctIndex: 1, explanation: 'L\'autorité (le pouvoir de décider) doit accompagner la responsabilité (l\'obligation de faire).', duration: 30, points: DEFAULT_POINTS },
  { id: 'log_quiz_7', categoryId: 'logistics', type: 'quiz', title: 'KPI LOGISTIQUE', scenario: 'Quelle est un KPI essentiel pour la Logistique ?', options: ['Temps passé en réunion', 'Taux de rotation des stocks', 'Nombre de likes sur les réseaux sociaux'], correctIndex: 1, explanation: 'Le Taux de Rotation mesure la vitesse à laquelle les stocks se vendent, un indicateur d\'efficacité opérationnelle.', duration: 30, points: DEFAULT_POINTS },

  // --- MATH WILD CARDS (5 cartes à 10 points) ---
  { id: 'm_wild_1', categoryId: 'math_wild', type: 'quiz', title: 'CALCUL MENTAL', scenario: 'Si un produit coûte 80€ et est soldé à 25%, quel est son prix final ?', options: ['65€', '60€', '55€'], correctIndex: 1, explanation: '25% de 80€ est (80 / 4) = 20€. Le prix final est 80€ - 20€ = 60€.', duration: 30, points: WILD_POINTS },
  { id: 'm_wild_2', categoryId: 'math_wild', type: 'quiz', title: 'SUITE LOGIQUE', scenario: 'Quel est le prochain chiffre de cette série : 1, 1, 2, 3, 5, 8, ?', options: ['12', '13', '14'], correctIndex: 1, explanation: 'C\'est la suite de Fibonacci : chaque nombre est la somme des deux précédents (5 + 8 = 13).', duration: 30, points: WILD_POINTS },
  { id: 'm_wild_3', categoryId: 'math_wild', type: 'quiz', title: 'ÉQUATION MYSTÈRE', scenario: 'Si $2x + 5 = 15$, que vaut $x$ ?', options: ['3', '5', '10'], correctIndex: 1, explanation: 'En soustrayant 5, on a $2x = 10$. En divisant par 2, on a $x = 5$.', duration: 30, points: WILD_POINTS },
  { id: 'm_wild_4', categoryId: 'math_wild', type: 'quiz', title: 'POURCENTAGE', scenario: 'Vous devez livrer 400 colis. Vous en avez déjà livré 300. Quel pourcentage reste-t-il à livrer ?', options: ['10%', '25%', '75%'], correctIndex: 1, explanation: 'Il reste 100 colis à livrer sur 400. $100/400 = 1/4 = 25\%$.', duration: 30, points: DEFAULT_POINTS },
  { id: 'm_wild_5', categoryId: 'math_wild', type: 'quiz', title: 'GESTION DU TEMPS', scenario: 'Il est 14h30. Si vous avez une réunion de 90 minutes, à quelle heure finit-elle ?', options: ['15h30', '16h00', '16h30'], correctIndex: 0, explanation: '90 minutes = 1h30. 14h30 + 1h30 = 16h00.', duration: 30, points: WILD_POINTS },
];

// --- SOUND MANAGER (Fonctions inchangées) ---
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
    if (!window.confetti) return; // CORRECTION: Ajout de la vérification confetti
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

// --- REDESIGN COMPLET : CARTE DE CHOIX PREMIUM ---
const CardBack = ({ category, onClick, disabled }) => {
  const Icon = category.icon;
  
  // Styles inline dynamiques pour le gradient et la bordure (safe pour production)
  const cardStyle = {
    background: disabled ? '#2d2d2d' : category.colorData.gradient,
    border: disabled ? '1px solid #444' : category.colorData.border,
    boxBoxShadow: disabled ? 'none' : `0 0 40px ${category.colorData.hex}30`, // Ombre plus prononcée
  };

  return (
    <div
      className={`
        relative w-full aspect-[3/4] rounded-[32px] transition-all duration-500
        ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : 'group cursor-pointer'}
      `}
      style={{
          transform: disabled ? 'none' : 'translateY(0)',
          marginBottom: disabled ? 0 : '40px', // Ajout d'une marge pour le bouton qui apparaît en dessous
      }}
    >
        {/* Le corps de la carte est cliquable et se soulève */}
        <button 
          onClick={() => { if(!disabled) { playSound('flip'); onClick(category.id); }}}
          disabled={disabled}
          className={`
            relative w-full h-full rounded-[32px] transition-all duration-500
            flex flex-col items-center justify-between p-6 overflow-hidden
            group-hover:-translate-y-3 group-hover:shadow-2xl
          `}
          style={cardStyle}
        >
          {/* Texture de fond bruitée pour aspect premium */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
          
          {/* Reflet lumineux en haut */}
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

          {/* ICONE CENTRALE AVEC EFFET NEON */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
            <div className={`
                 relative w-28 h-28 rounded-3xl flex items-center justify-center 
                 bg-white/10 backdrop-blur-md border-2 border-white/20
                 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
                 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
            `}>
                 {/* Glow derrière l'icone */}
                 <div className="absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" style={{ backgroundColor: category.colorData.hex }}></div>
                 <Icon size={56} className="text-white drop-shadow-md relative z-10" strokeWidth={1.5} />
            </div>
          </div>

          {/* TITRE - CORRECTION ICI */}
          <div className="relative z-10 w-full mt-4 flex flex-col items-center">
             <h3 
                className="font-black text-white text-lg tracking-tight uppercase text-center mb-2 drop-shadow-lg leading-tight"
                // Utilisation de dangerouslySetInnerHTML pour le <br/>
                dangerouslySetInnerHTML={{ __html: category.label }}
             />
             
             {/* Ligne décorative qui se transforme */}
             <div className={`w-12 h-1 bg-white/50 rounded-full transition-all duration-300 ${!disabled && 'group-hover:w-full group-hover:bg-white'}`}></div>
          </div>

          {/* Bordure intérieure brillante */}
          <div className="absolute inset-[1px] rounded-[31px] border border-white/10 pointer-events-none"></div>
        </button>

        {/* Bouton JOUER qui apparaît SOUS la carte au survol (non superposé) */}
        {!disabled && (
             <div 
                className="absolute left-1/2 -bottom-10 w-[80%] transform -translate-x-1/2 opacity-0 transition-all duration-500 pointer-events-none group-hover:opacity-100 group-hover:-translate-y-1"
             >
                 <button 
                    onClick={() => { playSound('flip'); onClick(category.id); }}
                    className="w-full text-black px-6 py-2 rounded-xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 transform scale-100 transition-all duration-300 pointer-events-auto"
                    style={{ background: category.colorData.hex, boxShadow: `0 10px 20px -5px ${category.colorData.hex}80` }}
                 >
                    <Plus size={16} strokeWidth={4} className="text-black/80" /> JOUER
                 </button>
             </div>
        )}
    </div>
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

  // Style de l'accentuation basé sur la catégorie (pour les boutons, timer, etc.)
  const hexColor = category.colorData.hex;

  // Affichage des points dynamiques
  const cardPoints = card.points || DEFAULT_POINTS;

  return (
    // MISE À JOUR : Ajout d'une classe pour la transition d'apparition
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-in slide-in-from-top-full duration-300">
      {/* Utilisation du style en ligne pour le gradient background */}
      <div 
         style={{ background: category.colorData.gradient }}
         // CORRECTION DE LA HAUTEUR MOBILE : Utiliser h-[90vh] pour éviter le débordement sur petit écran
         className={`relative w-full md:max-w-6xl h-[90vh] md:h-[80vh] rounded-[2.5rem] shadow-[0_0_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden text-white flex flex-col ring-4 ring-white/20`}
      >
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
                    <span className="font-bold text-sm text-white leading-none" dangerouslySetInnerHTML={{ __html: category.label }}></span>
                </div>
                <div className="text-3xl w-10 h-10 flex items-center justify-center rounded-xl" style={{ backgroundColor: `${hexColor}20`, border: `1px solid ${hexColor}60` }}> <category.icon size={24} style={{ color: hexColor }} /></div>
                <button onClick={onClose} className="ml-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition"><X size={20}/></button>
            </div>
        </div>

        {/* CONTENU RESPONSIVE DE LA CARTE */}
        {/* CORRECTION DU LAYOUT : flex-col sur mobile, flex-row sur desktop */}
        <div className="flex-grow flex flex-col md:flex-row overflow-y-auto relative z-10">
            {feedbackState && (
                <div className="absolute inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                    <div className="max-w-2xl w-full">
                        {feedbackState === 'success' ? (
                            <div className="mb-6 transform animate-bounce">
                                <h2 className="text-5xl font-black text-green-400 italic tracking-tighter flex items-center justify-center gap-3"><CheckCircle size={48} className="text-green-400" /> EXCELLENT !</h2>
                                <p className="font-bold text-white text-xl mt-2 tracking-widest">+{cardPoints} POINTS</p>
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
                        <button onClick={handleNext} className="w-full text-black font-black py-4 rounded-xl hover:scale-105 transition-all flex items-center justify-center gap-3 text-xl shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]" style={{ background: hexColor }}>CONTINUER <ArrowRight size={24} strokeWidth={3} /></button>
                    </div>
                </div>
            )}

            {/* Zone de Contenu (Scenario) - Prends 65% sur desktop, 100% sur mobile */}
            <div className="flex-1 p-6 md:p-10 flex flex-col justify-center items-center text-center overflow-y-auto custom-scrollbar md:border-r md:border-white/10">
                <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-black/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-white/10 shadow-sm shrink-0">
                    {card.type === 'quiz' ? <><Sparkles size={12} className="text-yellow-300"/> Quiz • {cardPoints} Pts</> : <><Users size={12} className="text-yellow-300"/> Défi • Jury</>}
                </div>
                {/* Ajustement du titre pour mobile */}
                <h2 className="text-2xl md:text-4xl font-black uppercase mb-8 leading-[0.9] drop-shadow-lg tracking-tighter w-full">{card.title}</h2>
                <div className="bg-black/10 p-6 md:p-8 rounded-3xl border border-white/5 backdrop-blur-sm w-full max-w-2xl">
                    {/* Ajustement du scénario pour mobile */}
                    <p className="text-lg md:text-2xl font-medium leading-snug drop-shadow-sm font-serif italic text-white/90">"{card.scenario}"</p>
                </div>
            </div>

            {/* Zone d'Action (Timer/Boutons) - Prends 35% sur desktop, 100% en bas sur mobile */}
            <div className="md:w-[420px] bg-black/10 flex flex-col shrink-0 border-t md:border-t-0 md:border-l border-white/5 relative h-auto"> {/* h-auto important pour mobile */}
                 <div className="flex-grow p-6 flex flex-col justify-center overflow-y-auto custom-scrollbar">
                    {card.type === 'quiz' ? (
                        <div className="space-y-3 w-full">
                            <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2 block text-center">Choisissez la bonne réponse</span>
                            {card.options.map((option, idx) => {
                                // Définition du style du bouton
                                const isSelected = selectedOption === idx;
                                const isCorrect = idx === card.correctIndex;
                                const baseStyle = 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30 active:scale-[0.98]';
                                let statusClass = baseStyle;
                                let statusCircleStyle = { border: '2px solid rgba(255,255,255,0.3)', color: 'white' };
                                let buttonStyle = {};

                                if (isAnswerRevealed) {
                                    if (isCorrect) {
                                        statusClass = 'bg-green-600 border-green-400 text-white shadow-[0_0_15px_rgba(0,255,0,0.5)]';
                                        statusCircleStyle = { border: '2px solid white', backgroundColor: 'white', color: '#047857' };
                                    } else if (isSelected) {
                                        statusClass = 'bg-red-600 border-red-400 text-white opacity-60';
                                        statusCircleStyle = { border: '2px solid white', backgroundColor: 'white', color: '#b91c1c' };
                                    } else {
                                        statusClass = 'bg-white/5 border-white/10 opacity-40';
                                    }
                                } else if (isSelected) {
                                     // Style lorsqu'une option est sélectionnée mais pas encore révélée
                                     buttonStyle = { border: `2px solid ${hexColor}` };
                                     statusCircleStyle = { border: `2px solid ${hexColor}`, backgroundColor: `${hexColor}30`, color: hexColor };
                                }
                                
                                return (
                                <button 
                                    key={idx} 
                                    onClick={() => handleQuizOptionClick(idx)} 
                                    disabled={isAnswerRevealed} 
                                    className={`w-full p-4 rounded-xl text-left text-base font-bold transition-all border-2 flex items-center gap-4 group relative overflow-hidden ${statusClass}`}
                                    style={buttonStyle}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-black transition-colors`} style={statusCircleStyle}>
                                        {idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}
                                    </div>
                                    <span className="leading-tight z-10 relative">{option}</span>
                                </button>
                            );
                            })}
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
                            <button onClick={() => handleResult(false)} className="flex-1 group text-white border border-red-500/30 font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(90deg, #dc262620, #b91c1c50)', borderColor: '#b91c1c' }}><XCircle size={20} className="group-hover:scale-110 transition"/> Raté</button>
                            <button onClick={() => handleResult(true)} className="flex-1 group text-white font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg" style={{ background: 'linear-gradient(90deg, #10b981, #059669)', borderColor: '#059669' }}><Check size={20} className="group-hover:scale-110 transition"/> Réussi</button>
                        </div>
                    )}
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};


// --- Écran de Profil des Compétences (NOUVEAU) ---
const ProfileScreen = ({ player, onBack }) => {
    if (!player) return <div className="text-white">Chargement du profil...</div>;

    // Suppression de getCategoryById car elle n'était pas utilisée et sa logique était redondante avec celle de ScoreBoard.

    const allCategories = Object.values(CATEGORIES).filter(c => c.id !== 'logistics' && c.id !== 'math_wild');
    
    // Calculer les scores et les max par catégorie
    const skillData = allCategories.map(cat => {
        const stats = player.scoreByCategory[cat.id] || { success: 0, total: 0 };
        const percentage = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;
        return {
            ...cat,
            percentage,
            success: stats.success,
            total: stats.total
        };
    });

    const totalScore = skillData.reduce((sum, item) => sum + item.success, 0) + (player.scoreByCategory['math_wild']?.success * WILD_POINTS || 0) + (player.scoreByCategory['logistics']?.success * DEFAULT_POINTS || 0);
    const totalPlayed = skillData.reduce((sum, item) => sum + item.total, 0) + (player.scoreByCategory['math_wild']?.total || 0) + (player.scoreByCategory['logistics']?.total || 0);

    // Fonction pour générer le graphique radar (simplifié)
    const RadarChart = ({ data }) => {
        // AUGMENTATION DE LA TAILLE POUR INCLURE LES LABELS
        const radius = 130;
        const center = 150; 
        const viewBoxSize = center * 2;
        const numSkills = data.length;
        const angleSlice = (Math.PI * 2) / numSkills;

        const pathPoints = data.map((skill, i) => {
            // Mapping du pourcentage (0-100) à la distance du centre (0-radius)
            const r = (skill.percentage / 100) * radius;
            const x = center + r * Math.cos(angleSlice * i - Math.PI / 2);
            const y = center + r * Math.sin(angleSlice * i - Math.PI / 2);
            return `${x},${y}`;
        }).join(" ");

        return (
            // CORRECTION: Le SVG doit être centré et avoir une taille définie pour ne pas être tronqué
            <svg width="100%" height="auto" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="max-w-[300px] max-h-[300px] shadow-xl">
                {/* Axes et cercles de référence */}
                {[25, 50, 75, 100].map(level => (
                    <circle 
                        key={level} 
                        cx={center} 
                        cy={center} 
                        r={(level / 100) * radius} 
                        stroke="#ffffff20" 
                        fill="transparent"
                        strokeDasharray={level === 100 ? 0 : 4}
                        strokeWidth={1}
                    />
                ))}
                
                {/* Lignes radiales */}
                {data.map((_, i) => (
                    <line 
                        key={`line-${i}`}
                        x1={center} 
                        y1={center} 
                        x2={center + radius * Math.cos(angleSlice * i - Math.PI / 2)} 
                        y2={center + radius * Math.sin(angleSlice * i - Math.PI / 2)} 
                        stroke="#ffffff30" 
                        strokeWidth={1}
                    />
                ))}
                
                {/* Surface des données (le profil) */}
                <polygon points={pathPoints} fill="#FFC20E50" stroke="#FFC20E" strokeWidth="2" />
                
                {/* Points des données */}
                {data.map((skill, i) => {
                    const r = (skill.percentage / 100) * radius;
                    const x = center + r * Math.cos(angleSlice * i - Math.PI / 2);
                    const y = center + r * Math.sin(angleSlice * i - Math.PI / 2);
                    return (
                        <circle 
                            key={`point-${i}`}
                            cx={x} 
                            cy={y} 
                            r={4} 
                            fill={skill.colorData.hex} 
                            stroke="#fff"
                            strokeWidth={1.5}
                        />
                    );
                })}

                {/* Étiquettes des compétences */}
                {data.map((skill, i) => {
                    // Position du label légèrement à l'extérieur du cercle
                    const labelRadius = radius * 1.05; 
                    const x = center + labelRadius * Math.cos(angleSlice * i - Math.PI / 2);
                    const y = center + labelRadius * Math.sin(angleSlice * i - Math.PI / 2);
                    
                    // Ajuster l'ancre du texte pour qu'il soit bien aligné
                    let textAnchor;
                    if (Math.abs(x - center) < 5) { // Si au sommet ou à la base
                        textAnchor = 'middle';
                    } else if (x < center) { // Si à gauche
                        textAnchor = 'end';
                    } else { // Si à droite
                        textAnchor = 'start';
                    }
                    
                    // Ajuster la position verticale pour les labels du haut et du bas
                    const dy = y < center ? -10 : (y > center ? 20 : 5); 

                    return (
                        <text 
                            key={`label-${i}`}
                            x={x} 
                            y={y + dy} 
                            textAnchor={textAnchor} 
                            fill={skill.colorData.hex} 
                            className="font-bold text-xs uppercase tracking-wider"
                            style={{ fontSize: '10px' }} // S'assurer que le texte est petit
                        >
                            {skill.label.replace('<br/>', '/')}
                        </text>
                    );
                })}
            </svg>
        );
    };


    return (
        <div className="w-full max-w-4xl h-[90vh] bg-black/60 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-500">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40 z-20">
                 <div className="flex items-center gap-3 text-white"><TrendingUp className="text-[#00d468]" size={28} /><h2 className="text-2xl font-black uppercase tracking-widest">PROFIL DE COMPÉTENCES</h2></div>
                 <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition text-white"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 text-white relative z-10">
                <div className="mb-8 text-center">
                    <h3 className="text-3xl font-black text-white">{player.name}</h3>
                    {/* CORRECTION DE L'AFFICHAGE POUR CLARIFIER LE MODE SOLO */}
                    <p className="text-sm text-white/60 uppercase tracking-widest">Profil Solo Champion (Cumul)</p>
                </div>

                <div className="flex flex-col md:flex-row gap-10">
                    
                    {/* Colonne du Graphique Radar */}
                    {/* Centrage du graphique sur mobile */}
                    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl shadow-inner border border-white/10 shrink-0">
                        <h3 className="text-xl font-bold uppercase tracking-wider mb-2 text-[#FFC20E]">Performance Globale</h3>
                        {/* MISE À JOUR : Afficher le score global dynamique */}
                        <p className="lg text-white/70 mb-6">Total joué: {totalPlayed} cartes | Score: {totalScore} pts</p>
                        
                        {totalPlayed > 0 ? (
                           // Centrage du graphique
                           <div className="w-full flex justify-center">
                                <RadarChart data={skillData} />
                           </div>
                        ) : (
                            <div className="text-center py-10 text-white/50 italic">Jouez quelques parties pour afficher votre profil !</div>
                        )}
                        
                    </div>

                    {/* Colonne des Détails */}
                    <div className="md:w-1/2 space-y-4">
                        <h3 className="text-xl font-bold uppercase tracking-wider border-b border-white/20 pb-2 mb-4">Détails par Compétence</h3>
                        {/* Inclure toutes les catégories dans les détails, y compris Math Wild et Logistique */}
                        {[...skillData, 
                            { 
                                ...CATEGORIES.LOGISTICS, 
                                success: player.scoreByCategory.logistics?.success || 0,
                                total: player.scoreByCategory.logistics?.total || 0,
                                percentage: player.scoreByCategory.logistics?.total > 0 ? Math.round((player.scoreByCategory.logistics.success / player.scoreByCategory.logistics.total) * 100) : 0,
                                isSpecial: true
                            },
                            { 
                                ...CATEGORIES.MATH_WILD, 
                                success: player.scoreByCategory.math_wild?.success || 0,
                                total: player.scoreByCategory.math_wild?.total || 0,
                                percentage: player.scoreByCategory.math_wild?.total > 0 ? Math.round((player.scoreByCategory.math_wild.success / player.scoreByCategory.math_wild.total) * 100) : 0,
                                isSpecial: true
                            },
                        ].map(skill => (
                            <div key={skill.id} className="bg-black/20 p-4 rounded-xl border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`font-black flex items-center gap-2 text-sm uppercase ${skill.isSpecial ? 'text-[#FFC20E]' : ''}`} style={{ color: skill.colorData.hex }}>
                                        <skill.icon size={16} /> {skill.label.replace('<br/>', '/')}
                                    </span>
                                    <span className="font-mono text-lg font-bold text-white">{skill.percentage}%</span>
                                </div>
                                <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full transition-all duration-1000" 
                                        style={{ 
                                            width: `${skill.percentage}%`, 
                                            backgroundColor: skill.colorData.hex 
                                        }} 
                                    />
                                </div>
                                <p className="text-xs text-white/50 mt-2">Réussi: {skill.success} / Total joué: {skill.total} {skill.id === 'math_wild' && `(Rapporte ${WILD_POINTS} Pts)`}</p>
                            </div>
                        ))}
                        <div className="pt-4 mt-6 border-t border-white/10">
                           <p className="text-sm italic text-white/70">Le score Logistique/Opérations et les cartes Mathématiques sont affichés ci-dessus but exclus du graphique radar pour conserver la symétrie des 5 soft skills.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- ECRAN HISTOIRE (Inchangé) ---
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
                            <img src="https://media.licdn.com/dms/image/v2/D4E03AQGPhAtWKK7wpA/profile-displayphoto-scale_200_200/B4EZky1.SpHgAY-/0/1757494638506?e=2147483647&v=beta&t=1kTBlrqh-i_Zj3pGqZk4P1PE1djT7Ze5LU8e9J5_p8E" alt="Gabriel Emrick Tognimanbou DAHISSIHO" className="relative w-full h-full object-cover rounded-full border-4 border-white/20 shadow-2xl"/>
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
                    <div className="bg-gradient-to-r from-[#B02E68]/20 to-transparent p-6 rounded-r-2xl border-l-4 border-[#B02E68]"><p className="mb-2 font-bold uppercase text-sm tracking-widest text-[#B02E68]">La Solution</p><p className="xl">C’est là que j’ai voulu agir. Pas avec une formation classique, mais avec une expérience vivante, ludique et impactante : <span className="font-black text-white block text-3xl mt-2 tracking-tighter">🎯 SKILLSMASTER</span></p></div>
                    <p>Un jeu conçu pour développer les compétences essentielles à la réussite scolaire et professionnelle en Afrique et partout ailleurs. Chaque carte te place face à une situation concrète de communication, de leadership, de créativité ou d’intelligence émotionnelle.</p>
                    <p className="font-bold text-white text-xl">Tu as quelques secondes pour réagir, argumenter, convaincre, coopérer.<br/><span className="text-[#FFC20E]">Et c’est là que tu découvres qui tu es vraiment dans l’action.</span></p>
                    <div className="mt-16 p-8 bg-white text-[#B02E68] rounded-3xl shadow-[0_10px_40px_-10px_rgba(176,46,104,0.5)] text-center relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-pink-500"></div><Quote className="mx-auto text-[#B02E68]/20 mb-4 transform scale-150" size={48} /><p className="text-2xl font-black italic relative z-10">"Et moi, j’ai décidé d’en faire un jeu. Un jeu sérieux, oui. Mais surtout, un jeu qui forme à être humain. 💡"</p></div>
                </div>
            </div>
        </div>
    </div>
);

// --- Ecrans Menu, History, Setup ---
const MainMenu = ({ onNavigate, startLogisticsChallenge, onResumeGame, gameSaved }) => ( // AJOUT: onResumeGame, gameSaved
  <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
     <div className="text-center mb-8 relative">
        <div className="absolute -inset-10 bg-gradient-to-r from-[#FFC20E] to-[#B02E68] blur-3xl opacity-20 animate-pulse"></div>
        <h1 className="relative text-6xl md:text-8xl font-black italic tracking-tighter mb-2 text-white drop-shadow-2xl">SKILLS<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC20E] to-white">MASTER</span></h1>
        <p className="text-white/80 uppercase tracking-[0.5em] text-xs md:text-sm font-bold">Le jeu des compétences ultimes</p>
     </div>
     <div className="w-full max-w-xs space-y-4 relative z-10">
       
       {/* NOUVEAU: BOUTON REPRENDRE */}
       {gameSaved && (
           <button onClick={onResumeGame} className="w-full group bg-[#FFC20E] text-[#B02E68] p-5 rounded-3xl font-black text-xl shadow-[0_20px_40px_-15px_rgba(255,194,14,0.3)] hover:scale-105 hover:shadow-[0_30px_60px_-15px_rgba(255,194,14,0.5)] transition-all flex items-center justify-between px-8 border-4 border-transparent hover:border-white">
             <span>REPRENDRE</span> <Play className="group-hover:translate-x-1 transition fill-current" />
           </button>
       )}
       
       <button onClick={() => { playSound('flip'); onNavigate('setup'); }} className="w-full group bg-white text-[#B02E68] p-5 rounded-3xl font-black text-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:scale-105 hover:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.3)] transition-all flex items-center justify-between px-8 border-4 border-transparent hover:border-[#FFC20E]"><span>NOUVELLE PARTIE</span> <Play className="group-hover:translate-x-1 transition fill-current" /></button>
       
       {/* MODIFICATION: startLogisticsChallenge -> onNavigate('logisticsSetup') */}
       <button onClick={() => onNavigate('logisticsSetup')} className="w-full group text-white p-5 rounded-3xl font-black text-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:scale-105 transition-all flex items-center justify-between px-8 border-4 border-white/20"
        style={{ background: COLORS.cards.logistics.accentGradient, boxShadow: `0 0 30px ${COLORS.cards.logistics.hex}50` }}>
          <span>DÉFI LOGISTIQUE</span> <Zap className="group-hover:translate-x-1 transition fill-current text-white" />
       </button>
       
       <button onClick={() => { playSound('flip'); onNavigate('profile'); }} className="w-full bg-[#FFC20E]/40 hover:bg-[#FFC20E]/60 border border-white/20 text-white p-5 rounded-3xl font-bold text-lg shadow-lg backdrop-blur-md transition-all flex items-center justify-between px-8 hover:border-white/50"><span>MON PROFIL</span> <TrendingUp size={20} /></button>
       <button onClick={() => { playSound('flip'); onNavigate('story'); }} className="w-full bg-[#B02E68]/40 hover:bg-[#B02E68]/60 border border-white/20 text-white p-5 rounded-3xl font-bold text-lg shadow-lg backdrop-blur-md transition-all flex items-center justify-between px-8 hover:border-white/50"><span>L'HISTOIRE</span> <BookOpen size={20} /></button>
       <button onClick={() => { playSound('flip'); onNavigate('history'); }} className="w-full bg://black/20 hover:bg-black/40 border border-white/10 text-white p-5 rounded-3xl font-bold text-lg shadow-lg backdrop-blur-md transition-all flex items-center justify-between px-8 hover:border-white/30"><span>HISTORIQUE</span> <History size={20} /></button>
     </div>
  </div>
);

// Composants History et Setup (inchangés) ... [omitted for brevity, they are unchanged]

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

// NOUVEAU COMPOSANT : Écran de configuration pour le défi Logistique
const LogisticsSetupScreen = ({ onStart, onBack, logisticsMaxRounds, categoryId, categoryLabel }) => {
  const [mode, setMode] = useState(null);
  const createPlayer = (id, name) => ({
      id, 
      name, 
      score: 0, 
      scoreByCategory: { 
          communication: { success: 0, total: 0 },
          leadership: { success: 0, total: 0 },
          critical_thinking: { success: 0, total: 0 },
          emotional_intelligence: { success: 0, total: 0 },
          creativity: { success: 0, total: 0 },
          logistics: { success: 0, total: 0 },
          math_wild: { success: 0, total: 0 }, // AJOUT
      }
  });

  const [players, setPlayers] = useState([createPlayer(1, 'Joueur 1'), createPlayer(2, 'Joueur 2')].map(p => p.name));
  const [soloName, setSoloName] = useState('Défieur'); // Nom par défaut pour le mode solo logistique

  const addPlayer = () => setPlayers([...players, `Joueur ${players.length + 1}`]);
  const removePlayer = (index) => players.length > 1 && setPlayers(players.filter((_, i) => i !== index));
  const updatePlayerName = (index, name) => { const newP = [...players]; newP[index] = name; setPlayers(newP); };
  
  const handleStart = () => {
    playSound('win'); 
    const playerList = mode === 'solo' 
        ? [createPlayer(1, soloName)]
        : players.map((name, i) => createPlayer(i + 1, name));
        
    // Lance le jeu avec le mode, le nombre de cartes logistiques et le filtre 'logistics'
    onStart(playerList, mode, logisticsMaxRounds, categoryId); 
  };

  return (
    <div className="w-full max-w-lg bg-black/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl animate-in slide-in-from-right-8 duration-300 relative overflow-hidden">
        <button onClick={!mode ? onBack : () => setMode(null)} className="absolute top-6 left-6 text-white/50 hover:text-white transition flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><RotateCcw size={14} /> Retour</button>
        <h2 className="text-4xl font-black text-center text-white mb-2 mt-6 tracking-tighter" dangerouslySetInnerHTML={{ __html: `DÉFI ${categoryLabel.toUpperCase().replace('<BR/>', '/')}` }} />
        <p className="text-white/60 text-sm text-center mb-8">Choisissez le mode de jeu</p>
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
             <button onClick={handleStart} className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#FFC20E] to-[#ff9900] text-black font-black text-xl hover:scale-105 transition shadow-[0_0_30px_-5px_rgba(255,194,14,0.4)] flex items-center justify-center gap-3">C'EST PARTI ({logisticsMaxRounds} tours) <ArrowRight size={24} strokeWidth={3} /></button>
          </div>
        )}
    </div>
  );
};

const SetupScreen = ({ onStart, onBack }) => {
  const [mode, setMode] = useState(null);
  // CHANGEMENT: Initialisation des stats par défaut
  const createPlayer = (id, name) => ({
      id, 
      name, 
      score: 0, 
      scoreByCategory: { 
          communication: { success: 0, total: 0 },
          leadership: { success: 0, total: 0 },
          critical_thinking: { success: 0, total: 0 },
          emotional_intelligence: { success: 0, total: 0 },
          creativity: { success: 0, total: 0 },
          logistics: { success: 0, total: 0 },
          math_wild: { success: 0, total: 0 }, // AJOUT
      }
  });

  const [players, setPlayers] = useState([createPlayer(1, 'Joueur 1'), createPlayer(2, 'Joueur 2')].map(p => p.name));
  const [soloName, setSoloName] = useState('Joueur 1');

  const addPlayer = () => setPlayers([...players, `Joueur ${players.length + 1}`]);
  const removePlayer = (index) => players.length > 2 && setPlayers(players.filter((_, i) => i !== index)); // Min 2 joueurs en mode multi normal
  const updatePlayerName = (index, name) => { const newP = [...players]; newP[index] = name; setPlayers(newP); };
  
  const handleStart = () => {
    playSound('win'); 
    const playerList = mode === 'solo' 
        ? [createPlayer(1, soloName)]
        : players.map((name, i) => createPlayer(i + 1, name));
        
    onStart(playerList, mode, 15, 'all');
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
    
    // Ajout d'une fonction de recherche de catégorie sécurisée
    const getCategoryById = (categoryId) => {
        // Normaliser l'ID avant de le comparer aux clés de CATEGORIES (sans accent)
        const key = categoryId?.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        // On cherche par la clé majuscule, nettoyée des accents, qui est maintenant 'CREATIVITE'
        return CATEGORIES[key];
    };

    return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl bg-[#B02E68] rounded-[3rem] p-10 border-4 border-white/20 text-white text-center shadow-2xl animate-in zoom-in duration-500 my-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            <Trophy className="mx-auto text-yellow-300 mb-6 drop-shadow-lg animate-bounce" size={80} strokeWidth={1.5} />
            <h2 className="text-5xl font-black italic mb-8 tracking-tighter">RÉSULTATS FINAUX</h2>
            <div className="space-y-3 mb-10 relative z-10">
                {[...players].sort((a,b) => b.score - a.score).map((p, i) => (
                    <div key={p.id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${i===0 ? 'bg-white text-[#B02E68] border-transparent scale-105 shadow-xl' : 'bg-black/20 border-white/10 text-white'}`}>
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
                        {missedCards.map((card, idx) => {
                            const category = getCategoryById(card.categoryId);
                            
                            // SECURITÉ : Si la catégorie n'est pas trouvée (cas improbable mais source de l'erreur)
                            if (!category) {
                                console.error(`Catégorie non trouvée pour l'ID: ${card.categoryId}`);
                                return null; // Retourne null pour ignorer cet élément non valide
                            }

                            return (
                                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="flex flex-col mb-2">
                                        {/* ACCÈS SÉCURISÉ AUX PROPRIÉTÉS */}
                                        <span className="text-[10px] font-black text-[#B02E68] uppercase tracking-widest mb-1" dangerouslySetInnerHTML={{ __html: category.label.toUpperCase() }} />
                                        <span className="text-sm font-bold text-gray-900">{card.title}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 italic leading-relaxed">"{card.explanation}"</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            <button onClick={onEndGame} className="w-full bg-white text-[#B02E68] font-black py-5 rounded-2xl hover:bg-gray-100 transition shadow-xl relative z-10 uppercase tracking-widest">Retour au menu</button>
        </div>
    </div>
    );
};

// --- Application Principale ---

const LOCAL_STORAGE_KEY = 'skillsMasterGame';

// Fonction utilitaire pour trouver la catégorie, gère les accents et les majuscules
const findCategoryByCardId = (cardId) => {
    // 1. Trouver l'ID de la catégorie dans la liste des cartes (ex: 'creativity')
    const card = INITIAL_CARDS.find(c => c.id === cardId);
    if (!card) return null;
    const categoryId = card.categoryId;

    // 2. Transformer l'ID de la catégorie pour correspondre aux clés de l'objet CATEGORIES
    // Ex: 'creativity' -> 'CREATIVITE'
    
    // Trouver la clé correspondante dans CATEGORIES (la boucle est plus sûre)
    const categoryKey = Object.keys(CATEGORIES).find(key => CATEGORIES[key].id === categoryId);

    if (categoryKey) {
        return CATEGORIES[categoryKey];
    }
    
    // Dernier recours (simple recherche par majuscule normalisée)
    const categoryIdUpper = categoryId.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return CATEGORIES[categoryIdUpper];
};


export default function App() {
  const initialPlayerState = { 
      id: 1, 
      name: 'Champion Solo', 
      score: 0, 
      scoreByCategory: { 
          communication: { success: 0, total: 0 },
          leadership: { success: 0, total: 0 },
          critical_thinking: { success: 0, total: 0 },
          emotional_intelligence: { success: 0, total: 0 },
          creativity: { success: 0, total: 0 },
          logistics: { success: 0, total: 0 },
          math_wild: { success: 0, total: 0 }, // AJOUT
      }
  };
  
  // NOUVEL ÉTAT POUR DÉTECTER LA SAUVEGARDE
  const [gameSaved, setGameSaved] = useState(false);
  // NOUVEL ÉTAT POUR DÉTECTER SI LE PREMIER TOUR (AVEC CHOIX DE CATÉGORIE) EST PASSÉ
  const [isGameStarted, setIsGameStarted] = useState(false);
  // ÉTAT DE TRANSITION SUPPRIMÉ pour un passage instantané
  // const [isTransitioningState, setIsTransitioningState] = useState(false); // Supprimé
  
  // FONCTION DE CHARGEMENT DE L'ÉTAT INITIAL
  const loadInitialState = () => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const state = JSON.parse(savedState);
        return {
          players: state.players || [initialPlayerState],
          gameMode: state.gameMode || 'solo',
          currentPlayerIndex: state.currentPlayerIndex || 0,
          maxRounds: state.maxRounds || 15,
          deckFilter: state.deckFilter || 'all',
          roundsPlayed: state.roundsPlayed || 0,
          playedCardIds: state.playedCardIds || [],
          missedCards: state.missedCards || [],
          view: 'menu', // Commence toujours par le menu après chargement
          isSaved: true, // Flag pour détecter la présence d'une sauvegarde
          isGameStarted: state.isGameStarted || false, // Charger l'état de démarrage
        };
      }
    } catch (e) {
      console.error("Erreur lors du chargement de l'état du jeu:", e);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    return {
      players: [initialPlayerState],
      gameMode: 'solo',
      currentPlayerIndex: 0,
      maxRounds: 15,
      deckFilter: 'all',
      roundsPlayed: 0,
      playedCardIds: [],
      missedCards: [],
      view: 'menu',
      isSaved: false, // Pas de sauvegarde trouvée
      isGameStarted: false,
    };
  };

  const initialState = loadInitialState();
  const [view, setView] = useState(initialState.view);
  const [players, setPlayers] = useState(initialState.players);
  const [gameMode, setGameMode] = useState(initialState.gameMode);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(initialState.currentPlayerIndex);
  const [activeCard, setActiveCard] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showScoreboard, setShowScoreboard] = useState(false);
  
  const [maxRounds, setMaxRounds] = useState(initialState.maxRounds);
  const [deckFilter, setDeckFilter] = useState(initialState.deckFilter);

  const [roundsPlayed, setRoundsPlayed] = useState(initialState.roundsPlayed);
  const [playedCardIds, setPlayedCardIds] = useState(initialState.playedCardIds);
  const [missedCards, setMissedCards] = useState(initialState.missedCards);
  const [isGameStartedState, setIsGameStartedState] = useState(initialState.isGameStarted); // Utilisation d'un état séparé pour éviter la confusion
  
  // NOUVEAU useEffect pour mettre à jour gameSaved APRÈS le rendu initial
  useEffect(() => {
    setGameSaved(initialState.isSaved);
    // Si la partie était déjà commencée (reprise), on met à jour l'état de démarrage
    if (initialState.isSaved) {
        setIsGameStartedState(initialState.isGameStarted);
    }
  }, []); // [] garantit que cela ne s'exécute qu'une fois au montage

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); }
  }, []);

  // --- LOGIQUE DE SAUVEGARDE ---
  const saveGameState = useCallback(() => {
    if (view === 'playing' && !showScoreboard) {
      const stateToSave = {
        players,
        gameMode,
        currentPlayerIndex,
        maxRounds,
        deckFilter,
        roundsPlayed,
        playedCardIds,
        missedCards,
        isGameStarted: isGameStartedState, // Sauvegarde l'état de démarrage
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      setGameSaved(true);
    } else if (view !== 'playing') {
       // Supprime la partie si on n'est plus en mode jeu actif
       localStorage.removeItem(LOCAL_STORAGE_KEY);
       setGameSaved(false);
    }
  }, [players, gameMode, currentPlayerIndex, maxRounds, deckFilter, roundsPlayed, playedCardIds, missedCards, view, showScoreboard, isGameStartedState]);

  // Surveillance des états pour la sauvegarde
  useEffect(() => {
    saveGameState();
  }, [players, roundsPlayed, view, showScoreboard, currentPlayerIndex, maxRounds, deckFilter, playedCardIds, missedCards, isGameStartedState, saveGameState]);
  // --- FIN LOGIQUE DE SAUVEGARDE ---


  // MISE À JOUR : Ajout des paramètres rounds et deckFilter
  const startGame = (playerList, mode, rounds, filter) => {
    console.log(`[GameStart] Démarrage du jeu. Mode: ${mode}, Tours: ${rounds}, Filtre: ${filter}`);
    setPlayers(playerList); setGameMode(mode); setView('playing');
    setCurrentPlayerIndex(0); setShowScoreboard(false); setRoundsPlayed(0);
    setPlayedCardIds([]); setMissedCards([]);
    setMaxRounds(rounds);
    setDeckFilter(filter);
    setIsGameStartedState(false); // Réinitialiser le drapeau de démarrage
    
    // NOUVEAU : Si en mode Logistique, on force l'état "démarré" pour permettre le premier tirage automatique (si on le souhaite)
    if (filter === 'logistics') {
        setIsGameStartedState(true); 
    }
  };
  
  const resumeGame = () => {
    setView('playing');
  };
  
  // MODIFICATION: startLogisticsChallenge est maintenant une fonction de navigation
  const navigateToLogisticsSetup = () => {
      playSound('flip');
      setView('logisticsSetup');
  };

  const endGame = () => {
    const newHistoryEntry = { date: new Date().toISOString(), mode: gameMode, results: [...players].sort((a,b) => b.score - a.score) };
    setGameHistory([newHistoryEntry, ...gameHistory]);
    
    // Si mode solo, on met à jour le profil permanent après la partie
    if (gameMode === 'solo' && players.length > 0) {
        // Le profil permanent est le joueur 0 du tableau (s'il existe)
        const finishedPlayer = players[0];
        // On met à jour l'état `players` pour refléter le profil mis à jour
        setPlayers([finishedPlayer]);
    }
    
    setShowScoreboard(false); setActiveCard(null); setActiveCategory(null); setView('menu');
    setDeckFilter('all'); // Réinitialiser le filtre
    setIsGameStartedState(false); // Réinitialiser le drapeau de démarrage
    localStorage.removeItem(LOCAL_STORAGE_KEY); // S'assurer de supprimer l'état après la fin
    setGameSaved(false);
  };
  
  // NOUVELLE FONCTION : Encapsule la logique de sélection de carte
  const getNewCard = (categoryId = 'all') => {
      const filterId = categoryId === 'all' ? deckFilter : categoryId;
      
      // 1. Déterminer le pool de cartes
      let cardPool = INITIAL_CARDS;
      if (filterId !== 'all') {
          // Si on filtre par catégorie (ex: Logistique ou 1er choix)
          cardPool = INITIAL_CARDS.filter(c => c.categoryId === filterId);
          console.log(`[getNewCard] Pool filtré par ${filterId}. Cartes disponibles dans le pool: ${cardPool.length}`);
      } else {
          // Mode 'all' (tirage aléatoire après le 1er tour)
          // Tenter la Wild Card à 10%
          if (Math.random() < 0.1) {
              const wildCards = INITIAL_CARDS.filter(c => c.categoryId === 'math_wild' && !playedCardIds.includes(c.id));
              if (wildCards.length > 0) {
                  const randomWildCard = wildCards[Math.floor(Math.random() * wildCards.length)];
                  console.log(`[getNewCard] Wild Card tirée: ${randomWildCard.id}`);
                  return { card: randomWildCard, category: findCategoryByCardId(randomWildCard.id) };
              }
          }
          // Sinon, on prend toutes les cartes SAUF les Wild Cards pour le tirage aléatoire des 5 catégories
          cardPool = INITIAL_CARDS.filter(c => c.categoryId !== 'math_wild');
      }

      // 2. Filtrer les cartes déjà jouées
      const availableCards = cardPool.filter(c => !playedCardIds.includes(c.id));
      
      if (availableCards.length === 0) {
          console.log("[getNewCard] AUCUNE carte disponible dans le pool filtré/global.");
          return null; 
      }

      // 3. Tirer une carte au hasard
      const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
      
      // 4. Trouver la catégorie correspondante
      const category = findCategoryByCardId(randomCard.id);
      
      if (!category) {
          console.error(`[getNewCard] ERREUR: Catégorie non trouvée pour la carte ID: ${randomCard.id}`);
          return null;
      }
      
      console.log(`[getNewCard] Carte sélectionnée: ${randomCard.id} (Cat: ${category.label})`);
      return { card: randomCard, category };
  };

  // NOUVELLE FONCTION : Gère la mise à jour de l'état de la carte active de manière sécurisée
  const handleDrawNext = useCallback((categoryId = null) => {
      let result;
      
      if (categoryId) {
          // Mode Normal (1er tour) avec choix de catégorie
          result = getNewCard(categoryId);
      } else if (deckFilter === 'logistics' || isGameStartedState) {
          // Mode Logistique (tirage explicite/auto) ou Mode Normal (auto-tirage)
          result = getNewCard();
      } else {
          console.log("[handleDrawNext] État du jeu non prêt pour un tirage aléatoire (attente sélection catégorie).");
          return;
      }
      
      if (result) {
          setActiveCategory(result.category);
          setActiveCard(result.card);
          setPlayedCardIds(prev => [...prev, result.card.id]);
          setIsGameStartedState(true); // Assure que le jeu est considéré comme démarré après la première carte
      } else {
          // Si le tirage renvoie null (deck vide)
          if (roundsPlayed < maxRounds) {
            console.log("[handleDrawNext] Le deck filtré est vide, fin anticipée.");
            setShowScoreboard(true);
          }
      }
  }, [deckFilter, isGameStartedState, playedCardIds, roundsPlayed, maxRounds]);
  
  // Remplacement de drawRandomNextCard et drawCard par des appels à handleDrawNext
  const drawRandomNextCard = () => handleDrawNext();
  const drawCard = (categoryId) => handleDrawNext(categoryId);


  const handleCardResult = (success, cardData) => {
    const currentPlayers = [...players];
    const player = currentPlayers[currentPlayerIndex];
    const categoryId = cardData.categoryId;
    
    // Points attribués
    const points = cardData.points || DEFAULT_POINTS;

    // Mise à jour des stats du joueur
    if (!player.scoreByCategory[categoryId]) {
        // Initialisation si la catégorie n'existe pas encore (sécurité)
        player.scoreByCategory[categoryId] = { success: 0, total: 0 };
    }
    
    player.scoreByCategory[categoryId].total += 1;

    if (success) { 
        player.score += points; // Utiliser les points spécifiques de la carte
        player.scoreByCategory[categoryId].success += 1;
        setPlayers(currentPlayers); 
    }
    
    // Mise à jour des cartes manquées
    if (!success && cardData) { 
        setMissedCards(prev => [...prev, cardData]); 
    }
    
    const nextRound = roundsPlayed + 1;
    setRoundsPlayed(nextRound);
    
    // 1. RETRAIT IMMÉDIAT DE LA CARTE ACTIVE
    setActiveCard(null); 
    setActiveCategory(null);
    console.log(`[HandleResult] Tour terminé: ${nextRound}/${maxRounds}. Prochain joueur: ${currentPlayers[(currentPlayerIndex + 1) % currentPlayers.length]?.name}`); // Debug Log

    // Logique de fin de partie
    if (nextRound >= maxRounds) { 
        setTimeout(() => {
            setShowScoreboard(true); 
        }, 50);
    } else { 
        // 2. PASSAGE AU JOUEUR SUIVANT
        setCurrentPlayerIndex((currentPlayerIndex + 1) % currentPlayers.length); 
        
        // 3. NOUVEAU : Le tirage est désormais automatique pour tous les modes après le premier tour/clic initial.
        handleDrawNext();
        
        // Ancienne logique :
        // if (deckFilter !== 'logistics') { handleDrawNext(); } // Auto-tirage si mode 'all' après le 1er tour
    }
  };

  // VÉRIFIE si une catégorie n'a plus de cartes non-wild disponibles
  const isCategoryEmpty = (categoryId) => {
      // SI on n'a joué aucune carte, la catégorie ne doit jamais être considérée comme vide (sécurité au démarrage)
      if (playedCardIds.length === 0) {
          return false;
      }

      // Filtrer toutes les cartes non-wild de cette catégorie qui n'ont pas encore été jouées
      const remaining = INITIAL_CARDS.filter(c => c.categoryId === categoryId && c.categoryId !== 'math_wild' && !playedCardIds.includes(c.id));
      return remaining.length === 0;
  };

  // MODIFICATION ICI: Suppression du filtre pour éviter un bug de correspondance avec l'ID 'creativity'
  // On utilise Object.values(CATEGORIES) et on exclut uniquement les decks spéciaux.
  const categoriesToRender = Object.values(CATEGORIES).filter(cat => cat.id !== 'logistics' && cat.id !== 'math_wild'); 
  
  // Style d'arrière-plan dynamique
  const currentBackgroundStyle = deckFilter === 'logistics' 
    ? COLORS.logisticsBackgroundStyle 
    : COLORS.defaultBackgroundStyle;
    
  // DONNÉES SPÉCIFIQUES LOGISTIQUE
  const LOGISTICS_MAX_CARDS = INITIAL_CARDS.filter(c => c.categoryId === 'logistics').length;
  const LOGISTICS_CATEGORY = CATEGORIES.LOGISTICS;


  return (
    <div 
        className={`min-h-screen font-sans selection:bg-[#FFC20E] selection:text-black flex flex-col overflow-hidden relative text-white`}
        // Application du style d'arrière-plan dynamique
        style={currentBackgroundStyle}
    >
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
        /* Animation lente de rotation pour le bouton de tirage */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        /* NOUVEAU: Animations pour la carte */
        /* Supprimons les animations 'slide-in' et 'slide-out' pour le passage de carte à carte */
        .card-enter { animation: slide-in-from-top-full 300ms cubic-bezier(0.4, 0, 0.2, 1); }
        .card-exit { animation: slide-out-to-bottom-full 150ms ease-in; }
        
        @keyframes slide-in-from-top-full {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-out-to-bottom-full {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }
      `}</style>

      {view === 'menu' && <MainMenu onNavigate={setView} startLogisticsChallenge={navigateToLogisticsSetup} onResumeGame={resumeGame} gameSaved={gameSaved} />}
      {view === 'setup' && <div className="flex-1 flex items-center justify-center p-4"><SetupScreen onStart={(p, m) => startGame(p, m, 15, 'all')} onBack={() => setView('menu')} /></div>}
      
      {/* NOUVEL ÉCRAN DE SETUP POUR LA LOGISTIQUE */}
      {view === 'logisticsSetup' && (
          <div className="flex-1 flex items-center justify-center p-4">
              <LogisticsSetupScreen 
                  onStart={startGame} 
                  onBack={() => setView('menu')}
                  logisticsMaxRounds={LOGISTICS_MAX_CARDS}
                  categoryId={LOGISTICS_CATEGORY.id}
                  categoryLabel={LOGISTICS_CATEGORY.label}
              />
          </div>
      )}

      {view === 'profile' && <div className="flex-1 flex items-center justify-center p-4 z-50"><ProfileScreen player={players.length > 0 ? players[0] : initialPlayerState} onBack={() => setView('menu')} /></div>}
      {view === 'story' && <div className="flex-1 flex items-center justify-center p-4 z-50"><StoryScreen onBack={() => setView('menu')} /></div>}
      {view === 'history' && <div className="flex-1 flex items-center justify-center p-4"><HistoryScreen history={gameHistory} onBack={() => setView('menu')} /></div>}

      {view === 'playing' && (
        <>
          <nav className="px-4 md:px-6 py-4 flex justify-between items-center bg-black/10 backdrop-blur-md border-b border-white/5 sticky top-0 z-40 shadow-lg">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-yellow-400 p-1.5 rounded-lg text-black shadow-lg shadow-yellow-400/20"><Trophy size={20} strokeWidth={2.5}/></div>
              <span className="font-black italic text-base md:text-xl tracking-tighter">SKILLS<span className="text-[#FFC20E]">MASTER</span></span>
            </div>
            {/* Responsiveness: Cache le compteur de tours sur les très petits écrans */}
            <div className="hidden sm:flex items-center gap-3 bg-black/30 px-4 py-2 rounded-full border border-white/10 shadow-inner">
                <CheckSquare size={16} className="text-white/60" />
                <span className="text-sm font-black tracking-widest">{roundsPlayed} / {maxRounds}</span>
            </div>
            {/* Responsiveness: Limite la taille de la liste des joueurs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-[40vw] sm:max-w-[30vw]">
                {players.map((p, i) => (
                <div key={p.id} className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${i === currentPlayerIndex ? 'bg-white text-[#B02E68] border-white font-black shadow-lg scale-105' : 'bg-black/20 border-transparent text-white/50'}`}>
                    <span className="text-xs uppercase truncate max-w-[60px] md:max-w-[80px]">{p.name}</span>
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
              {/* Responsiveness: Taille du titre adaptée */}
              <h2 className="text-2xl md:text-5xl font-black text-white uppercase drop-shadow-xl flex items-center justify-center gap-3 tracking-tighter">
                 {deckFilter === 'logistics' ? 'DÉFI LOGISTIQUE (ALÉATOIRE)' : 'CHOISISSEZ UNE CATÉGORIE'} <span className="text-[#FFC20E] animate-pulse"><Award size={32} /></span>
              </h2>
            </div>
            
            {/* MISE À JOUR IMPORTANTE : 
            1. Afficher la GRILLE DE SÉLECTION UNIQUEMENT si: deckFilter='all' ET isGameStartedState=false (premier tour)
            2. Afficher l'ÉCRAN D'ATTENTE/BOUTON si: activeCard=null MAIS le jeu a commencé (deckFilter='logistics' OU isGameStartedState=true)
            */}
            
            {/* CAS 1: Grille de sélection (Mode 'all', 1er tour SEULEMENT) */}
            {deckFilter === 'all' && !activeCard && !isGameStartedState && (
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 auto-rows-fr pb-20 animate-in fade-in duration-500">
                    {categoriesToRender.map((cat) => (
                        <CardBack 
                            key={cat.id} 
                            category={cat} 
                            onClick={drawCard} // Tirer la carte de la catégorie sélectionnée (avec 10% de chance de Wild)
                            disabled={isCategoryEmpty(cat.id)} 
                        />
                    ))}
                    <div className="col-span-full text-center mt-4 text-white/70 text-sm">
                        <p className="font-bold uppercase tracking-wider text-[#ffa62d] flex items-center justify-center gap-2">
                             <Zap size={16}/> Attention: 10% de chance de tomber sur une carte Maths (Wild Card +10 Pts) !
                        </p>
                    </div>
                </div>
            )}
            
            {/* CAS 2: Écran d'attente/bouton (Mode 'logistics' OU Mode 'all' APRES 1er tour) */}
            {/* Condition: activeCard est null, mais le jeu est lancé (logistics OU isGameStartedState=true) */}
            {(!activeCard && (deckFilter === 'logistics' || isGameStartedState)) && (
                <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-500">
                    <div className="relative w-80 h-80 flex items-center justify-center mb-8">
                       <div className="absolute inset-0 border-4 border-dashed border-white/20 rounded-full animate-spin-slow"></div>
                       <Zap size={64} className="text-[#FFC20E] animate-pulse"/>
                    </div>
                    
                    {deckFilter === 'logistics' ? (
                        // En mode Logistique, on doit toujours cliquer pour tirer
                       <button 
                            // Le tirage se fait sur le clic du bouton
                            onClick={() => {
                                console.log("[USER ACTION] Clic sur TIRER LA PROCHAINE CARTE LOGISTIQUE."); // Debug Log
                                drawRandomNextCard(); 
                            }} 
                            className="group bg-white text-[#B02E68] font-black text-xl py-5 px-10 rounded-3xl hover:scale-105 transition shadow-2xl flex items-center justify-center gap-4 hover:shadow-white/30"
                        >
                            TIRER LA PROCHAINE CARTE LOGISTIQUE
                            <ArrowRight className="group-hover:translate-x-1 transition fill-current" />
                        </button>
                    ) : (
                        // En mode 'all' après le 1er tour, le tirage est automatique et rapide (c'est l'écran de transition)
                         <p className="text-xl font-bold text-white/80 animate-pulse">
                             Carte tirée... Veuillez patienter !
                         </p>
                    )}
                    
                    <p className="mt-4 text-sm text-white/70 italic">
                        Tour actuel: {roundsPlayed + 1} / {maxRounds}
                    </p>
                </div>
            )}
            
          </main>
        </>
      )}

      {/* OVERLAY DE TRANSITION (TOTALEMENT SUPPRIMÉ, car il créait le clignotement) */}
      {/* L'état isTransitioningState n'est plus nécessaire. */}

      {activeCard && activeCategory && (
        <CardFront key={activeCard.id} card={activeCard} category={activeCategory} onClose={() => { setActiveCard(null); setActiveCategory(null); }} onResult={handleCardResult} playerName={players[currentPlayerIndex]?.name} />
      )}

      {showScoreboard && <ScoreBoard players={players} missedCards={missedCards} onEndGame={endGame} />}

      {/* NOUVEAU: Copyright Footer */}
      {(view === 'menu' || view === 'profile' || view === 'story' || view === 'history' || view === 'setup' || view === 'logisticsSetup') && (
        <footer className="w-full text-center py-4 text-xs font-light text-white/50 bg-black/10 backdrop-blur-sm border-t border-white/5 mt-auto z-0">
            © {new Date().getFullYear()} SKILLSMASTER. Tous droits réservés. Développé par Gabriel Emrick Tognimanbou DAHISSIHO.
        </footer>
      )}
    </div>
  );
}
