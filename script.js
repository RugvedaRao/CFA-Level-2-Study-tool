const T = [
  { id: 'eth', name: 'Ethical and Professional Standards', ico: '⚖', col: '#854F0B', bg: '#FAEEDA', sub: 'Standards of Practice & GIPS', 
    chapters: [{id:'s1', name:'Code and Standards'}, {id:'s2', name:'GIPS Standards'}] },
  { id: 'qnt', name: 'Quantitative Methods', ico: '≋', col: '#185FA5', bg: '#E6F1FB', sub: 'Regression & Machine Learning', 
    chapters: [{id:'q1', name:'Multiple Regression'}, {id:'q2', name:'Time Series'}, {id:'q3', name:'Machine Learning'}] },
  { id: 'eco', name: 'Economics', ico: '◎', col: '#3B6D11', bg: '#EAF3DE', sub: 'Currency Exchange & Growth', 
    chapters: [{id:'e1', name:'Currency Exchange Rates'}, {id:'e2', name:'Economic Growth'}, {id:'e3', name:'Regulation'}] },
  { id: 'fra', name: 'Financial Statement Analysis', ico: '▦', col: '#533AB7', bg: '#EEEDFE', sub: 'Investments & Pensions', 
    chapters: [{id:'f1', name:'Intercorporate Investments'}, {id:'f2', name:'Employee Compensation'}, {id:'f3', name:'Multinational Operations'}] },
  { id: 'cor', name: 'Corporate Issuers', ico: '◬', col: '#854F0B', bg: '#FAEEDA', sub: 'Capital Structure & M&A', 
    chapters: [{id:'c1', name:'Capital Structure'}, {id:'c2', name:'Analysis of Dividends'}, {id:'c3', name:'Corporate Restructuring'}] },
  { id: 'eqv', name: 'Equity Valuation', ico: '↗', col: '#0F6E56', bg: '#E1F5EE', sub: 'DDM, FCF & Multiples', 
    chapters: [{id:'eq1', name:'Equity Concepts'}, {id:'eq2', name:'DDM'}, {id:'eq3', name:'Free Cash Flow'}, {id:'eq4', name:'Market-Based Multiples'}] },
  { id: 'fxi', name: 'Fixed Income', ico: '⚓', col: '#993C1D', bg: '#FAECE7', sub: 'Term Structure & Credit Analysis', 
    chapters: [{id:'fi1', name:'Term Structure'}, {id:'fi2', name:'Arbitrage-Free Framework'}, {id:'fi3', name:'Credit Analysis'}] },
  { id: 'drv', name: 'Derivatives', ico: '∿', col: '#533AB7', bg: '#EEEDFE', sub: 'Forwards, Options & Swaps', 
    chapters: [{id:'d1', name:'Forward Commitment Pricing'}, {id:'d2', name:'Valuation of Contingent Claims'}] },
  { id: 'alt', name: 'Alternative Investments', ico: '◧', col: '#185FA5', bg: '#E6F1FB', sub: 'PE, Real Estate & Commodities', 
    chapters: [{id:'pe', name:'Private Equity'}, {id:'re', name:'Real Estate'}, {id:'hf', name:'Hedge Funds'}] },
  { id: 'pmt', name: 'Portfolio Management', ico: '◈', col: '#0F6E56', bg: '#E1F5EE', sub: 'Factor Models & Risk Mgmt', 
    chapters: [{id:'p1', name:'Exchange-Traded Funds'}, {id:'p2', name:'Multifactor Models'}, {id:'p3', name:'Backtesting'}] }
];

let curTopicId = null;

function buildSubjectDashboard() {
  curTopicId = null;
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = '';
  goPage('dash');

  document.querySelector('.ph-title').textContent = 'CFA Level II Study Hub';
  document.querySelector('.ph-sub').textContent = '10 Topics · Comprehensive Study Material';

  T.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tcard';
    card.innerHTML = `
      <div>
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:15px;">
          <div style="font-size:24px; background:${t.bg}; padding:10px; border-radius:8px; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">${t.ico}</div>
          <div style="flex:1;">
            <div style="font-weight:700; line-height:1.2; margin-bottom:2px;">${t.name}</div>
            <div style="font-size:11px; color:#64748b;">${t.sub}</div>
          </div>
        </div>
      </div>
      <button class="pill-g" onclick="event.stopPropagation(); openChapterGrid('${t.id}')">Explore Chapters</button>`;
    card.onclick = () => openChapterGrid(t.id);
    grid.appendChild(card);
  });
}

function openChapterGrid(subjectId) {
  const t = T.find(x => x.id === subjectId);
  curTopicId = subjectId;
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = '';
  goPage('dash');

  document.querySelector('.ph-title').textContent = t.name;
  document.querySelector('.ph-sub').textContent = 'Select a specific chapter to view detailed note blocks';

  const back = document.createElement('button');
  back.className = 'backbtn';
  back.textContent = '← Back to Subjects';
  back.onclick = buildSubjectDashboard;
  grid.appendChild(back);

  t.chapters.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'tcard chapter-card';
    card.innerHTML = `
        <div style="font-weight:700; margin-bottom:4px;">${ch.name}</div>
        <div style="font-size:12px; color:#64748b;">View note blocks</div>`;
    card.onclick = () => renderNoteBlocks(subjectId, ch.id, ch.name);
    grid.appendChild(card);
  });
}

async function renderNoteBlocks(subjectId, chapterId, chapterName) {
  goPage('topic');
  document.getElementById('t-title').textContent = chapterName;
  const body = document.getElementById('tab-body');
  body.innerHTML = "<div class='note-block'>Loading notes...</div>";

  try {
    const response = await fetch(`notes/${subjectId}/${chapterId}.md`);
    if (!response.ok) throw new Error();
    const markdown = await response.text();
    const blocks = markdown.split(/\n-----/);
    body.innerHTML = blocks.map(block => `<div class="note-block">${block.trim()}</div>`).join('');
  } catch (err) {
    body.innerHTML = `<div class="note-block">Notes file not found at: <code>notes/${subjectId}/${chapterId}.md</code></div>`;
  }
}

function goPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
    document.getElementById('page-' + id).classList.add('on');
}

buildSubjectDashboard();
