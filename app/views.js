// Leonida Night Ledger — the three secondary views: Roadmap, Missables & Timeline,
// and Sources & Save. Each renders from the same data files and the live saved state,
// so progress bars, chips and receipts always reflect the tracker.
import { trophies, meta, state, isEarned, counterOf, citeChips, withCites, exportPayload, EXPORT_FILE_NAME, SAVE_KEY } from './app.js';

function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function trophyChips(list) {
  return `<div class="trophy-chips">${list.map((t) =>
    `<span class="tchip ${isEarned(t) ? 'done' : ''}">${esc(t.name)}${t.count ? ` ${counterOf(t)}/${t.count.total}` : ''}</span>`).join('')}</div>`;
}

export function renderRoadmapView() {
  const claims = meta.roadmapClaims.map((c) =>
    `<div class="claim"><span class="claim-value">${esc(c.value)}</span>${esc(c.claim)} ${citeChips(c.c)}` +
    `${c.note ? `<span class="claim-note">${esc(c.note)}</span>` : ''}</div>`).join('');
  const stages = meta.stages.map((s) => {
    const inStage = trophies.filter((t) => t.stage === s.n);
    const done = inStage.filter(isEarned).length;
    return `<div class="card"><h2>Stage ${s.n} — ${esc(s.name.split('— ')[1] ?? s.name)}</h2>` +
      `<p class="meta-line">Hours: <b>${esc(s.hours)}</b> · Progress: <b>${done}/${inStage.length} earned</b></p>` +
      `<p>${esc(s.text)}</p>${trophyChips(inStage)}</div>`;
  }).join('');
  const watch = meta.watchList.map((w) =>
    `<tr><td><b>${esc(w.name)}</b></td><td>${esc(w.why)} ${citeChips(w.c)}</td></tr>`).join('');
  document.getElementById('view-roadmap').innerHTML =
    `<h2>Roadmap to the platinum — every headline claim cited</h2>` +
    `<div class="claims">${claims}</div>` +
    `<div class="view-grid">${stages}</div>` +
    `<div class="card" style="margin-top:14px"><h2>Missable watch list — keep an eye on these while you play</h2>` +
    `<table class="ledger"><thead><tr><th>Watch item</th><th>Why</th></tr></thead><tbody>${watch}</tbody></table>` +
    `<p class="kv">Ground rules: keep a manual save at the start and end of every chapter (the game has 15 manual slots and no mission replay) ${citeChips([1])}; ` +
    `never use cheats on a trophy run — they disable trophies and saving ${citeChips([1, 12])}; do optional missions as they appear, since progress counts toward the checklist from the start ${citeChips([1, 2])}.</p></div>`;
}

export function renderMissablesView() {
  const timeline = meta.timeline.map((row) =>
    `<tr><td><b>${esc(row.window)}</b></td><td>${esc(row.locksAt)}</td><td>${esc(row.closes)} ${citeChips(row.c)}</td></tr>`).join('');
  const possible = trophies.filter((t) => t.missable === 'possible');
  const watch = trophies.filter((t) => t.missable === 'watch');
  const unconfirmed = trophies.filter((t) => t.confidence === 'unconfirmed');
  const disagree = trophies.filter((t) => t.confidence === 'sources-disagree');
  const listOf = (list, empty) => list.length
    ? `<ul>${list.map((t) => `<li><b>${esc(t.name)}</b> — ${withCites(esc(t.short))}</li>`).join('')}</ul>`
    : `<p>${empty}</p>`;
  document.getElementById('view-missables').innerHTML =
    `<h2>Point-of-no-return timeline — what closes, and when</h2>` +
    `<div class="card"><table class="ledger"><thead><tr><th>Chapter window</th><th>Locks at</th><th>What closes (or opens)</th></tr></thead><tbody>${timeline}</tbody></table></div>` +
    `<div class="view-grid" style="margin-top:14px">` +
    `<div class="card"><h2>Possibly missable (${possible.length})</h2>${listOf(possible, 'None.')}</div>` +
    `<div class="card"><h2>Watch (${watch.length})</h2>${listOf(watch, 'None.')}</div>` +
    `<div class="card"><h2>Unconfirmed (${unconfirmed.length})</h2>${listOf(unconfirmed, 'None.')}</div>` +
    `<div class="card"><h2>Sources disagree (${disagree.length})</h2>${listOf(disagree, 'None.')}</div>` +
    `</div>` +
    `<div class="card" style="margin-top:14px"><h2>Cleared — everything else</h2>` +
    `<p>Every other trophy is earnable in post-story free-roam: all trophy quest givers return after the credits, and nothing on the 100% checklist is missable ${citeChips([1, 6])}. ` +
    `Two permanent non-trophy traps remain: cheats disable trophies and saving for the session ${citeChips([1, 12])}, and the Irredeemable criminal profile can never be undone ${citeChips([1, 7])}.</p></div>`;
}

function progressBars(groups) {
  return groups.map(([label, done, total]) => {
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return `<div class="bar-row"><span class="bar-label">${esc(label)}</span>` +
      `<span class="bar-track"><span class="bar-fill" style="display:block;width:${pct}%"></span></span>` +
      `<span class="bar-num">${done}/${total}</span></div>`;
  }).join('');
}

export function renderSourcesView() {
  const citedBy = new Map(meta.sources.map((s) => [s.n, 0]));
  for (const t of trophies) for (const n of t.sources) citedBy.set(n, (citedBy.get(n) ?? 0) + 1);
  const registry = meta.sources.map((s) =>
    `<tr><td>${s.n}</td><td><b>${esc(s.name)}</b><br><a href="${esc(s.url)}" rel="noopener" style="color:var(--aqua)">${esc(s.url)}</a></td>` +
    `<td>${esc(s.usedFor)}</td><td>${esc(s.independence)}</td><td>${esc(s.scope)}</td><td>${citedBy.get(s.n)} of 55</td></tr>`).join('');
  const disagreements = meta.disagreements.map((d) =>
    `<tr><td><b>${esc(d.topic)}</b></td><td>${esc(d.a)} ${citeChips(d.aSrc)}</td><td>${esc(d.b)} ${citeChips(d.bSrc)}</td><td>${esc(d.kept)}</td></tr>`).join('');
  const gradeGroups = ['platinum', 'gold', 'silver', 'bronze'].map((g) => [
    g[0].toUpperCase() + g.slice(1),
    trophies.filter((t) => t.grade === g && isEarned(t)).length,
    trophies.filter((t) => t.grade === g).length,
  ]);
  const kindGroups = ['story', 'missable', 'collectibles', 'activities', 'online'].map((k) => [
    k[0].toUpperCase() + k.slice(1),
    trophies.filter((t) => t.kind === k && isEarned(t)).length,
    trophies.filter((t) => t.kind === k).length,
  ]);
  const receipt = state.lastImport
    ? `Last import: <b>${esc(state.lastImport.file)}</b> at ${esc(state.lastImport.at)} — ${state.lastImport.earned} trophies earned after import.`
    : 'Last import: none yet in this browser.';
  document.getElementById('view-sources').innerHTML =
    `<div class="view-grid">` +
    `<div class="card"><h2>Spoiler state</h2><p class="kv">Spoiler shield: <b>${state.spoilersHidden ? 'ON — story trophies hidden until earned' : 'OFF — all names and descriptions shown'}</b>. ` +
    `${trophies.filter((t) => t.hidden).length} of the 55 trophies are hidden on PSN until earned; the shield covers the hidden story trophies in the checklist and Next Up queue.</p></div>` +
    `<div class="card"><h2>Saved state — what is stored</h2><p class="kv">Stored in localStorage under the key <b>${SAVE_KEY}</b>: the earned trophy ids (${state.earned.length} earned), ` +
    `the per-trophy counters (${Object.keys(state.counters).length} counters set), the spoiler setting and the last-import receipt. Export file name: <b>${EXPORT_FILE_NAME}</b>. ` +
    `Last saved: <b>${esc(state.savedAt ?? 'not yet')}</b>. ${receipt}</p></div>` +
    `<div class="card"><h2>Progress by grade</h2>${progressBars(gradeGroups)}</div>` +
    `<div class="card"><h2>Progress by kind</h2>${progressBars(kindGroups)}</div>` +
    `</div>` +
    `<div class="card" style="margin-top:14px"><h2>Your exported save — the real JSON the Export button downloads</h2>` +
    `<pre class="json-view">${esc(JSON.stringify(exportPayload(), null, 2))}</pre></div>` +
    `<div class="card" style="margin-top:14px"><h2>Source registry — read ${esc(meta.readDate)}</h2>` +
    `<table class="ledger"><thead><tr><th>#</th><th>Source</th><th>Used for</th><th>Counts as</th><th>Scope read</th><th>Guides citing</th></tr></thead><tbody>${registry}</tbody></table></div>` +
    `<div class="card" style="margin-top:14px"><h2>Where sources disagree — both versions kept</h2>` +
    `<table class="ledger"><thead><tr><th>Topic</th><th>Version A</th><th>Version B</th><th>What this guide does</th></tr></thead><tbody>${disagreements}</tbody></table></div>`;
}
