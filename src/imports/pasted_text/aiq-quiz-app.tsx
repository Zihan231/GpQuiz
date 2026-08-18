Build a full-screen single-page React quiz app for Grameenphone's AIQ 
(AI Quotient) campaign. No external libraries except what's available 
in the artifact environment (lucide-react if needed). All CSS inline 
via style objects or a single <style> tag injected in useEffect.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FONTS & BRAND COLORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Inject @font-face in a <style> tag for "TelenorEvolution" using these 
base64 embedded OTF files (provided separately as variables):
  FONT_BOLD, FONT_EXTRABOLD_SLANTED, FONT_MEDIUM, FONT_NORMAL

CSS variables / JS constants:
  DARK_BLUE    = '#070452'   → deep backgrounds, primary text on light
  MID_BLUE     = '#1C16C5'   → CTA backgrounds, category badges
  TELENOR_BLUE = '#00C8FF'   → electric accents, highlights, glow
  LIGHT_BLUE   = '#B4FFFF'   → soft text, secondary info
  OFF_WHITE    = '#E8FDFF'   → card backgrounds
  WHITE        = '#FFFFFF'
  GREEN        = '#B1FBB9'   → correct answer flash
  RED          = '#FFADAD'   → wrong answer flash

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APP STATE (useState / useRef)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const [screen, setScreen] = useState('hero')
  → 'hero' | 'quiz' | 'results'

const [lang, setLang] = useState('bn')
  → 'bn' | 'en'

const [currentQ, setCurrentQ] = useState(0)
const [score, setScore] = useState(0)
const [selected, setSelected] = useState(null)
  → null | index of chosen option

const [feedback, setFeedback] = useState(null)
  → null | 'correct' | 'wrong'

const [showSheet, setShowSheet] = useState(false)
  → controls bottom feedback sheet visibility

const [confetti, setConfetti] = useState([])
  → array of particle objects for canvas animation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LANGUAGE DATA OBJECT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const LANG = {
  en: {
    eyebrow: 'Grameenphone · AI Quotient',
    heroSub: '3 questions. How AI-ready are you?',
    start: 'Start Quiz →',
    correct: '🎉 Correct!',
    correctSub: 'Great thinking.',
    wrong: 'Not quite.',
    wrongSub: "Here's the right answer.",
    videoLabel: 'Watch Your Invitation',
    next: 'Next Question →',
    finish: 'See Results →',
    replay: '↺ Play Again',
    resultTitles: ['Keep Learning','Good Effort!','Well Done!','AIQ Champion! 🏆'],
    resultSubs: [
      'Keep learning — AI is transforming how we work.',
      'Good effort! Revisit the topics and try again.',
      'Well done! Almost there.',
      'You are an AIQ Champion. AI is your superpower.',
    ],
    scoreLabel: 'SCORE',
  },
  bn: {
    eyebrow: 'গ্রামীণফোন · AI কোশেন্ট',
    heroSub: '৩টি প্রশ্ন। আপনি কতটা AI-প্রস্তুত?',
    start: 'শুরু করুন →',
    correct: '🎉 সঠিক!',
    correctSub: 'দারুণ ভাবনা।',
    wrong: 'ঠিক হয়নি।',
    wrongSub: 'সঠিক উত্তর দেখুন।',
    videoLabel: 'আমন্ত্রণ দেখুন',
    next: 'পরের প্রশ্ন →',
    finish: 'ফলাফল দেখুন →',
    replay: '↺ আবার খেলুন',
    resultTitles: ['শিখতে থাকুন','ভালো চেষ্টা!','চমৎকার!','AIQ চ্যাম্পিয়ন! 🏆'],
    resultSubs: [
      'শিখতে থাকুন — AI আমাদের কাজের ধারা বদলে দিচ্ছে।',
      'ভালো চেষ্টা! বিষয়গুলো আবার দেখুন।',
      'চমৎকার! প্রায় পৌঁছে গেছেন।',
      'আপনি AIQ চ্যাম্পিয়ন। AI আপনার শক্তি।',
    ],
    scoreLabel: 'স্কোর',
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUIZ DATA (questions always in English)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const QUESTIONS = [
  {
    category: 'AI Use Case',
    text: 'Your team spends 3 hours every week preparing the same 
           performance report. What should AI be used for first?',
    options: [
      'Designing prettier PowerPoint slides.',
      'Automating data collection and report generation.',
      'Writing motivational emails to stakeholders.',
      'Replacing the report owner.'
    ],
    correct: 1
  },
  {
    category: 'Responsible AI',
    text: 'Which action reflects responsible AI use?',
    options: [
      'Uploading confidential customer data into any public AI tool.',
      'Using AI only with approved tools while protecting sensitive information.',
      'Assuming AI-generated answers are always accurate.',
      'Copying AI outputs without review.'
    ],
    correct: 1
  },
  {
    category: 'Cultural Adoption',
    text: 'An organization moves from AI experimentation to adoption when...',
    options: [
      'Only the IT team uses AI regularly.',
      'AI becomes part of everyday work across multiple teams with measurable outcomes.',
      'Every employee becomes an AI engineer.',
      'The company purchases more AI software.'
    ],
    correct: 1
  }
]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<App>                         ← root, holds all state
  <AuroraBackground />        ← fixed, z-index 0, CSS keyframe blobs
  <TopBar />                  ← fixed top, GP logo + lang toggle
  <ProgressBar />             ← fixed below topbar, only on quiz screen
  <ConfettiCanvas />          ← fixed overlay canvas, z-index 15
  
  {screen === 'hero'    && <HeroScreen />}
  {screen === 'quiz'    && <QuizScreen />}
  {screen === 'results' && <ResultsScreen />}
  
  <FeedbackSheet />           ← fixed bottom overlay, slides up on answer
</App>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<AuroraBackground />
  - position:fixed, inset:0, zIndex:0
  - Dark blue base (#070452)
  - Two absolutely positioned div blobs with borderRadius:50%, 
    filter:blur(80px), opacity:.5
  - Blob 1: top-left, #1C16C5 radial gradient, CSS @keyframes drift 
    (translate + scale, 12s alternate infinite)
  - Blob 2: bottom-right, #00C8FF radial gradient, 15s, delay -6s
  - This is the ambient atmosphere — always visible behind all screens

<TopBar /> (hidden on hero, hero has its own inline topbar)
  - position:fixed, top:0, left:0, right:0, zIndex:10
  - background: linear-gradient(to bottom, rgba(7,4,82,.85), transparent)
  - Left: GP logo circle (32px, border #00C8FF) + "AIQ" text in #00C8FF
  - Right: LangToggle pill (EN | বাং), active tab = #00C8FF bg / #070452 text
  - Clicking toggle calls setLang() — instant re-render, no animation needed

<ProgressBar />
  - position:fixed, top:58px, height:3px, full width
  - Track: rgba(180,255,255,.15)
  - Fill: #00C8FF, box-shadow: 0 0 10px #00C8FF
  - width = (currentQ / 3 * 100)%
  - transition: width 0.6s cubic-bezier(.4,0,.2,1)

<HeroScreen />
  - Full viewport, flex column center, zIndex:1
  - Has its OWN inline topbar row (GP logo left, lang toggle right)
    so the fixed topbar stays hidden on hero
  - Fade-up entrance animations using CSS @keyframes fadeUp with 
    staggered animation-delay: 0s, .1s, .2s, .3s on each element
  - Elements top to bottom:
      1. Eyebrow text — LANG.eyebrow — tiny caps, #00C8FF, letterSpacing .18em
      2. <h1> "Test Your AIQ" — ExtraBoldSlanted font, white, 
         clamp(2.6rem, 9vw, 4rem), "AIQ" wrapped in <span color:#00C8FF>
      3. Subtitle — LANG.heroSub — Light weight, #B4FFFF, max-width:320px
      4. Start button — pill, #00C8FF bg, #070452 text, Bold,
         CSS animation: pulse-glow (box-shadow expand/fade 2.5s loop)
         onClick: setScreen('quiz'), setCurrentQ(0), setScore(0)

<QuizScreen />
  - paddingTop:72px (below topbar), overflow-y:auto
  - Centered card (max-width:540px, auto margins)
  - Card style: background rgba(255,255,255,.05), 
    border: 1px solid rgba(0,200,255,.15), borderRadius:20px,
    backdropFilter: blur(12px)
  - Card contents top to bottom:
      1. Row: category badge (pill, #1C16C5 bg, #B4FFFF text, uppercase .68rem)
              + question counter right-aligned (LANG.qNum, muted)
      2. Question text — useEffect typewriter on currentQ change:
         const [displayed, setDisplayed] = useState('')
         useEffect → clear displayed, start interval adding one char 
         every 22ms until full question text is shown
      3. Electric pulse line — div, width:80%, height:2px, 
         background: linear-gradient(90deg, transparent, #00C8FF, transparent)
         backgroundSize: 200%, CSS @keyframes electric moves backgroundPosition 
         from 200% to -200%, 2.5s linear infinite
      4. Options list — map over QUESTIONS[currentQ].options:
         Each OptionButton gets: index, text, selectedIndex state, 
         feedback state, correct index
         
<OptionButton /> logic:
  - Base style: flex row, gap:14px, full width, rounded 14px,
    bg rgba(255,255,255,.06), border 1.5px solid rgba(180,255,255,.18),
    transition all .2s
  - Left: letter badge circle (A/B/C/D), 32px, #1C16C5 bg
  - Right: option text, .92rem, Normal weight, rgba(255,255,255,.9)
  - Hover (not disabled): border → #00C8FF, bg → rgba(0,200,255,.08),
    transform: translateY(-2px), boxShadow: 0 4px 16px rgba(0,200,255,.12)
  - States (applied via className logic based on selected + feedback):
      CORRECT (this index === correct AND feedback !== null):
        border #4ade80, bg rgba(177,251,185,.12), letter badge bg #22c55e
        letter text changes to '✓'
      WRONG (this index === selected AND feedback === 'wrong'):
        border #f87171, bg rgba(255,173,173,.1), letter badge bg #ef4444
        letter text changes to '✗'
        CSS animation: shake (.4s, translateX ±7px × 2 cycles)
      DIM (not selected, not correct, feedback !== null):
        opacity: .38
  - disabled when selected !== null
  - onClick → handleSelect(index):
      setSelected(index)
      const isCorrect = index === QUESTIONS[currentQ].correct
      if (isCorrect) setScore(s => s+1)
      setFeedback(isCorrect ? 'correct' : 'wrong')
      if correct → setTimeout(launchConfetti, 300)
      setTimeout(() => setShowSheet(true), isCorrect ? 500 : 900)

<FeedbackSheet />
  - position:fixed, inset:0, zIndex:20
  - Backdrop: rgba(7,4,82,.5), backdropFilter:blur(4px)
  - visibility/opacity controlled by showSheet state
  - transition: opacity .3s ease
  - Inner sheet: position absolute, bottom:0, full width, 
    max-width:560px, centered with left:50% transform:-50%
    bg: #070452, border top+sides rgba(0,200,255,.2), borderRadius 24px 24px 0 0
    padding: 28px 24px 36px
    transform: translateY(showSheet ? '0' : '100%')
    transition: transform .4s cubic-bezier(.4,0,.2,1)
  - Contents:
      • Icon: '🎉' if correct, '💡' if wrong — 2.4rem, centered
      • Title: LANG.correct or LANG.wrong — 1.35rem, ExtraBoldSlanted, italic
      • Sub: LANG.correctSub or LANG.wrongSub — .88rem, #B4FFFF
      • Video section (only render when feedback==='correct'):
          <div> 16:9 aspect ratio, rounded 14px
          bg rgba(28,22,197,.35), border rgba(0,200,255,.2)
          flex column center, gap:10px
          Play icon circle (52px, #00C8FF bg, white ▶ 1.4rem)
          Label text: LANG.videoLabel in #B4FFFF
          // Real <video> tag can be dropped in here later
          // Structure it so swapping is just replacing inner divs with:
          // <video src="" controls autoPlay muted style={{width:'100%'}} />
      • Next button: full width pill,
          gradient bg: linear-gradient(135deg, #1C16C5, #00C8FF)
          white text, Bold, 1rem
          text = isLastQ ? LANG.finish : LANG.next
          onClick → handleNext():
              setShowSheet(false)
              setTimeout(() => {
                setSelected(null)
                setFeedback(null)
                if (currentQ + 1 >= QUESTIONS.length) setScreen('results')
                else setCurrentQ(q => q+1)
              }, 400)

<ResultsScreen />
  - Full viewport, flex column center, gap:20px, zIndex:1
  - Aurora bg still visible behind
  - SVG score ring (150×150):
      outer track circle: stroke rgba(28,22,197,.4), strokeWidth 8
      animated arc: stroke #00C8FF, strokeWidth 8, strokeLinecap round
        strokeDasharray = 314 (2π×50)
        strokeDashoffset = 314 - (score/3 × 314)
        useEffect on mount: set dashoffset after 100ms delay
        transition: stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)
        filter: drop-shadow(0 0 6px #00C8FF)
        transform: rotate(-90deg) around center
      Center text overlay (absolute):
        Score number: ExtraBoldSlanted, 2.4rem, white — "{score}/3"
        Label: .72rem, Bold, #00C8FF, letterSpacing .1em — LANG.scoreLabel
  - Headline: LANG.resultTitles[score] — 1.7rem, ExtraBoldSlanted, white, italic
  - Sub: LANG.resultSubs[score] — .9rem, #B4FFFF, max-width:300px, centered
  - Replay button: pill, #1C16C5 bg, white text, Bold
    hover: bg → #00C8FF, color → #070452
    onClick → resetAll():
        setScreen('hero')
        setCurrentQ(0)
        setScore(0)
        setSelected(null)
        setFeedback(null)
        setShowSheet(false)

<ConfettiCanvas />
  - <canvas ref={canvasRef} style={{position:'fixed',inset:0,
    zIndex:15,pointerEvents:'none'}} />
  - launchConfetti() called from App via ref or context:
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      70 particles, each: { x, y, r (3–8), vx (±2), vy (-4 to -1),
        gravity:.12, tilt, tiltSpeed, opacity:1, 
        color: random from ['#00C8FF','#1C16C5','#B4FFFF','#ffffff','#B1FBB9'] }
      rAF loop:
        ctx.clearRect
        forEach particle:
          ctx.globalAlpha = p.opacity
          ctx.fillStyle = p.color
          ctx.beginPath → ellipse(p.x, p.y, p.r, p.r×.5, p.tilt)
          ctx.fill()
          p.x += p.vx; p.y += p.vy; p.vy += p.gravity
          p.tilt += p.tiltSpeed; p.opacity -= .014
        filter out opacity <= 0
        if particles remain → requestAnimationFrame(draw)
        else → ctx.clearRect (cleanup)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN TRANSITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use CSS transitions on each screen component:
  - Each screen is always rendered (conditional display or opacity)
    OR use a transitionKey pattern:
    const [visible, setVisible] = useState(false)
    useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])
    
    style={{ 
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(40px)',
      transition: 'opacity .35s ease, transform .35s ease'
    }}

    On navigation: trigger exit (opacity:0, translateX:-40px) first, 
    then after 350ms switch screen state

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CSS KEYFRAMES (inject via useEffect or <style> tag)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

@keyframes drift {
  0%   { transform: translate(0,0) scale(1); }
  100% { transform: translate(5%,8%) scale(1.12); }
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(18px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes pulseGlow {
  0%,100% { box-shadow: 0 0 0 0 rgba(0,200,255,.45); }
  50%     { box-shadow: 0 0 0 14px rgba(0,200,255,0); }
}
@keyframes electric {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%     { transform: translateX(-7px); }
  40%     { transform: translateX(7px); }
  60%     { transform: translateX(-5px); }
  80%     { transform: translateX(5px); }
}
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Single .jsx file, default export App
- All state at App level, passed as props
- No external CSS files, no Tailwind, no Bootstrap
- Inject global CSS (keyframes + font-face + body reset) 
  via a <style> tag rendered inside App's return, 
  or a useEffect that appends to document.head
- body and html: height 100%, overflow hidden, 
  background #070452, font-family TelenorEvolution
- The video placeholder div must have a comment: 
  // TODO: replace with <video src="..." controls /> when ready
- Questions always in English regardless of lang toggle
- Only UI text (buttons, labels, feedback messages) switches language
- Mobile first: max-width 540px card, full bleed on mobile,
  centered on desktop