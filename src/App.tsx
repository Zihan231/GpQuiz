import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, animate } from 'framer-motion'
import { Brain, Zap, ShieldCheck, Globe, FlaskConical, Radio, Bot, HelpCircle, Timer, Ticket, Sparkles, ChevronRight, ArrowRight } from 'lucide-react'
import gpLogoUrl from '../public/Grameenphone_idC0j-VyWQ_0.png'
import aiAndILogo from '../public/AI_I-removebg-preview.png'
import campaignVideo from '@/imports/vidssave.com_Ek-er_Moddhei_Onek___GP_X___PritomHasan__ft._Critical_Mahmood___Fazlu_Majhi__Official_Music_Video__720P.mp4'

// ─── Telenor Brand Palette (from official colour guide) ──────────────────────
const DARK_BLUE    = '#070452'   // background, primary text on light
const MID_BLUE     = '#1C16C5'   // CTA backgrounds, surfaces
const TELENOR_BLUE = '#00C8FF'   // accent, highlights, glow
const LIGHT_BLUE   = '#B4FFFF'   // soft text, secondary info
const OFF_WHITE    = '#E8FDFF'   // card backgrounds
const GP_BLUE      = '#19AAF8'   // GP logo brand colour
// Secondary palette
const SEC_GREEN    = '#B1FBB9'
const SEC_YELLOW   = '#FEF7B9'
const SEC_RED      = '#FFADAD'

// ─── Language strings ────────────────────────────────────────────────────────
const LANG = {
  en: {
    heroSub: 'How ready are you for the age of AI? Three questions stand between you and your invitation.',
    heroDetail: 'Grameenphone\'s AI & I event brings together the people shaping what comes next. Prove your AIQ and earn your seat.',
    start: 'Take the Challenge',
    correct: 'Spot on!',
    correctSub: 'You clearly know your stuff.',
    wrong: 'Not this time.',
    wrongSub: 'Here is what the answer actually is.',
    videoLabel: 'Watch Your Invitation',
    arLabel: 'Reveal in AR',
    arSub: 'Point your camera to unlock',
    arInstruction: 'Your personalised AR invitation is ready — tap below to open it.',
    next: 'Next Question',
    finish: 'See My Results',
    replay: 'Try Again',
    resultTitles: ['Keep Exploring', 'Good Start!', 'Strong Score!', 'AIQ Champion'],
    resultSubs: [
      'AI moves fast — and so can you. Keep exploring and come back stronger.',
      'Solid effort. A few more sessions and you\'ll be leading the conversation.',
      'You clearly get it. AI literacy like yours is rare and valuable.',
      'Top of the class. You think about AI the way Grameenphone does — boldly.',
    ],
    scoreLabel: 'YOUR SCORE',
  },
  bn: {
    heroSub: 'AI-র যুগে আপনি কতটা প্রস্তুত? মাত্র তিনটি প্রশ্নের উত্তর দিন এবং আপনার আমন্ত্রণ নিশ্চিত করুন।',
    heroDetail: 'Grameenphone-এর AI & I ইভেন্টে যোগ দিন — যেখানে ভবিষ্যৎ গড়ে উঠছে। আপনার AIQ প্রমাণ করুন।',
    start: 'চ্যালেঞ্জ নিন',
    correct: 'একদম ঠিক!',
    correctSub: 'আপনি বিষয়টা সত্যিই বোঝেন।',
    wrong: 'এবার হয়নি।',
    wrongSub: 'সঠিক উত্তরটি দেখুন।',
    videoLabel: 'আমন্ত্রণ দেখুন',
    arLabel: 'AR-এ দেখুন',
    arSub: 'ক্যামেরায় আনলক করুন',
    arInstruction: 'আপনার ব্যক্তিগত AR আমন্ত্রণ প্রস্তুত — নিচে ট্যাপ করুন।',
    next: 'পরের প্রশ্ন',
    finish: 'ফলাফল দেখুন',
    replay: 'আবার চেষ্টা করুন',
    resultTitles: ['অন্বেষণ চলুক', 'ভালো শুরু!', 'চমৎকার স্কোর!', 'AIQ চ্যাম্পিয়ন'],
    resultSubs: [
      'AI দ্রুত এগিয়ে চলছে — আপনিও পারবেন। অন্বেষণ চালিয়ে যান।',
      'ভালো চেষ্টা। আরেকটু চর্চায় আপনি এগিয়ে যাবেন।',
      'আপনি বিষয়টা বোঝেন — এই দক্ষতা সত্যিই মূল্যবান।',
      'শীর্ষে আছেন। Grameenphone-এর মতোই আপনি AI নিয়ে ভাবেন — সাহসীভাবে।',
    ],
    scoreLabel: 'আপনার স্কোর',
  },
} as const
type Lang = keyof typeof LANG

// ─── Quiz data ───────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    category: 'AI Use Case',
    text: 'Your team spends 3 hours every week preparing the same performance report. What should AI be used for first?',
    options: [
      'Designing prettier PowerPoint slides.',
      'Automating data collection and report generation.',
      'Writing motivational emails to stakeholders.',
      'Replacing the report owner.',
    ],
    correct: 1,
  },
  {
    category: 'Responsible AI',
    text: 'Which action reflects responsible AI use?',
    options: [
      'Uploading confidential customer data into any public AI tool.',
      'Using AI only with approved tools while protecting sensitive information.',
      'Assuming AI-generated answers are always accurate.',
      'Copying AI outputs without review.',
    ],
    correct: 1,
  },
  {
    category: 'Cultural Adoption',
    text: 'An organization moves from AI experimentation to adoption when...',
    options: [
      'Only the IT team uses AI regularly.',
      'AI becomes part of everyday work across multiple teams with measurable outcomes.',
      'Every employee becomes an AI engineer.',
      'The company purchases more AI software.',
    ],
    correct: 1,
  },
]

type Particle = {
  x: number; y: number; r: number
  vx: number; vy: number; gravity: number
  tilt: number; tiltSpeed: number
  opacity: number; color: string
}

// ─── Global CSS ──────────────────────────────────────────────────────────────
const getGlobalCSS = (theme: 'dark' | 'light') => `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800;1,900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root {
    height: 100%;
    overflow: hidden;
    background: ${theme === 'dark' ? DARK_BLUE : '#D0F8FF'};
    font-family: 'Barlow', system-ui, sans-serif;
    color: ${theme === 'dark' ? '#fff' : DARK_BLUE};
    transition: background 0.8s ease, color 0.8s ease;
  }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${theme === 'dark' ? 'rgba(0,200,255,.25)' : 'rgba(28,22,197,.25)'}; border-radius: 2px; }

  @keyframes drift {
    0%   { transform: translate(0,0) scale(1) rotate(0deg); }
    100% { transform: translate(4%,7%) scale(1.15) rotate(3deg); }
  }
  @keyframes pulseGlow {
    0%,100% { box-shadow: 0 0 0 0 rgba(0,200,255,.5), 0 6px 30px rgba(0,200,255,.3); }
    50%     { box-shadow: 0 0 0 18px rgba(0,200,255,0), 0 6px 30px rgba(0,200,255,.3); }
  }
  @keyframes electric {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-8px); }
    40%     { transform: translateX(8px); }
    60%     { transform: translateX(-5px); }
    80%     { transform: translateX(5px); }
  }
  @keyframes floatUp {
    0%   { transform: translateY(0) scale(1); opacity: .8; }
    100% { transform: translateY(-140px) scale(.2); opacity: 0; }
  }
  @keyframes badgePop {
    0%   { transform: scale(1); }
    35%  { transform: scale(1.4); }
    65%  { transform: scale(.88); }
    100% { transform: scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes rippleOut {
    to { transform: scale(5); opacity: 0; }
  }
  @keyframes logoSpin {
    0%   { transform: rotate(0deg) scale(1); }
    50%  { transform: rotate(8deg) scale(1.06); }
    100% { transform: rotate(0deg) scale(1); }
  }
  @keyframes heroWordReveal {
    from { clip-path: inset(0 100% 0 0); opacity: 0; }
    to   { clip-path: inset(0 0% 0 0); opacity: 1; }
  }
  @keyframes scanLine {
    0%   { top: -2px; opacity: .6; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes glowPulse {
    0%,100% { opacity: .4; transform: scale(1); }
    50%     { opacity: .7; transform: scale(1.05); }
  }
  @keyframes floatBob {
    0%,100% { transform: translateY(0); }
    45%     { transform: translateY(-13px); }
    70%     { transform: translateY(-7px); }
  }
  @keyframes spinCW  { to { transform: rotate(360deg); } }
  @keyframes spinCCW { to { transform: rotate(-360deg); } }
  @keyframes chipPulse {
    0%,100% { opacity: 1; }
    50%     { opacity: .2; }
  }
  @keyframes btnShimmer {
    0%   { transform: translateX(-120%); }
    100% { transform: translateX(120%); }
  }
  @keyframes borderFlow {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scanComet {
    0%   { transform: translateX(-120%); opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 1; }
    100% { transform: translateX(120%); opacity: 0; }
  }
  @keyframes countBounce {
    0%   { transform: scale(.7); opacity: 0; }
    60%  { transform: scale(1.15); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes correctFlash {
    0%   { box-shadow: 0 0 0 0 rgba(74,222,128,.7), inset 0 0 30px rgba(74,222,128,.25); }
    50%  { box-shadow: 0 0 0 12px rgba(74,222,128,0), inset 0 0 30px rgba(74,222,128,.12); }
    100% { box-shadow: 0 0 0 0 rgba(74,222,128,0),  inset 0 0 0   rgba(74,222,128,0); }
  }
  @keyframes wrongFlash {
    0%   { box-shadow: 0 0 0 0 rgba(248,113,113,.7); }
    100% { box-shadow: 0 0 0 12px rgba(248,113,113,0); }
  }
  @keyframes optionIn {
    from { opacity: 0; transform: translateX(18px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes introDot {
    0%,100% { transform: translateY(0); opacity:.6; }
    50%      { transform: translateY(-10px); opacity:1; }
  }
  @keyframes introWipeDown {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  @keyframes introBlast {
    0%   { transform: scale(0) rotate(-30deg); opacity:0; filter: blur(20px); }
    60%  { transform: scale(1.18) rotate(4deg); opacity:1; filter: blur(0); }
    100% { transform: scale(1) rotate(0deg); opacity:1; filter: blur(0); }
  }
  @keyframes introScan {
    0%   { top: -4px; opacity:0; }
    5%   { opacity:1; }
    95%  { opacity:.7; }
    100% { top: 100%; opacity:0; }
  }
  @keyframes introLetterIn {
    from { opacity:0; transform: translateY(12px) scale(.85); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }
  @keyframes introLogoIn {
    0%   { opacity:0; transform: scale(.6) translateY(-20px); filter: blur(12px); }
    70%  { transform: scale(1.06) translateY(2px); filter: blur(0); }
    100% { opacity:1; transform: scale(1) translateY(0); filter: blur(0); }
  }
  @keyframes introRingExpand {
    from { transform: scale(0); opacity: .8; }
    to   { transform: scale(3.5); opacity: 0; }
  }
  @keyframes introTaglineIn {
    from { opacity:0; letter-spacing: .5em; }
    to   { opacity:.55; letter-spacing: .25em; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
`

// ─── Ripple hook ──────────────────────────────────────────────────────────────
function useRipple() {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const nextId = useRef(0)
  const add = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = nextId.current++
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples(r => r.filter(ri => ri.id !== id)), 700)
  }
  return { ripples, add }
}

// ─── Premium neural-network background ───────────────────────────────────────
type NNode = { x: number; y: number; vx: number; vy: number; r: number; pulse: number; pulseSpeed: number }

// no mx/my props — mouse is tracked internally via ref
function AuroraBackground({ theme }: { theme: 'dark' | 'light' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glowRef   = useRef<HTMLDivElement>(null)
  const nodesRef  = useRef<NNode[]>([])
  const rafRef    = useRef<number>(0)
  const mouseRef  = useRef({ x: -500, y: -500 })

  // track mouse with a ref — never triggers re-renders
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX - 280}px`
        glowRef.current.style.top  = `${e.clientY - 280}px`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; init() }
    const init = () => {
      const W = canvas.width, H = canvas.height
      const count = Math.min(55, Math.floor((W * H) / 22000))
      nodesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .38, vy: (Math.random() - .5) * .38,
        r: 1.2 + Math.random() * 1.8,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: .012 + Math.random() * .018,
      }))
    }
    resize()
    window.addEventListener('resize', resize)

    const CONNECT = 130  // max edge length px
    const MOUSE_R = 180  // mouse attraction radius

    const draw = () => {
      const ctx = canvas.getContext('2d')!
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      const nodes = nodesRef.current
      const { x: mx, y: my } = mouseRef.current

      // update positions
      nodes.forEach(n => {
        // gentle mouse attraction
        const dx = mx - n.x, dy = my - n.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_R) {
          n.vx += (dx / dist) * .012
          n.vy += (dy / dist) * .012
        }
        n.vx *= .994; n.vy *= .994   // friction
        n.x += n.vx; n.y += n.vy
        n.pulse += n.pulseSpeed
        if (n.x < 0) n.x = W; if (n.x > W) n.x = 0
        if (n.y < 0) n.y = H; if (n.y > H) n.y = 0
      })

      // draw edges — no per-edge gradient objects, batch by alpha bucket
      ctx.lineWidth = .7
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const d2 = dx * dx + dy * dy
          if (d2 > CONNECT * CONNECT) continue
          const alpha = (1 - Math.sqrt(d2) / CONNECT) * (theme === 'dark' ? .2 : .35)
          ctx.strokeStyle = theme === 'dark' 
            ? `rgba(0,200,255,${alpha.toFixed(2)})`
            : `rgba(28,22,197,${alpha.toFixed(2)})`
          ctx.beginPath()
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }

      // draw nodes — single pass, no per-node gradient objects
      ctx.shadowColor = theme === 'dark' ? TELENOR_BLUE : MID_BLUE
      ctx.shadowBlur = 5
      nodes.forEach(n => {
        const brightness = .5 + Math.sin(n.pulse) * .3
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = theme === 'dark'
          ? `rgba(180,255,255,${(brightness * .8).toFixed(2)})`
          : `rgba(28,22,197,${(brightness * .8).toFixed(2)})`
        ctx.fill()
      })
      ctx.shadowBlur = 0

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [theme])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {/* Deep space base — three-stop gradient for richness */}
      <div style={{
        position: 'absolute', inset: 0,
        background: theme === 'dark' ? `
          radial-gradient(ellipse 80% 60% at 20% 10%, #0d0880 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 85% 80%, #030a3a 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 70% 5%,  rgba(25,170,248,.18) 0%, transparent 50%),
          linear-gradient(160deg, #080560 0%, #020230 55%, #060140 100%)
        ` : `
          radial-gradient(ellipse 80% 60% at 20% 10%, #B4FFFF 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 85% 80%, #D0F8FF 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 70% 5%,  rgba(25,170,248,.2) 0%, transparent 60%),
          linear-gradient(160deg, #C2F3FD 0%, #E2FAFE 65%, #A6F6FE 100%)
        `,
        transition: 'background 0.8s ease',
      }} />

      {/* Volumetric light shaft from top-center */}
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '70vw', height: '55vh',
        background: theme === 'dark'
          ? `conic-gradient(from 260deg at 50% -10%, transparent 15%, rgba(0,200,255,.055) 30%, transparent 45%)`
          : `conic-gradient(from 260deg at 50% -10%, transparent 15%, rgba(28,22,197,.04) 30%, transparent 45%)`,
        filter: 'blur(40px)',
        animation: 'glowPulse 8s ease infinite',
      }} />

      {/* Horizon glow — premium depth trick */}
      <div style={{
        position: 'absolute', bottom: '-10%', left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', height: '45vh',
        background: theme === 'dark'
          ? `radial-gradient(ellipse 90% 60% at 50% 100%, rgba(28,22,197,.45) 0%, transparent 65%)`
          : `radial-gradient(ellipse 90% 60% at 50% 100%, rgba(180,255,255,.6) 0%, transparent 65%)`,
        filter: 'blur(60px)',
        transition: 'background 0.8s ease',
      }} />

      {/* Neural network canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: theme === 'dark' ? .85 : 0.6 }} />

      {/* Film grain overlay for texture */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        backgroundSize: '180px 180px',
        opacity: theme === 'dark' ? .6 : .35,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
      }} />

      {/* Cursor proximity glow — moved via ref, no re-renders */}
      <div ref={glowRef} style={{
        position: 'absolute', pointerEvents: 'none',
        left: -500, top: -500, width: 560, height: 560,
        borderRadius: '50%',
        background: theme === 'dark'
          ? `radial-gradient(circle, rgba(0,200,255,.07) 0%, transparent 65%)`
          : `radial-gradient(circle, rgba(28,22,197,.05) 0%, transparent 65%)`,
      }} />
    </div>
  )
}

// ─── Official GP Grameenphone Logo ────────────────────────────────────────────
// Inline the exact SVG path from the provided brand asset
function GpMark({ size = 40 }: { size?: number }) {
  const scale = size / 51
  return (
    <svg
      width={size}
      height={size * (48 / 51)}
      viewBox="0 0 51 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.221 14.4173C25.9354 14.5299 26.0799 14.3816 26.1746 13.6882C26.3296 12.6303 26.699 10.8466 27.5622 9.01821C28.4969 7.04658 29.9854 4.88017 32.0673 3.42958C33.8208 2.22364 36.6948 0.887949 38.9198 0.403463C40.7399 0.00162001 42.4453 -0.0750825 43.9085 0.0638832C46.9155 0.3412 48.5789 1.22057 49.4138 2.35871C49.7235 2.7839 49.8929 3.30843 49.8998 3.64801C49.9237 4.21411 49.6828 4.95287 48.89 5.67812C48.1186 6.37674 46.473 7.26061 44.2289 8.03459C41.8995 8.83009 38.7163 9.67013 35.5433 10.419C32.8864 11.0468 31.3747 11.581 30.1125 12.02C28.013 12.75 27.3802 14.8935 28.6885 15.5481C30.5794 16.494 31.7621 17.4831 32.77 18.324C34.2818 19.596 36.0375 21.0927 38.2173 23.792C40.1922 26.2673 43.4229 30.9916 44.5857 35.5772C45.8727 40.6117 45.0685 45.3861 42.2923 46.7193C39.5703 48.0286 35.943 46.1393 33.3967 43.4301C30.9742 40.8589 29.2834 37.8303 27.6936 33.1588C26.3148 29.1435 25.7559 23.3209 25.7582 20.275C25.7582 19.2603 25.7422 19.0438 25.7822 18.1275C25.8746 17.329 23.7764 16.6685 21.5213 18.1573C18.955 19.8514 16.4408 22.9217 14.9565 24.7048C14.3108 25.4831 13.4355 26.6269 12.5081 27.8264C11.2854 29.3999 9.93574 31.0385 8.70537 31.9546C6.85373 33.3395 3.8788 33.912 1.79502 32.3869C0.636703 31.5373 0.0201208 29.9332 0.000758975 28.3024C-0.0165069 27.1543 0.260945 26.1156 0.819642 25.091C1.51766 23.8332 2.6669 22.4833 4.4888 20.9374C6.37278 19.3488 9.38024 17.552 12.3941 16.3098C16.9912 14.411 21.9409 13.8136 25.221 14.4173Z"
        fill={GP_BLUE}
      />
    </svg>
  )
}

// ─── Theme switcher component ────────────────────────────────────────────────
function ThemeToggle({ theme, setTheme }: { theme: 'dark' | 'light'; setTheme: (t: 'dark' | 'light') => void }) {
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: theme === 'dark' ? 'rgba(255,255,255,.07)' : 'rgba(7,4,82,.07)',
        border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer',
        color: theme === 'dark' ? '#fff' : DARK_BLUE,
        transition: 'all .25s ease',
      }}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      )}
    </button>
  )
}

// ─── Topbar with real logo ────────────────────────────────────────────────────
function LangToggle({ lang, setLang, theme }: { lang: Lang; setLang: (l: Lang) => void; theme: 'dark' | 'light' }) {
  return (
    <div style={{ display: 'flex', background: theme === 'dark' ? 'rgba(255,255,255,.07)' : 'rgba(7,4,82,.07)', borderRadius: 22, padding: 3, gap: 2 }}>
      {(['en', 'bn'] as Lang[]).map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          padding: '5px 14px', borderRadius: 18, border: 'none', cursor: 'pointer',
          fontSize: '.72rem', fontWeight: 700, fontFamily: 'inherit',
          transition: 'all .22s cubic-bezier(.4,0,.2,1)',
          background: lang === l ? TELENOR_BLUE : 'transparent',
          color: lang === l ? DARK_BLUE : (theme === 'dark' ? 'rgba(255,255,255,.45)' : 'rgba(7,4,82,.5)'),
          boxShadow: lang === l ? `0 2px 10px rgba(0,200,255,.4)` : 'none',
        }}>
          {l === 'en' ? 'EN' : 'বাং'}
        </button>
      ))}
    </div>
  )
}

function TopBar({ lang, setLang, theme, setTheme }: { lang: Lang; setLang: (l: Lang) => void; theme: 'dark' | 'light'; setTheme: (t: 'dark' | 'light') => void }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
      background: theme === 'dark' 
        ? `linear-gradient(to bottom, rgba(7,4,82,.96) 60%, transparent)`
        : `linear-gradient(to bottom, rgba(232,253,255,.96) 60%, transparent)`,
      padding: '11px 22px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'background 0.8s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <GpMark size={32} />
        <div style={{ height: 24, width: 1, background: theme === 'dark' ? 'rgba(255,255,255,.12)' : 'rgba(7,4,82,.12)' }} />
        <span style={{ color: theme === 'dark' ? 'rgba(255,255,255,.55)' : 'rgba(7,4,82,.65)', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase' }}>
          Grameenphone
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <LangToggle lang={lang} setLang={setLang} theme={theme} />
      </div>
    </div>
  )
}

// ─── Progress bar with glow dots ─────────────────────────────────────────────
function ProgressBar({ currentQ }: { currentQ: number }) {
  const pct = (currentQ / QUESTIONS.length) * 100
  return (
    <div style={{ position: 'fixed', top: 56, left: 0, right: 0, zIndex: 10, padding: '0 22px 10px' }}>
      <div style={{ height: 2, borderRadius: 1, background: 'rgba(180,255,255,.08)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 1,
          background: `linear-gradient(90deg, ${MID_BLUE}, ${TELENOR_BLUE})`,
          boxShadow: `0 0 10px ${TELENOR_BLUE}, 0 0 20px rgba(0,200,255,.3)`,
          transition: 'width .65s cubic-bezier(.4,0,.2,1)',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 7 }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{
            height: 6,
            width: i < currentQ ? 28 : i === currentQ ? 10 : 6,
            borderRadius: 3,
            background: i < currentQ
              ? `linear-gradient(90deg, ${MID_BLUE}, ${TELENOR_BLUE})`
              : i === currentQ
                ? 'rgba(0,200,255,.45)'
                : 'rgba(255,255,255,.12)',
            boxShadow: i < currentQ ? `0 0 8px rgba(0,200,255,.5)` : 'none',
            transition: 'all .45s cubic-bezier(.4,0,.2,1)',
          }} />
        ))}
      </div>
    </div>
  )
}

// ─── Confetti canvas ──────────────────────────────────────────────────────────
function ConfettiCanvas({ launchRef }: { launchRef: React.MutableRefObject<() => void> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const particles = useRef<Particle[]>([])

  const launch = useCallback(() => {
    const c = canvasRef.current; if (!c) return
    c.width = window.innerWidth; c.height = window.innerHeight
    const colors = [TELENOR_BLUE, GP_BLUE, LIGHT_BLUE, '#fff', SEC_GREEN, SEC_YELLOW]
    particles.current = Array.from({ length: 100 }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height * .3,
      r: 2.5 + Math.random() * 5.5,
      vx: (Math.random() - .5) * 5, vy: -1.5 - Math.random() * 4,
      gravity: .09, tilt: Math.random() * Math.PI * 2,
      tiltSpeed: (Math.random() - .5) * .14,
      opacity: 1, color: colors[Math.floor(Math.random() * colors.length)],
    }))
    cancelAnimationFrame(rafRef.current)
    const ctx = c.getContext('2d')!
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      particles.current.forEach(p => {
        ctx.save(); ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 5
        ctx.beginPath()
        ctx.ellipse(p.x, p.y, p.r, p.r * .42, p.tilt, 0, Math.PI * 2)
        ctx.fill(); ctx.restore()
        p.x += p.vx; p.y += p.vy; p.vy += p.gravity
        p.tilt += p.tiltSpeed; p.opacity -= .011
      })
      particles.current = particles.current.filter(p => p.opacity > 0)
      if (particles.current.length) rafRef.current = requestAnimationFrame(draw)
      else ctx.clearRect(0, 0, c.width, c.height)
    }
    draw()
  }, [])

  useEffect(() => { launchRef.current = launch }, [launch, launchRef])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 15, pointerEvents: 'none' }} />
}

// ─── Floating orbs hero background ───────────────────────────────────────────
function HeroOrbs() {
  const orbs = useRef(Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 88}%`,
    bottom: `-8px`,
    delay: `${Math.random() * 7}s`,
    dur: `${4.5 + Math.random() * 5}s`,
    size: 2 + Math.random() * 5,
    color: [TELENOR_BLUE, LIGHT_BLUE, GP_BLUE, '#fff', MID_BLUE][i % 5],
  })))
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {orbs.current.map(o => (
        <div key={o.id} style={{
          position: 'absolute', bottom: o.bottom, left: o.left,
          width: o.size, height: o.size, borderRadius: '50%',
          background: o.color, opacity: .65,
          boxShadow: `0 0 ${o.size * 2}px ${o.color}`,
          animation: `floatUp ${o.dur} ${o.delay} ease-in infinite`,
        }} />
      ))}
    </div>
  )
}

// ─── Option button — premium redesign ────────────────────────────────────────
function OptionButton({ index, text, selected, feedback, correct, onSelect, delay = 0, theme }: {
  index: number; text: string
  selected: number | null; feedback: 'correct' | 'wrong' | null
  correct: number; onSelect: (i: number) => void
  delay?: number; theme: 'dark' | 'light'
}) {
  const { ripples, add } = useRipple()
  const btnRef = useRef<HTMLButtonElement>(null)
  const isSelected = selected === index
  const isCorrect = correct === index
  const disabled = selected !== null
  const LABELS = ['A', 'B', 'C', 'D']

  // state derivation
  let borderColor = theme === 'dark' ? 'rgba(180,255,255,.11)' : 'rgba(28,22,197,.2)'
  let bg = theme === 'dark' ? 'rgba(14,10,80,.45)' : 'rgba(230,250,252,.8)'
  let badgeBg = theme === 'dark' ? `rgba(28,22,197,.7)` : `rgba(180,255,255,.6)`
  let badgeBorder = theme === 'dark' ? 'rgba(0,200,255,.2)' : 'rgba(28,22,197,.2)'
  let badgeTxt: string = LABELS[index]
  let badgeColor = theme === 'dark' ? LIGHT_BLUE : MID_BLUE
  let cardAnim = `optionIn .35s ${delay}ms both`
  let textColor = theme === 'dark' ? 'rgba(255,255,255,.82)' : DARK_BLUE
  let opacity = 1
  let extraShadow = ''

  if (feedback !== null) {
    if (isCorrect) {
      borderColor = '#4ade80'
      bg = 'rgba(34,197,94,.1)'
      badgeBg = '#22c55e'
      badgeBorder = '#4ade80'
      badgeTxt = '✓'
      badgeColor = '#fff'
      textColor = '#fff'
      extraShadow = 'correctFlash .6s ease'
      cardAnim = 'none'
    } else if (isSelected) {
      borderColor = '#f87171'
      bg = 'rgba(239,68,68,.08)'
      badgeBg = '#ef4444'
      badgeBorder = '#f87171'
      badgeTxt = '✗'
      badgeColor = '#fff'
      textColor = 'rgba(255,255,255,.7)'
      cardAnim = 'shake .38s ease'
    } else {
      opacity = .25
      cardAnim = 'none'
    }
  }

  const handleMouseEnter = () => {
    if (disabled || !btnRef.current) return
    btnRef.current.style.borderColor = theme === 'dark' ? TELENOR_BLUE : MID_BLUE
    btnRef.current.style.background = theme === 'dark' ? 'rgba(0,200,255,.06)' : 'rgba(28,22,197,.04)'
    btnRef.current.style.transform = 'translateY(-2px)'
    btnRef.current.style.boxShadow = theme === 'dark'
      ? '0 8px 28px rgba(0,200,255,.14), inset 0 0 0 1px rgba(0,200,255,.14)'
      : '0 8px 28px rgba(28,22,197,.08), inset 0 0 0 1px rgba(28,22,197,.08)'
  }
  const handleMouseLeave = () => {
    if (!btnRef.current) return
    btnRef.current.style.borderColor = borderColor
    btnRef.current.style.background = bg
    btnRef.current.style.transform = 'none'
    btnRef.current.style.boxShadow = '0 2px 12px rgba(0,0,0,.25)'
  }

  return (
    <button
      ref={btnRef}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={e => { add(e); onSelect(index) }}
      style={{
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', gap: 0,
        width: '100%', padding: 0, borderRadius: 16,
        background: bg,
        border: `1.5px solid ${borderColor}`,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'all .22s cubic-bezier(.4,0,.2,1)',
        boxShadow: isCorrect && feedback
          ? `0 0 0 0 rgba(74,222,128,0), 0 8px 28px rgba(34,197,94,.18)`
          : `0 2px 12px rgba(0,0,0,.25)`,
        opacity,
        animation: extraShadow || cardAnim,
        textAlign: 'left', fontFamily: 'inherit',
        backdropFilter: 'blur(10px)',
      }}
    >
      {ripples.map(r => (
        <span key={r.id} style={{
          position: 'absolute', left: r.x - 10, top: r.y - 10,
          width: 20, height: 20, borderRadius: '50%',
          background: 'rgba(0,200,255,.25)',
          animation: 'rippleOut .7s ease-out forwards',
          pointerEvents: 'none',
        }} />
      ))}

      {/* left badge strip */}
      <div style={{
        width: 52, alignSelf: 'stretch', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: badgeBg,
        borderRight: `1.5px solid ${badgeBorder}`,
        transition: 'all .22s',
        animation: isCorrect && feedback ? 'badgePop .5s ease' : 'none',
      }}>
        <span style={{
          fontSize: '.9rem', fontWeight: 800, color: badgeColor,
          textShadow: isCorrect && feedback ? `0 0 12px rgba(74,222,128,.8)` : 'none',
        }}>{badgeTxt}</span>
      </div>

      {/* text */}
      <span style={{
        flex: 1, padding: '15px 16px',
        fontSize: '.92rem', fontWeight: 500,
        color: textColor, lineHeight: 1.55,
        transition: 'color .22s',
      }}>
        {text}
      </span>

      {/* correct glow overlay */}
      {isCorrect && feedback && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 16,
          background: `radial-gradient(ellipse at 30% 50%, rgba(74,222,128,.12) 0%, transparent 65%)`,
        }} />
      )}

      {/* hover shimmer / scanning effect */}
      {!disabled && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 16,
          background: `linear-gradient(105deg, transparent 35%, ${theme === 'dark' ? 'rgba(0,200,255,.05)' : 'rgba(28,22,197,.04)'} 50%, transparent 65%)`,
          backgroundSize: '200%',
          animation: 'shimmer 4.5s linear infinite',
        }} />
      )}
    </button>
  )
}

// ─── Auto-play YouTube video ──────────────────────────────────────────────────
// Replace this URL with the actual GP AIQ campaign video embed URL
function VideoPlayer({ active }: { active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (active) {
      v.currentTime = 10
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [active])

  if (!active) return null

  return (
    <div style={{
      width: '100%', aspectRatio: '16/9', borderRadius: 14, overflow: 'hidden',
      border: `1px solid rgba(0,200,255,.2)`,
      boxShadow: `0 0 24px rgba(0,200,255,.12), 0 8px 40px rgba(0,0,0,.45)`,
      background: '#000',
    }}>
      <video
        ref={videoRef}
        src={campaignVideo}
        controls
        playsInline
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
      />
    </div>
  )
}



// ─── Animated counter — DOM-ref version, no setState ────────────────────────
function MotionCount({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const ctrl = animate(0, to, {
      duration, ease: 'easeOut',
      onUpdate: v => { if (ref.current) ref.current.textContent = String(Math.round(v)) },
    })
    return () => ctrl.stop()
  }, [to])
  return <span ref={ref}>0</span>
}

// ─── Floating ambient icon ────────────────────────────────────────────────────
function FloatIcon({ icon, x, y, delay, color = 'rgba(0,200,255,.15)' }: { icon: React.ReactNode; x: string; y: string; delay: number; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: .5, type: 'spring', stiffness: 200, damping: 18 }}
      style={{
        position: 'absolute', left: x, top: y, color, pointerEvents: 'none', zIndex: 0,
        animation: `floatBob ${5 + delay * .3}s ease-in-out ${delay + .5}s infinite`,
      }}
    >
      {icon}
    </motion.div>
  )
}

// ─── Hero screen ──────────────────────────────────────────────────────────────
function HeroScreen({ lang, setLang, onStart, theme, setTheme }: {
  lang: Lang; setLang: (l: Lang) => void; onStart: () => void; theme: 'dark' | 'light'; setTheme: (t: 'dark' | 'light') => void
}) {
  const { ripples, add } = useRipple()
  const t = LANG[lang]
  const WORD = 'GRAMEENPHONE'
  const [scanDone, setScanDone] = useState(false)
  useEffect(() => { const id = setTimeout(() => setScanDone(true), 1600); return () => clearTimeout(id) }, [])

  const chips = [
    { label: lang === 'bn' ? 'AI প্রয়োগ'       : 'Applied AI',      color: TELENOR_BLUE, Icon: Bot },
    { label: lang === 'bn' ? 'দায়িত্বশীল AI'   : 'Responsible AI',  color: '#4ade80',    Icon: ShieldCheck },
    { label: lang === 'bn' ? 'ভবিষ্যতের কাজ'  : 'Future of Work',  color: '#a78bfa',    Icon: Globe },
  ]

  const stats = [
    { num: 3, label: lang === 'bn' ? 'প্রশ্ন'    : 'Questions',  Icon: HelpCircle, color: TELENOR_BLUE },
  ]

  const chipV = { hidden: { opacity: 0, scale: .7, y: 10 }, show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } } }
  const statV = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 250, damping: 22 } } }

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px', textAlign: 'center', overflowY: 'auto' }}>

      {/* floating lucide icons — ambient decoration */}
      <FloatIcon icon={<Brain size={26} strokeWidth={1.2} />}       x="5%"  y="11%" delay={3.4} color={theme === 'dark' ? "rgba(0,200,255,.18)" : "rgba(28,22,197,.38)"} />
      <FloatIcon icon={<Zap size={22} strokeWidth={1.2} />}         x="88%" y="16%" delay={3.7} color={theme === 'dark' ? "rgba(192,38,211,.18)" : "rgba(192,38,211,.38)"} />
      <FloatIcon icon={<FlaskConical size={20} strokeWidth={1.2} />} x="3%"  y="65%" delay={4.0} color={theme === 'dark' ? "rgba(164,120,250,.18)" : "rgba(124,58,237,.38)"} />
      <FloatIcon icon={<Radio size={20} strokeWidth={1.2} />}        x="90%" y="60%" delay={4.2} color={theme === 'dark' ? "rgba(0,200,255,.14)" : "rgba(28,22,197,.35)"} />
      <FloatIcon icon={<Globe size={18} strokeWidth={1.2} />}        x="13%" y="40%" delay={4.5} color={theme === 'dark' ? "rgba(74,222,128,.14)" : "rgba(21,128,61,.38)"} />
      <FloatIcon icon={<Sparkles size={18} strokeWidth={1.2} />}     x="83%" y="42%" delay={4.8} color={theme === 'dark' ? "rgba(192,38,211,.16)" : "rgba(192,38,211,.35)"} />
      <FloatIcon icon={<Bot size={20} strokeWidth={1.2} />}          x="50%" y="4%"  delay={5.1} color={theme === 'dark' ? "rgba(0,200,255,.14)" : "rgba(28,22,197,.32)"} />

      {/* scan line */}
      <AnimatePresence>
        {!scanDone && (
          <motion.div
            initial={{ top: 0, opacity: 0 }} animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ position: 'absolute', left: 0, right: 0, height: 2, zIndex: 5, pointerEvents: 'none', background: `linear-gradient(90deg, transparent, ${TELENOR_BLUE}, rgba(25,170,248,.9), transparent)`, boxShadow: `0 0 16px ${TELENOR_BLUE}` }}
          />
        )}
      </AnimatePresence>

      {/* lang & theme toggles */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: .5 }}
        style={{ position: 'absolute', top: 18, right: 24, zIndex: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <LangToggle lang={lang} setLang={setLang} theme={theme} />
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 460, width: '100%', paddingBottom: 40, paddingTop: 24 }}>

        {/* GP mark */}
        <motion.div
          initial={{ scale: 0, rotate: -25, opacity: 0, filter: 'blur(18px)' }}
          animate={{ scale: 1, rotate: 0, opacity: 1, filter: `blur(0px) drop-shadow(0 0 20px ${GP_BLUE}) drop-shadow(0 0 40px rgba(25,170,248,.4))` }}
          transition={{ delay: .1, duration: .6, type: 'spring', stiffness: 220, damping: 14 }}
          style={{ marginBottom: 14, position: 'relative' }}
        >
          <GpMark size={52} />
          <motion.div initial={{ scale: .4, opacity: .9 }} animate={{ scale: 3, opacity: 0 }} transition={{ delay: .3, duration: .9, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `1.5px solid ${GP_BLUE}`, pointerEvents: 'none' }} />
        </motion.div>

        {/* GRAMEENPHONE letter cascade */}
        <div style={{ marginBottom: 20, display: 'flex' }}>
          {WORD.split('').map((ch, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .65 + i * .05, duration: .28, type: 'spring', stiffness: 320 }}
              style={{ display: 'inline-block', fontSize: '.67rem', fontWeight: 700, letterSpacing: '.18em', color: theme === 'dark' ? 'rgba(255,255,255,.36)' : 'rgba(7,4,82,.45)' }}
            >{ch}</motion.span>
          ))}
        </div>

        {/* AI&I logo + orbit rings */}
        <div style={{ position: 'relative', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', width: 'clamp(195px, 50vw, 270px)', height: 'clamp(195px, 50vw, 270px)', borderRadius: '50%', border: theme === 'dark' ? '1px solid rgba(0,200,255,.1)' : '1px solid rgba(28,22,197,.1)', pointerEvents: 'none', animation: 'spinCW 11s linear infinite' }}>
          </div>
          <div style={{ position: 'absolute', width: 'clamp(235px, 60vw, 320px)', height: 'clamp(235px, 60vw, 320px)', borderRadius: '50%', border: '1px solid rgba(192,38,211,.07)', pointerEvents: 'none', animation: 'spinCCW 17s linear infinite' }}>
            <div style={{ position: 'absolute', top: -4, left: '50%', width: 8, height: 8, borderRadius: '50%', background: '#c026d3', boxShadow: '0 0 8px #c026d3', marginLeft: -4 }} />
          </div>
          <motion.div initial={{ opacity: 0, scale: .5, filter: 'blur(16px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 1.55, duration: .65, type: 'spring', stiffness: 180, damping: 14 }}
            style={{ filter: 'drop-shadow(0 0 22px rgba(224,64,251,.5)) drop-shadow(0 0 44px rgba(0,200,255,.28))' }}>
            <img src={aiAndILogo} alt="AI & I" style={{ width: 'clamp(138px, 33vw, 185px)', display: 'block' }} />
          </motion.div>
        </div>

        {/* tagline */}
        <motion.p initial={{ opacity: 0, letterSpacing: '0.45em' }} animate={{ opacity: 1, letterSpacing: '0.22em' }} transition={{ delay: 2.2, duration: .65 }}
          style={{ fontSize: '.58rem', color: theme === 'dark' ? 'rgba(255,255,255,.28)' : 'rgba(7,4,82,.4)', letterSpacing: '.22em', textTransform: 'uppercase', marginBottom: 22 }}>
          powered by grameenphone
        </motion.p>


        {/* stat pill */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22, delay: 2.95 } } }}
          initial="hidden" animate="show"
          style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '10px 20px 10px 12px', borderRadius: 40, background: theme === 'dark' ? `rgba(0,200,255,.06)` : `rgba(28,22,197,.06)`, border: theme === 'dark' ? `1px solid ${TELENOR_BLUE}30` : `1px solid ${MID_BLUE}30`, backdropFilter: 'blur(12px)', boxShadow: theme === 'dark' ? `0 0 24px rgba(0,200,255,.08)` : `0 0 24px rgba(28,22,197,.08)` }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: theme === 'dark' ? `${TELENOR_BLUE}18` : `${MID_BLUE}18`, border: theme === 'dark' ? `1px solid ${TELENOR_BLUE}30` : `1px solid ${MID_BLUE}30` }}>
            <HelpCircle size={16} color={theme === 'dark' ? TELENOR_BLUE : MID_BLUE} strokeWidth={2} />
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: theme === 'dark' ? '#fff' : DARK_BLUE, lineHeight: 1 }}>
              <MotionCount to={3} duration={1.2} />
            </span>
            <span style={{ fontSize: '.62rem', color: theme === 'dark' ? `${TELENOR_BLUE}cc` : `${MID_BLUE}cc`, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>
              {lang === 'bn' ? 'টি প্রশ্ন' : 'Questions'}
            </span>
          </span>
        </motion.div>

        {/* divider */}
        <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ delay: 3.35, duration: .55 }}
          style={{ width: '100%', height: 1, marginBottom: 18, background: 'linear-gradient(90deg, transparent, rgba(224,64,251,.38) 30%, rgba(0,200,255,.38) 70%, transparent)' }} />

        {/* headline */}
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.45, duration: .48 }}
          style={{ fontSize: 'clamp(.95rem, 3.5vw, 1.12rem)', fontWeight: 700, lineHeight: 1.6, color: theme === 'dark' ? 'rgba(255,255,255,.82)' : DARK_BLUE, marginBottom: 10 }}>
          {t.heroSub}
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.6, duration: .5 }}
          style={{ fontSize: '.78rem', color: theme === 'dark' ? 'rgba(255,255,255,.38)' : 'rgba(7,4,82,.6)', lineHeight: 1.7, marginBottom: 26, maxWidth: 360 }}>
          {t.heroDetail}
        </motion.p>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.65, duration: .45, type: 'spring', stiffness: 200 }}>
          <motion.button
            onClick={e => { add(e as any); onStart() }}
            whileHover={{ scale: 1.04, boxShadow: '0 10px 40px rgba(192,38,211,.6), 0 4px 20px rgba(0,200,255,.35)' }}
            whileTap={{ scale: .97 }}
            style={{ position: 'relative', overflow: 'hidden', display: 'inline-flex', alignItems: 'center', gap: 10, padding: '15px 48px', borderRadius: 40, border: 'none', background: 'linear-gradient(135deg, #c026d3 0%, #7c3aed 40%, #0ea5e9 100%)', color: '#fff', fontWeight: 800, fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '.06em', boxShadow: '0 4px 28px rgba(192,38,211,.42), 0 2px 12px rgba(0,200,255,.18)' }}
          >
            {ripples.map(r => (
              <span key={r.id} style={{ position: 'absolute', left: r.x - 10, top: r.y - 10, width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,.35)', animation: 'rippleOut .7s ease-out forwards', pointerEvents: 'none' }} />
            ))}
            <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,.16) 50%, transparent 65%)', pointerEvents: 'none', animation: 'btnShimmer 3.8s ease-in-out infinite' }} />
            {t.start}
            <ArrowRight size={18} strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Quiz screen — premium card ───────────────────────────────────────────────
function QuizScreen({ currentQ, selected, feedback, lang, onSelect, theme }: {
  currentQ: number; selected: number | null; feedback: 'correct' | 'wrong' | null
  lang: Lang; onSelect: (i: number) => void; theme: 'dark' | 'light'
}) {
  const [displayed, setDisplayed] = useState('')
  const [cardVisible, setCardVisible] = useState(false)
  const q = QUESTIONS[currentQ]

  // Dynamic 3D tilt coordinates
  const tiltRef = useRef<HTMLDivElement>(null)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    // rotate up to 10 degrees
    const rX = -(y / (rect.height / 2)) * 10
    const rY = (x / (rect.width / 2)) * 10
    el.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02, 1.02, 1.02)`
  }
  const handleMouseLeave = () => {
    const el = tiltRef.current
    if (!el) return
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }

  useEffect(() => {
    setDisplayed(''); setCardVisible(false)
    const t1 = setTimeout(() => setCardVisible(true), 60)
    let i = 0
    const iv = setInterval(() => {
      i++; setDisplayed(q.text.slice(0, i))
      if (i >= q.text.length) clearInterval(iv)
    }, 17)
    return () => { clearTimeout(t1); clearInterval(iv) }
  }, [currentQ, q.text])

  const categoryColors: Record<string, string> = {
    'AI Use Case':        '#00C8FF',
    'Responsible AI':     '#4ade80',
    'Cultural Adoption':  '#a78bfa',
  }
  const catColor = categoryColors[q.category] ?? TELENOR_BLUE

  return (
    <div style={{
      position: 'relative', zIndex: 1,
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '84px 14px 120px', overflowY: 'auto',
    }}>
      {/* outer glow card wrapper */}
      <div 
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%', maxWidth: 540,
          opacity: cardVisible ? 1 : 0,
          transform: cardVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(.97)',
          transition: 'opacity .4s ease, transform .2s ease',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Question card */}
        <div style={{
          background: theme === 'dark'
            ? 'linear-gradient(155deg, rgba(20,14,100,.75) 0%, rgba(7,4,82,.85) 100%)'
            : 'linear-gradient(155deg, rgba(206,242,247,.9) 0%, rgba(228,251,254,.95) 100%)',
          border: theme === 'dark' ? `1px solid rgba(0,200,255,.14)` : `1px solid rgba(28,22,197,.18)`,
          borderRadius: 24,
          backdropFilter: 'blur(24px)',
          overflow: 'hidden',
          boxShadow: theme === 'dark'
            ? `0 0 0 1px rgba(0,200,255,.06), 0 32px 80px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.07)`
            : `0 0 0 1px rgba(28,22,197,.05), 0 20px 48px rgba(28,22,197,.12), inset 0 1px 0 rgba(255,255,255,.8)`,
          marginBottom: 10,
          transition: 'background 0.8s ease, border-color 0.8s ease, box-shadow 0.8s ease',
          transform: 'translateZ(20px)', // Elevates the content in 3D perspective space
        }}>
          {/* colored top accent bar */}
          <div style={{
            height: 3,
            background: `linear-gradient(90deg, ${catColor}aa, ${catColor}, ${catColor}44)`,
            boxShadow: `0 0 16px ${catColor}88`,
          }} />

          <div style={{ padding: '22px 22px 24px' }}>
            {/* category + counter row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: `${catColor}18`,
                border: `1px solid ${catColor}44`,
                color: catColor,
                fontSize: '.67rem', fontWeight: 800, letterSpacing: '.14em',
                textTransform: 'uppercase', padding: '5px 13px', borderRadius: 22,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: catColor, boxShadow: `0 0 6px ${catColor}` }} />
                {q.category}
              </span>
            </div>

            {/* typewriter question */}
            <p style={{
              fontSize: '1.1rem', fontWeight: 600, color: theme === 'dark' ? OFF_WHITE : DARK_BLUE,
              lineHeight: 1.65, minHeight: '4.8em',
              letterSpacing: '-.01em',
              transition: 'color 0.8s ease',
            }}>
              {displayed}
              <span style={{
                display: 'inline-block', width: 2, height: '1.1em',
                background: theme === 'dark' ? TELENOR_BLUE : MID_BLUE, verticalAlign: 'text-bottom', marginLeft: 2,
                opacity: displayed.length < q.text.length ? 1 : 0,
                boxShadow: theme === 'dark' ? `0 0 8px ${TELENOR_BLUE}` : `0 0 8px ${MID_BLUE}`,
                transition: 'opacity .15s',
              }} />
            </p>

            {/* electric scan line */}
            <div style={{
              position: 'relative',
              height: 1.5,
              width: '100%',
              borderRadius: 1,
              background: `linear-gradient(90deg, transparent, rgba(0,200,255,.18) 40%, rgba(0,200,255,.35) 60%, transparent)`,
              marginTop: 8,
              overflow: 'hidden',
            }}>
              {/* comet head */}
              <div style={{
                position: 'absolute', top: '50%',
                transform: 'translateY(-50%)',
                width: 120, height: 10,
                background: `linear-gradient(90deg, transparent, ${TELENOR_BLUE}cc, #fff, ${TELENOR_BLUE}cc, transparent)`,
                borderRadius: 4,
                filter: `blur(2px)`,
                boxShadow: `0 0 12px 3px ${TELENOR_BLUE}, 0 0 28px 6px rgba(0,200,255,.45)`,
                animation: 'scanComet 2.4s ease-in-out infinite',
              }} />
            </div>
          </div>
        </div>

        {/* Options list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {q.options.map((text, i) => (
            <OptionButton key={`${currentQ}-${i}`} index={i} text={text}
              selected={selected} feedback={feedback}
              correct={q.correct} onSelect={onSelect}
              delay={i * 55} theme={theme}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Animated score count ─────────────────────────────────────────────────────
function AnimCount({ to }: { to: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let cur = 0; if (!to) return
    const step = () => { cur++; setV(cur); if (cur < to) setTimeout(step, 280) }
    setTimeout(step, 500)
  }, [to])
  return <>{v}</>
}

// ─── Results screen — with video ─────────────────────────────────────────────
function ResultsScreen({ score, lang, onReplay, theme }: { score: number; lang: Lang; onReplay: () => void; theme: 'dark' | 'light' }) {
  const CIRC = Math.round(2 * Math.PI * 64)
  const [offset, setOffset] = useState(CIRC)
  const [visible, setVisible] = useState(false)
  const replayBtnRef = useRef<HTMLButtonElement>(null)
  const { ripples, add } = useRipple()
  const t = LANG[lang]

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 60)
    const t2 = setTimeout(() => setOffset(CIRC - (score / 3) * CIRC), 260)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [score])

  const ring = score === 3 ? '#FFD700' : score === 2 ? '#4ade80' : score === 1 ? TELENOR_BLUE : SEC_RED

  return (
    <div style={{
      position: 'relative', zIndex: 1,
      minHeight: '100vh', overflowY: 'auto',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '80px 16px 50px',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: 'opacity .45s ease, transform .45s ease',
    }}>
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

        {/* score ring + title row */}
        <div style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 20,
          background: theme === 'dark'
            ? 'linear-gradient(145deg, rgba(20,14,100,.7), rgba(7,4,82,.8))'
            : 'linear-gradient(145deg, rgba(232,253,255,.9), rgba(255,255,255,.95))',
          border: theme === 'dark' ? `1px solid rgba(0,200,255,.12)` : `1px solid rgba(28,22,197,.12)`,
          borderRadius: 24, padding: '22px 24px',
          backdropFilter: 'blur(20px)',
          boxShadow: theme === 'dark'
            ? `0 0 0 1px rgba(0,200,255,.06), 0 24px 60px rgba(0,0,0,.4)`
            : `0 0 0 1px rgba(28,22,197,.03), 0 20px 40px rgba(28,22,197,.08)`,
          animation: 'slideUp .5s .1s both',
          transition: 'background 0.8s ease, border-color 0.8s ease',
        }}>
          {/* ring */}
          <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
            <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="55" cy="55" r="44" fill="none" stroke={theme === 'dark' ? "rgba(28,22,197,.2)" : "rgba(28,22,197,.07)"} strokeWidth="7" />
              <circle cx="55" cy="55" r="44" fill="none"
                stroke={ring} strokeWidth="7" strokeLinecap="round"
                strokeDasharray={`${Math.round(2 * Math.PI * 44)} ${Math.round(2 * Math.PI * 44)}`}
                strokeDashoffset={Math.round(2 * Math.PI * 44) - (score / 3) * Math.round(2 * Math.PI * 44)}
                style={{ filter: `drop-shadow(0 0 7px ${ring})`, transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.9rem', fontWeight: 900, color: theme === 'dark' ? '#fff' : DARK_BLUE, lineHeight: 1, animation: 'countBounce .5s .3s both' }}>
                <AnimCount to={score} />/3
              </span>
              <span style={{ fontSize: '.6rem', fontWeight: 700, color: ring, letterSpacing: '.12em', marginTop: 2 }}>
                {t.scoreLabel}
              </span>
            </div>
          </div>

          {/* title + sub + dots */}
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, fontStyle: 'italic', color: theme === 'dark' ? '#fff' : DARK_BLUE, lineHeight: 1.2, marginBottom: 6 }}>
              {t.resultTitles[score]}
            </h2>
            <p style={{ fontSize: '.82rem', color: theme === 'dark' ? LIGHT_BLUE : MID_BLUE, lineHeight: 1.55, marginBottom: 12 }}>
              {t.resultSubs[score]}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: i < score ? 'rgba(74,222,128,.15)' : (theme === 'dark' ? 'rgba(255,255,255,.05)' : 'rgba(7,4,82,.05)'),
                  border: `1.5px solid ${i < score ? '#4ade80' : (theme === 'dark' ? 'rgba(255,255,255,.1)' : 'rgba(7,4,82,.12)')}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '.78rem', color: i < score ? '#4ade80' : (theme === 'dark' ? 'rgba(255,255,255,.22)' : 'rgba(7,4,82,.35)'),
                  boxShadow: i < score ? '0 0 10px rgba(74,222,128,.3)' : 'none',
                  transition: `all .35s ${i * .12}s ease`,
                }}>
                  {i < score ? '✓' : '○'}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI&I results divider badge */}
        <div style={{ width: '100%', animation: 'slideUp .5s .2s both' }}>
          <div style={{
            position: 'relative',
            background: theme === 'dark'
              ? 'linear-gradient(135deg, rgba(192,38,211,.15) 0%, rgba(14,165,233,.15) 100%)'
              : 'linear-gradient(135deg, rgba(192,38,211,.08) 0%, rgba(28,22,197,.08) 100%)',
            border: theme === 'dark' ? '1px solid rgba(255,255,255,.12)' : '1px solid rgba(28,22,197,.15)',
            borderRadius: 20,
            padding: '18px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
            backdropFilter: 'blur(16px)',
            boxShadow: theme === 'dark'
              ? '0 16px 40px rgba(192,38,211,.15), inset 0 0 20px rgba(255,255,255,.05)'
              : '0 16px 40px rgba(28,22,197,.08), inset 0 0 20px rgba(255,255,255,.4)',
            // 3D dynamic auto-drift bob animation
            transform: 'perspective(800px) rotateX(4deg) rotateY(-8deg)',
            animation: 'drift 6s ease-in-out infinite alternate',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(224,64,251,.7) 40%, rgba(0,200,255,.7) 70%, transparent)' }} />
            <div>
              <div style={{ fontSize: '.6rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: theme === 'dark' ? 'rgba(255,255,255,.45)' : 'rgba(7,4,82,.6)', marginBottom: 4 }}>
                Your invitation to
              </div>
              <img
                src={aiAndILogo}
                alt="AI & I"
                style={{
                  width: 'clamp(70px, 16vw, 100px)',
                  height: 'auto',
                  display: 'block',
                  filter: theme === 'dark' ? 'drop-shadow(0 2px 12px rgba(224,64,251,.8))' : 'drop-shadow(0 2px 8px rgba(28,22,197,.35))',
                }}
              />
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '.65rem', color: theme === 'dark' ? 'rgba(255,255,255,.45)' : 'rgba(7,4,82,.6)', letterSpacing: '.08em', marginBottom: 4 }}>Powered by</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                <GpMark size={20} />
                <span style={{ fontSize: '.72rem', fontWeight: 700, color: theme === 'dark' ? 'rgba(255,255,255,.75)' : DARK_BLUE, letterSpacing: '.1em' }}>Grameenphone</span>
              </div>
            </div>
            {/* Shimmer overlay loop */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 20,
              background: 'linear-gradient(110deg, transparent 35%, rgba(255,255,255,.08) 50%, transparent 65%)',
              backgroundSize: '200%',
              animation: 'shimmer 4.5s linear infinite',
            }} />
          </div>
        </div>

        {/* AR camera CTA */}
        <div style={{ width: '100%', animation: 'slideUp .5s .3s both' }}>
          {/* instruction text */}
          <p style={{
            textAlign: 'center', fontSize: '.95rem', fontWeight: 700,
            color: theme === 'dark' ? '#fff' : DARK_BLUE, lineHeight: 1.6,
            marginBottom: 16, letterSpacing: '.01em',
            textShadow: theme === 'dark' ? '0 0 24px rgba(0,200,255,.4)' : 'none',
          }}>
            {t.arInstruction}
          </p>

          {/* camera button */}
          <label style={{ display: 'block', cursor: 'pointer' }} onClick={e => {
            e.preventDefault()
            navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
              .then(stream => {
                const win = window.open('', '_blank', 'width=640,height=480')
                if (!win) { stream.getTracks().forEach(t => t.stop()); return }
                win.document.body.style.cssText = 'margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh'
                const v = win.document.createElement('video')
                v.srcObject = stream; v.autoplay = true; v.playsInline = true
                v.style.cssText = 'width:100%;height:100%;object-fit:cover'
                win.document.body.appendChild(v)
                win.addEventListener('beforeunload', () => stream.getTracks().forEach(t => t.stop()))
              })
              .catch(() => alert('Camera permission denied or not available.'))
          }}>
            <div style={{
              position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
              padding: '18px 32px', borderRadius: 20,
              background: 'linear-gradient(135deg, #c026d3 0%, #7c3aed 45%, #0ea5e9 100%)',
              boxShadow: '0 6px 32px rgba(192,38,211,.45), 0 2px 14px rgba(0,200,255,.2)',
              transition: 'transform .15s ease, box-shadow .15s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 10px 40px rgba(192,38,211,.6), 0 4px 20px rgba(0,200,255,.3)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 32px rgba(192,38,211,.45), 0 2px 14px rgba(0,200,255,.2)' }}
            >
              {/* camera icon SVG */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '.04em' }}>
                  {t.arLabel}
                </div>
                <div style={{ fontSize: '.68rem', color: 'rgba(255,255,255,.7)', letterSpacing: '.08em', marginTop: 1 }}>
                  {t.arSub}
                </div>
              </div>
              {/* shimmer sweep */}
              <div style={{
                position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
                background: 'linear-gradient(105deg, transparent, rgba(255,255,255,.12), transparent)',
                animation: 'shimmer 2.4s ease infinite',
                pointerEvents: 'none',
              }} />
            </div>
          </label>
        </div>

      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme]         = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('gp-quiz-theme')
    return (saved === 'light' || saved === 'dark') ? saved : 'dark'
  })

  useEffect(() => {
    localStorage.setItem('gp-quiz-theme', theme)
  }, [theme])

  const [screen, setScreen]       = useState<'hero' | 'quiz' | 'results'>('hero')
  const [lang, setLang]           = useState<Lang>('bn')
  const [currentQ, setCurrentQ]   = useState(0)
  const [score, setScore]         = useState(0)
  const [selected, setSelected]   = useState<number | null>(null)
  const [feedback, setFeedback]   = useState<'correct' | 'wrong' | null>(null)
  const launchConfetti            = useRef<() => void>(() => {})

  const handleStart = () => {
    setCurrentQ(0); setScore(0); setSelected(null); setFeedback(null)
    setScreen('quiz')
  }
  const handleSelect = (index: number) => {
    setSelected(index)
    const ok = index === QUESTIONS[currentQ].correct
    if (ok) {
      setScore(s => s + 1)
      setFeedback('correct')
      launchConfetti.current()   // immediate burst
      // auto-advance after particle moment
      setTimeout(() => {
        setSelected(null); setFeedback(null)
        if (currentQ + 1 >= QUESTIONS.length) setScreen('results')
        else setCurrentQ(q => q + 1)
      }, 1500)
    } else {
      setFeedback('wrong')
      setTimeout(() => {
        setSelected(null); setFeedback(null)
        if (currentQ + 1 >= QUESTIONS.length) setScreen('results')
        else setCurrentQ(q => q + 1)
      }, 1500)
    }
  }
  const handleReplay = () => {
    setScreen('hero'); setCurrentQ(0); setScore(0)
    setSelected(null); setFeedback(null)
  }

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <style>{getGlobalCSS(theme)}</style>
      <AuroraBackground theme={theme} />
      <ConfettiCanvas launchRef={launchConfetti} />

      {screen !== 'hero' && <TopBar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} />}
      {screen === 'quiz' && <ProgressBar currentQ={currentQ} />}

      <div style={{ height: '100vh', overflowY: screen === 'quiz' ? 'auto' : 'hidden' }}>
        {screen === 'hero'    && <HeroScreen lang={lang} setLang={setLang} onStart={handleStart} theme={theme} setTheme={setTheme} />}
        {screen === 'quiz'    && <QuizScreen currentQ={currentQ} selected={selected} feedback={feedback} lang={lang} onSelect={handleSelect} theme={theme} />}
        {screen === 'results' && <ResultsScreen score={score} lang={lang} onReplay={handleReplay} theme={theme} />}
      </div>


    </div>
  )
}
