/* ==========================================================================
   Dr Catherine Wong - Digital Humanities Stylistics Engine
   Calculates live metrics for Early Modern English & literary corpora
   ========================================================================== */

const StylisticsEngine = (function() {

  // Historical & Early Modern English Archaic Lexicon Dictionary
  const ARCHAIC_LEXICON = new Set([
    "thou", "thee", "thy", "thine", "ye", "hath", "doth", "art", "wilt", "shalt", "dost",
    "spake", "quoth", "whereupon", "wherefore", "heretofore", "henceforth", "betwixt",
    "forsooth", "highness", "prithee", "ere", "anon", "oft", "nay", "aye", "whither",
    "thither", "whence", "sooth", "verily", "goodman", "methinks", "twas", "tis"
  ]);

  // Sample Early Modern English Text Presets
  const PRESETS = {
    shakespeare: {
      title: "W. Shakespeare - Sonnet 18 (1609)",
      text: `Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date:
Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd;
And every fair from fair sometime declines,
By chance or nature's changing course untrimm'd;
But thy eternal summer shall not fade
Nor lose possession of that fair thou ow'st;
Nor shall Death brag thou wander'st in his shade,
When in eternal lines to time thou grow'st:
So long as men can breathe or eyes can see,
So long lives this and this gives life to thee.`
    },
    elizabeth: {
      title: "Queen Elizabeth I - Tilbury Speech (1588)",
      text: `My loving people, We have been persuaded by some that are careful of our safety, to take heed how we commit our selves to armed multitudes, for fear of treachery; but I assure you I do not desire to live to distrust my loving and faithful people.
Let tyrants fear, I have always so behaved myself that, under God, I have placed my chiefest strength and safeguard in the loyal hearts and good-will of my subjects; and therefore I am come amongst you, as you see, at this time, not for my recreation and disport, but being resolved, in the midst and heat of the battle, to live and die amongst you all; to lay down for my God, and for my kingdom, and my people, my honour and my blood, even in the dust.
I know I have the body but of a weak and feeble woman; but I have the heart and stomach of a king, and of a king of England too, and think foul scorn that Parma or Spain, or any prince of Europe, should dare to invade the borders of my realm.`
    },
    donne: {
      title: "John Donne - Devotions Upon Emergent Occasions (1624)",
      text: `No man is an island, entire of itself; every man is a piece of the continent, a part of the main. If a clod be washed away by the sea, Europe is the less, as well as if a promontory were, as well as if a manor of thy friend's or of thine own were: any man's death diminishes me, because I am involved in mankind, and therefore never send to know for whom the bell tolls; it tolls for thee.`
    },
    marlowe: {
      title: "Christopher Marlowe - Doctor Faustus (1604)",
      text: `Was this the face that launch'd a thousand ships,
And burnt the topless towers of Ilium?
Sweet Helen, make me immortal with a kiss.
Her lips suck forth my soul: see where it flies!
Come, Helen, come, give me my soul again.
Here will I dwell, for heaven be in these lips,
And all is dross that is not Helena.
I will be Paris, and for love of thee,
Instead of Troy, shall Wertenberg be sack'd;
And I will combat with weak Menelaus,
And wear thy colours on my plumed crest;
Yea, I will wound Achilles in the heel,
And then return to Helen for a kiss.`
    }
  };

  // Syllable Estimation Helper
  function countSyllables(word) {
    word = word.toLowerCase().replace(/(?:[^laeiouy]|ed|es|e)$/i, '');
    word = word.replace(/^y/i, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  // Tokenize Text into Words
  function tokenize(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9'\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);
  }

  // Analyse Stylistic Metrics
  function analyse(text, includeStopwords = false) {
    if (!text || text.trim().length === 0) {
      return {
        wordCount: 0,
        uniqueCount: 0,
        ttr: 0,
        archaismDensity: 0,
        avgSyllables: 0,
        topFrequencies: []
      };
    }

    const tokens = tokenize(text);
    const wordCount = tokens.length;
    const freqMap = {};
    let archaicCount = 0;
    let totalSyllables = 0;

    tokens.forEach(token => {
      // Clean quotes
      const cleanToken = token.replace(/^'+|'+$/g, '');
      if (cleanToken.length === 0) return;
      freqMap[cleanToken] = (freqMap[cleanToken] || 0) + 1;

      if (ARCHAIC_LEXICON.has(cleanToken)) {
        archaicCount++;
      }

      totalSyllables += countSyllables(cleanToken);
    });

    const uniqueWords = Object.keys(freqMap);
    const uniqueCount = uniqueWords.length;
    const ttr = wordCount > 0 ? ((uniqueCount / wordCount) * 100).toFixed(1) : 0;
    const archaismDensity = wordCount > 0 ? ((archaicCount / wordCount) * 100).toFixed(1) : 0;
    const avgSyllables = wordCount > 0 ? (totalSyllables / wordCount).toFixed(2) : 0;

    // Filter out common English stop words unless includeStopwords is true
    const stopWords = new Set(["the", "and", "to", "of", "a", "i", "in", "is", "that", "it", "for", "you", "my", "with", "on", "as", "be", "or", "by", "not", "this", "all", "he", "she", "his", "her", "their", "they", "was", "were", "had", "have", "but", "so", "if", "at", "from", "an", "no", "we", "me", "him", "your", "us", "are", "do"]);
    
    const sortedFreqs = Object.entries(freqMap)
      .filter(([w]) => includeStopwords ? w.length > 0 : (w.length > 1 && !stopWords.has(w)))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      wordCount,
      uniqueCount,
      ttr,
      archaismDensity,
      avgSyllables,
      topFrequencies: sortedFreqs
    };
  }

  // Draw Frequency Chart on HTML5 Canvas
  function drawChart(canvas, frequencies) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth || 400;
    const height = canvas.clientHeight || 140;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    if (!frequencies || frequencies.length === 0) {
      ctx.fillStyle = '#71717a';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Enter or select text to generate frequency distribution chart.', 10, 70);
      return;
    }

    const maxFreq = Math.max(...frequencies.map(f => f[1]), 1);
    const barPadding = 12;
    const availableWidth = width - 40;
    const barWidth = (availableWidth / frequencies.length) - barPadding;
    const startX = 20;
    const startY = height - 25;
    const maxHeight = height - 40;

    frequencies.forEach((item, index) => {
      const [word, count] = item;
      const barHeight = (count / maxFreq) * maxHeight;
      const x = startX + index * (barWidth + barPadding);
      const y = startY - barHeight;

      // Draw Bar in Bright Yellow
      ctx.fillStyle = '#ffd000';
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
      ctx.fill();

      // Count label on top of bar
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Fira Code, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(count.toString(), x + barWidth / 2, y - 4);

      // Word label under bar
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(word, x + barWidth / 2, startY + 16);
    });
  }

  return {
    PRESETS,
    analyse,
    analyze: analyse,
    drawChart
  };

})();
