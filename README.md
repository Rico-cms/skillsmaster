# SkillsMaster

SkillsMaster est un jeu web d'animation et de team building autour des compétences humaines : communication, leadership, esprit critique, intelligence émotionnelle et créativité. Il propose aussi des défis spécialisés Logistique et JALO, ainsi que des cartes bonus de calcul mental.

## Fonctionnalités

- Parties solo ou multijoueurs locales
- Quiz et défis chronométrés
- Scores et statistiques par compétence
- Reprise automatique d'une partie en cours
- Historique local des 20 dernières parties
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

Cette commande exécute ESLint puis génère le build de production. Pour prévisualiser ce build :

```bash
npm run preview
```

## Structure

- `src/App.jsx` : données des cartes, logique de jeu et composants d'interface
- `src/index.css` : chargement de Tailwind CSS
- `src/main.jsx` : point d'entrée React
- `vite.config.js` : configuration Vite/Tailwind

## Stack

React 19, Vite 7, Tailwind CSS 4 et Lucide React.
