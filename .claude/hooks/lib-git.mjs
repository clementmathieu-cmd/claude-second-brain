// lib-git.mjs — utilitaires partagés par les hooks de synchro et le script du soir (Windows + Linux)
// Synchro Git entre plusieurs machines (Windows + Linux), sans jamais forcer.
import { spawnSync } from "node:child_process";
import { existsSync, appendFileSync, readFileSync, unlinkSync } from "node:fs";
import { hostname } from "node:os";
import { isAbsolute, join } from "node:path";

export const ROOT = process.env.CLAUDE_PROJECT_DIR || process.env.VAULT_DIR || process.cwd();
export const DRY = process.env.VAULT_DRY_RUN === "1";

export function git(args, opts = {}) {
  const r = spawnSync("git", args, {
    cwd: ROOT, encoding: "utf8", timeout: opts.timeout ?? 20000, maxBuffer: 256 * 1024 * 1024,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GIT_EDITOR: "true" },
  });
  return { ok: r.status === 0, out: (r.stdout || "").trim(), err: ((r.stderr || "") + (r.error ? String(r.error) : "")).trim() };
}

// Nom court de la machine : "pc" ou "vps" (VAULT_MACHINE, sinon déduit)
export function machine() {
  if (process.env.VAULT_MACHINE) return process.env.VAULT_MACHINE;
  return process.platform === "win32" ? "pc" : hostname();
}

function gitDir() {
  const gd = git(["rev-parse", "--git-dir"]).out || ".git";
  return isAbsolute(gd) ? gd : join(ROOT, gd);
}

// Opération Git en cours (rebase, merge, cherry-pick) : on ne touche à rien
export function operationEnCours() {
  const gd = gitDir();
  return ["rebase-merge", "rebase-apply", "MERGE_HEAD", "CHERRY_PICK_HEAD"].some((f) => existsSync(join(gd, f)));
}

// Avance / retard par rapport à l'amont ; null si pas d'amont
export function ecart() {
  const r = git(["rev-list", "--left-right", "--count", "HEAD...@{u}"]);
  if (!r.ok) return null;
  const [avance, retard] = r.out.split(/\s+/).map(Number);
  return { avance, retard };
}

// Alerte persistante (dans .git, jamais commitée) : relue et affichée par sync-start au démarrage suivant
const fichierAlerte = () => join(gitDir(), "vault-sync-alerte.txt");
export function alerter(msg) {
  try { appendFileSync(fichierAlerte(), `${horodatage()} [${machine()}] ${msg}\n`); } catch {}
}
export function lireEtEffacerAlertes() {
  try { const t = readFileSync(fichierAlerte(), "utf8").trim(); unlinkSync(fichierAlerte()); return t; } catch { return ""; }
}

// Contrôle des secrets sur le diff indexé : renvoie la liste des fichiers suspects
const MOTIFS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bsk-ant-[A-Za-z0-9_-]{20,}/,            // clé Anthropic
  /\bsk-(proj-)?[A-Za-z0-9]{32,}/,          // clé type OpenAI
  /\bghp_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{40,}/,
  /\bAKIA[0-9A-Z]{16}\b/,                   // AWS
  /\bxox[abprs]-[A-Za-z0-9-]{10,}/,         // Slack
  /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/, // JWT (clé API n8n…)
  /^\s*(password|passwd|mot_de_passe|api[_-]?key|secret|token)\s*[:=]\s*\S{8,}/im,
];
const FICHIERS_INTERDITS = /(^|\/)(\.env(\..*)?|.*\.pem|.*\.key|id_rsa.*|id_ed25519.*|.*\.p12|.*\.pfx)$/i;

// Échec du contrôle (git en erreur, délai dépassé) = suspect : on bloque plutôt que de commiter sans vérifier
export function secretsDansIndex() {
  const suspects = new Set();
  const rNoms = git(["diff", "--cached", "--name-only", "--diff-filter=AM"]);
  if (!rNoms.ok) return ["(contrôle des secrets impossible : liste des fichiers)"];
  const noms = rNoms.out.split("\n").filter(Boolean);
  for (const n of noms) if (FICHIERS_INTERDITS.test(n)) suspects.add(n);
  const rDiff = git(["diff", "--cached", "-U0", "--diff-filter=AM", "--no-color", "--no-ext-diff"], { timeout: 60000 });
  if (!rDiff.ok) return ["(contrôle des secrets impossible : diff)"];
  const diff = rDiff.out;
  let fichier = "";
  for (const ligne of diff.split("\n")) {
    if (ligne.startsWith("+++ b/")) { fichier = ligne.slice(6); continue; }
    if (ligne.startsWith("+") && !ligne.startsWith("+++") && MOTIFS.some((m) => m.test(ligne.slice(1)))) suspects.add(fichier);
  }
  return [...suspects];
}

export function horodatage() {
  const d = new Date(); const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
