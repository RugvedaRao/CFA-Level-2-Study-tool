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
  // Add remaining 8 subjects here...
];

let curTopic = null;

/**
 * Renders the initial 10-subject dashboard
 */
function buildSubjectDashboard() {
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = '';
  goPage('dash');
  
  document.querySelector('.ph-title').textContent = 'Your progress';
  document.querySelector('.ph-sub').textContent = 'CFA Level II · 10 topics';

  T.forEach(t => {
    const card = document.createElement('div');
    card.className = 'tcard';
    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:15px;">
        <div style="font-size:24px; background:${t.bg}; padding:10px; border-radius:8px;">${t.ico}</div>
        <div><div style="font-weight:700;">${t.name}</div><div style="font-size:12px; color:#64748b;">${t.sub}</div></div>
      </div>
      <button class="pill g" onclick="openChapterGrid('${t.id}')">View Chapters</button>`;
    grid.appendChild(card);
  });
}

/**
 * Renders the chapter selection for a specific subject
 */
function openChapterGrid(subjectId) {
  const t = T.find(x => x.id === subjectId);
  curTopic = subjectId;
  const grid = document.getElementById('topics-grid');
  grid.innerHTML = '';
  goPage('dash');

  document.querySelector('.ph-title').textContent = t.name;
  document.querySelector('.ph-sub').textContent = 'Select a chapter to read notes';

  t.chapters.forEach(ch => {
    const card = document.createElement('div');
    card.className = 'tcard chapter-card';
    card.innerHTML = `<div style="font-weight:700;">${ch.name}</div><div style="font-size:12px; color:#64748b; margin-top:4px;">Click to view notes</div>`;
    card.onclick = () => renderNoteBlocks(subjectId, ch.id, ch.name);
    grid.appendChild(card);
  });

  const back = document.createElement('button');
  back.className = 'backbtn';
  back.style.marginTop = '20px';
  back.textContent = '← Back to Subjects';
  back.onclick = buildSubjectDashboard;
  grid.parentElement.insertBefore(back, grid); // Place before the grid
}

/**
 * Fetches and displays Markdown note blocks
 */
async function renderNoteBlocks(subjectId, chapterId, chapterName) {
  goPage('topic');
  document.getElementById('t-title').textContent = chapterName;
  const body = document.getElementById('tab-body');
  body.innerHTML = "Loading notes...";
  
  try {
    const response = await fetch(`notes/${subjectId}/${chapterId}.md`);
    if (!response.ok) throw new Error();
    const markdown = await response.text();
    
    // Split by three dashes on a new line to create blocks
    const blocks = markdown.split(/\n---\n/);
    
    body.innerHTML = blocks.map(block => `
      <div class="note-block">${block.trim()}</div>
    `).join('');
  } catch (err) {
    body.innerHTML = `<div class="note-block">Notes for <strong>${chapterName}</strong> are currently being updated in <code>notes/${subjectId}/${chapterId}.md</code>.</div>`;
  }
}

/**
 * Standard page transition logic
 */
function goPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
    const target = document.getElementById('page-' + id);
    if(target) target.classList.add('on');
    
    // Clean up extra back buttons when moving
    const extraBack = document.querySelector('.main > .backbtn');
    if (extraBack && id !== 'dash') extraBack.remove();
}

// Initialize
buildSubjectDashboard();
