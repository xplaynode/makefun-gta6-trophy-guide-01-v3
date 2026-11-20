// Leonida Night Ledger — guide & tracker core.
// Loads the trophy data and the meta data (sources, roadmap, timeline), renders the
// three-pane guide view, and owns the saved state: earned trophies, per-trophy counters
// and the spoiler setting, persisted in localStorage and exportable/importable as a file.
import { renderRoadmapView, renderMissablesView, renderSourcesView } from './views.js';

export const SAVE_KEY = 'leonida-night-ledger-v3';
export const EXPORT_FILE_NAME = 'leonida-night-ledger-save.json';

const trophyDoc = await (await fetch('data/trophies.json')).json();
const metaDoc = await (await fetch('data/meta.json')).json();
export const trophies = trophyDoc.trophies;
export const meta = metaDoc;
export const byId = new Map(trophies.map((t) => [t.id, t]));

const DEMO_EARNED = [2, 3, 4, 5, 8, 16, 20, 21, 23, 28, 35, 38, 44, 54];
const DEMO_COUNTERS = { 15: 137, 17: 19, 25: 3, 28: 18, 30: 1, 31: 47, 32: 22, 42: 21, 48: 212, 52: 85000, 53: 42000, 55: 4 };

export let state = loadState();
let selectedId = 28;
let currentView = 'guide';

function freshState() {
  return { earned: [], counters: {}, spoilersHidden: true, savedAt: null, lastImport: null };
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.earned) && typeof parsed.counters === 'object') return parsed;
    }
  } catch { /* a corrupt save falls through to a fresh or demo state */ }
  const seeded = freshState();
  if (new URLSearchParams(location.search).has('demo')) {
    seeded.earned = [...DEMO_EARNED];
    seeded.counters = { ...DEMO_COUNTERS };
    seeded.savedAt = 'demo state (pre-populated for screenshots)';
  }
  return seeded;
}

export function persistState() {
  state.savedAt = new Date().toISOString();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  updateHeader();
}

export function isEarned(t) { return state.earned.includes(t.id); }
export function counterOf(t) { return state.counters[t.id] ?? 0; }
export function isSpoilerHidden(t) {
  return state.spoilersHidden && t.kind === 'story' && t.hidden && !isEarned(t);
}

export function exportPayload() {
  return {
    app: 'Leonida Night Ledger',
    version: 3,
    exportedAt: new Date().toISOString(),
    earned: [...state.earned].sort((a, b) => a - b),
    counters: state.counters,
    spoilersHidden: state.spoilersHidden,
  };
}

function updateHeader() {
  const earnedCount = state.earned.length;
  const points = trophies.filter(isEarned).reduce((sum, t) => sum + t.points, 0);
  document.getElementById('progress-line').textContent = `${earnedCount} of ${trophies.length} earned`;
  document.getElementById('points-line').textContent = `${points.toLocaleString('en-US')} / 1,350 PSN points`;
  document.getElementById('saved-note').textContent =
    `Saved in this browser (localStorage, key ${SAVE_KEY})${state.savedAt ? ` — last saved ${state.savedAt}` : ''}`;
}

export function auditStats() {
  const grades = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  let steps = 0; let citedSteps = 0;
  for (const t of trophies) {
    grades[t.grade] += 1;
    for (const s of t.steps) { steps += 1; if (s.c && s.c.length > 0) citedSteps += 1; }
  }
  return {
    total: trophies.length,
    grades,
    hidden: trophies.filter((t) => t.hidden).length,
    guidesCiting: trophies.filter((t) => t.sources.length > 0).length,
    steps, citedSteps,
    sourcesRead: meta.sources.length,
    possiblyMissable: trophies.filter((t) => t.missable === 'possible').length,
    watch: trophies.filter((t) => t.missable === 'watch').length,
    unconfirmed: trophies.filter((t) => t.confidence === 'unconfirmed').length,
    disagree: trophies.filter((t) => t.confidence === 'sources-disagree').length,
    points: trophies.reduce((sum, t) => sum + t.points, 0),
  };
}

function renderAuditStrip() {
  const a = auditStats();
  document.getElementById('audit-strip').textContent =
    `AUDIT — ${a.total} official · ${a.grades.platinum}P ${a.grades.gold}G ${a.grades.silver}S ${a.grades.bronze}B · ` +
    `${a.hidden} hidden · ${a.guidesCiting}/${a.total} guides cite a source · ${a.citedSteps}/${a.steps} steps cited · ` +
    `${a.sourcesRead} sources read ${meta.readDate} · ${a.possiblyMissable} possibly missable · ${a.watch} watch · ` +
    `${a.unconfirmed} unconfirmed · ${a.disagree} disagree · ${a.points.toLocaleString('en-US')} PSN points`;
}

export function citeChips(numbers) {
  return numbers.map((n) => `<a class="cite" href="#sources" data-goto="sources" title="Source ${n}">[${n}]</a>`).join('');
}

export function withCites(text) {
  return text.replace(/\[(\d+)\]/g, (m, n) => citeChips([Number(n)]));
}

function esc(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function trophyMetaLine(t) {
  const bits = [
    `Kind: <b>${t.kind}</b>`,
    `Stage ${t.stage}`,
    `~${t.minutes.toLocaleString('en-US')} min`,
    `${t.points} PSN pts`,
    `Confidence: <b>${t.confidence}</b>`,
  ];
  if (t.count) bits.push(`Count: <b>${t.count.label} ${t.count.total.toLocaleString('en-US')}${t.count.unit}</b>`);
  return bits.join(' · ');
}

function renderChecklist() {
  const search = document.getElementById('search-box').value.trim().toLowerCase();
  const kind = document.getElementById('kind-filter').value;
  const grade = document.getElementById('grade-filter').value;
  const status = document.getElementById('status-filter').value;
  const wrap = document.getElementById('checklist');
  const parts = [];
  for (const stage of meta.stages) {
    const inStage = trophies.filter((t) => t.stage === stage.n);
    const visible = inStage.filter((t) => {
      if (kind !== 'all' && t.kind !== kind) return false;
      if (grade !== 'all' && t.grade !== grade) return false;
      if (status === 'earned' && !isEarned(t)) return false;
      if (status === 'open' && isEarned(t)) return false;
      if (search && !t.name.toLowerCase().includes(search) && !t.description.toLowerCase().includes(search)) return false;
      return true;
    });
    if (visible.length === 0) continue;
    const done = inStage.filter(isEarned).length;
    parts.push(`<div class="stage-head"><span>Stage ${stage.n} — ${esc(stage.name.split('— ')[1] ?? stage.name)}</span><span class="stage-count">${done}/${inStage.length}</span></div>`);
    for (const t of visible) {
      const hiddenName = isSpoilerHidden(t);
      const name = hiddenName ? 'Hidden trophy (spoiler shield on)' : esc(t.name);
      const desc = hiddenName ? 'Name and description hidden until earned.' : esc(t.description);
      const flags = [
        t.missable === 'possible' ? '<span class="flag flag-miss">POSSIBLY MISSABLE</span>' : '',
        t.missable === 'watch' ? '<span class="flag flag-watch">WATCH</span>' : '',
        t.hidden ? '<span class="flag flag-hidden">HIDDEN</span>' : '',
        t.confidence === 'unconfirmed' ? '<span class="flag flag-watch">UNCONFIRMED</span>' : '',
        t.confidence === 'sources-disagree' ? '<span class="flag flag-watch">SOURCES DISAGREE</span>' : '',
      ].join(' ');
      const counter = t.count ? `<span class="t-meta">${esc(t.count.label)}: ${counterOf(t).toLocaleString('en-US')}/${t.count.total.toLocaleString('en-US')}${esc(t.count.unit)}</span>` : '';
      parts.push(
        `<div class="trophy-row ${t.id === selectedId ? 'selected' : ''}" data-select="${t.id}">` +
        `<input type="checkbox" data-earn="${t.id}" ${isEarned(t) ? 'checked' : ''} aria-label="Mark ${esc(t.name)} earned">` +
        `<span class="grade-chip grade-${t.grade}">${t.grade}</span>` +
        `<span><span class="t-name ${hiddenName ? 'spoiler-name' : ''}">${name}</span>` +
        `<span class="t-desc">${desc}</span>${counter}<span class="t-meta">${flags}</span></span></div>`,
      );
    }
  }
  wrap.innerHTML = parts.join('') || '<p>No trophies match the current filters.</p>';
  const next = trophies.filter((t) => !isEarned(t)).slice(0, 5);
  document.getElementById('next-up').innerHTML =
    `<h3>Next up — roadmap order</h3><ol>${next.map((t) => `<li>${isSpoilerHidden(t) ? 'Hidden trophy' : esc(t.name)} (Stage ${t.stage})</li>`).join('')}</ol>`;
}

function countIndependentSources(t) {
  const counts = { independent: 0, shared: 0, aggregator: 0 };
  for (const n of t.sources) {
    const source = meta.sources.find((s) => s.n === n);
    if (!source) continue;
    if (source.independence.startsWith('independent')) counts.independent += 1;
    else if (source.independence.startsWith('shares')) counts.shared += 1;
    else counts.aggregator += 1;
  }
  return counts;
}

function disagreementFor(t) {
  return meta.disagreements.find((d) => d.topic.includes(t.name));
}

function renderGuidePane() {
  const t = byId.get(selectedId);
  const pane = document.getElementById('guide-pane');
  const hiddenName = isSpoilerHidden(t);
  const parts = [];
  parts.push(`<h2>${hiddenName ? 'Hidden trophy (spoiler shield on)' : esc(t.name)}</h2>`);
  parts.push(`<p class="official-desc">${hiddenName ? 'Official name and description hidden until earned.' : esc(t.description)}</p>`);
  parts.push(`<p class="meta-line"><span class="grade-chip grade-${t.grade}">${t.grade}</span> ${trophyMetaLine(t)}</p>`);
  parts.push(`<label class="earned-toggle"><input type="checkbox" data-earn="${t.id}" ${isEarned(t) ? 'checked' : ''}> Earned</label>`);
  if (t.count) {
    parts.push(
      `<div class="counter-box"><span>Counter — ${esc(t.count.label)}:</span>` +
      `<button type="button" data-count="-1">−</button>` +
      `<span class="counter-value">${counterOf(t).toLocaleString('en-US')} / ${t.count.total.toLocaleString('en-US')}${esc(t.count.unit)}</span>` +
      `<button type="button" data-count="1">+</button>` +
      `<button type="button" data-count="set">Set to total</button></div>`,
    );
  }
  if (t.missable === 'possible') {
    parts.push(`<div class="box box-missable"><h3>Missable warning</h3><p>This is the game's one possibly missable trophy. The Chapter 1 balcony meditation at Jason's house becomes permanently unavailable at the end of Chapter 1 — do it before the chapter closes ${citeChips([1, 13])}.</p></div>`);
  }
  if (t.missable === 'watch') {
    parts.push(`<div class="box box-watch"><h3>Watch — not missable, but start it on time</h3><p>One secondary report claims stranger chains have story-linked windows ${citeChips([5])}; the fuller guide says every quest giver returns after the story ${citeChips([1])}. Both claims are kept in the disagreements register; starting the chain when it unlocks is the safe play.</p></div>`);
  }
  const dis = disagreementFor(t);
  if (dis) {
    parts.push(`<div class="box box-disagree"><h3>Sources disagree — both versions shown</h3><p><b>Version A:</b> ${esc(dis.a)} ${citeChips(dis.aSrc)}</p><p><b>Version B:</b> ${esc(dis.b)} ${citeChips(dis.bSrc)}</p><p>${esc(dis.kept)}</p></div>`);
  }
  parts.push(`<div class="box box-short"><h3>In short — the cited answer first</h3><p>${withCites(esc(t.short))}</p></div>`);
  parts.push(`<h3>Steps</h3><ol class="steps">${t.steps.map((s) => `<li>${esc(s.t)} ${citeChips(s.c)}</li>`).join('')}</ol>`);
  parts.push(`<h3>Guide</h3><p class="guide-text">${esc(t.guide)}</p>`);
  const independence = countIndependentSources(t);
  parts.push(`<p class="meta-line">Guide sources: ${t.sources.map((n) => `source ${n}`).join(', ')} — see the register on the right, or the Sources &amp; Save view. ` +
    `Corroboration: ${independence.independent} independent witness(es), ${independence.shared} sharing a witness, ${independence.aggregator} aggregator(s) — aggregators never count as confirmation.</p>`);
  pane.innerHTML = parts.join('');
}

function renderRegister() {
  const citedBy = new Map(meta.sources.map((s) => [s.n, 0]));
  for (const t of trophies) for (const n of t.sources) citedBy.set(n, (citedBy.get(n) ?? 0) + 1);
  document.getElementById('source-register').innerHTML = meta.sources.map((s) =>
    `<li value="${s.n}"><span class="src-name">${esc(s.name)}</span>` +
    `<span class="src-meta">${esc(s.scope)} · ${esc(s.independence)} · cited by ${citedBy.get(s.n)} of 55 guides</span>` +
    `<a href="${esc(s.url)}" rel="noopener">${esc(s.url)}</a></li>`,
  ).join('');
}

function renderAll() {
  updateHeader();
  renderAuditStrip();
  renderChecklist();
  renderGuidePane();
  renderRegister();
  renderRoadmapView();
  renderMissablesView();
  renderSourcesView();
}

function switchView(name) {
  currentView = name;
  for (const tab of document.querySelectorAll('#view-tabs .tab')) {
    tab.classList.toggle('active', tab.dataset.view === name);
  }
  for (const section of document.querySelectorAll('main .view')) {
    section.hidden = section.id !== `view-${name}`;
  }
  if (location.hash !== `#${name}`) history.replaceState(null, '', `#${name}`);
}

document.getElementById('view-tabs').addEventListener('click', (event) => {
  const tab = event.target.closest('[data-view]');
  if (tab) switchView(tab.dataset.view);
});
document.getElementById('spoiler-toggle').addEventListener('change', (event) => {
  state.spoilersHidden = event.target.checked;
  persistState();
  renderAll();
});
for (const id of ['search-box', 'kind-filter', 'grade-filter', 'status-filter']) {
  document.getElementById(id).addEventListener('input', renderChecklist);
}
document.getElementById('export-btn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(exportPayload(), null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = EXPORT_FILE_NAME;
  link.click();
  URL.revokeObjectURL(link.href);
});
document.getElementById('import-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.earned) || typeof data.counters !== 'object') throw new Error('not a Night Ledger save');
    state.earned = data.earned.filter((id) => byId.has(id));
    state.counters = data.counters;
    state.spoilersHidden = data.spoilersHidden !== false;
    state.lastImport = { file: file.name, at: new Date().toISOString(), earned: state.earned.length };
    document.getElementById('spoiler-toggle').checked = state.spoilersHidden;
    persistState();
    renderAll();
  } catch {
    document.getElementById('saved-note').textContent = `Import failed: ${file.name} is not a valid Night Ledger save file.`;
  }
});
document.querySelector('main').addEventListener('click', (event) => {
  const goto = event.target.closest('[data-goto]');
  if (goto) { switchView(goto.dataset.goto); return; }
  const row = event.target.closest('[data-select]');
  if (row && !event.target.matches('input')) {
    selectedId = Number(row.dataset.select);
    renderChecklist();
    renderGuidePane();
    return;
  }
  const countBtn = event.target.closest('[data-count]');
  if (countBtn) {
    const t = byId.get(selectedId);
    if (t && t.count) {
      const action = countBtn.dataset.count;
      const current = counterOf(t);
      const next = action === 'set' ? t.count.total : Math.max(0, Math.min(t.count.total, current + Number(action)));
      state.counters[t.id] = next;
      persistState();
      renderChecklist();
      renderGuidePane();
    }
  }
});
document.querySelector('main').addEventListener('change', (event) => {
  const box = event.target.closest('[data-earn]');
  if (!box) return;
  const id = Number(box.dataset.earn);
  if (box.checked && !state.earned.includes(id)) state.earned.push(id);
  if (!box.checked) state.earned = state.earned.filter((x) => x !== id);
  persistState();
  renderAll();
});

const initialView = ['guide', 'roadmap', 'missables', 'sources'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'guide';
renderAll();
switchView(initialView);
