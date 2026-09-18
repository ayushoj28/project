// Initialize React and HTM bindings
const ReactObj = (typeof window !== "undefined" ? window.React : null) || (typeof React !== "undefined" ? React : null);
const ReactDOMObj = (typeof window !== "undefined" ? window.ReactDOM : null) || (typeof ReactDOM !== "undefined" ? ReactDOM : null);
const htmObj = (typeof window !== "undefined" ? window.htm : null) || (typeof htm !== "undefined" ? htm : null);

if (!ReactObj || !htmObj) {
  console.error("React or HTM failed to load.");
}

const { useState, useEffect, useRef } = ReactObj || {};
const html = htmObj ? htmObj.bind(ReactObj.createElement) : () => null;

const C = {
  name: "Chandni",
  nickname: "Khushu",
  petName1: "bby gurl",
  petName2: "khuchu puu",
  song: "A Romantic Soundtrack for Chandni",
  audio: "./music/song.mp3",
  letter: [
    "Chandni, my sweet, adorable khuchu pu bby gurl,",
    "I don’t think you realize just how much my heart lights up every single time your name pops up on my screen or whenever you cross my mind. Just like the moonlight your name carries, you have this gentle, magical way of making even the most ordinary days feel extra bright, warm, and full of joy. You are my little ray of sunshine wrapped in the softest, sweetest moonbeams.",
    "Being with you is like having a constant reason to smile. From your adorable little habits to the way your laugh instantly brightens up my whole mood, everything about you is my favorite thing. You’re my absolute comfort, my safe haven, and my favorite person to dream about. When I'm tired, thinking of you gives me energy. When I'm stressed, your memory brings me instant peace. You are, quite literally, my cozy happy place in human form.",
    "I catch myself thinking about you at the most random times of the day—wondering what you’re doing, wishing I could pull you into a big squeeze, or just hoping you’re smiling that precious smile of yours. You have completely taken over my heart, and honestly? I wouldn't have it any other way.",
    "Thank you for being so endlessly cute, for filling my life with sweet giggles, and for being the most wonderful part of my world. I love you to the moon, the stars, and all the way back again, my gorgeous Chandni."
  ]
};

const pages = [
  "welcome",
  "penguin",
  "choose",
  "birthday",
  "story",
  "love",
  "hug",
  "music",
  "letter",
  "final"
];

function go(p) {
  if (typeof window !== "undefined") {
    window.location.hash = p;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Romantic Web Audio Synth (Music Box melody fallback)
class RomanticAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.noteIndex = 0;
    this.notes = [
      261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 349.23,
      392.00, 440.00, 523.25, 587.33, 523.25, 392.00, 329.63, 261.63,
      293.66, 349.23, 440.00, 523.25, 493.88, 392.00, 329.63, 293.66,
      261.63, 329.63, 392.00, 523.25, 659.25, 587.33, 523.25, 392.00
    ];
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playNote(freq) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    // Warm harmonics
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, this.ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 1.25);
  }

  start(onTick) {
    this.init();
    this.isPlaying = true;
    this.noteIndex = 0;
    
    const step = () => {
      if (!this.isPlaying) return;
      const freq = this.notes[this.noteIndex % this.notes.length];
      this.playNote(freq);
      this.noteIndex++;
      if (onTick) onTick((this.noteIndex % this.notes.length) / this.notes.length * 100);
      this.timer = setTimeout(step, 420);
    };
    step();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) clearTimeout(this.timer);
  }
}

const audioEngine = new RomanticAudioEngine();

function Penguin({ mood = "", small = false }) {
  return html`
    <div className=${"penguin-wrap " + (small ? "small " : "") + mood}>
      <div className="penguin-sparkle">✨</div>
      <div className="penguin-crying-tears">
        <span className="tear left">💧</span>
        <span className="tear right">💧</span>
        <span className="tear splash-left">💦</span>
        <span className="tear splash-right">💦</span>
      </div>
      <div className="penguin-happy-hearts">
        <span className="happy-heart h1">💖</span>
        <span className="happy-heart h2">✨</span>
        <span className="happy-heart h3">🥰</span>
      </div>
      <div className="penguin">
        <div className="penguin-head">
          <div className="penguin-blush left"></div>
          <div className="penguin-blush right"></div>
          <div className="penguin-eyes">
            <i className="eye left"></i>
            <i className="eye right"></i>
          </div>
          <div className="penguin-beak">
            <b>♥</b>
          </div>
        </div>
        <div className="penguin-belly">
          <div className="belly-heart">♥</div>
        </div>
        <div className="penguin-wing left"></div>
        <div className="penguin-wing right"></div>
        <div className="penguin-feet">
          <span className="foot left"></span>
          <span className="foot right"></span>
        </div>
      </div>
    </div>
  `;
}

function Decor() {
  return html`
    <div className="decor-layer">
      <div className="heart-field">
        ${Array.from({ length: 20 }, (_, i) => html`
          <span key=${i} style=${{
            left: `${(i * 19 + 7) % 96}%`,
            animationDelay: `${(i * 0.45) % 6}s`,
            fontSize: `${14 + (i % 4) * 8}px`,
            opacity: 0.15 + (i % 3) * 0.1
          }}>♥</span>
        `)}
      </div>
      <div className="flower-corners">
        <span className="flower top-left">🌷</span>
        <span className="flower top-right">🌸</span>
        <span className="flower bottom-left">🌸</span>
        <span className="flower bottom-right">🌷</span>
      </div>
    </div>
  `;
}

function Layout({ children, page }) {
  const currentIndex = pages.indexOf(page);
  const currentStep = currentIndex >= 0 ? currentIndex + 1 : 1;
  const progressPercent = (currentStep / pages.length) * 100;

  return html`
    <div className="app">
      <${Decor} />
      <header className="progress-header">
        <div className="progress-bar-wrap">
          <span className="progress-heart">❤️</span>
          <div className="progress-track">
            <i className="progress-fill" style=${{ width: `${progressPercent}%` }}></i>
          </div>
          <small className="progress-counter">${currentStep} / ${pages.length}</small>
        </div>
      </header>
      <main className="page fade-in">
        ${children}
      </main>
      <footer className="brand-mark">
        <span>made with ❤️ just for Chandni (Khushu)</span>
      </footer>
    </div>
  `;
}

function Welcome() {
  return html`
    <section className="hero-page">
      <div className="eyebrow">✨ A SPECIAL SURPRISE FOR CHANDNI ✨</div>
      <h1>Hey Khushu... <span>❤️</span></h1>
      <p className="subtitle">I crafted a little magical world for my favorite bby gurl, my sweet khuchu puu...</p>
      <div className="penguin-stage">
        <${Penguin} mood="waving" />
      </div>
      <button className="btn glow" onClick=${() => go("penguin")}>
        Open Your Surprise, Chandni 💌
      </button>
      <p className="tiny-promise">Promise me you'll stay till the end, khuchu puu? 🥺</p>
    </section>
  `;
}

function PenguinPage() {
  const [n, setN] = useState(0);
  const [isHappy, setIsHappy] = useState(false);

  const messages = [
    "Are you ready for your birthday surprise, my sweet Chandni? 👀",
    "Khushu, did you really just tap NO? Look at him... 🥺💧",
    "bby gurl, he's literally crying his little heart out! 😭💔",
    "*Inconsolable penguin sobbing noises for khuchu puu* 🐧🌊",
    "Please don't break his tiny penguin heart, Chandni! Say YES! 🥺❤️"
  ];
  const msg = isHappy 
    ? "Yaaay!! Khushu made the penguin super happy! 🥰💖 Loading your surprise..." 
    : messages[Math.min(n, messages.length - 1)];

  function handleYes() {
    setIsHappy(true);
    setTimeout(() => {
      go("choose");
    }, 900);
  }

  return html`
    <section className="center-page">
      <div className="eyebrow">
        ${isHappy ? "🥰 PENGUIN IS OVERJOYED! 🎉" : (n > 0 ? "😭 PENGUIN IS HEARTBROKEN 💔" : "THE PENGUIN ASKS KHUSHU 🐧")}
      </div>
      <h2>
        ${isHappy ? "Yay Khushu! 🥰✨" : (n > 0 ? "You Made Him Cry, Khushu! 🥺" : "Wait... Why Did You Come Here, bby gurl? <em>👀</em>")}
      </h2>
      <p className="soft-copy dynamic-msg">${msg}</p>
      
      <div className="penguin-stage">
        <${Penguin} mood=${isHappy ? "happy" : (n > 0 ? "crying" : "confused")} />
      </div>

      <div className="choice-row">
        <button 
          className=${"btn yes pulse " + (isHappy ? "celebrating-yes" : "")} 
          onClick=${handleYes}
          style=${{
            transform: `scale(${Math.min(1.35, 1 + n * 0.08)})`,
            zIndex: 10
          }}
        >
          ${isHappy ? "Yay Khushu! 🥰❤️" : (n > 0 ? "Okay Fine, YES! ❤️" : "YES I WANT TO SEE ❤️")}
        </button>
        ${!isHappy ? html`
          <button 
            className="btn no" 
            onClick=${() => setN(prev => prev + 1)}
            style=${n > 0 ? {
              transform: `scale(${Math.max(0.65, 1 - n * 0.08)})`,
              opacity: Math.max(0.4, 1 - n * 0.12)
            } : {}}
          >
            ${n === 0 ? "NO 😏" : n === 1 ? "Still No 😢" : n === 2 ? "No (Monster) 🙈" : "No 💔"}
          </button>
        ` : null}
      </div>
      
      ${n > 0 && !isHappy ? html`
        <p className="cry-counter-hint">
          Tears shed: <strong>${n * 42} 💧</strong> • Click YES to cheer him up, Khushu! ❤️
        </p>
      ` : null}
    </section>
  `;
}

function Choose() {
  const [selected, setSelected] = useState(-1);
  const companions = [
    ["shy", "Shy Penguin", "A little quiet, but secretly head over heels in love with Khushu. 🥺"],
    ["romantic", "Romantic Penguin", "Good choice, Chandni... I have so many sweet confessions for you. ❤️"],
    ["crazy", "Playful Penguin", "Unlimited giggles, chaos, and warm cuddles for khuchu puu! 🥰"]
  ];

  return html`
    <section className="content-page">
      <div className="eyebrow">CHAPTER 3 • CHOOSE FOR KHUSHU</div>
      <h2>Pick Your Companion, Chandni <em>🐧</em></h2>
      <p className="soft-copy">Pick your little buddy to guide you through your story, bby gurl.</p>
      <div className="penguin-grid">
        ${companions.map((x, i) => html`
          <button 
            className=${"penguin-card " + (selected === i ? "selected" : "")} 
            key=${i} 
            onClick=${() => setSelected(i)}
          >
            <div className="card-avatar">
              <${Penguin} mood=${x[0]} small=${true} />
            </div>
            <h3>${x[1]}</h3>
            <p className="desc">${selected === i ? x[2] : "Tap to pick me ✨"}</p>
            ${selected === i ? html`<span className="selected-badge">✓ Chosen</span>` : null}
          </button>
        `)}
      </div>
      ${selected >= 0 ? html`
        <button className="btn glow mt-6" onClick=${() => go("birthday")}>
          Continue to Chandni's Big Moment →
        </button>
      ` : html`
        <p className="select-prompt">Tap any penguin to continue, khuchu puu ✨</p>
      `}
    </section>
  `;
}

function Birthday() {
  const [wished, setWished] = useState(false);
  const [confetti, setConfetti] = useState([]);

  function blowCandle() {
    setWished(true);
    const particles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 320,
      y: -50 - Math.random() * 250,
      color: ["#ec4899", "#f43f5e", "#fbbf24", "#a855f7", "#38bdf8"][i % 5],
      char: ["✨", "💖", "🎉", "🌟", "🌸", "🎂"][i % 6]
    }));
    setConfetti(particles);
  }

  return html`
    <section className="birthday-page">
      <div className="eyebrow">🎉 THE CELEBRATION MOMENT 🎉</div>
      <h1 className="birthday-title">HAPPY BIRTHDAY CHANDNI <span>❤️</span></h1>
      <p className="birthday-line">
        Today isn't just another day... it's the day the universe blessed the world with my precious Khushu, my sweet bby gurl.
      </p>
      <div className="celebration-stage">
        <div className="confetti-container">
          ${confetti.map(c => html`
            <span 
              key=${c.id} 
              className="particle" 
              style=${{
                '--dx': `${c.x}px`,
                '--dy': `${c.y}px`,
                color: c.color
              }}
            >${c.char}</span>
          `)}
        </div>
        <div className="stage-penguin">
          <${Penguin} mood="celebrating" />
        </div>
        <button className="cake-btn" onClick=${blowCandle} title="Tap candle to blow it out!">
          <div className=${"flame " + (wished ? "off" : "burning")}>
            ${wished ? "💨" : "🔥"}
          </div>
          <div className="candle-stick">🕯️</div>
          <div className="cake-emoji">🎂</div>
        </button>
      </div>
      <p className=${"tap-hint " + (wished ? "wished" : "")}>
        ${wished 
          ? "✨ Wish made for my sweet Chandni! May all your dreams come true ❤️ ✨" 
          : "✨ Tap the candle flame to make your birthday wish, khuchu puu! ✨"}
      </p>
      <button className="btn glow" onClick=${() => go("story")}>
        Read Our Story, Khushu →
      </button>
    </section>
  `;
}

function Story() {
  const [openCard, setOpenCard] = useState(0);
  const stories = [
    [
      "How It Started",
      "It all began with a simple, random add on Snapchat, totally unaware that a single tap would bring the most special person into my life. What started as an unexpected notification turned into the best unexpected surprise ever."
    ],
    [
      "First Conversation",
      "What started as casual messages quickly turned into deep chats about our future and life goals. The sweetest part? She mentioned wanting to learn web development from me—and honestly, teaching my favorite girl how to code has been the best perk ever."
    ],
    [
      "Favorite Memory",
      "Every little moment with my Khuchu Pu feels like a core memory, but those late-night conversations where we just lose track of time, laughing at silly jokes and talking about everything under the sun, hold a special place in my heart."
    ],
    [
      "That Crazy Moment",
      "The moments when we completely forget about the rest of the world, joking around, teasing each other, and sharing those unexpected sweet bursts of laughter that make me realize just how effortlessly fun life is with her."
    ],
    [
      "Why Khuchu Pu is Special",
      "Khuchu Pu isn't just incredible—she’s my whole heart. She brings warmth, comfort, and so much sweetness into my life without even trying. Her laugh brightens up my worst days, and her presence makes everything feel infinitely better."
    ]
  ];
  const icons = ["🌷", "💖", "✨", "🥳", "💖"];

  return html`
    <section className="content-page">
      <div className="eyebrow">OUR SCRAPBOOK • FOR MY BBY GURL</div>
      <h2>Our Story, Chandni <em>❤️</em></h2>
      <p className="soft-copy">Tap each chapter of our journey together, Khushu.</p>
      <div className="memory-grid">
        ${stories.map((story, i) => html`
          <button 
            className=${"memory-card " + (openCard === i ? "open" : "")} 
            key=${i} 
            onClick=${() => setOpenCard(openCard === i ? -1 : i)}
          >
            <div className="memory-card-header">
              <span className="memory-icon">${icons[i]}</span>
              <h3>${story[0]}</h3>
              <span className="toggle-indicator">${openCard === i ? "−" : "+"}</span>
            </div>
            <div className="memory-body">
              <p>${story[1]}</p>
            </div>
          </button>
        `)}
      </div>
      <button className="btn glow mt-6" onClick=${() => go("love")}>
        There's More I Want to Say to Khushu ❤️
      </button>
    </section>
  `;
}

function Love() {
  const [openLove, setOpenLove] = useState(0);
  const confessions = [
    ["Chandni's Smile 😊", "It lights up everything around you and effortlessly melts away any bad day, my bby gurl."],
    ["Khushu's Voice ❤️", "Hearing you talk is genuinely my favorite sound in the world, sweet khuchu puu."],
    ["Your Little Habits 🥺", "The tiny, cute things you do without even realizing... I cherish every single one of them, Chandni."],
    ["The Way You Care 🌸", "Your gentle heart and kindness make everyone around you feel cherished, especially me."],
    ["Your Sweet Laugh 🥰", "The purest, sweetest sound—it instantly brightens up my whole world."],
    ["Simply... My Khushu 💖", "There are a million reasons, but the biggest one is simply who you are, my precious Chandni."]
  ];

  return html`
    <section className="content-page">
      <div className="eyebrow">CONFESSIONS FROM MY HEART</div>
      <h2>Why I Adore Chandni <em>❤️</em></h2>
      <p className="soft-copy">Tap every heart to unlock a confession for my bby gurl, Khushu.</p>
      <div className="love-grid">
        ${confessions.map((x, i) => html`
          <button 
            className=${"love-heart-card " + (openLove === i ? "active" : "")} 
            key=${i} 
            onClick=${() => setOpenLove(openLove === i ? -1 : i)}
          >
            <div className="heart-icon-badge">♥</div>
            <div className="love-content">
              <h3>${x[0]}</h3>
              <p>${openLove === i ? x[1] : "Tap to open my heart ✨"}</p>
            </div>
          </button>
        `)}
      </div>
      <button className="btn glow mt-6" onClick=${() => go("hug")}>
        Come Here, Khushu... 🥺
      </button>
    </section>
  `;
}

function Hug() {
  const [hugged, setHugged] = useState(false);

  return html`
    <section className="hug-page">
      <div className="eyebrow">WARMTH & CUDDLES FOR BBY GURL</div>
      <h2>Come Here, Chandni... <em>🥺❤️</em></h2>
      <p className="soft-copy">Because tight cuddles for khuchu puu should never have to wait.</p>
      <div className=${"hug-stage " + (hugged ? "is-hugging" : "")}>
        <div className="hugger left">
          <${Penguin} mood=${hugged ? "hugging" : "romantic"} />
        </div>
        <div className="hug-heart-burst">
          <span>❤️</span>
          <span>💖</span>
          <span>✨</span>
        </div>
        <div className="hugger right">
          <${Penguin} mood=${hugged ? "hugging" : "shy"} />
        </div>
      </div>
      <div className="hug-controls">
        <button className="btn glow" onClick=${() => setHugged(prev => !prev)}>
          ${hugged ? "One More Big Squeeze for Khushu 🤗" : "Send Chandni A Warm Hug 🫂"}
        </button>
      </div>
      <button className="text-btn" onClick=${() => go("music")}>
        Listen to our soundtrack, bby gurl →
      </button>
    </section>
  `;
}

function Music() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audioEngine.stop();
    };
  }, []);

  function togglePlay() {
    const audio = audioRef.current;
    if (isPlaying) {
      if (audio) audio.pause();
      audioEngine.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (audio) {
        audio.play().catch(() => {
          // Fallback to procedural romantic web audio chime synthesizer
          audioEngine.start((p) => setProgress(p));
        });
      } else {
        audioEngine.start((p) => setProgress(p));
      }
    }
  }

  function handleSeek(e) {
    const val = Number(e.target.value);
    setProgress(val);
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (val / 100) * audio.duration;
    }
  }

  return html`
    <section className="music-page">
      <div className="eyebrow">OUR SOUNDTRACK FOR CHANDNI 🎵</div>
      <h2>This Reminds Me Of Khushu <em>🎶</em></h2>
      <p className="soft-copy">Press play, turn the volume up, and enjoy this melody dedicated to my bby gurl ❤️</p>
      
      <div className=${"player-card " + (isPlaying ? "playing" : "")}>
        <div className="vinyl-wrap">
          <div className="vinyl-disc">
            <div className="vinyl-center">❤️</div>
          </div>
        </div>
        
        <div className="player-meta">
          <strong className="song-title">Chandni's Melody (Khushu)</strong>
          <span className="song-sub">A sweet soundtrack dedicated to my bby gurl</span>
        </div>

        <div className="player-controls">
          <button className="play-circle-btn" onClick=${togglePlay} aria-label="Play or pause">
            ${isPlaying ? "⏸" : "▶"}
          </button>
          
          <div className="slider-row">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value=${progress} 
              onChange=${handleSeek}
              className="music-slider"
            />
          </div>
        </div>

        <div className=${"equalizer " + (isPlaying ? "active" : "")}>
          <i style=${{ animationDelay: "0s" }}></i>
          <i style=${{ animationDelay: "0.2s" }}></i>
          <i style=${{ animationDelay: "0.4s" }}></i>
          <i style=${{ animationDelay: "0.1s" }}></i>
          <i style=${{ animationDelay: "0.3s" }}></i>
        </div>
      </div>

      <audio ref=${audioRef} src=${C.audio} loop preload="metadata"></audio>
      
      <p className="audio-note">
        🎵 <em>Music box audio • Soft melodies for Chandni's special day</em>
      </p>

      <button className="btn glow mt-6" onClick=${() => go("letter")}>
        Open My Letter, Chandni 💌
      </button>
    </section>
  `;
}

function Letter() {
  const [opened, setOpened] = useState(false);

  return html`
    <section className="letter-page">
      <div className="eyebrow">A PERSONAL LETTER • FROM MY HEART</div>
      <h2>For My Chandni... <em>❤️</em></h2>
      <p className="soft-copy">Every single word here is straight from my heart to yours, Khushu.</p>
      
      <div className=${"envelope-wrapper " + (opened ? "opened" : "")} onClick=${() => setOpened(true)}>
        <div className="envelope-back"></div>
        <div className="letter-paper">
          <div className="letter-header">Dearest Chandni, my sweet khuchu puu ❤️</div>
          <div className="letter-lines">
            ${C.letter.map((paragraph, i) => html`
              <p key=${i} className="letter-p">${paragraph}</p>
            `)}
          </div>
          <div className="letter-seal-stamp">Forever & Always Yours, Khushu's ❤️</div>
        </div>
        <div className="envelope-front">
          <div className="wax-seal">💌</div>
          <span className="envelope-tap-msg">${opened ? "" : "Tap to open your letter, bby gurl ✨"}</span>
        </div>
      </div>

      <div className="mt-6">
        <button 
          className="btn glow" 
          onClick=${() => opened ? go("final") : setOpened(true)}
        >
          ${opened ? "One Final Surprise For Chandni ✨" : "Open My Letter, Khushu 💌"}
        </button>
      </div>
    </section>
  `;
}

function Final() {
  return html`
    <section className="final-page">
      <div className="stars-glow">✦ · ✧ · ✦ · ✧ · ✦</div>
      <div className="final-penguins-stage">
        <${Penguin} mood="celebrating" />
        <div className="giant-heart pulse">❤️</div>
        <${Penguin} mood="romantic" />
      </div>
      <div className="eyebrow">HAPPY BIRTHDAY TO MY MOONLIGHT ✨</div>
      <h1 className="final-title">Happy Birthday, My Gorgeous Chandni <span>❤️</span></h1>
      <p className="final-message">
        May this year bring my sweet Khushu, my precious bby gurl khuchu puu, endless laughter, peace, magical moments, and all the love in the universe.
      </p>
      <div className="final-flowers">
        <span>🌷</span>
        <span>🌸</span>
        <span>💐</span>
        <span>🌸</span>
        <span>🌷</span>
      </div>
      <button className="btn glow restart-btn" onClick=${() => go("welcome")}>
        Replay Our Story, Khushu ↻
      </button>
    </section>
  `;
}

const routes = {
  welcome: Welcome,
  penguin: PenguinPage,
  choose: Choose,
  birthday: Birthday,
  story: Story,
  love: Love,
  hug: Hug,
  music: Music,
  letter: Letter,
  final: Final
};

function App() {
  const [page, setPage] = useState(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      return window.location.hash.replace(/^#/, "") || "welcome";
    }
    return "welcome";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHash = () => {
      const hash = window.location.hash.replace(/^#/, "") || "welcome";
      if (routes[hash]) {
        setPage(hash);
      } else {
        setPage("welcome");
      }
    };

    window.addEventListener("hashchange", handleHash);
    if (!window.location.hash) window.location.hash = "welcome";

    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const CurrentPageComponent = routes[page] || Welcome;

  return ReactObj.createElement(Layout, { page }, ReactObj.createElement(CurrentPageComponent));
}

function mountApp() {
  if (typeof document === "undefined") return;
  const rootEl = document.getElementById("root");
  if (!rootEl) return;

  try {
    if (ReactDOMObj && ReactDOMObj.createRoot) {
      const root = ReactDOMObj.createRoot(rootEl);
      root.render(ReactObj.createElement(App));
    } else if (ReactDOMObj && ReactDOMObj.render) {
      ReactDOMObj.render(ReactObj.createElement(App), rootEl);
    }
  } catch (err) {
    console.error("Mount error:", err);
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountApp);
  } else {
    mountApp();
  }
}