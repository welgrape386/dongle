// @ts-nocheck
/* eslint-disable */
/*
 * This file is a direct port of the original vanilla-JS game logic.
 * It intentionally uses classic DOM APIs (getElementById, classList, etc.)
 * instead of React state, so the behaviour matches the original prototype
 * exactly. It is called once from a useEffect in App.tsx.
 */
import type { Job } from '../data/jobs';

export function initGame(JOBS: Job[]) {
const starsEl = document.getElementById('stars');
for(let i=0;i<70;i++){
  const s=document.createElement('div');
  s.className='star';
  s.style.left=Math.random()*100+'vw';
  s.style.top=Math.random()*100+'vh';
  s.style.animationDelay=(Math.random()*3)+'s';
  s.style.width=s.style.height=(Math.random()<.15?'3px':'1.5px');
  starsEl.appendChild(s);
}





/* ---------------- retro audio (synthesized, no files needed) ---------------- */
let audioCtx = null;
function getAudioCtx(){
  if(!audioCtx){
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return null;
    audioCtx = new AC();
  }
  if(audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
  return audioCtx;
}
// unlock audio on first user interaction (autoplay policies)
['pointerdown','keydown'].forEach(evt=>{
  document.addEventListener(evt, ()=>{ getAudioCtx(); }, {once:true});
});

function noiseBuffer(ctx, duration){
  const size = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<size;i++){ data[i] = Math.random()*2-1; }
  return buffer;
}

function playStaticBurst(duration=0.16, volume=0.22){
  const ctx = getAudioCtx(); if(!ctx) return;
  try{
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, duration);
    const filter = ctx.createBiquadFilter();
    filter.type='bandpass'; filter.frequency.value=1600+Math.random()*800; filter.Q.value=0.7;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+duration);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(); src.stop(ctx.currentTime+duration);
  }catch(e){}
}

// old-TV "buzz + flicker" power-on hum, timed roughly with the crtBoot keyframes
function playPowerHum(duration=1.3){
  const ctx = getAudioCtx(); if(!ctx) return;
  try{
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type='sawtooth';
    osc.frequency.setValueAtTime(45, t);
    osc.frequency.exponentialRampToValueAtTime(140, t+duration*0.55);
    osc.frequency.exponentialRampToValueAtTime(90, t+duration);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    // flicker envelope matching crtBoot's on/off pulses
    const stops = [0.04,0.08,0.14,0.18,0.23,0.27,0.34,0.40,0.48,0.55,0.63,0.72,0.82,1.0];
    let prevLevel = 0.0001;
    stops.forEach((pos,i)=>{
      const time = t + duration*pos;
      const level = (i%2===0) ? (0.06+Math.random()*0.10) : 0.008;
      gain.gain.linearRampToValueAtTime(level, time);
    });
    gain.gain.exponentialRampToValueAtTime(0.0001, t+duration+0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t); osc.stop(t+duration+0.4);
  }catch(e){}
  playStaticBurst(0.25, 0.18);
  setTimeout(()=>playStaticBurst(0.18, 0.22), 260);
  setTimeout(()=>playStaticBurst(0.15, 0.16), 620);
  setTimeout(()=>playStaticBurst(0.12, 0.12), 980);
}

// short blip/whoosh used when flipping through jobs
function playBlip(rising=true){
  const ctx = getAudioCtx(); if(!ctx) return;
  try{
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type='square';
    if(rising){
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(680, t+0.09);
    }else{
      osc.frequency.setValueAtTime(680, t);
      osc.frequency.exponentialRampToValueAtTime(320, t+0.09);
    }
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t+0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t); osc.stop(t+0.13);
  }catch(e){}
}

// quick electric "zap" used at each CRT collapse/expand beat
function playZap(){
  const ctx = getAudioCtx(); if(!ctx) return;
  try{
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type='square';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(60, t+0.22);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.16, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t+0.24);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t); osc.stop(t+0.25);
  }catch(e){}
  playStaticBurst(0.2, 0.18);
}

// short upward confirm chime, used whenever the player picks/confirms something
function playSelect(){
  const ctx = getAudioCtx(); if(!ctx) return;
  try{
    const t = ctx.currentTime;
    [520, 780].forEach((freq, i)=>{
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t + i*0.07);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.16, t + i*0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i*0.07 + 0.14);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t + i*0.07);
      osc.stop(t + i*0.07 + 0.15);
    });
  }catch(e){}
}

/* ---------------- CRT suck-in / glitch transition fx ---------------- */
const fxLayer = document.getElementById('fx-layer');
const screenEl = document.querySelector('.screen');

function spawnGlitchDebris(colors){
  // flying horizontal glitch bars (screen slices whipping past)
  const barCount = 9;
  for(let i=0;i<barCount;i++){
    const bar = document.createElement('div');
    bar.className = 'fx-glitchbar';
    const top = Math.random()*100;
    const h = 2 + Math.random()*7;
    const dur = 0.16 + Math.random()*0.22;
    const delay = Math.random()*0.18;
    bar.style.top = top + '%';
    bar.style.height = h + 'px';
    bar.style.setProperty('--fx-color', colors[Math.floor(Math.random()*colors.length)]);
    bar.style.animationDuration = dur + 's';
    bar.style.animationDelay = delay + 's';
    fxLayer.appendChild(bar);
    setTimeout(()=>bar.remove(), (dur+delay)*1000 + 80);
  }
  // flying pixel shards
  const shardCount = 14;
  for(let i=0;i<shardCount;i++){
    const s = document.createElement('div');
    s.className = 'fx-shard';
    const x = 25 + Math.random()*50;
    const y = 25 + Math.random()*50;
    const angle = Math.random()*Math.PI*2;
    const dist = 140 + Math.random()*260;
    const dur = 0.32 + Math.random()*0.3;
    s.style.left = x + '%';
    s.style.top = y + '%';
    s.style.setProperty('--fx-color', colors[Math.floor(Math.random()*colors.length)]);
    s.style.setProperty('--fx-dx', Math.cos(angle)*dist + 'px');
    s.style.setProperty('--fx-dy', Math.sin(angle)*dist + 'px');
    s.style.animationDuration = dur + 's';
    fxLayer.appendChild(s);
    setTimeout(()=>s.remove(), dur*1000 + 80);
  }
}

function flashStatic(){
  const staticEl = document.createElement('div');
  staticEl.className = 'fx-static show';
  fxLayer.appendChild(staticEl);
  setTimeout(()=>staticEl.remove(), 450);
}

/**
 * Boot flicker: runs once when the page loads. The screen is dark, then
 * flickers dim/bright a few times like an old TV warming up (깜빡깜빡 지지직~),
 * then settles fully lit on the START screen. No flying debris here — just
 * dimming/brightening + static noise, so it reads as "powering on" rather
 * than a transition effect.
 */
function bootSequence(){
  screenEl.classList.add('crt-boot');
  playPowerHum(1.5);
  setTimeout(flashStatic, 350);
  setTimeout(flashStatic, 540);
  setTimeout(flashStatic, 690);
  setTimeout(flashStatic, 870);
  const onEnd = (e)=>{
    if(e.animationName === 'crtBoot'){
      screenEl.classList.remove('crt-boot');
      screenEl.removeEventListener('animationend', onEnd);
    }
  };
  screenEl.addEventListener('animationend', onEnd);
}
// Run after the browser has painted at least once. We avoid relying on
// document.readyState / the window 'load' event here: in a React app this
// code runs inside a useEffect *after* the page has already mounted, so the
// 'load' event may have already fired earlier and a fresh listener for it
// would never call back — leaving the boot flicker looking like it "does
// nothing". A couple of requestAnimationFrame ticks guarantees we start
// right after paint, every time.
requestAnimationFrame(()=>requestAnimationFrame(bootSequence));

/**
 * CRT-style transition: screen collapses into a bright horizontal line and
 * vanishes (like switching off an old TV), swaps the scene content at the
 * midpoint, then the screen expands back out (like switching it back on).
 * While collapsed/expanding, glitch bars and pixel shards fly across the screen,
 * with electric zap + static sound at each beat.
 */
function crtTransition(swapFn, colors){
  colors = colors || ['var(--pink)','var(--cyan)','var(--purple)','var(--yellow)'];

  screenEl.classList.remove('crt-in');
  void screenEl.offsetWidth;
  screenEl.classList.add('crt-out');
  playZap();
  flashStatic();
  spawnGlitchDebris(colors);
  setTimeout(()=>{ flashStatic(); spawnGlitchDebris(colors); }, 150);

  setTimeout(()=>{
    if (typeof swapFn === 'function') swapFn();

    screenEl.classList.remove('crt-out');
    void screenEl.offsetWidth;
    screenEl.classList.add('crt-in');
    playZap();
    flashStatic();
    spawnGlitchDebris(colors);
    setTimeout(()=>{ flashStatic(); spawnGlitchDebris(colors); }, 150);

    setTimeout(()=>{
      screenEl.classList.remove('crt-in');
    }, 500);
  }, 420);
}

/* ---------------- start screen logic ---------------- */
const optYes = document.getElementById('opt-yes');
const optNo = document.getElementById('opt-no');
const ynRow = document.getElementById('yn-row');
const noToast = document.getElementById('no-toast');
let selectedYes = true;

function setSelection(yes){
  selectedYes = yes;
  optYes.classList.toggle('selected', yes);
  optNo.classList.toggle('selected', !yes);
}

optYes.addEventListener('mouseenter', ()=>setSelection(true));
optNo.addEventListener('mouseenter', ()=>setSelection(false));

optYes.addEventListener('click', ()=>{
  setSelection(true);
  crtTransition(goToSelect);
});
optNo.addEventListener('click', ()=>{
  setSelection(false);
  ynRow.classList.remove('shake'); void ynRow.offsetWidth; ynRow.classList.add('shake');
  const msgs = ['용기를 내보세요!','직업 선택이 기다려요!','다시 생각해봐요!'];
  noToast.textContent = msgs[Math.floor(Math.random()*msgs.length)];
});

document.addEventListener('keydown', (e)=>{
  if(!document.getElementById('screen-start').classList.contains('active')) return;
  if(e.key==='ArrowLeft'||e.key==='ArrowRight'){ setSelection(!selectedYes); }
  if(e.key==='Enter'){
    if(selectedYes){
      crtTransition(goToSelect);
    } else {
      optNo.click();
    }
  }
});

function goToSelect(){
  document.getElementById('screen-start').classList.remove('active');
  document.getElementById('screen-select').classList.add('active');
  renderSlots();
}

/* ---------------- carousel (fixed 3-slot) logic ---------------- */
const row3 = document.getElementById('row3');
const dotsEl = document.getElementById('dots');
const slotPrevImg = document.querySelector('#slot-prev img');
const slotCurImg = document.querySelector('#slot-current img');
const slotNextImg = document.querySelector('#slot-next img');
const slotCenter = document.getElementById('slot-current');
const nameTag = document.getElementById('name-tag');
let index = 0;
const len = JOBS.length;

function buildDots(){
  dotsEl.innerHTML = JOBS.map((_,i)=>`<span class="dot ${i===index?'on':''}"></span>`).join('');
}

function renderSlots(){
  const prevJob = JOBS[(index-1+len)%len];
  const curJob = JOBS[index];
  const nextJob = JOBS[(index+1)%len];
  slotPrevImg.src = prevJob.img; slotPrevImg.alt = prevJob.name;
  slotCurImg.src = curJob.img; slotCurImg.alt = curJob.name;
  slotNextImg.src = nextJob.img; slotNextImg.alt = nextJob.name;
  slotCenter.style.setProperty('--accent', curJob.accent);
  nameTag.textContent = curJob.name;
  buildDots();
}

function goTo(newIndex, dir){
  index = (newIndex + len) % len;
  row3.classList.add(dir > 0 ? 'anim-next' : 'anim-prev');
  playBlip(dir > 0);
  setTimeout(()=>{
    renderSlots();
    row3.classList.remove('anim-next','anim-prev');
  }, 220);
}

document.getElementById('btn-prev').addEventListener('click', ()=>goTo(index-1,-1));
document.getElementById('btn-next').addEventListener('click', ()=>goTo(index+1,1));

document.addEventListener('keydown', (e)=>{
  if(!document.getElementById('screen-select').classList.contains('active')) return;
  if(document.getElementById('modal').classList.contains('active')) return;
  if(e.key==='ArrowLeft') goTo(index-1,-1);
  if(e.key==='ArrowRight') goTo(index+1,1);
  if(e.key==='Enter') document.getElementById('btn-select').click();
});

/* ---------------- job selection modal flow ---------------- */
const modal = document.getElementById('modal');
const stepTier = document.getElementById('step-tier');
const stepNickname = document.getElementById('step-nickname');
const stepConfirm = document.getElementById('step-confirm');
const tierRow = document.getElementById('tier-row');
const tierNext = document.getElementById('tier-next');
const nicknameInput = document.getElementById('nickname-input');
const nicknameBadge = document.getElementById('nickname-badge');
const TIER_LABELS = ['1차','2차','3차','4차','5차'];
const TIER_COLORS = ['#9099a6', '#e9e6f0', '#ff4fa8', '#ffd23f', '#a06bff'];
const TIER_NEON = [false, false, false, true, true];

function starSVG(color, filled){
  const fill = filled ? color : 'none';
  const stroke = color;
  return `<svg viewBox="0 0 24 24"><polygon points="12,2 15,9 22,9 16.5,13.5 18.5,21 12,16.5 5.5,21 7.5,13.5 2,9 9,9" fill="${fill}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
}

let chosenTier = null;
let playerName = '';

function showStep(step){
  [stepTier, stepNickname, stepConfirm].forEach(s=>s.classList.remove('active'));
  step.classList.add('active');
}

document.getElementById('btn-select').addEventListener('click', ()=>{
  playSelect();
  const job = JOBS[index];
  chosenTier = null;
  tierNext.disabled = true;

  document.getElementById('tier-job-img').src = job.img;
  document.getElementById('tier-frame').style.setProperty('--accent', job.accent);
  stepTier.style.setProperty('--accent', job.accent);

  tierRow.innerHTML = TIER_COLORS.map((color,i)=>`
    <button class="tier-btn${TIER_NEON[i] ? ' neon' : ''}" data-i="${i}" style="--accent:${color}">
      ${starSVG(color, i>0)}
      <span>${TIER_LABELS[i]}</span>
    </button>`).join('');

  tierRow.querySelectorAll('.tier-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      playSelect();
      tierRow.querySelectorAll('.tier-btn').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      chosenTier = Number(btn.dataset.i);
      tierNext.disabled = false;
    });
  });

  showStep(stepTier);
  modal.classList.add('active');
});

tierNext.addEventListener('click', ()=>{
  if(chosenTier===null) return;
  playSelect();
  showStep(stepNickname);
  nicknameInput.value = playerName;
  setTimeout(()=>nicknameInput.focus(), 50);
});

document.getElementById('nickname-back').addEventListener('click', ()=>showStep(stepTier));

function submitNickname(){
  const val = nicknameInput.value.trim();
  if(!val) { nicknameInput.focus(); return; }
  playerName = val;
  const job = JOBS[index];
  playSelect();

  document.getElementById('confirm-job-img').src = job.img;
  document.getElementById('confirm-frame').style.setProperty('--accent', job.accent);
  document.getElementById('confirm-name').textContent = playerName;
  document.getElementById('confirm-job').textContent = job.name;
  document.getElementById('confirm-tier').textContent = TIER_LABELS[chosenTier];

  nicknameBadge.textContent = `· ${playerName}님`;
  nicknameBadge.classList.add('show');

  showStep(stepConfirm);
}

document.getElementById('nickname-next').addEventListener('click', submitNickname);
nicknameInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') submitNickname(); });

document.getElementById('modal-close').addEventListener('click', ()=>{
  modal.classList.remove('active');
});

document.getElementById('modal-x').addEventListener('click', ()=>{
  modal.classList.remove('active');
});

}
