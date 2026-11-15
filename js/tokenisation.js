document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================================
  // 1. Default examples
  // ============================================================

  const examples = {
    whitespace: 'The king saw the king. The kings smiled.',
    chinese: '國王看見了國王。國王們看見了國王。'
  };

  const tabs = document.querySelectorAll('.token-tab');
  const panels = document.querySelectorAll('.token-panel');
  const results = document.getElementById('token-results');

  const whitespaceInput = document.getElementById(
    'token-whitespace-input'
  );

  const chineseInput = document.getElementById(
    'token-chinese-input'
  );

  const chineseNote = document.getElementById(
    'token-chinese-note'
  );

  // ============================================================
  // 2. Switch between tabs
  // ============================================================

  function switchTab(tabName) {
    tabs.forEach(tab => {
      const selected = tab.dataset.tab === tabName;

      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });

    panels.forEach(panel => {
      panel.hidden = panel.id !== `token-${tabName}`;
    });

    results.hidden = true;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.tab);
    });
  });

  // ============================================================
  // 3. Whitespace tokenisation
  //
  // Split only at whitespace.
  // Preserve punctuation and capitalisation.
  // ============================================================

  function tokeniseWhitespace(text) {
    const trimmed = text.trim();

    if (!trimmed) {
      return [];
    }

    return trimmed.split(/\s+/u);
  }

  // ============================================================
  // 4. Chinese character-based segmentation
  //
  // Treat each written character as a separate unit.
  // Exclude whitespace and punctuation.
  // ============================================================

  function tokeniseChineseCharacters(text) {
    const segmenter = new Intl.Segmenter('zh', {
      granularity: 'grapheme'
    });

    return Array.from(segmenter.segment(text))
      .map(item => item.segment)
      .filter(segment => /[\p{L}\p{N}]/u.test(segment));
  }

  // ============================================================
  // 5. Chinese word-based segmentation
  //
  // Use the browser's language-aware word segmenter.
  // Exclude whitespace and punctuation.
  //
  // Note: Word boundaries are algorithmic decisions.
  // Different tools may segment the same text differently.
  // ============================================================

  function tokeniseChineseWords(text) {
    const segmenter = new Intl.Segmenter('zh', {
      granularity: 'word'
    });

    return Array.from(segmenter.segment(text))
      .filter(item => item.isWordLike)
      .map(item => item.segment);
  }

  // ============================================================
  // 6. Calculate type frequencies
  // ============================================================

  function calculateFrequencies(tokens) {
    const frequencies = new Map();

    tokens.forEach(token => {
      frequencies.set(
        token,
        (frequencies.get(token) || 0) + 1
      );
    });

    return Array.from(frequencies.entries())
      .sort((a, b) => {
        return b[1] - a[1] || a[0].localeCompare(b[0]);
      });
  }

  // ============================================================
  // 7. Display analysis results
  // ============================================================

  function displayResults(tokens) {
    const frequencies = calculateFrequencies(tokens);

    // Token and type counts

    document.getElementById('token-count').textContent =
      tokens.length;

    document.getElementById('token-type-count').textContent =
      frequencies.length;

    // Display individual tokens

    const segmentsContainer = document.getElementById(
      'token-segments'
    );

    segmentsContainer.replaceChildren();

    tokens.forEach((token, index) => {
      const element = document.createElement('span');

      element.className = 'token-unit';
      element.textContent = token;
      element.title = `Token ${index + 1}`;

      segmentsContainer.appendChild(element);
    });

    // Display type-frequency table

    const tableBody = document.getElementById(
      'token-frequency-body'
    );

    tableBody.replaceChildren();

    frequencies.forEach(([type, frequency]) => {
      const row = document.createElement('tr');

      const typeCell = document.createElement('td');
      typeCell.textContent = type;

      const frequencyCell = document.createElement('td');
      frequencyCell.textContent = frequency;

      row.append(typeCell, frequencyCell);
      tableBody.appendChild(row);
    });

    results.hidden = false;
  }

  // ============================================================
  // 8. Analyse whitespace-separated text
  // ============================================================

  document.getElementById('token-whitespace-analyse')
    .addEventListener('click', () => {
      const tokens = tokeniseWhitespace(
        whitespaceInput.value
      );

      displayResults(tokens);
    });

  // ============================================================
  // 9. Analyse Chinese text
  // ============================================================

  function getChineseMethod() {
    return document.querySelector(
      'input[name="token-chinese-method"]:checked'
    ).value;
  }

  document.getElementById('token-chinese-analyse')
    .addEventListener('click', () => {
      const text = chineseInput.value;
      const method = getChineseMethod();

      const tokens = method === 'character'
        ? tokeniseChineseCharacters(text)
        : tokeniseChineseWords(text);

      displayResults(tokens);
    });

  // ============================================================
  // 10. Explain Chinese segmentation methods
  // ============================================================

  const characterExplanation =
    'Character-based segmentation treats each written ' +
    'character as a separate unit. Whitespace and ' +
    'punctuation are excluded.';

  const wordExplanation =
    'Word-based segmentation uses the browser’s Chinese ' +
    'word segmenter to identify word-like units. ' +
    'Whitespace and punctuation are excluded. ' +
    'Different segmentation tools may produce ' +
    'different boundaries.';

  document.querySelectorAll(
    'input[name="token-chinese-method"]'
  ).forEach(radio => {
    radio.addEventListener('change', () => {
      chineseNote.textContent =
        getChineseMethod() === 'character'
          ? characterExplanation
          : wordExplanation;

      results.hidden = true;
    });
  });

  // ============================================================
  // 11. Reset examples
  // ============================================================

  document.getElementById('token-whitespace-reset')
    .addEventListener('click', () => {
      whitespaceInput.value = examples.whitespace;
      results.hidden = true;
    });

  document.getElementById('token-chinese-reset')
    .addEventListener('click', () => {
      chineseInput.value = examples.chinese;

      document.querySelector(
        'input[name="token-chinese-method"][value="character"]'
      ).checked = true;

      chineseNote.textContent = characterExplanation;

      results.hidden = true;
    });

  // ============================================================
  // 12. Hide outdated results when text changes
  // ============================================================

  [whitespaceInput, chineseInput].forEach(input => {
    input.addEventListener('input', () => {
      results.hidden = true;
    });
  });

  // ============================================================
  // 13. Initialise application
  // ============================================================

  switchTab('whitespace');
});
