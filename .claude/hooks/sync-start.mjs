// SessionStart (startup|resume) : avance rapide depuis GitHub, puis contexte injecté (stdout = contexte de Claude).
// Ne fait jamais de rebase ni de merge : en cas de divergence, il alerte seulement.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { git, machine, operationEnCours, ecart, lireEtEffacerAlertes, ROOT } from "./lib-git.mjs";

const msgs = [];
const m = machine();

const anciennes = lireEtEffacerAlertes();
if (anciennes) msgs.push(`ALERTE SYNCHRO (fin de session précédente) :\n${anciennes}`);

if (process.env.VAULT_SYNC === "off") {
  msgs.push("Synchro désactivée (VAULT_SYNC=off).");
} else if (operationEnCours()) {
  msgs.push("ALERTE SYNCHRO : un rebase ou un merge est en cours dans le vault. Ne rien modifier avant que l'utilisateur l'ait résolu (git status).");
} else {
  const f = git(["fetch", "--quiet", "--no-tags", "origin"], { timeout: 20000 });
  if (!f.ok) {
    msgs.push(`Synchro : fetch impossible (réseau ou accès GitHub). Travail sur la copie locale. Détail : ${f.err.split("\n")[0]}`);
  } else {
    const e = ecart();
    if (!e) {
      msgs.push("ALERTE SYNCHRO : la branche n'a pas d'amont (git branch -u origin/main). Prévenir l'utilisateur.");
    } else if (e.retard === 0) {
      msgs.push(e.avance > 0 ? `Synchro : à jour ; ${e.avance} commit(s) local(aux) pas encore poussé(s), ils partiront en fin de session.` : "Synchro : à jour.");
    } else if (e.avance > 0) {
      msgs.push(`ALERTE SYNCHRO : copies divergentes (${e.avance} commit(s) ici, ${e.retard} sur GitHub). Pas de pull automatique. La fin de session tentera un rebase ; en cas de conflit, rien ne sera poussé. Prévenir l'utilisateur maintenant.`);
    } else {
      const p = git(["pull", "--ff-only", "--quiet", "--no-tags"], { timeout: 25000 });
      msgs.push(p.ok
        ? `Synchro : ${e.retard} commit(s) récupéré(s) depuis GitHub.`
        : `ALERTE SYNCHRO : pull refusé (probablement des fichiers modifiés localement qui seraient écrasés). Prévenir l'utilisateur. Détail : ${p.err.split("\n")[0]}`);
    }
  }
}

const sale = git(["status", "--porcelain"]).out.split("\n").filter(Boolean);
let recent = "";
try {
  recent = readFileSync(join(ROOT, "_index", "recent.md"), "utf8").split("\n")
    .filter((l) => /^\|\s*20\d\d-/.test(l) || l.startsWith("- 20")).slice(0, 5)
    .map((l) => (l.length > 220 ? l.slice(0, 217) + "..." : l)).join("\n");
} catch {}

console.log([
  `Machine : ${m}. Date : ${new Date().toISOString().slice(0, 10)}. Branche : ${git(["branch", "--show-current"]).out}.`,
  ...msgs,
  sale.length ? `${sale.length} fichier(s) non commité(s) au démarrage (autre session ou session interrompue) : ne pas les écraser.` : "",
  recent ? `Dernières entrées de recent.md :\n${recent}` : "",
].filter(Boolean).join("\n"));
process.exit(0);
