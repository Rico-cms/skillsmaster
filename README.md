# SkillsMaster

SkillsMaster est un jeu web d'animation et de team building autour des compétences humaines : communication, leadership, esprit critique, intelligence émotionnelle et créativité. Il propose aussi des défis spécialisés Logistique et JALO, ainsi que des cartes bonus de calcul mental.

Un mode Culture générale propose également 30 questions aléatoires couvrant actualité datée, médecine, mécanique, sciences, histoire, arts, sport et curiosités.

## Fonctionnalités

- Parties solo ou multijoueurs locales
- Quiz et défis chronométrés
- Scores et statistiques par compétence
- Reprise automatique d'une partie en cours
- Historique local des 20 dernières parties
- Réglages avancés : tours, difficulté, Wild Cards et catégories actives
- Atelier de cartes personnalisées avec import/export JSON et validation
- Rapports de fin de partie copiables ou téléchargeables
- Historique enrichi avec export et suppression contrôlée
- Mode plein écran et relance immédiate d'une partie
- Application installable (PWA) et disponible hors ligne après la première visite
- Interface responsive, sans compte ni serveur

Les sauvegardes sont stockées dans le `localStorage` du navigateur. Elles restent donc sur l'appareil utilisé.

## Installation

Prérequis : Node.js 20.19+ ou 22.12+ et npm.

```bash
npm install
npm run dev
```

Vite affiche ensuite l'adresse locale de l'application, généralement `http://localhost:5173`.

## Vérifications

```bash
npm run check
```

Cette commande exécute ESLint, les tests unitaires puis génère le build de production. GitHub Actions lance le même contrôle à chaque push et pull request. Pour prévisualiser ce build :

```bash
npm run preview
```

## Structure

- `src/App.jsx` : données des cartes et orchestration du jeu
- `src/components/` : écrans autonomes, dont l'atelier de cartes
- `src/lib/` : validation, rapports et fonctions métier testables
- `public/` : manifeste, icône et service worker de la PWA
- `src/index.css` : chargement de Tailwind CSS
- `src/main.jsx` : point d'entrée React
- `vite.config.js` : configuration Vite/Tailwind

## Stack

React 19, Vite 7, Tailwind CSS 4 et Lucide React.
