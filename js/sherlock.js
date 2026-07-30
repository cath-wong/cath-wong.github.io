/* ==========================================================================
   Sherlock Holmes in the Computer - Interactive DH Teaching Tool Engine
   Based on Research & Presentation by Dr Catherine Wong (IVACS 2024, Cambridge)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Dataset: 10 Short Stories Corpus & Nouns Following 'the'
  const CLUSTER_DATA = [
    { word: 'door', count: 66, percentage: '1.42%', type: 'Narrative Boundary / Client Arrival' },
    { word: 'matter', count: 65, percentage: '1.40%', type: 'Case Problem Definition' },
    { word: 'other', count: 65, percentage: '1.40%', type: 'Comparative Observation' },
    { word: 'same', count: 47, percentage: '1.01%', type: 'Pattern Recognition' },
    { word: 'room', count: 46, percentage: '0.99%', type: 'Spatial Confinement' },
    { word: 'man', count: 39, percentage: '0.84%', type: 'Suspect / Person of Interest' },
    { word: 'house', count: 38, percentage: '0.82%', type: 'Setting Location' },
    { word: 'case', count: 36, percentage: '0.77%', type: 'Investigation Scope' },
    { word: 'time', count: 35, percentage: '0.75%', type: 'Temporal Marker' },
    { word: 'first', count: 33, percentage: '0.71%', type: 'Ordinal Sequence' }
  ];

  const STORY_DATA = {
    bohemia: {
      title: 'A Scandal in Bohemia (SH1)',
      doorTcu: 39,
      totalTcus: 259,
      yMax: 12,
      passage: 'A slow and heavy step, which had been heard upon the stairs and in the passage, paused immediately outside the door. Then there was a loud and authoritative tap of obstinacy. "Come in!" said Holmes.',
      client: 'Count Von Kramm (Wilhelm Gottsreich Sigismond von Ormstein, Grand Duke of Cassel-Felstein)',
      analysis: "The first occurrence of 'the door' at TCU 39 marks the physical entrance of the masked client, transforming Watson's introductory frame into active narrative mystery.",
      povPoints: [
        { segment: '1-20', sh: 0, jw: 12 },
        { segment: '21-40', sh: 5, jw: 11 },
        { segment: '41-60', sh: 8, jw: 2 },
        { segment: '61-80', sh: 11, jw: 0 },
        { segment: '81-100', sh: 10, jw: 0 },
        { segment: '101-120', sh: 9, jw: 4 },
        { segment: '121-140', sh: 8, jw: 12 },
        { segment: '141-160', sh: 9, jw: 9 },
        { segment: '161-180', sh: 10, jw: 5 },
        { segment: '181-200', sh: 3, jw: 8 },
        { segment: '201-220', sh: 2, jw: 10 },
        { segment: '221-240', sh: 8, jw: 1 },
        { segment: '241-260', sh: 5, jw: 3 }
      ]
    },
    redheaded: {
      title: 'The Red-Headed League (SH2)',
      doorTcu: 2,
      totalTcus: 218,
      yMax: 12,
      passage: "With an apology for my intrusion, I was about to withdraw when Holmes pulled me abruptly into the room and closed the door behind me.",
      client: "Mr Jabez Wilson (Red-headed pawnbroker)",
      analysis: "'The door' is closed immediately at TCU 2 to lock Watson, Holmes, and the client inside Baker Street, initiating the narrative confinement.",
      povPoints: [
        { segment: '1-20', sh: 2, jw: 10 },
        { segment: '21-40', sh: 7, jw: 8 },
        { segment: '41-60', sh: 9, jw: 5 },
        { segment: '61-80', sh: 10, jw: 1 },
        { segment: '81-100', sh: 11, jw: 0 },
        { segment: '101-120', sh: 11, jw: 0 },
        { segment: '121-140', sh: 10, jw: 0 },
        { segment: '141-160', sh: 8, jw: 5 },
        { segment: '161-180', sh: 7, jw: 1 },
        { segment: '181-200', sh: 4, jw: 9 },
        { segment: '201-220', sh: 8, jw: 1 }
      ]
    },
    boscombe: {
      title: 'The Boscombe Valley Mystery (SH4)',
      doorTcu: 130,
      totalTcus: 215,
      yMax: 12,
      passage: 'We were seated at breakfast when a telegram was handed to me. It was from Holmes: "Have you a couple of days to spare? Have just been wired for from West of England in connection with Boscombe Valley tragedy."',
      client: 'Miss Turner & James McCarthy',
      analysis: "In SH4, 'the door' appears at TCU 130 after the railway trip and preliminary discussion, marking the entry into the hotel room investigation scene.",
      povPoints: [
        { segment: '1-20', sh: 3, jw: 11 },
        { segment: '21-40', sh: 8, jw: 7 },
        { segment: '41-60', sh: 9, jw: 6 },
        { segment: '61-80', sh: 10, jw: 2 },
        { segment: '81-100', sh: 10, jw: 0 },
        { segment: '101-120', sh: 10, jw: 0 },
        { segment: '121-140', sh: 8, jw: 5 },
        { segment: '141-160', sh: 7, jw: 8 },
        { segment: '161-180', sh: 5, jw: 9 },
        { segment: '181-200', sh: 4, jw: 10 },
        { segment: '201-215', sh: 2, jw: 12 }
      ]
    },
    twistedlip: {
      title: 'The Man with the Twisted Lip (SH6)',
      doorTcu: 62,
      totalTcus: 220,
      yMax: 15,
      passage: 'He stepped across the room and opened the door. In the light of the hall lamp I saw a woman standing outside in a dark cloak.',
      client: 'Mrs Isa Whitney & Neville St. Clair',
      analysis: "Watson\'s domestic prelude is disrupted when 'the door' opens at TCU 62 to admit the distressed client, shifting focus to London\'s opium den underworld.",
      povPoints: [
        { segment: '1-20', sh: 0, jw: 13 },
        { segment: '21-40', sh: 0, jw: 11 },
        { segment: '41-60', sh: 5, jw: 5 },
        { segment: '61-80', sh: 0, jw: 10 },
        { segment: '81-100', sh: 0, jw: 11 },
        { segment: '101-120', sh: 7, jw: 11 },
        { segment: '121-140', sh: 10, jw: 10 },
        { segment: '141-160', sh: 9, jw: 10 },
        { segment: '161-180', sh: 8, jw: 8 },
        { segment: '181-200', sh: 7, jw: 4 },
        { segment: '201-220', sh: 11, jw: 11 }
      ]
    },
    bachelor: {
      title: 'The Adventure of the Noble Bachelor (SH10)',
      doorTcu: 130,
      totalTcus: 225,
      yMax: 10,
      passage: 'A footman opened the door and announced Lord Robert St. Simon, who entered with a solemn and aristocratic bearing.',
      client: 'Lord Robert St. Simon',
      analysis: "Watson\'s framing narration opens the story before 'the door' introduces Lord Robert St. Simon at TCU 130, triggering Holmes\'s investigation into the missing bride.",
      povPoints: [
        { segment: '1-20', sh: 1, jw: 10 },
        { segment: '21-40', sh: 10, jw: 10 },
        { segment: '41-60', sh: 10, jw: 10 },
        { segment: '61-80', sh: 10, jw: 7 },
        { segment: '81-100', sh: 10, jw: 0 },
        { segment: '101-120', sh: 10, jw: 0 },
        { segment: '121-140', sh: 10, jw: 0 },
        { segment: '141-160', sh: 8, jw: 9 },
        { segment: '161-180', sh: 7, jw: 1 },
        { segment: '181-200', sh: 4, jw: 9 },
        { segment: '201-220', sh: 3, jw: 2 }
      ]
    }
  };

  // 2. Render Cluster Frequency Table & Bar Progress
  function renderClusterTable() {
    const tbody = document.getElementById('clusterTableBody');
    if (!tbody) return;

    tbody.innerHTML = CLUSTER_DATA.map((item, idx) => `
      <tr class="cluster-row">
        <td style="font-weight: 700; color: var(--accent-yellow); font-family: var(--font-mono);">${idx + 1}</td>
        <td style="font-weight: 700; color: #ffffff; font-family: var(--font-mono);">${item.word}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="flex: 1; height: 8px; background: #27272a; border-radius: 4px; overflow: hidden;">
              <div style="width: ${(item.count / 66) * 100}%; height: 100%; background: ${idx === 0 ? 'var(--accent-yellow)' : '#a1a1aa'};"></div>
            </div>
            <span style="font-weight: 600; font-family: var(--font-mono); color: #ffffff;">${item.count}</span>
          </div>
        </td>
      </tr>
    `).join('');
  }

  let currentPovPoints = [];
  let currentStoryYMax = 12;
  let hoveredPovIndex = null;

  // 3. Render Story Boundary Analysis
  function updateStoryAnalysis(storyKey) {
    const story = STORY_DATA[storyKey];
    if (!story) return;

    document.getElementById('storyTitleDisplay').textContent = story.title;
    document.getElementById('doorTcuBadge').textContent = `TCU #${story.doorTcu} of ${story.totalTcus}`;
    document.getElementById('passageQuoteDisplay').textContent = `'${story.passage}'`;
    document.getElementById('clientNameDisplay').textContent = story.client;
    document.getElementById('analysisTextDisplay').textContent = story.analysis;

    // Draw POV chart
    currentPovPoints = story.povPoints || [];
    currentStoryYMax = story.yMax || 12;
    hoveredPovIndex = null;
    drawPovChart(currentPovPoints, null, currentStoryYMax);
  }

  // 4. Draw Canvas Line Chart for Holmes vs. Watson POV Dynamics
  function drawPovChart(points, hoverIdx = null, customYMax = null) {
    const canvas = document.getElementById('povCanvas');
    if (!canvas || !points || points.length === 0) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = 320 * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    const width = rect.width;
    const height = 320;
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 30;
    const paddingBottom = 45;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    ctx.clearRect(0, 0, width, height);

    // Dynamic Y Max (matching slide axes: 15 for Twisted Lip, 12 for Bohemia/Redheaded, 10 for Noble Bachelor)
    let maxVal = 0;
    points.forEach(p => {
      if (p.sh > maxVal) maxVal = p.sh;
      if (p.jw > maxVal) maxVal = p.jw;
    });
    const yMax = customYMax || currentStoryYMax || (maxVal > 12 ? 15 : (maxVal > 10 ? 12 : 10));

    // Background Grid
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y = paddingTop + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();

      const labelVal = Math.round(yMax - (yMax / 4) * i);
      ctx.fillStyle = '#71717a';
      ctx.font = '10px Fira Code, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(labelVal, paddingLeft - 8, y + 4);
    }

    const n = points.length;

    // Draw Watson Line (Grey)
    ctx.strokeStyle = '#a1a1aa';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach((p, idx) => {
      const x = paddingLeft + (chartWidth / (n - 1)) * idx;
      const y = paddingTop + chartHeight - (p.jw / yMax) * chartHeight;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Holmes Line (Bright Yellow)
    ctx.strokeStyle = '#ffd000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    points.forEach((p, idx) => {
      const x = paddingLeft + (chartWidth / (n - 1)) * idx;
      const y = paddingTop + chartHeight - (p.sh / yMax) * chartHeight;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Points & X-Labels
    points.forEach((p, idx) => {
      const x = paddingLeft + (chartWidth / (n - 1)) * idx;
      const yJw = paddingTop + chartHeight - (p.jw / yMax) * chartHeight;
      const ySh = paddingTop + chartHeight - (p.sh / yMax) * chartHeight;

      const isHovered = (idx === hoverIdx);

      // Watson dot
      ctx.fillStyle = '#a1a1aa';
      ctx.beginPath();
      ctx.arc(x, yJw, isHovered ? 6 : 4, 0, Math.PI * 2);
      ctx.fill();

      // Holmes dot
      ctx.fillStyle = '#ffd000';
      ctx.beginPath();
      ctx.arc(x, ySh, isHovered ? 7 : 5, 0, Math.PI * 2);
      ctx.fill();

      // X Label
      ctx.fillStyle = isHovered ? '#ffd000' : '#71717a';
      ctx.font = isHovered ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      if (idx % 2 === 0 || idx === n - 1 || isHovered) {
        ctx.fillText(p.segment, x, height - 12);
      }
    });

    // Draw Hover Guideline & Interactive Data Tooltip
    if (hoverIdx !== null && points[hoverIdx]) {
      const p = points[hoverIdx];
      const x = paddingLeft + (chartWidth / (n - 1)) * hoverIdx;
      const yJw = paddingTop + chartHeight - (p.jw / yMax) * chartHeight;
      const ySh = paddingTop + chartHeight - (p.sh / yMax) * chartHeight;

      // Vertical Guideline Crosshair
      ctx.strokeStyle = 'rgba(255, 208, 0, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x, paddingTop);
      ctx.lineTo(x, paddingTop + chartHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      // Glowing rings around hovered dots
      ctx.fillStyle = 'rgba(161, 161, 170, 0.35)';
      ctx.beginPath();
      ctx.arc(x, yJw, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 208, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(x, ySh, 10, 0, Math.PI * 2);
      ctx.fill();

      // Tooltip Card Dimensions & Auto-Positioning
      const boxW = 165;
      const boxH = 68;
      let boxX = x + 12;
      if (boxX + boxW > width - 15) {
        boxX = x - boxW - 12;
      }
      let boxY = Math.min(yJw, ySh) - 15;
      if (boxY < paddingTop + 5) boxY = paddingTop + 5;
      if (boxY + boxH > height - paddingBottom) boxY = height - paddingBottom - boxH;

      // Card Container background
      ctx.fillStyle = 'rgba(24, 24, 27, 0.95)';
      ctx.strokeStyle = '#ffd000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(boxX, boxY, boxW, boxH, 6);
      } else {
        ctx.rect(boxX, boxY, boxW, boxH);
      }
      ctx.fill();
      ctx.stroke();

      // Tooltip Data Labels
      ctx.textAlign = 'left';

      // Header: Segment TCUs
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '10px Fira Code, monospace';
      ctx.fillText(`TCUs ${p.segment}`, boxX + 10, boxY + 16);

      // Sherlock Holmes count
      ctx.fillStyle = '#ffd000';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`Holmes (SH): ${p.sh} TCUs`, boxX + 10, boxY + 34);

      // Watson count
      ctx.fillStyle = '#e4e4e7';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`Watson (JW): ${p.jw} TCUs`, boxX + 10, boxY + 52);

      // Dominance Badge
      let roleLabel = p.sh > p.jw ? 'SH Dominating' : (p.jw > p.sh ? 'JW Framing' : 'Equal');
      ctx.fillStyle = p.sh > p.jw ? '#ffd000' : '#a1a1aa';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(roleLabel, boxX + boxW - 10, boxY + 16);
    }
  }

  // 5. Interactive Teaching Quiz Engine
  function initQuiz() {
    const quizCards = document.querySelectorAll('.quiz-card');
    quizCards.forEach(card => {
      const options = card.querySelectorAll('.quiz-option');
      const resultBox = card.querySelector('.quiz-result');

      options.forEach(btn => {
        btn.addEventListener('click', () => {
          const isCorrect = btn.dataset.correct === 'true';
          const explanation = btn.dataset.explanation || '';

          options.forEach(b => b.classList.remove('selected-correct', 'selected-wrong'));

          if (isCorrect) {
            btn.classList.add('selected-correct');
            if (resultBox) {
              resultBox.style.display = 'block';
              resultBox.style.background = 'rgba(34, 197, 94, 0.15)';
              resultBox.style.borderColor = '#22c55e';
              resultBox.style.color = '#ffffff';
              resultBox.innerHTML = `<strong>Correct!</strong> ${explanation}`;
            }
          } else {
            btn.classList.add('selected-wrong');
            if (resultBox) {
              resultBox.style.display = 'block';
              resultBox.style.background = 'rgba(239, 68, 68, 0.15)';
              resultBox.style.borderColor = '#ef4444';
              resultBox.style.color = '#ffffff';
              resultBox.innerHTML = '<strong>Incorrect.</strong> Review the narratology and corpus analysis above and try again.';
            }
          }
        });
      });
    });
  }

  // 6. Setup Story Selector Tabs
  function initStorySelector() {
    const buttons = document.querySelectorAll('#storySelectorWrap .story-tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.dataset.story;
        updateStoryAnalysis(key);
      });
    });
  }

  // 7. Collapsible "Why The Door?" Hypothesis Compare Engine
  function initHypothesisCompare() {
    const btn = document.getElementById('compareAnswerBtn');
    const input = document.getElementById('studentHypothesisInput');
    const container = document.getElementById('preparedAnswerContainer');
    const feedback = document.getElementById('userAnswerFeedback');

    if (!btn || !container) return;

    function revealAnswer() {
      container.style.display = 'block';
      if (input && input.value.trim() !== '') {
        feedback.style.display = 'block';
        feedback.innerHTML = `<strong>Your hypothesis:</strong> "${escapeHtml(input.value.trim())}"`;
      } else {
        feedback.style.display = 'none';
      }
      btn.textContent = 'Hide Comparison';
    }

    function toggleAnswer() {
      if (container.style.display === 'none' || container.style.display === '') {
        revealAnswer();
      } else {
        container.style.display = 'none';
        btn.textContent = 'Compare!';
      }
    }

    btn.addEventListener('click', toggleAnswer);

    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          revealAnswer();
        }
      });
    }
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // 8. Canvas Interactivity Engine (Mouse Hover & Tooltips)
  function initPovCanvasInteractivity() {
    const canvas = document.getElementById('povCanvas');
    if (!canvas) return;

    canvas.addEventListener('mousemove', (e) => {
      if (!currentPovPoints || currentPovPoints.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;

      const paddingLeft = 45;
      const paddingRight = 20;
      const chartWidth = rect.width - paddingLeft - paddingRight;
      const n = currentPovPoints.length;

      let closestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < n; i++) {
        const x = paddingLeft + (chartWidth / (n - 1)) * i;
        const dist = Math.abs(mouseX - x);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = i;
        }
      }

      if (minDistance < (chartWidth / (n - 1)) * 0.85) {
        if (hoveredPovIndex !== closestIdx) {
          hoveredPovIndex = closestIdx;
          drawPovChart(currentPovPoints, hoveredPovIndex);
        }
      } else if (hoveredPovIndex !== null) {
        hoveredPovIndex = null;
        drawPovChart(currentPovPoints, null);
      }
    });

    canvas.addEventListener('mouseleave', () => {
      if (hoveredPovIndex !== null) {
        hoveredPovIndex = null;
        drawPovChart(currentPovPoints, null);
      }
    });
  }

  // Initialize
  renderClusterTable();
  initStorySelector();
  initQuiz();
  initHypothesisCompare();
  initPovCanvasInteractivity();
  updateStoryAnalysis('bohemia');

  // Handle Resize
  window.addEventListener('resize', () => {
    const activeBtn = document.querySelector('#storySelectorWrap .story-tab-btn.active');
    const key = activeBtn ? activeBtn.dataset.story : 'bohemia';
    updateStoryAnalysis(key);
  });
});
