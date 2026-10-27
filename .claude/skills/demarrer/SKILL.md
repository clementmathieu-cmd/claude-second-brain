---
name: demarrer
description: Démarre une session sur le vault - état de la synchro, contexte utile, travail en cours, plan proposé. Utiliser en début de session ou sur « on démarre », « /demarrer ».
argument-hint: "[projet ou sujet optionnel]"
---
1. Relis le message du hook de démarrage : s'il contient « ALERTE SYNCHRO », c'est le premier point
   de ta réponse, avec la commande à lancer (git status, git pull --rebase) ; ne modifie rien avant.
2. Lis `_index/master-index.md` et les 20 lignes de `_index/recent.md`.
2 bis. Lis la section « Cette semaine » de `_index/taches.md` (registre en listes : par projet, quatre cases
   À faire / À décider / En attente / Plus tard). Mets-la à jour (échéance dans les 7 jours ou bloquante,
   15 lignes max), puis régénère la vue kanban : `python -I .claude/skills/demarrer/kanban.py`
   (écrit `_index/kanban.md`, ne jamais l'éditer à la main).
   Rends les 3 à 5 priorités du jour et toute échéance à moins de 7 jours.
3. Projet donné ($ARGUMENTS) : lis `pro/<projet>/instructions.md`, délègue l'état à `reprise-projet`.
4. Liste le dernier fichier non traité de `_index/reprises/`, les notes #status/raw récentes (10 max)
   et #status/review en attente.
5. Rends : contexte en 5 lignes, UN lot de questions à choix (5 max), le plan. Rien avant la réponse.
