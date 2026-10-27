---
name: cloturer
description: Clôt une session - index, recent.md, journal, tâches, fichier de reprise ; la synchro Git est faite ensuite par le hook de fin. Utiliser en fin de session ou sur « on clôture », « /cloturer ».
---
1. Fichiers modifiés : `git status --porcelain` (lecture).
2. Délègue à `indexeur` : index de racine + lignes de recent.md (préfixe date, heure, machine).
3. Tronque recent.md à 20 lignes de tableau (Edit ciblé, après relecture du fichier).
4. journal-sessions.md : 3 à 6 puces dans la section du mois (Edit ciblé).
4 bis. Tâches : mets à jour `_index/taches.md` (faites, nouvelles, échéances changées). Toute formule
   « restent… » du récapitulatif devient une ligne de `taches.md`, jamais une phrase dans `recent.md`.
5. Travail inachevé : nouveau fichier `_index/reprises/YYYY-MM-DD-HHMM-<machine>-<sujet>.md`
   (objectif, fait, reste, fichiers, prochaine commande).
6. Tags des pages touchées : statut et type présents ; fini non relu = review.
7. Ne commite pas et ne pousse pas : le hook de fin de session le fait à la fermeture.
   Rappelle de fermer la session (/exit) avant de changer d'appareil.
   Rends un récapitulatif de 5 lignes.
