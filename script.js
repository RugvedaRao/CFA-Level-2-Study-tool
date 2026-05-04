const T = [
  { id: 'qnt', name: 'Quantitative Methods', ico: '≋', col: '#185FA5', bg: '#E6F1FB', sub: '7 Learning Modules', 
    chapters: [
        {id:'q1', name:'LM 1: Basics of Multiple Regression and Underlying Assumptions'},
        {id:'q2', name:'LM 2: Evaluating Regression Model Fit and Interpreting Model Results'},
        {id:'q3', name:'LM 3: Model Misspecification'},
        {id:'q4', name:'LM 4: Extensions of Multiple Regression'},
        {id:'q5', name:'LM 5: Time-Series Analysis'},
        {id:'q6', name:'LM 6: Machine Learning'},
        {id:'q7', name:'LM 7: Big Data Projects'}
    ]},
  { id: 'eco', name: 'Economics', ico: '◎', col: '#3B6D11', bg: '#EAF3DE', sub: '2 Learning Modules', 
    chapters: [
        {id:'e1', name:'LM 1: Currency Exchange Rates: Understanding Equilibrium Value'},
        {id:'e2', name:'LM 2: Economic Growth'}
    ]},
  { id: 'fra', name: 'Financial Statement Analysis', ico: '▦', col: '#533AB7', bg: '#EEEDFE', sub: '6 Learning Modules', 
    chapters: [
        {id:'f1', name:'LM 1: Intercorporate Investments'},
        {id:'f2', name:'LM 2: Employee Compensation: Post-Employment and Share-Based'},
        {id:'f3', name:'LM 3: Multinational Operations'},
        {id:'f4', name:'LM 4: Analysis of Financial Institutions'},
        {id:'f5', name:'LM 5: Evaluating Quality of Financial Reports'},
        {id:'f6', name:'LM 6: Integration of Financial Statement Analysis Techniques'}
    ]},
  { id: 'cor', name: 'Corporate Issuers', ico: '◬', col: '#854F0B', bg: '#FAEEDA', sub: '4 Learning Modules', 
    chapters: [
        {id:'c1', name:'LM 1: Analysis of Dividends and Share Repurchases'},
        {id:'c2', name:'LM 2: Environmental, Social, and Governance (ESG) Considerations'},
        {id:'c3', name:'LM 3: Capital Structure'},
        {id:'c4', name:'LM 4: Business Models'}
    ]},
  { id: 'eqv', name: 'Equity Investments', ico: '↗', col: '#0F6E56', bg: '#E1F5EE', sub: '6 Learning Modules', 
    chapters: [
        {id:'eq1', name:'LM 1: Equity Valuation: Applications and Processes'},
        {id:'eq2', name:'LM 2: Discounted Dividend Valuation'},
        {id:'eq3', name:'LM 3: Free Cash Flow Valuation'},
        {id:'eq4', name:'LM 4: Market-Based Valuation: Price and Enterprise Value Multiples'},
        {id:'eq5', name:'LM 5: Residual Income Valuation'},
        {id:'eq6', name:'LM 6: Private Company Valuation'}
    ]},
  { id: 'fxi', name: 'Fixed Income', ico: '⚓', col: '#185FA5', bg: '#E6F1FB', sub: '5 Learning Modules', 
    chapters: [
        {id:'fi1', name:'LM 1: The Term Structure and Interest Rate Dynamics'},
        {id:'fi2', name:'LM 2: The Arbitrage-Free Valuation Framework'},
        {id:'fi3', name:'LM 3: Valuation and Analysis of Bonds with Embedded Options'},
        {id:'fi4', name:'LM 4: Credit Analysis Models'},
        {id:'fi5', name:'LM 5: Credit Default Swaps'}
    ]},
  { id: 'drv', name: 'Derivatives', ico: '∿', col: '#533AB7', bg: '#EEEDFE', sub: '2 Learning Modules', 
    chapters: [
        {id:'dr1', name:'LM 1: Pricing and Valuation of Forward Commitments'},
        {id:'dr2', name:'LM 2: Valuation of Contingent Claims'}
    ]},
  { id: 'alt', name: 'Alternative Investments', ico: '◧', col: '#185FA5', bg: '#E6F1FB', sub: '4 Learning Modules', 
    chapters: [
        {id:'al1', name:'LM 1: Overview of Types of Real Estate Investment'},
        {id:'al2', name:'LM 2: Investments in Real Estate Through Publicly Traded Securities'},
        {id:'al3', name:'LM 3: Private Equity Investments'},
        {id:'al4', name:'LM 4: Introduction to Commodities and Commodity Derivatives'}
    ]},
  { id: 'pmt', name: 'Portfolio Management', ico: '◈', col: '#0F6E56', bg: '#E1F5EE', sub: '6 Learning Modules', 
    chapters: [
        {id:'pm1', name:'LM 1: Exchange-Traded Funds: Mechanics and Applications'},
        {id:'pm2', name:'LM 2: Using Multifactor Models'},
        {id:'pm3', name:'LM 3: Measuring and Managing Market Risk'},
        {id:'pm4', name:'LM 4: Backtesting and Simulation'},
        {id:'pm5', name:'LM 5: Economics and Investment Markets'},
        {id:'pm6', name:'LM 6: Analysis of Active Portfolio Management'}
    ]},
  { id: 'eth', name: 'Ethics & Professional Standards', ico: '⚖', col: '#854F0B', bg: '#FAEEDA', sub: '3 Learning Modules', 
    chapters: [
        {id:'et1', name:'LM 1: Code of Ethics and Standards of Professional Conduct'},
        {id:'et2', name:'LM 2: Guidance for Standards I–VII'},
        {id:'et3', name:'LM 3: Application of the Code and Standards'}
    ]}
];

function buildSubjectDashboard() {
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = '';
  // Explicitly hide other views
  document.getElementById('page-topic').classList.remove('on');
  document.getElementById('page-dash').classList.add('on');

  document.querySelector('.ph-title').textContent = 'Your progress';
  document.querySelector('.ph-sub').textContent = 'CFA Level II · 10 topics';

  T.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tcard';
    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
        <div style="font-size:18px; background:${t.bg}; padding:6px; border-radius:8px;">${t.ico}</div>
        <div><div style="font-weight:700; font-size:13px; line-height:1.2;">${t.name}</div><div style="font-size:9px; color:#64748b;">${t.sub}</div></div>
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
  document.querySelector('.ph-sub').textContent = 'Select a module to view notes';

  const back = document.createElement('button');
  back.className = 'backbtn';
  back.textContent = '← Back';
  back.onclick = buildSubjectDashboard;
  grid.appendChild(back);

  t.chapters.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'tcard';
    card.innerHTML = `<div style="font-weight:700; font-size:12px;">${ch.name}</div>`;
    card.onclick = () => renderNoteBlocks(subjectId, ch.id, ch.name);
    grid.appendChild(card);
  });
}

async function renderNoteBlocks(subjectId, chapterId, chapterName) {
  // Switch pages completely
  document.getElementById('page-dash').classList.remove('on');
  document.getElementById('page-topic').classList.add('on');
  
  document.getElementById('t-title').textContent = chapterName;
  const body = document.getElementById('tab-body');
  body.innerHTML = "<div class='note-block'>Fetching notes...</div>";
  
  try {
    const response = await fetch(`notes/${subjectId}/${chapterId}.md`);
    if (!response.ok) throw new Error();
    const markdown = await response.text();
    const blocks = markdown.split(/\n---\n/);
    body.innerHTML = blocks.map(block => `<div class="note-block">${block.trim()}</div>`).join('');
  } catch (err) {
    body.innerHTML = `<div class="note-block">Notes file missing: <code>notes/${subjectId}/${chapterId}.md</code></div>`;
  }
}

// Ensure first load is clean
buildSubjectDashboard();
