// SessionEnd (et timer du soir) : commit + push si changements, avec garde-fous.
// Ne force jamais rien : secret => aucun commit ; conflit => rebase annulé, rien poussé.
// VAULT_SYNC=off : ne fait rien. VAULT_DRY_RUN=1 : décrit ce qui serait fait, sans commit ni push.
import { git, machine, operationEnCours, secretsDansIndex, horodatage, ecart, alerter, DRY } from "./lib-git.mjs";

const fin = (msg, code = 0) => {
  if (msg) { console.error(msg); if (code) alerter(msg); }
  process.exit(code);
};
if (process.env.VAULT_SYNC === "off") fin();
if (operationEnCours()) fin("Synchro : rebase/merge en cours, rien n'est commité ni poussé.", 2);

// 1. Commit si changements
if (git(["status", "--porcelain"]).out) {
  const a = git(["add", "-A"], { timeout: 60000 });
  if (!a.ok) fin(`Synchro : git add impossible. ${a.err.split("\n")[0]}`, 2);
  const suspects = secretsDansIndex();
  if (suspects.length) {
    git(["reset", "--quiet"]); // désindexe tout, ne touche pas aux fichiers
    fin(`Synchro BLOQUÉE : secret possible dans ${suspects.join(", ")}. Rien n'est commité ni poussé. Retirer le secret puis relancer.`, 2);
  }
  const fichiers = git(["diff", "--cached", "--name-only"]).out.split("\n").filter(Boolean);
  const racines = [...new Set(fichiers.map((f) => f.split("/")[0]))].slice(0, 4).join(", ");
  const msg = `auto(${machine()}) : ${fichiers.length} fichier(s) [${racines}] ${horodatage()}`;
  if (DRY) {
    git(["reset", "--quiet"]);
    console.error(`[à blanc] commit qui serait créé : « ${msg} »`);
  } else {
    const c = git(["commit", "--quiet", "-m", msg]);
    if (!c.ok) fin(`Synchro : commit impossible. ${(c.err || c.out).split("\n")[0]}`, 2);
  }
} else if (DRY) console.error("[à blanc] rien à commiter.");

// 2. Rien à pousser ?
if (!git(["fetch", "--quiet", "--no-tags", "origin"], { timeout: 15000 }).ok) fin("Synchro : hors ligne, commit local gardé, push au prochain passage.", 2);
const e = ecart();
if (!e) fin("Synchro : pas de branche amont, rien n'est poussé.", 2);
if (DRY) fin(`[à blanc] ${e.avance} commit(s) à pousser, ${e.retard} à récupérer.`);
if (!e.avance) fin();

// 3. Réconcilier si GitHub a avancé (merge=union règle recent/journal/index de racine)
if (e.retard > 0) {
  const r = git(["rebase", "--quiet", "@{u}"], { timeout: 30000 });
  if (!r.ok) {
    git(["rebase", "--abort"]);
    fin("Synchro : CONFLIT avec GitHub. Rebase annulé, commit local intact, RIEN n'est poussé. À résoudre à la main (git pull --rebase).", 2);
  }
}

// 4. Push (jamais forcé)
const p = git(["push", "--quiet", "--no-tags", "origin", "HEAD"], { timeout: 30000 });
if (!p.ok) fin(`Synchro : push refusé, commit local gardé. ${p.err.split("\n")[0]}`, 2);
fin();
