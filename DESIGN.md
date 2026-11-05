---
name: Re-Label
description: Valorisateur des pratiques du réemploi, un outil collaboratif qui recense et partage.
colors:
  steel-blue: "#355c7d"
  terracotta: "#b2675e"
  slate-gray: "#7a7a7a"
  paper-white: "#ffffff"
  mist-gray: "#f4f4f5"
  cool-mist: "#f3f4f6"
  error-red: "#b91c1c"
typography:
  display:
    fontFamily: "Barlow, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 900
    lineHeight: 1
  headline:
    fontFamily: "Barlow, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 900
    lineHeight: 1
  title:
    fontFamily: "Barlow, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    lineHeight: 1
  body:
    fontFamily: "Barlow, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
  label:
    fontFamily: "Barlow, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
rounded:
  none: "0"
  sm: "0.25rem"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  card:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.steel-blue}"
    rounded: "{rounded.none}"
    padding: "1.5rem"
  button:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.steel-blue}"
    rounded: "{rounded.none}"
    padding: "0.5rem 1rem"
  button-hover:
    backgroundColor: "{colors.cool-mist}"
  tag:
    backgroundColor: "{colors.mist-gray}"
    rounded: "{rounded.sm}"
    padding: "0.25rem 0.5rem"
---

# Design System: Re-Label

## Overview

**Creative North Star: "L'étiquette cartonnée"**

Re-Label ressemble à une étiquette de réemploi : des panneaux blancs cernés d'un trait bleu épais, posés sur un motif Memphis répété en fond. Tout est tracé au même bleu acier, texte, bordures, titres, comme une encre unique sur du carton. La hiérarchie vient du poids (Barlow 900, capitales) et des cadres, pas de la couleur.

Le système est dense et frontal : bordures de 4px, angles droits, grandes ombres portées. Le motif de fond apporte le jeu, les panneaux restent sobres.

**Key Characteristics:**
- Une encre unique (bleu acier) pour texte, bordures et titres.
- Panneaux blancs à cadre épais, angles droits.
- Titres en capitales Barlow très grasses.
- Fond Memphis répété (motif teinté bleu acier à ~25 %, `memphis-tint.png`) derrière le contenu.

## Colors

Palette quasi monochrome : bleu acier sur blanc, avec un terre cuite d'appoint.

### Primary
- **Bleu acier** (#355c7d, `--color-primary`) : texte, titres, bordures, liens, champs. Couleur de presque tout.

### Secondary
- **Terre cuite** (#b2675e, `--color-tertiary`) : soulignement des liens (`.link`), usage rare.

### Neutral
- **Gris ardoise** (#7a7a7a, `--color-quaternary`) : texte secondaire.
- **Blanc papier** (#ffffff) : surface des panneaux.
- **Brume** (#f4f4f5) et **brume froide** (#f3f4f6) : fond des tags et survol des blocs et boutons.
- **Rouge erreur** (#b91c1c) : erreurs et champs requis.

### Named Rules
**The One Ink Rule.** Texte, bordures et titres partagent le bleu acier. Une nouvelle teinte doit justifier son rôle.

## Typography

**Display / Body Font:** Barlow (via next/font, repli Segoe UI, Roboto, Arial)

**Character:** une seule famille, contraste obtenu par le poids (400 en texte, 800-900 en titres) et les capitales.

### Hierarchy
- **Display** (900, 4.5rem, 1) : h1 de bannière, capitales.
- **Headline** (900, 1.875rem, 1) : h2 de bannière.
- **Title** (700-800, ~1.125rem, 1) : h3, titres de cartes et navigation, capitales.
- **Body** (400, 1.05rem) : texte courant.
- **Label** (400, 0.75rem) : tags.

### Named Rules
**The Shout Case Rule.** Tous les titres h1-h6 sont en capitales, interligne 1.

## Layout

Colonne centrée de 67,5rem (max-w-270) ; contenu « padded » avec marge haute 5rem et gouttière 2rem. Bannières en flex : en-tête 40/60, puis trois colonnes égales séparées par des traits de 4px ; bascule en colonne sous 768px. Grille de cartes `repeat(auto-fill, minmax(300px, 1fr))` avec écart de 2rem. Breakpoints : 640 / 768 / 1024 / 1280 / 1536px. Mise en page imprimée en A4 paysage sans fond.

## Elevation & Depth

Hybride : panneaux et cartes portent une grande ombre (`0 25px 50px -12px rgba(0,0,0,.25)`) sur le fond Memphis ; à l'intérieur, la séparation se fait par traits de 4px, pas par ombres.

## Shapes

Angles droits partout (panneaux, boutons, champs) ; seuls les tags ont un léger arrondi (0.25rem). Cadres de 4px (`--borderWidth-lg`), champs soulignés de 2px.

## Components

### Buttons
- **Shape:** angles droits, bordure 4px bleu acier.
- **Default:** fond blanc, padding 0.5rem 1rem.
- **Hover:** fond brume froide (#f3f4f6). Pas de transition définie.

### Cards / Containers
- **Corner Style:** droit. **Background:** blanc. **Border:** 4px bleu acier. **Shadow:** ombre 2xl. **Padding:** 1.5rem.
- Le verso (description) apparaît au survol de la carte.

### Inputs / Fields
- **Style:** sans cadre, soulignement 2px bleu acier, texte bleu. Marge basse 2rem.
- **Focus:** contour de 2px bleu acier avec décalage de 2px.
- **Error:** texte rouge #b91c1c sous le champ.

### Tags
- Pastille carrée-ish blanche, cadre 2px bleu acier, texte bleu 0.75rem ; la couleur de catégorie est réduite à un petit carré. Contraste garanti par construction.

### Navigation
- Capitales 800, bleu acier, soulignement de 3px animé au survol et pour la page active. Sous 768px : bouton « Menu » encadré (4px) qui ouvre un panneau plein écran blanc.

## Do's and Don'ts

### Do:
- **Do** garder une encre unique : bleu acier #355c7d pour texte, bordures et titres.
- **Do** cadrer les blocs de contenu en blanc avec bordure de 4px et angles droits.
- **Do** mettre les titres en Barlow 800-900, capitales.
- **Do** préserver l'impression (fond retiré, A4 paysage) pour les labels.

### Don't:
- **Don't** arrondir panneaux, boutons ou champs.
- **Don't** introduire de nouvelles teintes d'accent sans rôle clair.
- **Don't** supprimer un contour de focus sans équivalent visible.
