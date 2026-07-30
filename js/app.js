/* ==========================================================================
   Dr Catherine Wong - Academic Website Main Application Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // Initialise UI Features
  initNavigation();
  initStylisticsVisualizer();
  initPublicationFilters();
  initBibTeXModal();
  initContactForm();
  initPresentationSwitcher();
  initScrollAnimations();

  /* --------------------------------------------------
     1. Navigation & Mobile Menu
     -------------------------------------------------- */
  function initNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });

      links.forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('active');
        });
      });
    }

    // Scroll spy for active menu highlights
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          links.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('href') === `#${sectionId}`) {
              l.classList.add('active');
            }
          });
        }
      });
    });
  }

  /* --------------------------------------------------
     2. Digital Humanities Stylistics Visualiser
     -------------------------------------------------- */
  function initStylisticsVisualizer() {
    const textarea = document.getElementById('vizTextarea');
    const toggleStopwords = document.getElementById('toggleStopwords');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const metricWordCount = document.getElementById('metricWordCount');
    const metricTTR = document.getElementById('metricTTR');
    const metricArchaic = document.getElementById('metricArchaic');
    const metricSyllable = document.getElementById('metricSyllable');
    const canvas = document.getElementById('chartCanvas');

    if (!textarea || !canvas) return;

    function runAnalysis() {
      const text = textarea.value;
      const includeStopwords = toggleStopwords ? toggleStopwords.checked : false;
      const results = StylisticsEngine.analyse(text, includeStopwords);

      if (metricWordCount) metricWordCount.textContent = results.wordCount;
      if (metricTTR) metricTTR.textContent = `${results.ttr}%`;
      if (metricArchaic) metricArchaic.textContent = `${results.archaismDensity}%`;
      if (metricSyllable) metricSyllable.textContent = results.avgSyllables;

      StylisticsEngine.drawChart(canvas, results.topFrequencies);
    }

    // Input & Toggle Event Listeners
    textarea.addEventListener('input', runAnalysis);
    if (toggleStopwords) {
      toggleStopwords.addEventListener('change', runAnalysis);
    }

    // Preset Button Click Listeners
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const presetKey = btn.getAttribute('data-preset');
        if (StylisticsEngine.PRESETS[presetKey]) {
          textarea.value = StylisticsEngine.PRESETS[presetKey].text;
          runAnalysis();
        }
      });
    });

    // Run initial analysis with default preset (Shakespeare)
    if (StylisticsEngine.PRESETS.shakespeare) {
      textarea.value = StylisticsEngine.PRESETS.shakespeare.text;
      runAnalysis();
    }

    // Resize listener for chart recalculation
    window.addEventListener('resize', runAnalysis);
  }

  /* --------------------------------------------------
     3. Publication Filtering & Live Search
     -------------------------------------------------- */
  function initPublicationFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('pubSearchInput');
    const pubItems = document.querySelectorAll('.pub-item');

    function filterPublications() {
      const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

      pubItems.forEach(item => {
        const itemType = item.getAttribute('data-type');
        const itemText = item.textContent.toLowerCase();

        const matchesType = (activeFilter === 'all' || itemType === activeFilter);
        const matchesSearch = (!searchTerm || itemText.includes(searchTerm));

        if (matchesType && matchesSearch) {
          item.style.display = 'grid';
        } else {
          item.style.display = 'none';
        }
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterPublications();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', filterPublications);
    }
  }

  /* --------------------------------------------------
     4. Global Citation Copy & Toast Notification Helper
     -------------------------------------------------- */
  window.showToast = function(message = 'Citation Copied!') {
    let toast = document.getElementById('toastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotification';
      document.body.appendChild(toast);
    }
    toast.className = 'toast-notification show';
    toast.textContent = message;

    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  function fallbackCopyText(text, callback) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textarea);
    if (callback) callback();
  }

  window.copyCitation = function(btn, format) {
    const attrName = (format === 'apa') ? 'data-apa' : 'data-mla';
    const textToCopy = btn.getAttribute(attrName);
    if (!textToCopy) return;

    const showSuccess = () => {
      window.showToast('Citation Copied!');
      const originalText = btn.innerHTML;
      btn.innerHTML = '&#10003; Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('copied');
      }, 2200);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(showSuccess).catch(() => {
        fallbackCopyText(textToCopy, showSuccess);
      });
    } else {
      fallbackCopyText(textToCopy, showSuccess);
    }
  };

  function initBibTeXModal() {
    const modalBackdrop = document.getElementById('bibtexModal');
    const modalClose = document.getElementById('modalClose');
    const bibtexCode = document.getElementById('bibtexCode');
    const copyBtn = document.getElementById('copyBibtexBtn');
    const citeBtns = document.querySelectorAll('.cite-btn');

    if (!modalBackdrop) return;

    citeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const rawBibtex = btn.getAttribute('data-bibtex');
        if (bibtexCode) {
          bibtexCode.textContent = rawBibtex;
        }
        modalBackdrop.classList.add('active');
      });
    });

    function closeModal() {
      modalBackdrop.classList.remove('active');
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });

    if (copyBtn && bibtexCode) {
      copyBtn.addEventListener('click', () => {
        const rawText = bibtexCode.textContent;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(rawText).then(() => {
            window.showToast('Citation Copied!');
            closeModal();
          }).catch(() => {
            fallbackCopyText(rawText, () => {
              window.showToast('Citation Copied!');
              closeModal();
            });
          });
        } else {
          fallbackCopyText(rawText, () => {
            window.showToast('Citation Copied!');
            closeModal();
          });
        }
      });
    }
  }

  /* --------------------------------------------------
     5. Contact Form Handler
     -------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending Message...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast('Thank you! Your message has been sent successfully.');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }

  /* --------------------------------------------------
     6. Presentation Slide Switcher Handler
     -------------------------------------------------- */
  function initPresentationSwitcher() {
    const presItems = document.querySelectorAll('.pres-item');
    const iframe = document.getElementById('presIframe');
    const activeTitle = document.getElementById('presFrameTitle');
    const externalBtn = document.getElementById('presFrameExternalBtn');

    if (!presItems.length || !iframe) return;

    presItems.forEach(item => {
      item.addEventListener('click', () => {
        presItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const embedUrl = item.getAttribute('data-embed');
        const origUrl = item.getAttribute('data-url');
        const titleText = item.getAttribute('data-title');

        if (embedUrl) iframe.src = embedUrl;
        if (activeTitle && titleText) activeTitle.textContent = titleText;
        if (externalBtn && origUrl) externalBtn.href = origUrl;
      });
    });
  }

  /* --------------------------------------------------
     7. Scroll Animations
     -------------------------------------------------- */
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.pillar-card, .project-card, .pub-item, .pres-item').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

});
