# claude-second-brain

A Markdown knowledge base run with [Claude Code](https://claude.com/claude-code), synced between several machines through Git.

I'm a small agency owner and a business student. I use this setup every day to run client projects, content, studies and personal notes from one vault, on a Windows PC and a Linux server. This repository is the generic layer of that setup: no personal notes, no client data. The skill and rule files are in French because that's how I use them; this README is in English.

## What's inside

| Path | What it does |
|---|---|
| `CLAUDE.md` | Project instructions: how Claude should read, plan, ask, write and index in the vault |
| `.claude/rules/` | Folder-scoped rules, loaded only when Claude touches matching files (`connaissance/`, `pro/`, `_index/`) |
| `.claude/skills/demarrer` | `/demarrer`: start a session. Reads sync status, recent changes, this week's tasks, pending handoffs, then proposes a plan. Includes `kanban.py`, which turns the task list into a read-only column view |
| `.claude/skills/cloturer` | `/cloturer`: close a session. Updates indexes, the recent log, the journal and tasks, and writes a handoff file if the work isn't finished |
| `.claude/skills/reprendre` | `/reprendre`: resume a task that was cut off (usage limit, closed session, other machine) without redoing finished steps |
| `.claude/agents/` | Four subagents: `indexeur` (the only writer of index files), `reprise-projet` (rebuilds a project's state from Git history and notes), `traiteur-source` (turns a raw source into vault pages without duplicates), `verif-sources` (fact-checks a page before publication) |
| `.claude/hooks/` | Git sync and guardrails, in Node.js, no dependencies (details below) |
| `_index/` | Master index, per-folder indexes, recent log, monthly journal, task register, handoff folder |
| `templates/` | Note templates (concept, source, synthesis) |

## The sync hooks

The part I'd most like others to reuse. Two or more machines work on the same vault, and nobody runs Git by hand.

- **Session start** (`sync-start.mjs`): fetches, fast-forwards if it's safe, and never rebases or merges on its own. If the copies have diverged, a rebase is in progress, or the last push failed, Claude gets an `ALERTE SYNCHRO` message and must report it before changing anything.
- **Session end** (`sync-end.mjs`): commits everything, **scans the staged diff for secrets** (private keys, Anthropic/OpenAI/GitHub/AWS/Slack tokens, JWTs, `password=` lines, `.env` and key files) and refuses to commit if it finds one. Then it rebases on the remote if needed, aborts cleanly on conflict, and pushes. It never force-pushes.
- **Evening timer** (`sync-soir.mjs` plus a systemd unit): same as session end, for an always-on server. It postpones if a Claude session is still writing.
- **Guards**: `garde-git.mjs` blocks destructive Git commands (force push, `reset --hard`, `clean -f`, `filter-repo`, tag deletion); `garde-index.mjs` blocks full rewrites of the shared log files, so Claude must use targeted edits.
- `.gitattributes` sets `merge=union` on the append-only logs, so two machines adding a line at the same time don't conflict.

Failures are written to `.git/vault-sync-alerte.txt` (never committed) and shown at the next session start.

Environment variables: `VAULT_SYNC=off` disables sync for a session, `VAULT_DRY_RUN=1` shows what would be committed, `VAULT_MACHINE` names the machine in commit messages and logs, `VAULT_GIT_MANUEL=1` lifts the Git guard for manual work.

## Setup

1. Use this repository as a template, or copy it, then make it a **private** repository: your vault will hold personal notes.
2. Install Node.js 18+ and Claude Code on each machine, clone the vault and set an upstream (`git branch -u origin/main`).
3. Open the folder with Claude Code. The hooks in `.claude/settings.json` run on their own.
4. Optional, on a server: copy `.claude/hooks/systemd/vault-soir.*` to `~/.config/systemd/user/`, fix the paths, then `systemctl --user enable --now vault-soir.timer`.
5. Edit `CLAUDE.md`: your language, your folders, your closed list of domains.

## Conventions in short

- Three roots by use: `connaissance/` (knowledge, sourced, no duplicates), `pro/` (one folder per project, each with its own `instructions.md`), `perso/`.
- Every note has a 3-line summary, `#type/` and `#status/` tags, and full-path wiki links.
- Theory lives in `connaissance/`; projects link to it instead of copying it.
- Claude never invents figures or sources, marks unverified facts as "à vérifier", and keeps "decided by me" separate from "recommended by Claude".

## Status

Extracted from my working vault in October 2026 and cleaned for publication. The hooks and skills are the ones I run daily; the folder skeleton and examples are new. Issues and pull requests are welcome.

## License

MIT
