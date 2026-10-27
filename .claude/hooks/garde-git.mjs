// PreToolUse (Bash) : bloque les commandes Git destructrices dans le vault (exit 2 = outil bloqué).
// VAULT_GIT_MANUEL=1 dans l'environnement lève le garde-fou (travail Git manuel validé par l'utilisateur).
import { readFileSync } from "node:fs";
let cmd = "";
// Entrée illisible : on bloque (exit 2) plutôt que de laisser passer une commande non contrôlée
try { cmd = JSON.parse(readFileSync(0, "utf8")).tool_input?.command || ""; } catch { console.error("garde-git : entrée illisible, commande bloquée."); process.exit(2); }
const interdit = [
  /git\s+push\b[^\n;&|]*(--force\b|--force-with-lease|\s-f\b|\s\+\S)/,
  /git\s+reset\s+--hard/,
  /git\s+clean\s+-[a-z]*f/,
  /git\s+filter-(repo|branch)/,
  /git\s+checkout\s+--\s+\./,
  /git\s+(tag\s+(-d|--delete)|push\b[^\n;&|]*(--delete|:refs\/tags))/,
];
if (process.env.VAULT_GIT_MANUEL !== "1" && interdit.some((r) => r.test(cmd))) {
  console.error("Commande Git destructrice bloquée dans le vault (push forcé, reset --hard, clean, filter-repo, suppression de tag). Demander à l'utilisateur.");
  process.exit(2);
}
process.exit(0);
