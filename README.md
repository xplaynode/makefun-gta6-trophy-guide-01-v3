# Leonida Night Ledger — GTA VI Trophy Guide & Tracker

[![Competition](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/xplaynode/makefun-gta6-trophy-guide-01-v3/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/xplaynode/makefun-gta6-trophy-guide-01-v3/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI,
built for the [gta6-trophy-guide-01 competition on make.fun](https://make.fun/c/gta6-trophy-guide-01).

## What it does

- **Tracker** — every trophy with its official name, description and grade (1 platinum, 2 gold,
  6 silver, 46 bronze; 28 hidden; 1,350 PSN points in total). Progress is saved in the browser
  (localStorage) and can be exported to a file and imported back. Filters by kind (story,
  missable, collectibles, activities, online), grade and status, plus a spoiler setting that
  hides hidden story trophies until they are earned. Every counted trophy has a live counter.
- **Cited guides** — each trophy opens with a short cited answer, then numbered steps; all
  333 steps cite their sources by number, and all 55 guides cite at least one source.
  14 sources were read on 2026-11-20 and are registered in the app with an honest scope note
  and an independence classification for each. Where sources disagree, both versions are shown.
- **Roadmap** — a six-stage route to the platinum whose headline claims (about 200 hours,
  difficulty 4/10, one playthrough, no mission replay, 0 online trophies, 1 possibly missable)
  each carry their own citations, with stage hours and a missable watch list.
- **Missables & timeline** — a point-of-no-return chapter-window timeline showing what closes
  when, plus the possibly-missable / watch / unconfirmed / sources-disagree boxes.
- **Sources & Save view** — spoiler state, a saved-state panel (what is stored, the export
  file name, the last-import receipt), the real exported save JSON, by-grade and by-kind
  progress bars, the source registry and the disagreements register.
- **Audit strip** — the header of every view quantifies the entry: official count, grade
  split, hidden count, guides citing, steps cited, sources read, and the honesty counts.

## Run it

Serve `app/` with any static file server and open `index.html` — no build step, no network:

```sh
node serve.ts          # then open http://localhost:8080
```

Add `?demo=1` to the URL for a pre-populated demo state (14 of 55 earned, counters part-way).

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json` with the
vendored make.fun library (`vendor/makefun-frontend.ts`, unchanged).

## Notes

- All guide wording is original to this entry; facts are cited, never copied. No Rockstar
  logo, official artwork or game screenshots are used — the dark ledger look is our own.
- `TOURNAMENT.md` records the 24 candidate designs and the pairwise tournament that chose
  this entry's shape.
- License: see `LICENSE` (OSI-approved, from the kit starter).
