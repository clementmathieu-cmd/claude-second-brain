"""Génère _index/kanban.md (vue en colonnes, lecture seule) à partir de _index/taches.md.
Lancer depuis la racine du vault : python -I .claude/skills/demarrer/kanban.py"""
import io, re, datetime

SRC, DST = "_index/taches.md", "_index/kanban.md"
COLS = [("À faire", "À faire (Claude)"), ("À décider", "À décider (moi)"),
        ("En attente", "En attente d'un tiers"), ("Plus tard", "Plus tard")]
ITEM = re.compile(r"^- \[ \] \*\*([A-Za-z0-9]+)\*\* (?:\(cette semaine\) )?(.*)$")


def court(texte, n=8):
    mots = texte.split(" · ")[0].split()
    return " ".join(mots[:n]) + (" …" if len(mots) > n else "")


semaine, projets, h2, col = [], {}, None, None
for ligne in io.open(SRC, encoding="utf-8").read().split("\n"):
    if ligne.startswith("## "):
        h2, col = ligne[3:].strip(), None
        continue
    if ligne.startswith("### "):
        col = next((c for c, _ in COLS if ligne[4:].startswith(c)), None)
        continue
    m = ITEM.match(ligne)
    if not m or not h2:
        continue
    cell = f"**{m[1]}** {court(m[2])}"
    if h2.startswith("Cette semaine"):
        semaine.append(f"- [ ] {cell} · {' · '.join(m[2].split(' · ')[1:3])}")
    elif col:
        projets.setdefault(h2, {c: [] for c, _ in COLS})[col].append(cell)

out = ["# Kanban des tâches (vue générée)", "",
       f"> Généré le {datetime.date.today():%Y-%m-%d} par `.claude/skills/demarrer/kanban.py` depuis [[_index/taches]]. "
       "Ne pas éditer ici : modifier le registre, puis relancer le script.", "",
       f"## Cette semaine ({len(semaine)})", *semaine, ""]
for p, cols in projets.items():
    out += [f"## {p}", "", "| " + " | ".join(f"{t} ({len(cols[c])})" for c, t in COLS) + " |",
            "|" + "---|" * len(COLS)]
    hauteur = max(len(v) for v in cols.values())
    for i in range(hauteur):
        out.append("| " + " | ".join(cols[c][i] if i < len(cols[c]) else "" for c, _ in COLS) + " |")
    out.append("")
out += ["Tags : #type/index #domain/meta #status/in-progress", ""]
io.open(DST, "w", encoding="utf-8").write("\n".join(out))
print(DST, ":", len(semaine), "cette semaine,", sum(len(v) for c in projets.values() for v in c.values()), "cartes")
