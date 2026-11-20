# Tournament — how this entry's shape was chosen

Entry: **Leonida Night Ledger** (gta6-trophy-guide-01, v3). Author: Agent Lucky, in the recorded build session, 2026-11-20.

Before any app code was written, 24 candidate angles/structures were generated and run through a
pairwise tournament scored against the kit's judge rubric, in the rubric's own priority order:

1. Tracker + data (official name/description/grade for all 55, saved progress, kind/grade/status
   filters, spoiler shield for story trophies, export/import) — weighted first.
2. Roadmap + missables built from the official descriptions (chapters, counts, order).
3. Cited guidance — every specific cited by source number; no credit for uncited specifics.
4. Speed, clarity, polish — readable at a glance when the dossier sheet shrinks the cover.

## The 24 candidates

| # | Candidate | Look | Layout | Differentiator |
|---|-----------|------|--------|----------------|
| 1 | Leonida Night Ledger | Dark navy + neon aqua, ledger rules | 3 panes: stage checklist / guide / source register | Audit strip + short cited answer first + point-of-no-return timeline |
| 2 | Sunledger Atlas II | Light paper, gold leaf | 3 panes like v2 | v2 refined; loses on cover contrast at shrink size |
| 3 | Vice Postcard | Retro postcard pastels | Card grid, modal guide | Pretty, but guide text is two clicks away |
| 4 | Palm-Reader | Tarot / fortune-teller violet | Card fan + detail drawer | Novel; weak tracker affordances |
| 5 | Dispatch Desk | Police-dispatch mono green | Table-first, dense rows | Fast, but screenshots read as a spreadsheet |
| 6 | Marina Logbook | Nautical logbook cream/teal | Book pages, one trophy per page | Slow to scan 55 trophies |
| 7 | Neon Mile | Synthwave magenta grid | Horizontal stage timeline, cards below | Roadmap strong, checklist weak |
| 8 | The Ledger Line | Newspaper broadsheet | Columns of print, sidebar index | Text-dense; poor at 768px shrink |
| 9 | Cartel Ledger | Stark black/red account book | 2 panes + bottom source strip | Sources demoted to a strip; rubric 3 suffers |
| 10 | Boardwalk Atlas | Map-first, pins per region | Map + side list | No real map data to show; decoration only |
| 11 | Static Bloom | Soft gradient glass | Single column feed | Filters and counters buried |
| 12 | Trophy Case | Glass cabinet, shelf rows | Shelf grid + plaque modal | Earned state reads well; guides hidden in modals |
| 13 | Night Ledger Mini | Dark, compact, one pane | Accordion list, inline guides | Great on mobile; cramped for sources column |
| 14 | Route 55 Diner | Roadside-diner chrome/red | Menu-board stages, ticket detail | Charm high; audit strip hard to fit |
| 15 | The Auditor | Terminal green-on-black | CLI-style panes | Audit strip native; type too small at shrink |
| 16 | Leonida Ledger (plain) | Dark slate, no timeline | 3 panes, no audit strip | Floor shape of the field; no beat-it axis |
| 17 | Sunline Calm | Pale calm single pane | One calm guide pane + rail | Calm, but tracker is secondary |
| 18 | Evidence Board | Corkboard + string | Pinned cards, yarn links | Disagreements visual; checklist order unclear |
| 19 | Vault Book | Bank-vault brass/dark | Ledger + vault-door roadmap | Heavy chrome, slow first load |
| 20 | Two-Character Split | Jason blue / Lucia pink halves | Split-screen duo checklist | Duo idea strong; halves duplicate the list |
| 21 | Radio Leonida | Radio dial + station presets | Dial stages, playlist trophies | Filters map badly to presets |
| 22 | The Long Ledger | Dark navy, audit-first | Audit strip hero, 3 panes, timeline view | Same family as #1, audit even louder |
| 23 | Paper Trail | Court-file manila | Folder tabs per stage | Export/JSON proof fits; contrast weak |
| 24 | Minimal Slate | Grey minimal | List + detail, no register | Fails rubric 3 (citations not visible) |

## Tournament

Round of 24 → 12 (head-to-head on rubric order; first differing criterion decides):
1 beat 24 (citations visible), 22 beat 2 (cover contrast), 16 beat 9 (source register as a pane,
not a strip), 9's strip idea was absorbed by nobody; 3 beat 11, 15 beat 6, 12 beat 20,
5 beat 18, 7 beat 21, 14 beat 4, 10 beat 23, 13 beat 8, 17 beat 19.

Quarter-finals: 1 beat 3 (guide beside checklist beats modal), 22 beat 16 (timeline + audit
strip), 15 beat 12 (real tracker rows beat shelf modal), 7 beat 5 (roadmap clarity),
13 beat 14 (inline guides beat ticket modal), 17 beat 10 (real data beats decorative map).

Semi-finals: 1 beat 15 (readable type at shrink beats terminal density), 22 beat 7 (tracker
first, roadmap second — 7 inverted the rubric), 1 beat 13 (three panes beat one at desktop
1280×800), 22 beat 17 (tracker + register beat calm single pane).

Final: **1 beat 22** — same family; #1 wins because its audit strip quantifies the entry
without pushing the checklist below the fold, and its fourth view (Sources & Save) gives the
export-JSON proof and disagreement register their own screenshot, which #22 folded into the
guide pane where the judge's sheet would shrink them away.

## Winner: #1 — Leonida Night Ledger

Dark navy ledger, neon-aqua rules, three panes in the Guide view (stage-grouped checklist,
guide pane with a SHORT cited answer before numbered cited steps, numbered source register),
plus three further views: Roadmap (every headline claim individually cited, stage hours,
watch list), Missables (point-of-no-return chapter-window timeline + the four honesty boxes),
and Sources & Save (spoiler state, saved-state panel with real exported JSON, by-grade and
by-kind progress bars, source registry with independence classes, disagreements register).
An audit strip under the header quantifies the whole entry on every view.
