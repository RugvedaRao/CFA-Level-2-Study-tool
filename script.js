const T = [
    {
        id: 'eth', name: 'Ethics & Standards', ico: '⚖', col: '#854F0B', bg: '#FAEEDA', sub: 'Standards of Practice & GIPS',
        preview: { h: 'Standards I–VII overview', p1: 'This section covers the complete Code and Standards framework tested at CFA Level II.', p2: 'Notes include side-by-side IFRS vs GAAP ethics tables.', f: 'Violation detection: Intent + Knowledge + Harm → Standard mapping' },
        quiz: [
            { q: 'Under Standard II-A, which activity is most likely permitted?', o: ['Trading on a tip from a company insider', 'Combining public research with non-material non-public observations', 'Front-running clients', 'Delaying MNPI disclosure'], a: 1, e: 'Mosaic theory allows analysts to combine public data with non-material non-public information.' },
            { q: 'Standard III-C (Suitability) requires a manager to:', o: ['Execute trades immediately', 'Assess whether a trade fits the client IPS', 'Refuse all speculative trades', 'Confirm every trade in writing'], a: 1, e: 'Suitability assessment against the IPS is required before execution.' }
        ]
    },
    {
        id: 'qnt', name: 'Quantitative Methods', ico: '≋', col: '#185FA5', bg: '#E6F1FB', sub: 'Regression & Machine Learning',
        preview: { h: 'Multiple regression', p1: 'Covers OLS, CLRM assumptions, and F-tests.', p2: 'Time series models including AR(1).', f: 'AR(1): Xt = b0 + b1Xt-1 + ε' },
        quiz: [
            { q: 'High R² with individually insignificant t-stats indicates:', o: ['Heteroskedasticity', 'Multicollinearity', 'Serial correlation', 'Model misspecification'], a: 1, e: 'Multicollinearity inflates standard errors while joint explanatory power remains high.' }
        ]
    },
    {
        id: 'eqv', name: 'Equity Valuation', ico: '↗', col: '#0F6E56', bg: '#E1F5EE', sub: 'DDM, Residual Income & Multiples',
        preview: { h: 'Gordon Growth Model', p1: 'Complete coverage of DDM, H-Model, and FCFE.', p2: 'Residual income vs Economic Profit.', f: 'V0 = D1 / (r - g)' },
        quiz: [
            { q: 'In the H-Model, growth is assumed to:', o: ['Be constant', 'Decline linearly', 'Jump abruptly', 'Be zero'], a: 1, e: 'The H-model assumes growth declines linearly to the stable rate.' }
        ]
    }
    // Add other topics here...
];

let scores = {};
let curTopic = null;
let curTab = 'quiz';
let qstate = {};

function buildSidebar() {
    const el = document.getElementById('sidenav-topics');
    T.forEach(t => {
        const b = document.createElement('button');
        b.className = 'snbtn';
        b.id = 'nav-' + t.id;
        b.innerHTML = `<div class="snicon" style="background:${t.bg}">${t.ico}</div><span style="flex:1">${t.name}</span><span class="snbadge" id="snb-${t.id}">—</span>`;
        b.onclick = () => openTopic(t.id);
        el.appendChild(b);
    });
}

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
                <button class="pill a" onclick="event.stopPropagation(); openTopic('${t.id}','notes')">Notes</button>
                <button class="pill g" onclick="event.stopPropagation(); openTopic('${t.id}','quiz')">Quiz</button>
            </div>
        `;
        card.onclick = () => openTopic(t.id);
        grid.appendChild(card);
    });

    const acc = totQ ? Math.round(totC / totQ * 100) : 0;
    document.getElementById('st-acc').innerHTML = acc + '<sup>%</sup>';
    document.getElementById('sb-acc').style.width = acc + '%';
    document.getElementById('st-done').innerHTML = done + '<sup>/10</sup>';
    document.getElementById('sb-done').style.width = (done * 10) + '%';
}

function goPage(id, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
    document.getElementById('page-' + id).classList.add('on');
    document.querySelectorAll('.snbtn').forEach(b => b.classList.remove('on'));
    if (btn) btn.classList.add('on');
    if (id === 'dash') { curTopic = null; refreshDash(); }
}

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

function renderNotes() {
    const t = T.find(x => x.id === curTopic);
    const p = t.preview;
    document.getElementById('tab-body').innerHTML = `
        <div class="lock-wrap">
            <div class="lock-preview">
                <div class="preview-blur">
                    <h3>${p.h}</h3>
                    <p>${p.p1}</p>
                    <div class="fbox">${p.f}</div>
                </div>
                <div class="lock-gate">
                    <div class="gate-card">
                        <div class="gate-ico">🔒</div>
                        <div class="gate-title">Premium notes</div>
                        <button class="unlock-btn">Unlock with Pro</button>
                    </div>
                </div>
            </div>
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
    document.getElementById('tab-body').innerHTML = `
        <div class="qwrap">
            <div class="qcard">
                <div class="qtag">${t.name}</div>
                <div class="qtext">${q.q}</div>
                <div class="opts">${q.o.map((o, j) => `
                    <button class="opt" onclick="ansQ(${j},${q.a},'${q.e}')">${o}</button>
                `).join('')}</div>
                <div class="expbox" id="exp"></div>
            </div>
            <div id="nxt" style="display:none"><button class="nextbtn" onclick="nextQ()">Next</button></div>
        </div>`;
}

function ansQ(chosen, correct, exp) {
    if (qstate.answered) return;
    qstate.answered = true;
    document.querySelectorAll('.opt').forEach((b, i) => {
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
    
    document.getElementById('tab-body').innerHTML = `
        <div class="rcard">
            <div class="rring"><div class="rpct">${pct}%</div></div>
            <div class="rtitle">Quiz Complete</div>
            <div class="rbtnrow">
                <button class="rbtn" onclick="renderQuizStart()">Retry</button>
                <button class="rbtn g" onclick="goPage('dash',document.getElementById('nav-dash'))">Dashboard</button>
            </div>
        </div>`;
}

buildSidebar();
refreshDash();
