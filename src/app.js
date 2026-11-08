import { roasts, tantrums, beers, wishes, createDeck } from './content.js';

const $ = selector => document.querySelector(selector);
const scene = $('#scene');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let motionOverride = false;
const prefersLessMotion = () => reducedMotion.matches || motionOverride;
const next = { cry: createDeck(tantrums), beer: createDeck(beers), roast: createDeck(roasts), wish: createDeck(wishes) };
const counts = { cry: 0, beer: 0, roast: 0 };
let sceneTimer, toastTimer, resetClicks = 0;

// All reaction art is cropped from the supplied personalised concept, never stock art.
const camera = document.createElement('div');
camera.className = 'reaction-camera';
camera.setAttribute('aria-hidden', 'true');
camera.innerHTML = `<img class="camera-cry" src="images/nads-cry.webp" alt="" width="366" height="232"><img class="camera-beer" src="images/nads-beer.webp" alt="" width="358" height="232"><img class="camera-roast" src="images/nads-roast.webp" alt="" width="358" height="232"><svg class="drinking-bottle" viewBox="0 0 358 232" preserveAspectRatio="xMidYMid slice"><defs><clipPath id="bottle-cutout"><path d="M40 43Q28 57 38 79L139 104 167 102 173 86 62 44Z"/></clipPath></defs><image href="images/nads-beer.webp" width="358" height="232" clip-path="url(#bottle-cutout)"/></svg><span class="camera-tears"><i></i><i></i><i></i><i></i></span><span class="camera-foam">° ◦ °</span><span class="camera-fire"></span>`;
scene.append(camera);

class BirthdayAudio {
  context;
  enabled = false;
  sources = new Set();
  sequence = 0;
  async unlock() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    try {
      this.context ??= new AudioContext();
      if (this.context.state === 'suspended') await this.context.resume();
      return this.context.state === 'running';
    } catch { return false; }
  }
  stop() {
    this.sequence++;
    for (const source of this.sources) { try { source.stop(); } catch { /* Already finished. */ } }
    this.sources.clear();
  }
  tone(frequency, duration, delay = 0, type = 'sine', volume = .08, endFrequency = frequency) {
    if (!this.context || !this.enabled) return;
    const time = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, time);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(10, endFrequency), time + duration);
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + .025);
    gain.gain.exponentialRampToValueAtTime(.001, time + duration);
    oscillator.connect(gain).connect(this.context.destination);
    this.sources.add(oscillator);
    oscillator.onended = () => { this.sources.delete(oscillator); oscillator.disconnect(); gain.disconnect(); };
    oscillator.start(time);
    oscillator.stop(time + duration + .02);
    return oscillator;
  }
  async play(kind) {
    this.stop();
    const sequence = this.sequence;
    if (!this.enabled) return;
    if (!await this.unlock() || !this.enabled || document.hidden || sequence !== this.sequence) return;
    if (kind === 'cry') {
      // Sweeping voiced wails with a separate tremolo oscillator: finite, no samples.
      for (let i = 0; i < 4; i++) {
        const voice = this.tone(520, .55, i * .46, 'sawtooth', .035, 280);
        const vibrato = this.context.createOscillator();
        const depth = this.context.createGain();
        vibrato.frequency.value = 8;
        depth.gain.value = 36;
        vibrato.connect(depth).connect(voice.frequency);
        const start = this.context.currentTime + i * .46;
        this.sources.add(vibrato);
        vibrato.onended = () => { this.sources.delete(vibrato); vibrato.disconnect(); depth.disconnect(); };
        vibrato.start(start); vibrato.stop(start + .55);
      }
    } else if (kind === 'beer') {
      [0, .22, .44].forEach(delay => this.tone(250, .12, delay, 'sine', .08, 90));
      this.tone(110, .65, .85, 'sawtooth', .075, 36);
    } else if (kind === 'roast') {
      [220, 174, 110].forEach((note, i) => this.tone(note, .25, i * .16, 'triangle', .1, note * .8));
    } else if (kind === 'duck') {
      this.tone(450, .18, 0, 'square', .035, 270); this.tone(380, .18, .23, 'square', .035, 220);
    } else {
      [523, 659, 784, 1047].forEach((note, i) => this.tone(note, .3, i * .12, 'triangle', .07));
    }
  }
}
const audio = new BirthdayAudio();
$('#sound').addEventListener('click', async () => {
  const button = $('#sound');
  if (audio.enabled) {
    audio.enabled = false; audio.stop();
  } else {
    button.disabled = true;
    const unlocked = await audio.unlock();
    button.disabled = false;
    if (!unlocked) { toast('Sound isn’t available in this browser. The chaos still works.'); return; }
    audio.enabled = true;
    audio.play('party');
  }
  button.setAttribute('aria-pressed', String(audio.enabled));
  button.textContent = audio.enabled ? '♫ Sound on' : '◌ Sound off';
});

const canvas = $('#confetti');
const ctx = canvas.getContext('2d');
let particles = [], animationFrame = 0, lastFrame = 0, confettiEnd = 0;
function stopConfetti() {
  cancelAnimationFrame(animationFrame); animationFrame = 0; particles = [];
  ctx?.clearRect(0, 0, canvas.width, canvas.height);
}
function confetti(count = 90, duration = 4000) {
  if (prefersLessMotion() || !ctx || document.hidden) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr; canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colours = ['#e64530', '#244edf', '#f9ce41', '#cef0bd', '#f6b7c3'];
  particles = Array.from({ length: count }, () => ({ x: Math.random() * innerWidth, y: -20 - Math.random() * 100, speed: 110 + Math.random() * 150, drift: (Math.random() - .5) * 100, spin: Math.random() * 6, colour: colours[Math.floor(Math.random() * colours.length)] }));
  cancelAnimationFrame(animationFrame);
  lastFrame = performance.now(); confettiEnd = lastFrame + duration;
  animationFrame = requestAnimationFrame(frame);
}
function frame(now) {
  const delta = Math.min((now - lastFrame) / 1000, .05); lastFrame = now;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  if (now >= confettiEnd || prefersLessMotion() || document.hidden) { stopConfetti(); return; }
  for (const p of particles) {
    p.y += p.speed * delta; p.x += p.drift * delta; p.spin += delta * 3;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.spin); ctx.fillStyle = p.colour; ctx.fillRect(-3, -5, 6, 10); ctx.restore();
  }
  animationFrame = requestAnimationFrame(frame);
}
function toast(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message; $('#toast').classList.add('visible');
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4500);
}
function reveal(message, label) {
  const box = $('.message-box');
  box.classList.remove('reveal');
  $('#message').textContent = message;
  $('#message-tag').textContent = label;
  // Restart only the short reveal; text enters the live region as one complete sentence.
  void box.offsetWidth; box.classList.add('reveal');
}
const scenes = {
  cry: { status: 'SUBJECT: ABSOLUTELY INCONSOLABLE', caption: 'TANTRUM CAM / SEND A RESPONSIBLE ADULT', tag: 'OFFICIAL REASON FOR THE FUCKING CARRY-ON', camera: 'LIVE: NAPPY INCIDENT' },
  beer: { status: 'SUBJECT: BOTTLE-FED & THRIVING', caption: 'CRISIS AVERTED. MATURITY STILL AT 3%.', tag: 'EMOTIONAL SUPPORT STUBBY: DEPLOYED', camera: 'LIVE: BIG-BOY BOTTLE TIME' },
  roast: { status: 'SUBJECT: FEELINGS WELL DONE', caption: 'ROAST MODE / THE BEARD CAN’T SAVE HIM NOW', tag: 'FRESHLY ROASTED. ZERO FUCKS GIVEN.', camera: 'LIVE: ABSOLUTELY COOKED' }
};
function act(kind) {
  if (!scenes[kind]) return;
  clearTimeout(sceneTimer); stopConfetti();
  // Force finite reaction sequences to restart even for the same button.
  scene.dataset.mood = 'party'; scene.classList.remove('settled');
  void scene.offsetWidth; scene.dataset.mood = kind;
  counts[kind]++;
  $('#tears-count').textContent = counts.cry;
  $('#beer-count').textContent = counts.beer;
  $('#roast-count').textContent = counts.roast;
  const total = counts.cry + counts.beer + counts.roast;
  $('#action-count').textContent = `${String(total).padStart(2, '0')} ${total === 1 ? 'INCIDENT' : 'INCIDENTS'}`;
  $('#status').textContent = scenes[kind].status;
  $('#scene-caption').textContent = scenes[kind].caption;
  camera.dataset.label = scenes[kind].camera;
  $('#art-title').textContent = `Nads: ${scenes[kind].camera.toLowerCase()}`;
  document.querySelectorAll('[data-action]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.action === kind)));
  reveal(next[kind](), scenes[kind].tag);
  audio.play(kind);
  if (kind === 'beer') confetti(28, 1400);
  if (kind === 'roast' && counts.roast === 10) toast('Ten roasts. At this point it’s a fucking intervention.');
  sceneTimer = setTimeout(() => scene.classList.add('settled'), 6500);
}
document.querySelectorAll('[data-action]').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => act(button.dataset.action));
});
$('#reset').addEventListener('click', () => {
  clearTimeout(sceneTimer); audio.stop(); stopConfetti(); scene.dataset.mood = 'party'; scene.classList.remove('settled');
  $('#status').textContent = 'SUBJECT: UNSUPERVISED';
  $('#scene-caption').textContent = 'THE BIRTHDAY BOY. ALLEGEDLY A GROWN-UP.';
  $('#art-title').textContent = 'Nads, the birthday boy and enormous bearded baby';
  document.querySelectorAll('[data-action]').forEach(button => button.setAttribute('aria-pressed', 'false'));
  reveal('Factory settings restored. Unfortunately, the factory was a fucking daycare.', 'HAVE YOU TRIED TURNING HIM OFF AND ON AGAIN?');
  if (++resetClicks === 3) toast('Three resets. Still 3%. It’s a hardware problem, mate.');
});
$('#maturity').addEventListener('click', () => {
  toast('ERROR 003: Adult not found. Firmware update rejected. Still 3%.');
  audio.play('roast');
});
$('#celebrate').addEventListener('click', () => {
  $('#wish').textContent = next.wish(); confetti(); audio.play('party');
});
$('#duck').addEventListener('click', () => {
  toast('Even the fucking duck has a better five-year plan.'); audio.play('duck'); confetti();
});
$('#share').addEventListener('click', async () => {
  const url = new URL(window.location.href); url.hash = '';
  const share = { title: 'Happy birthday, you big bearded baby!', text: 'Nads has a full beard and 3% maturity. You know what to do.', url: url.href };
  try {
    if (navigator.share) { await navigator.share(share); return; }
    if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(url.href); toast('Link copied. Send it to another enabler.'); return; }
  } catch (error) { if (error.name === 'AbortError') return; }
  toast(`Copy this birthday link: ${url.href}`);
});
// Keyboard Easter egg; never intercept shortcuts or editable controls.
let secret = '';
document.addEventListener('keydown', event => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.target.matches('input,textarea,[contenteditable=true]')) return;
  if (event.key.length !== 1) return;
  secret = (secret + event.key.toLowerCase()).slice(-5);
  if (secret === 'nappy') { toast('NAPPY MODE UNLOCKED. Dignity remains unavailable.'); confetti(); audio.play('duck'); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) { audio.stop(); stopConfetti(); } });
window.addEventListener('resize', stopConfetti);
function syncMotion() {
  const reduced = prefersLessMotion();
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  $('#motion').setAttribute('aria-pressed', String(reduced));
  $('#motion').textContent = reduced ? 'Motion reduced' : 'Reduce motion';
  if (reduced) stopConfetti();
}
$('#motion').addEventListener('click', () => {
  if (reducedMotion.matches) { toast('Your device requests reduced motion. We’re keeping it that way.'); return; }
  motionOverride = !motionOverride; syncMotion();
});
reducedMotion.addEventListener('change', syncMotion);
syncMotion();
