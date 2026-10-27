---
paths:
  - "_index/**"
---
# Index et pilotage
`master-index.md` < 100 lignes : hub, pas de narration ; pas de merge=union (un conflit y est un vrai signal).
`recent.md` : tableau de 20 lignes, une ligne par traitement, insérée en tête du tableau :
`| YYYY-MM-DD HH:MM [machine] | action courte | [[chemin]] |` (machine = pc ou vps, donnée par le hook
de démarrage). Deux lignes écrites en parallèle sur PC et VPS restent distinctes : merge=union les garde.
Ne jamais tronquer recent.md en cours de route : /cloturer le fait (21 ou 22 lignes un moment, sans gravité).
`journal-sessions.md` : un résumé par mois ; le détail reste dans l'historique Git.
Écritures concurrentes : relire juste avant, Edit ciblé, jamais Write complet sur recent, journal,
master-index (bloqué par hook).
`reprises/` : un fichier par reprise `YYYY-MM-DD-HHMM-<machine>-<sujet>.md`, jamais écrasé.
