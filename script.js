const T = [
  {
    id: 'alt', name: 'Alternative Investments', ico: '◧', col: '#185FA5', bg: '#E6F1FB', sub: 'PE, Real Estate & Hedge Funds',
    chapters: [
      { id: 'pe', name: 'Private Equity Valuation' },
      { id: 're', name: 'Real Estate Investments' },
      { id: 'hf', name: 'Hedge Funds' }
    ]
  },
  {
    id: 'fra', name: 'Financial Reporting', ico: '▦', col: '#533AB7', bg: '#EEEDFE', sub: 'Investments & Pensions',
    chapters: [
      { id: 'inv', name: 'Intercorporate Investments' },
      { id: 'pen', name: 'Employee Compensation' }
    ]
  }
  // Add all 10 subjects here with their respective chapter IDs
];

let scores = {};
let curTopic = null;

function buildSubjectDashboard() {
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = '';
  document.getElementById('page-dash').classList.add('on');
  document.getElementById('page-topic').classList.remove('on');
  
  // Reset Titles
  document.querySelector('.ph-title').textContent = 'Your progress';
  document.querySelector('.ph-sub').textContent = 'CFA Level II · 10 topics';

  T.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tcard';
    card.style.borderTop = `2px solid ${t.col}40`;
    card.innerHTML = `
      <div class="tcard-top">
        <div class="tico" style="background:${t.bg}">${t.ico}</div>
        <div><div class="tname">${t.name}</div><div class="tsub">${t.sub}</div></div>
      </div>
      <div class="tacts">
        <button class="pill g" onclick="openChapterGrid('${t.id}')">View Chapters</button>
      </div>`;
    grid.appendChild(card);
  });
}

function openChapterGrid(subjectId) {
  const t = T.find(x => x.id === subjectId);
  curTopic = subjectId;
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = '';

  document.querySelector('.ph-title').textContent = t.name;
  document.querySelector('.ph-sub').textContent = 'Select a chapter to view notes';

  t.chapters.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'tcard chapter-card';
    card.innerHTML = `
      <div class="tname">${ch.name}</div>
      <div class="tsub">Click to read blocks</div>`;
    card.onclick = () => renderNoteBlocks(subjectId, ch.id, ch.name);
    grid.appendChild(card);
  });

  // Add a "Back to Subjects" button
  const back = document.createElement('button');
  back.className = 'pill';
  back.textContent = '← Back to Subjects';
  back.onclick = buildSubjectDashboard;
  grid.appendChild(back);
}

async function renderNoteBlocks(subjectId, chapterId, chapterName) {
  document.getElementById('page-dash').classList.remove('on');
  document.getElementById('page-topic').classList.add('on');
  document.getElementById('t-title').textContent = chapterName;
  
  try {
    const response = await fetch(`./notes/${subjectId}/${chapterId}.md`);
    if (!response.ok) throw new Error();
    const markdown = await response.text();
    
    // Split by '---' in your markdown file to create separate blocks
    const blocks = markdown.split('---');
    
    document.getElementById('tab-body').innerHTML = blocks.map(block => `
      <div class="note-block">${block.trim()}</div>
    `).join('');
  } catch (err) {
    document.getElementById('tab-body').innerHTML = "<div class="note-block">Notes for this chapter are currently being updated.</div>";
  }
}

function goPage(id) {
    if(id === 'dash') buildSubjectDashboard();
}

// Start app
buildSubjectDashboard();
