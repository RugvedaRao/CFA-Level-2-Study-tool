const T = [
  { id: 'fxi', name: 'Fixed Income', ico: '⚓', col: '#185FA5', bg: '#E6F1FB', sub: '10–15% Weight', 
    chapters: [
        {id:'fi1', name:'LM 1: The Term Structure and Interest Rate Dynamics'},
        {id:'fi2', name:'LM 2: The Arbitrage-Free Valuation Framework'},
        {id:'fi3', name:'LM 3: Valuation and Analysis of Bonds with Embedded Options'},
        {id:'fi4', name:'LM 4: Credit Analysis Models'},
        {id:'fi5', name:'LM 5: Credit Default Swaps'}
    ]},
  { id: 'drv', name: 'Derivatives', ico: '∿', col: '#533AB7', bg: '#EEEDFE', sub: '5–10% Weight', 
    chapters: [
        {id:'dr1', name:'LM 1: Pricing and Valuation of Forward Commitments'},
        {id:'dr2', name:'LM 2: Valuation of Contingent Claims'}
    ]},
  { id: 'alt', name: 'Alternative Investments', ico: '◧', col: '#185FA5', bg: '#E6F1FB', sub: '5–10% Weight', 
    chapters: [
        {id:'al1', name:'LM 1: Overview of Types of Real Estate Investment'},
        {id:'al2', name:'LM 2: Investments in Real Estate Through Publicly Traded Securities'},
        {id:'al3', name:'LM 3: Private Equity Investments'},
        {id:'al4', name:'LM 4: Introduction to Commodities and Commodity Derivatives'}
    ]},
  { id: 'pmt', name: 'Portfolio Management', ico: '◈', col: '#0F6E56', bg: '#E1F5EE', sub: '10–15% Weight', 
    chapters: [
        {id:'pm1', name:'LM 1: Exchange-Traded Funds: Mechanics and Applications'},
        {id:'pm2', name:'LM 2: Using Multifactor Models'},
        {id:'pm3', name:'LM 3: Measuring and Managing Market Risk'},
        {id:'pm4', name:'LM 4: Backtesting and Simulation'},
        {id:'pm5', name:'LM 5: Economics and Investment Markets'},
        {id:'pm6', name:'LM 6: Analysis of Active Portfolio Management'}
    ]},
  { id: 'eth', name: 'Ethics & Prof. Standards', ico: '⚖', col: '#854F0B', bg: '#FAEEDA', sub: '10–15% Weight', 
    chapters: [
        {id:'et1', name:'LM 1: Code of Ethics and Standards of Professional Conduct'},
        {id:'et2', name:'LM 2: Guidance for Standards I–VII'},
        {id:'et3', name:'LM 3: Application of the Code and Standards'}
    ]},
  { id: 'qnt', name: 'Quantitative Methods', ico: '≋', col: '#185FA5', bg: '#E6F1FB', sub: '5–10% Weight', 
    chapters: [{id:'q1', name:'Multiple Regression'}, {id:'q2', name:'Time Series Analysis'}] },
  { id: 'eco', name: 'Economics', ico: '◎', col: '#3B6D11', bg: '#EAF3DE', sub: '5–10% Weight', 
    chapters: [{id:'e1', name:'Currency Exchange Rates'}, {id:'e2', name:'Economic Growth'}] },
  { id: 'fra', name: 'Financial Statement Analysis', ico: '▦', col: '#533AB7', bg: '#EEEDFE', sub: '10–15% Weight', 
    chapters: [{id:'f1', name:'Intercorporate Investments'}, {id:'f2', name:'Employee Compensation'}] },
  { id: 'cor', name: 'Corporate Issuers', ico: '◬', col: '#854F0B', bg: '#FAEEDA', sub: '5–10% Weight', 
    chapters: [{id:'c1', name:'Capital Structure'}, {id:'c2', name:'Corporate Restructuring'}] },
  { id: 'eqv', name: 'Equity Valuation', ico: '↗', col: '#0F6E56', bg: '#E1F5EE', sub: '10–15% Weight', 
    chapters: [{id:'eq1', name:'Discounted Dividend Valuation'}, {id:'eq2', name:'Free Cash Flow Valuation'}] }
];

function buildSubjectDashboard() {
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = '';
  document.getElementById('page-dash').classList.add('on');
  document.getElementById('page-topic').classList.remove('on');

  T.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tcard';
    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
        <div style="font-size:20px; background:${t.bg}; padding:8px; border-radius:8px;">${t.ico}</div>
        <div><div style="font-weight:700; font-size:14px;">${t.name}</div><div style="font-size:10px; color:#64748b;">${t.sub}</div></div>
      </div>
      <button class="pill-g" onclick="openChapterGrid('${t.id}')">View Chapters</button>`;
    grid.appendChild(card);
  });
}

function openChapterGrid(subjectId) {
  const t = T.find(x => x.id === subjectId);
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = '';
  document.querySelector('.ph-title').textContent = t.name;

  t.chapters.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'tcard';
    card.innerHTML = `<div style="font-weight:700; font-size:13px;">${ch.name}</div><div style="font-size:11px; color:#64748b; margin-top:4px;">Read notes</div>`;
    card.onclick = () => renderNoteBlocks(subjectId, ch.id, ch.name);
    grid.appendChild(card);
  });
}

async function renderNoteBlocks(subjectId, chapterId, chapterName) {
  document.getElementById('page-dash').classList.remove('on');
  document.getElementById('page-topic').classList.add('on');
  document.getElementById('t-title').textContent = chapterName;
  const body = document.getElementById('tab-body');
  
  try {
    const response = await fetch(`notes/${subjectId}/${chapterId}.md`);
    if (!response.ok) throw new Error();
    const markdown = await response.text();
    const blocks = markdown.split(/\n---\n/);
    body.innerHTML = blocks.map(block => `<div class="note-block">${block.trim()}</div>`).join('');
  } catch (err) {
    body.innerHTML = `<div class="note-block">Note missing: <code>notes/${subjectId}/${chapterId}.md</code></div>`;
  }
}

buildSubjectDashboard();
