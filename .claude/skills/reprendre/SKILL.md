---
name: reprendre
description: Reprend une tâche coupée (limite d'API, agent interrompu, session fermée, autre machine) sans refaire le travail fait. Utiliser sur « reprends », « continue », « /reprendre ».
argument-hint: "[chantier ou fichier de reprise]"
---
1. Dernier état : fichier le plus récent de `_index/reprises/` (il a pu être écrit sur l'autre machine
   et arriver par le pull), puis `git log -5 --stat` et `git status` (lecture).
2. Reconstitue : objectif, étapes faites (preuve sur disque ou dans un commit), étapes restantes.
3. Annonce en 5 lignes ce qui reste, puis reprends à la première étape non faite ;
   3 sous-agents en parallèle max.
4. Coche les étapes dans le fichier de reprise ; terminé = #status/processed (jamais supprimé).
