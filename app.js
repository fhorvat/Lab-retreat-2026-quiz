// ============================================================
// Facts, or Faith? — frontend logic
//
//  • Voter view (default): polls the live question, shows two
//    vote buttons, never shows answers.
//  • Presenter view (?teacher=true&key=SECRET): advances the
//    room, shows live tallies, reveals answers locally.
//
// Backend = the Google Apps Script in google_apps_script.js.
// Paste your deployed /exec URL into GOOGLE_SCRIPT_URL below.
// Until you do, the app runs in LOCAL DEMO mode (this browser
// only, via localStorage) so you can test the flow end-to-end.
// ============================================================

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzcNjO1tRIIuZGFC6g1ALe-tp6RoxJZNj_hNhTobwE_mApW6_NAdHm8c2BlH8fqnYF8/exec';   // <-- paste your Apps Script web-app /exec URL here
const POLL_MS = 4000;           // how often phones / presenter poll the backend

// ── Mode & identity ─────────────────────────────────────────
const params       = new URLSearchParams(location.search);
const IS_PRESENTER = params.get('teacher') === 'true' || params.get('present') === 'true';
const PRESENTER_KEY = params.get('key') || '';
const LOCAL_MODE   = !GOOGLE_SCRIPT_URL || params.get('local') === 'true';

const app   = document.getElementById('app');
const badge = document.getElementById('modeBadge');

function getDeviceId() {
  let id = localStorage.getItem('faf_device_id');
  if (!id) {
    id = 'dev_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now();
    localStorage.setItem('faf_device_id', id);
  }
  return id;
}
const DEVICE_ID = getDeviceId();

// ── Backend layer (real Apps Script  OR  local-demo fallback) ─
const LS_STATE = 'faf_local_state';
const LS_VOTES = 'faf_local_votes';

async function api(action, extra) {
  const qs = new URLSearchParams(Object.assign({ action }, extra || {}));
  const res = await fetch(GOOGLE_SCRIPT_URL + '?' + qs.toString(), { method: 'GET' });
  return res.json();
}

function localGetState() {
  return { status: 'ok', currentQuestion: Number(localStorage.getItem(LS_STATE) || 0) };
}
function localSetState(q) { localStorage.setItem(LS_STATE, String(q)); return { status: 'ok' }; }
function localVote(topicId, vote) {
  const v = JSON.parse(localStorage.getItem(LS_VOTES) || '{}');
  v[DEVICE_ID + '_' + topicId] = { topicId: String(topicId), vote: vote, deviceId: DEVICE_ID, ts: Date.now() };
  localStorage.setItem(LS_VOTES, JSON.stringify(v));
  return { status: 'ok' };
}
function localResults() {
  const v = JSON.parse(localStorage.getItem(LS_VOTES) || '{}');
  const results = {}, devices = {};
  Object.keys(v).forEach(function (k) {
    const r = v[k];
    if (!results[r.topicId]) results[r.topicId] = { facts: 0, faith: 0 };
    if (results[r.topicId][r.vote] !== undefined) results[r.topicId][r.vote]++;
    devices[r.deviceId] = true;
  });
  return { status: 'ok', deviceCount: Object.keys(devices).length, results: results };
}

async function getState()        { return LOCAL_MODE ? localGetState()   : api('state'); }
async function pushState(q)       { return LOCAL_MODE ? localSetState(q)   : api('setState', { q: q, key: PRESENTER_KEY }); }
async function sendVote(id, vote, title) {
  return LOCAL_MODE ? localVote(id, vote)
                    : api('vote', { deviceId: DEVICE_ID, topicId: id, topicTitle: title || '', vote: vote });
}
async function getResults()       { return LOCAL_MODE ? localResults()    : api('results'); }

// ── Helpers ─────────────────────────────────────────────────
function qById(id)  { return QUESTIONS.find(function (q) { return q.id === Number(id); }); }
function qIndex(id) { return QUESTIONS.findIndex(function (q) { return q.id === Number(id); }); }
function esc(s)     { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

// Extract a YouTube video id from watch / youtu.be / shorts / embed URLs.
function ytId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.indexOf('youtu.be') !== -1) return u.pathname.slice(1);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts[0] === 'shorts' || parts[0] === 'embed') return parts[1];
    if (u.searchParams.get('v')) return u.searchParams.get('v');
  } catch (e) {}
  return '';
}

// Build HTML for a question's media of a given placement ('before' | 'after').
function mediaHTML(items, when) {
  if (!items || !items.length) return '';
  const sel = items.filter(function (m) { return m.when === when; });
  if (!sel.length) return '';
  return sel.map(function (m) {
    if (m.type === 'youtube') {
      const isShort = /\/shorts\//.test(m.url);
      return '<div class="media yt' + (isShort ? ' short' : '') + '">' +
               '<iframe src="https://www.youtube.com/embed/' + ytId(m.url) + '" title="video" ' +
               'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
               'allowfullscreen></iframe></div>' +
             (m.caption ? '<div class="media-cap">' + m.caption + '</div>' : '');
    }
    if (m.type === 'image') {
      return '<figure class="media img"><img src="' + m.url + '" alt="' + (m.caption || 'figure') + '">' +
             (m.caption ? '<figcaption>' + m.caption + '</figcaption>' : '') + '</figure>';
    }
    // link
    return '<a class="media-link" href="' + m.url + '" target="_blank" rel="noopener">' +
           (m.label || m.url) + ' ↗</a>';
  }).join('');
}

// ============================================================
//  VOTER VIEW
// ============================================================
function startVoter() {
  badge.textContent = LOCAL_MODE ? 'Demo' : 'Live vote';
  let renderedId = null;

  function renderWaiting() {
    if (renderedId === 0) return;
    renderedId = 0;
    app.innerHTML =
      '<div class="waiting">' +
        '<div class="spinner"></div>' +
        '<h2>You’re in.</h2>' +
        '<p>Waiting for the presenter to start the next question…</p>' +
      '</div>';
  }

  function renderQuestion(q) {
    if (renderedId === q.id) return;   // avoid wiping the user's selection on every poll
    renderedId = q.id;
    app.innerHTML =
      '<div class="card">' +
        '<div class="q-progress">Question ' + (qIndex(q.id) + 1) + ' of ' + QUESTIONS.length + '</div>' +
        '<div class="q-tag">' + q.tag + '</div>' +
        '<h2 class="q-text">' + esc(q.text) + '</h2>' +
        '<div class="vote-row">' +
          '<button class="vote-btn facts" data-vote="facts">Facts<span class="sub">Real, peer-reviewed</span></button>' +
          '<button class="vote-btn faith" data-vote="faith">Faith<span class="sub">Plausible, unsupported</span></button>' +
        '</div>' +
        '<div class="vote-status" id="voteStatus"></div>' +
      '</div>';

    const status = document.getElementById('voteStatus');
    app.querySelectorAll('.vote-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const vote = btn.getAttribute('data-vote');
        app.querySelectorAll('.vote-btn').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        status.textContent = 'Saving…';
        sendVote(q.id, vote, q.text)
          .then(function () { status.textContent = '✓ Vote recorded — you can change it while the question is open'; })
          .catch(function () { status.textContent = '⚠ Could not save — tap again'; });
      });
    });
  }

  async function tick() {
    try {
      const st = await getState();
      const cur = Number(st.currentQuestion || 0);
      const q = qById(cur);
      if (q) renderQuestion(q); else renderWaiting();
    } catch (e) { /* keep last view on transient errors */ }
  }
  tick();
  setInterval(tick, POLL_MS);
}

// ============================================================
//  PRESENTER VIEW
// ============================================================
function startPresenter() {
  badge.textContent = LOCAL_MODE ? 'Presenter · Demo' : 'Presenter';
  const voterUrl = location.origin + location.pathname;
  const qrSrc = 'https://api.qrserver.com/v1/create-qr-code/?size=264x264&margin=8&data=' + encodeURIComponent(voterUrl);

  app.innerHTML =
    (LOCAL_MODE
      ? '<div class="setup-warning"><strong>Local demo mode.</strong> No backend configured — votes are stored only in <em>this</em> browser. ' +
        'Paste your Apps Script URL into <code>GOOGLE_SCRIPT_URL</code> in <code>app.js</code> to go live across phones.</div>'
      : '') +
    '<div class="join">' +
      '<img src="' + qrSrc + '" alt="QR code to join">' +
      '<div class="join-text">Scan to vote, or open:<br><span class="url">' + esc(voterUrl) + '</span></div>' +
    '</div>' +
    '<div class="card">' +
      '<div class="q-progress" id="pProgress"></div>' +
      '<div class="q-tag" id="pTag"></div>' +
      '<h2 class="q-text" id="pText"></h2>' +
      '<div class="tally">' +
        '<div class="meta"><span id="pVoters"></span><span id="pCount"></span></div>' +
        '<div class="bar" id="pBar"></div>' +
        '<div class="legend"><span class="facts"><span class="dot"></span><span id="pFacts"></span></span>' +
        '<span class="faith"><span class="dot"></span><span id="pFaith"></span></span></div>' +
      '</div>' +
      '<div class="media-block" id="pBefore"></div>' +
      '<div id="pAnswer"></div>' +
    '</div>' +
    '<div class="controls">' +
      '<button class="btn" id="pPrev">← Previous</button>' +
      '<button class="btn primary" id="pNext">Next →</button>' +
      '<button class="btn reveal" id="pReveal">Reveal answer</button>' +
    '</div>';

  const el = function (id) { return document.getElementById(id); };
  let shownId = null;     // question currently displayed
  let revealed = false;

  function curIdx(cur) { return cur ? qIndex(cur) : -1; }   // -1 == "not started"

  function goto(i) {
    if (i < -1 || i >= QUESTIONS.length) return;
    const id = i < 0 ? 0 : QUESTIONS[i].id;
    pushState(id).then(refresh).catch(function () {});
  }

  function renderQuestionBlock(q) {
    revealed = false;
    el('pAnswer').innerHTML = '';
    if (!q) {
      el('pProgress').textContent = 'Not started';
      el('pTag').textContent = '';
      el('pText').textContent = 'Press “Next →” to show the first question to the room.';
    } else {
      el('pProgress').textContent = 'Question ' + (qIndex(q.id) + 1) + ' of ' + QUESTIONS.length;
      el('pTag').textContent = q.tag;
      el('pText').innerHTML = esc(q.text);
    }
    el('pBefore').innerHTML = q ? mediaHTML(q.media, 'before') : '';
  }

  function renderTally(q, data) {
    const results = (data && data.results) || {};
    const dc = (data && data.deviceCount) || 0;
    const r = (q && results[q.id]) || { facts: 0, faith: 0 };
    const total = r.facts + r.faith;
    const fPct = total ? Math.round(r.facts / total * 100) : 0;
    const hPct = total ? 100 - fPct : 0;

    el('pVoters').textContent = dc + (dc === 1 ? ' person connected' : ' people connected');
    el('pCount').textContent  = total + (total === 1 ? ' vote' : ' votes');
    el('pFacts').textContent  = 'Facts · ' + r.facts;
    el('pFaith').textContent  = 'Faith · ' + r.faith;

    if (total === 0) {
      el('pBar').innerHTML = '<div class="seg empty">No votes yet</div>';
    } else {
      el('pBar').innerHTML =
        '<div class="seg facts" style="flex-basis:' + fPct + '%">' + (fPct >= 12 ? fPct + '%' : '') + '</div>' +
        '<div class="seg faith" style="flex-basis:' + hPct + '%">' + (hPct >= 12 ? hPct + '%' : '') + '</div>';
    }
  }

  function renderAnswer(q) {
    if (!q) return;
    const refs = q.refs.map(function (r) { return '<div>' + r + '</div>'; }).join('');
    el('pAnswer').innerHTML =
      '<div class="answer ' + q.verdict + '">' +
        '<span class="verdict">' + (q.verdict === 'facts' ? 'Facts' : 'Faith') + '</span>' +
        '<p class="one-liner">' + q.oneLiner + '</p>' +
        '<p class="explain">' + q.explanation + '</p>' +
        '<div class="refs"><strong>Reference' + (q.refs.length > 1 ? 's' : '') + '</strong>' + refs + '</div>' +
        (mediaHTML(q.media, 'after') ? '<div class="media-block">' + mediaHTML(q.media, 'after') + '</div>' : '') +
      '</div>';
  }

  async function refresh() {
    let cur = 0;
    try {
      const st = await getState();
      cur = Number(st.currentQuestion || 0);
    } catch (e) {}
    const q = qById(cur);

    if (shownId !== cur) {
      shownId = cur;
      renderQuestionBlock(q);
    }
    el('pPrev').disabled = curIdx(cur) <= -1;
    el('pNext').disabled = curIdx(cur) >= QUESTIONS.length - 1;
    el('pReveal').disabled = !q;
    el('pReveal').textContent = revealed ? 'Hide answer' : 'Reveal answer';

    try {
      const data = await getResults();
      renderTally(q, data);
    } catch (e) {}
  }

  el('pPrev').addEventListener('click', function () { goto(curIdx(shownId) - 1); });
  el('pNext').addEventListener('click', function () { goto(curIdx(shownId) + 1); });
  el('pReveal').addEventListener('click', function () {
    const q = qById(shownId);
    if (!q) return;
    revealed = !revealed;
    if (revealed) renderAnswer(q); else el('pAnswer').innerHTML = '';
    el('pReveal').textContent = revealed ? 'Hide answer' : 'Reveal answer';
  });

  refresh();
  setInterval(refresh, POLL_MS);
}

// ── Boot ────────────────────────────────────────────────────
if (IS_PRESENTER) startPresenter(); else startVoter();
