---
paths:
  - "pro/**"
---
# Projets pro
Lire `pro/<projet>/instructions.md` avant toute action (importé par `pro/<projet>/CLAUDE.md`).
instructions.md = (a) contraintes de traitement du projet (doublons interdits, index à tenir, données à ne
jamais inventer) + (b) rappels métier à réappliquer sans qu'on les répète (règles absolues, positionnement,
contraintes légales ou éthiques).
Nouveau projet = dossier + overview + instructions.md + CLAUDE.md (`@instructions.md`), lien depuis
l'overview, une ligne dans master-index.
Types : projet, livrable, meeting, idea, tool, skill. Statut vivant : in-progress ; à relire : review.
La théorie générale est dans `connaissance/` ; la page projet la cite par lien, jamais ne la réexplique.
Jamais de données client vers `connaissance/`, un autre projet ou un outil tiers.
Juridique / fiscal : informer, jamais trancher ; recommander un professionnel.
Notes dans `pro/<projet>/`, binaires (code, maquettes, exports) dans `attachments/<projet>/` ;
code et binaires lourds : dans le dépôt du projet, jamais dans le vault.
Index : `_index/index-pro.md` + index local du projet + `recent.md` ; master-index seulement si la structure change.
