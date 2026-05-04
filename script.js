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
  // Add other subjects following this structure
];

let curTopicId = null;

function buildSubjectDashboard() {
  curTopicId = null;
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
        <div style="font-size:24px; background:${t.bg}; padding:8px; border-radius:8px;">${t.ico}</div>
        <div><div style="font-weight:700;">${t.name}</div><div style="font-size:11px; color:#64748b;">${t.sub}</div></div>
      </div>
      <button class="pill-g" onclick="event.stopPropagation(); openChapterGrid('${t.id}')">View Chapters</button>`;
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
  document.querySelector('.ph-sub').textContent = 'Select a chapter to read blocks';

  // Add Back Button
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
        <div style="font-size:12px; color:#64748b;">Click to view note blocks</div>`;
    card.onclick = () => renderNoteBlocks(subjectId, ch.id, ch.name);
    grid.appendChild(card);
  });
}

async function renderNoteBlocks(subjectId, chapterId, chapterName) {
  goPage('topic');
  document.getElementById('t-title').textContent = chapterName;
  
  const header = document.getElementById('topic-header');
  header.innerHTML = `<button class="backbtn" onclick="openChapterGrid('${subjectId}')">← Back to Chapters</button>`;
  
  const body = document.getElementById('tab-body');
  body.innerHTML = "<div class='note-block'>Loading your notes...</div>";

  try {
    const response = await fetch(`notes/${subjectId}/${chapterId}.md`);
    if (!response.ok) throw new Error();
    const markdown = await response.text();
    
    // Split by '---' on an empty line to create blocks
    const blocks = markdown.split(/\n---\n/);
    
    body.innerHTML = blocks.map(block => `
      <div class="note-block">${block.trim()}</div>
    `).join('');
  } catch (err) {
    body.innerHTML = `
      <div class="note-block">
        <strong>Error:</strong> Could not load notes for this chapter.<br>
        Please ensure the file exists at: <code>notes/${subjectId}/${chapterId}.md</code>
      </div>`;
  }
}

function goPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
    const target = document.getElementById('page-' + id);
    if(target) target.classList.add('on');
}

// Start
buildSubjectDashboard();
