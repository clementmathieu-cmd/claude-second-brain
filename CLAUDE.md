# CLAUDE.md — Second brain

Lis `_index/master-index.md` (hub court), puis l'index de la racine concernée.
Règles par dossier : `.claude/rules/` (chargées selon les fichiers touchés).
Projet pro : `pro/<projet>/CLAUDE.md` importe son `instructions.md`, à respecter sans exception.

## Style
Français. Direct, sans rembourrage, sans flatterie. Le crucial d'abord. Challenger une hypothèse faible.

## Manière d'agir
1. Lire d'abord : instructions.md du projet, pages visées, 20 lignes de recent.md.
2. Plan (étapes, fichiers, livrable) AVANT toute tâche non triviale.
3. Questions : un seul lot, option recommandée en premier « (recommandé) ».
4. Sigle ambigu : demander, ne jamais deviner.
5. Travail lourd : sous-agents, 3 en parallèle max ; rapports écrits dans le vault, jamais /tmp.
6. Périmètre : ne modifier que ce qui est demandé ; le reste est proposé, pas fait.
7. Fait non vérifié = « à vérifier ». Distinguer « décidé par moi » et « recommandé par Claude ».
8. Publier (site, mail, post, partage) seulement après validation explicite dans la session.
9. Fin de tâche : /cloturer (index, recent, journal, reprise si inachevé).

## Les usages du vault (identifier l'usage AVANT de créer une note : il fixe le dossier)
| Usage | Racine | Rythme |
|---|---|---|
| Apprendre, s'enrichir | `connaissance/` | quasi statique |
| Piloter ses projets pro | `pro/` | chaque semaine |
| Suivre sa vie perso | `perso/` | continu, notes datées |

Autres racines : `_index/` (master-index, index par racine, recent, journal-sessions, taches, reprises) ;
`templates/` ; `attachments/` (binaires seulement, rangés par projet) ; `raw-sources/` (boîte de réception,
vidée à chaque traitement ; seul `inbox.md` y reste).

## Synchro entre machines
Plusieurs copies de travail synchronisées par GitHub. Synchro automatique par hooks (pull au démarrage,
commit + push en fin de session, timer optionnel le soir) : ne pas lancer soi-même `git push`, `pull` ou
`rebase` sauf demande ; si le hook signale un échec, le dire en premier.

## Règles de traitement
1. Un fichier de raw-sources → au moins une page, dans la bonne racine selon l'usage.
2. 3 pages de `connaissance/` ou plus sur un thème → page de synthèse dans `connaissance/synthesis/`.
3. Après création : index de la racine + une ligne en tête de recent.md (20 max) ; détail dans
   journal-sessions.md ; master-index (< 100 lignes) seulement si la structure change.
4. Jamais de doublon : enrichir la page existante de `connaissance/` et la lier depuis `pro/` ou `perso/`.
5. Résumé de 3 lignes max, corps complet et sourcé (standard dans `.claude/rules/connaissance.md`).

## Règles absolues
1. Connaissance vs pratique : jamais de théorie recopiée dans `pro/` ou `perso/`, un lien.
2. Liens `[[chemin/complet/depuis/la/racine]]` ; page liée absente : stub minimum.
3. Ne jamais inventer chiffres, clients, témoignages, validations juridiques ou médicales.
4. Notes perso : ne pas les modifier sans demande.
5. Jamais de secret (mot de passe, token, clé) dans le vault : le hook de fin bloque le commit.

## Tags (statut et type obligatoires partout, domaine obligatoire dans connaissance/)
Statut : raw, in-progress, review, processed, synthesis, outdated.
Type : concept, article, book, tool, skill, idea, meeting, projet, livrable, formation, routine, index.
Domaine : liste fermée à définir (ex. business, tech, sciences, sante, sport, culture, histoire, meta).

## Commandes maison
/demarrer · /reprendre · /cloturer
