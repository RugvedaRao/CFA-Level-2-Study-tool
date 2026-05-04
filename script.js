const T = [
  {
    id: 'eth', name: 'Ethics & Standards', ico: '⚖', col: '#854F0B', bg: '#FAEEDA', sub: 'Standards of Practice & GIPS',
    preview: { h: 'Standards I–VII overview', p1: 'This section covers the complete Code and Standards framework tested at CFA Level II, with emphasis on multi-part vignette scenarios.', p2: 'Notes include side-by-side IFRS vs GAAP ethics tables and the standard violation detection framework.', f: 'Violation detection: Intent + Knowledge + Harm → Standard mapping' },
    quiz: [
      { q: 'Under Standard II-A, which activity is most likely permitted?', o: ['Trading on a tip from a company insider', 'Combining public research with non-material non-public observations', 'Front-running clients after overhearing earnings guidance', 'Delaying MNPI disclosure to trade first'], a: 1, e: 'Mosaic theory allows analysts to combine public data with non-material non-public information to form investment conclusions.' },
      { q: 'Standard III-C (Suitability) most requires a manager to:', o: ['Execute client-requested trades immediately', 'Assess whether a trade fits the client IPS before executing', 'Refuse all speculative trades', 'Execute only with written client confirmation'], a: 1, e: 'Standard III-C requires suitability assessment against the IPS before executing any trade.' }
    ]
  },
  {
    id: 'qnt', name: 'Quantitative Methods', ico: '≋', col: '#185FA5', bg: '#E6F1FB', sub: 'Regression, time series & machine learning',
    preview: { h: 'Multiple regression & violations', p1: 'Notes cover OLS regression, CLRM assumptions, F-test and t-test interpretation, and R² vs adjusted R².', p2: 'Time series models including AR(1), unit root testing via Dickey-Fuller, and first differencing.', f: 'AR(1): Xₜ = b₀ + b₁Xₜ₋₁ + ε · Mean-reverting if |b₁| < 1' },
    quiz: [
      { q: 'High R² combined with individually insignificant t-statistics most likely indicates:', o: ['Heteroskedasticity', 'Multicollinearity', 'Serial correlation', 'Model misspecification'], a: 1, e: 'Multicollinearity inflates standard errors of individual coefficients while joint explanatory power R² remains high.' }
    ]
  },
  {
    id: 'eqv', name: 'Equity Valuation', ico: '↗', col: '#0F6E56', bg: '#E1F5EE', sub: 'DDM, residual income & multiples',
    preview: { h: 'Gordon Growth Model & beyond', p1: 'Complete coverage of dividend discount models — GGM, multi-stage, H-Model — with derivation of the sustainable growth rate.', p2: 'FCFF vs FCFE selection framework with full formula sheets.', f: 'GGM: V₀ = D₁ / (r − g)' },
    quiz: [
      { q: 'GGM with D₁ = ₹2, r = 10%, g = 5% gives intrinsic value of:', o: ['₹20', '₹40', '₹50', '₹100'], a: 1, e: 'V₀ = D₁/(r−g) = 2/0.05 = ₹40.' }
    ]
  }
  // Add other topics (Eco, FRA, Corp, FI, Deriv, Alts, PM) using the same structure
];

let scores = {};
let curTopic = null;
let curTab = 'quiz';
let qstate = {};

/**
 * Builds the sidebar navigation dynamically
 */
function buildSidebar() {
  const el = document.getElementById('sidenav-topics');
  T.forEach(t => {
    const b = document.createElement('button');
    b.className = 'snbtn';
    b.id = 'nav-' + t.id;
    b.innerHTML = `<div class="snicon" style="background:${t.bg}">${t.ico}</div><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.name}</span><span class="snbadge" id="snb-${t.id}">—</span>`;
    b.onclick = () => openTopic(t.id);
    el.appendChild(b);
  });
}

/**
 * Refreshes the main dashboard with progress stats
 */
function refreshDash() {
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = '';
  let totC = 0, totQ = 0, done = 0;

  T.forEach(t => {
    const s = scores[t.id];
    const pct = s ? Math.round(s.c / s.t * 100) : null;
    if (s) { totC += s.c; totQ += s.t; done++; }

    const card = document.createElement('div');
    card.className = 'tcard';
    card.style.borderTop = `2px solid ${t.col}40`;
    card.innerHTML = `
      ${pct !== null ? `<span class="sbadge ${pct >= 70 ? 'g' : 'a'}">${pct}%</span>` : ''}
      <div class="tcard-top">
        <div class="tico" style="background:${t.bg}">${t.ico}</div>
        <div><div class="tname">${t.name}</div><div class="tsub">${t.sub}</div></div>
      </div>
      <div class="tacts">
        <button class="pill a" onclick="event.stopPropagation(); openTopic('${t.id}', 'notes')">Notes</button>
        <button class="pill g" onclick="event.stopPropagation(); openTopic('${t.id}', 'quiz')">Quiz</button>
      </div>
      <div class="tprog">
        <div class="tprow"><span>${pct !== null ? `Score: ${pct}%` : 'Not attempted'}</span><span>${t.quiz.length} questions</span></div>
        <div class="ttrack"><div class="tbar" style="width:${pct || 0}%;background:${t.col}"></div></div>
      </div>`;
    card.onclick = () => openTopic(t.id);
    grid.appendChild(card);
  });

  // Calculate overall stats
  const acc = totQ ? Math.round(totC / totQ * 100) : 0;
  document.getElementById('st-acc').innerHTML = acc + '<sup>%</sup>';
  document.getElementById('sb-acc').style.width = acc + '%';
  document.getElementById('st-done').innerHTML = done + '<sup>/' + T.length + '</sup>';
  document.getElementById('sb-done').style.width = Math.round(done / T.length * 100) + '%';
  document.getElementById('st-q').innerHTML = totQ + '<sup>/50</sup>';
  document.getElementById('sb-q').style.width = Math.round(totQ / 50 * 100) + '%';
}

/**
 * Handles main page navigation
 */
function goPage(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  document.getElementById('page-' + id).classList.add('on');
  document.querySelectorAll('.snbtn').forEach(b => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  if (id === 'dash') { curTopic = null; refreshDash(); }
}

/**
 * Navigates to a specific topic
 */
function openTopic(id, tab) {
  curTopic = id;
  curTab = tab || 'quiz';
  const t = T.find(x => x.id === id);
  document.getElementById('t-title').textContent = t.name;
  document.getElementById('t-sub').textContent = t.sub;

  document.querySelectorAll('.snbtn').forEach(b => b.classList.remove('on'));
  const sb = document.getElementById('nav-' + id);
  if (sb) sb.classList.add('on');

  renderTab();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  document.getElementById('page-topic').classList.add('on');
}

function switchTab(t) {
  curTab = t;
  renderTab();
}

function renderTab() {
  document.getElementById('ctab-notes').classList.toggle('on', curTab === 'notes');
  document.getElementById('ctab-quiz').classList.toggle('on', curTab === 'quiz');
  if (curTab === 'notes') renderNotes();
  else renderQuizStart();
}

/**
 * Displays topic notes (Unlocked/Free Version)
 */
function renderNotes() {
  const t = T.find(x => x.id === curTopic);
  const p = t.preview;
  document.getElementById('tab-body').innerHTML = `
    <div class="note-content">
      <h3>${p.h}</h3>
      <p>${p.p1}</p>
      <p>${p.p2}</p>
      <div class="fbox">${p.f}</div>
      <p style="margin-top:20px; font-size:12px; color:#888;">Full detailed formulas and vignette examples available in this section.</p>
    </div>`;
}

function renderQuizStart() {
  qstate = { tid: curTopic, idx: 0, correct: 0, answered: false };
  renderQ();
}

function renderQ() {
  const t = T.find(x => x.id === curTopic);
  const qs = t.quiz;
  const i = qstate.idx;
  if (i >= qs.length) { renderResult(); return; }
  const q = qs[i];
  const pct = Math.round(i / qs.length * 100);
  document.getElementById('tab-body').innerHTML = `
    <div class="qwrap">
      <div class="qmeta">
        <span class="qmlbl">Q${i + 1} of ${qs.length}</span>
        <div class="qmbar"><div class="qmbarf" style="width:${pct}%"></div></div>
        <span class="qmlbl">${qstate.correct} correct</span>
      </div>
      <div class="qcard">
        <div class="qtag">${t.name}</div>
        <div class="qtext">${q.q}</div>
        <div class="opts">${q.o.map((o, j) => `<button class="opt" onclick="ansQ(${j},${q.a},'${q.e.replace(/'/g, "\\'")}')">${String.fromCharCode(65 + j)}. ${o}</button>`).join('')}</div>
        <div class="expbox" id="exp"></div>
      </div>
      <div id="nxt" style="display:none"><button class="nextbtn" onclick="nextQ()">${i + 1 < qs.length ? 'Next question →' : 'See results'}</button></div>
    </div>`;
}

function ansQ(chosen, correct, exp) {
  if (qstate.answered) return;
  qstate.answered = true;
  document.querySelectorAll('.opt').forEach((b, i) => {
    b.disabled = true;
    if (i === correct) b.classList.add('correct');
    if (i === chosen && chosen !== correct) b.classList.add('wrong');
  });
  if (chosen === correct) qstate.correct++;
  const e = document.getElementById('exp');
  e.textContent = exp;
  e.classList.add('show');
  document.getElementById('nxt').style.display = 'block';
}

function nextQ() {
  qstate.idx++;
  qstate.answered = false;
  renderQ();
}

function renderResult() {
  const t = T.find(x => x.id === curTopic);
  const pct = Math.round(qstate.correct / t.quiz.length * 100);
  scores[t.id] = { c: qstate.correct, t: t.quiz.length };
  const nb = document.getElementById('snb-' + t.id);
  if (nb) { nb.textContent = pct + '%'; nb.className = 'snbadge ' + (pct >= 70 ? 'good' : 'mid'); }
  
  document.getElementById('tab-body').innerHTML = `
    <div class="rcard">
      <div class="rring"><div class="rpct">${pct}%</div></div>
      <div class="rtitle">${pct >= 70 ? 'Great job!' : 'Keep practicing'}</div>
      <div class="rsub">You scored ${qstate.correct} / ${t.quiz.length} on ${t.name}.</div>
      <div class="rbtnrow">
        <button class="rbtn" onclick="renderQuizStart()">Retry quiz</button>
        <button class="rbtn g" onclick="goPage('dash',document.getElementById('nav-dash'))">Dashboard</button>
      </div>
    </div>`;
}

// Initial build
buildSidebar();
refreshDash();
