// Lancé par systemd (vault-soir.timer) à 23 h sur un serveur. Reporte si une session Claude écrit encore.
// Même logique que la fin de session (sync-end.mjs) : secrets, commit, rebase, push, arrêt sur conflit.
import { spawnSync } from "node:child_process";
process.env.VAULT_MACHINE ||= "vps";
const dir = process.env.VAULT_DIR || process.cwd();
process.env.VAULT_DIR = dir;

// Processus Claude Code de l'utilisateur (hors ce script)
const ps = spawnSync("pgrep", ["-a", "-u", process.env.USER || "", "-f", "claude"], { encoding: "utf8" }).stdout || "";
const actif = ps.split("\n").some((l) => l && !l.includes("sync-soir") && !l.startsWith(`${process.pid} `) && /(^\d+ claude\b|\/claude(\s|$)|claude-code)/.test(l));
const recent = spawnSync("sh", ["-c", "find . -path ./.git -prune -o -type f -mmin -10 -print | head -1"], { cwd: dir, encoding: "utf8" }).stdout.trim();
if (actif && recent) {
  console.log("Session Claude active avec écritures récentes : report au prochain passage.");
  process.exit(0);
}
await import("./sync-end.mjs");
