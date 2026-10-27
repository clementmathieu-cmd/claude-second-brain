// PreToolUse (Write) : refuse un Write complet sur les fichiers d'index partagés (exit 2 = outil bloqué).
import { readFileSync, existsSync } from "node:fs";
let input = {};
try { input = JSON.parse(readFileSync(0, "utf8")); } catch { process.exit(0); }
const brut = input.tool_input?.file_path || "";
const p = brut.replace(/\\/g, "/");
if (/(^|\/)_index\/(recent|journal-sessions|master-index)\.md$/.test(p) && existsSync(brut)) {
  console.error("Write complet interdit sur ce fichier partagé (recent, journal-sessions, master-index) : relis-le et utilise Edit.");
  process.exit(2);
}
process.exit(0);
