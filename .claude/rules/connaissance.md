---
paths:
  - "connaissance/**"
  - "raw-sources/**"
---
# Pages de connaissance (standard de qualité rédactionnelle)

Priorité : complet, précis, sourcé plutôt que court. Résumé d'ouverture bref (3 lignes), corps sans
plafond de longueur : la page doit permettre de vraiment comprendre le sujet. Ignorer la consigne
« 100-200 mots » des anciens templates.

## Format
```
# Titre
**Résumé (3 lignes max) :** ...

## Points clés
- ... (autant que nécessaire)

## Connexions
- Lié à : [[chemin/A]], [[chemin/B]]
- Opposé à : [[chemin/C]]

## Sources
- Auteur, Titre, éditeur/institution, année
- [[raw-sources/nom]] si applicable

Tags : #type/X #domain/X #status/processed
Créé : YYYY-MM-DD | Mis à jour : YYYY-MM-DD
```
Au moins 2 liens sortants. Page terminée mais non relue : `#status/review`.

## Sourcing
- Sources nommées (ex. « Matthew Walker, *Why We Sleep*, Scribner, 2017 »), pas « connaissances générales »
  sauf fait de base incontesté. Pas de source précise : le dire plutôt que remplir vaguement.

## Mise en forme (clarifier, pas décorer)
- Tableau dès qu'il y a comparaison, chronologie, classification, chiffres.
- Mermaid pour schéma, arbre de décision, chronologie visuelle, carte de concepts.
- Images : seulement celles déjà présentes dans `attachments/` ; ne jamais prétendre en avoir ajouté.
- Callouts selon leur rôle : `[!warning]` piège, `[!important]` point critique, `[!example]` cas concret,
  `[!quote]` citation sourcée, `[!tip]` astuce, `[!question]` incertitude. Explication normale = texte courant.

## Rangement
- Domaines : liste fermée du CLAUDE.md (`formation` → perso, `thailande` → pays).
- Recettes : `#type/recette #domain/lifestyle`, dans `connaissance/lifestyle/cuisine/recettes/`.
- 3 pages ou plus sur un thème : synthèse dans `connaissance/synthesis/`.
- Index : `_index/index-connaissance.md` ou `_index/index-pays.md`.
- Page ancienne retravaillée (fusion, extension, correction) : l'amener au standard au passage.
- `raw-sources/` : tri (archivage hors Git ou suppression d'un fichier déjà traité, page créée et liée)
  seulement après validation de l'utilisateur, lot par lot. Boîte de réception, vidée après chaque traitement.
- `pays/` : gabarit 7 pages par pays (vue d'ensemble `_index-<pays>`, histoire, politique-geopolitique,
  economie, societe, culture, geographie ; politique et geopolitique séparées au-delà de 7 000 mots).
  Un nouveau sujet devient une section `##` de la page thématique, pas une nouvelle page.
