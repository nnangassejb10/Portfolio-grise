/* Cube 3D piloté par le scroll — section « À propos »
   Autonome : injecte son CSS et son HTML, CSS 3D pur (aucune dépendance),
   utilise les variables du portfolio (--card, --line, --ink, --accent…),
   donc suit automatiquement le mode clair / sombre. */
(() => {
  const host = document.querySelector('#about .indent');
  if (!host || host.querySelector('.cube-scene')) return;

  const faces = [
    { n: 'Développement logiciel', k: 'Dev',  d: 'Web, API, base de données' },
    { n: 'Santé numérique',        k: 'Santé', d: 'Solutions métiers hospitalières' },
    { n: 'Analyse de données',     k: 'Data',  d: 'Exploiter et valoriser' },
    { n: 'Cybersécurité',          k: 'Sécu',  d: 'Réseaux et sécurisation des SI' },
  ];
  const top = { k: 'IA', d: 'Modèles de ML' };
  const bottom = { k: 'JB', d: 'Gloire JB NNANG' };

  const css = `
  .about-cols,.about-text{max-width:none}
  .indent.has-cube{display:grid;grid-template-columns:minmax(0,1fr) clamp(240px,30vw,380px);column-gap:clamp(32px,5vw,72px);align-items:start}
  .indent.has-cube>*{grid-column:1}
  .indent.has-cube>.cube-scene{grid-column:2;grid-row:1 / span 2;position:sticky;top:112px;align-self:start}
  .indent.has-cube>.focus{grid-column:1 / -1}
  .cube-scene{--s:clamp(150px,17vw,220px);display:flex;flex-direction:column;align-items:center;gap:36px;padding-top:12px}
  .cube-stage{width:var(--s);height:var(--s);perspective:900px;perspective-origin:50% 40%}
  .cube{position:relative;width:100%;height:100%;transform-style:preserve-3d;will-change:transform}
  .cube-face{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:18px;
    background:color-mix(in oklab,var(--card) 94%,transparent);border:1px solid var(--ink);backface-visibility:hidden;-webkit-backface-visibility:hidden}
  .cube-face .k{font-family:var(--serif);font-size:clamp(38px,5vw,60px);line-height:1}
  .cube-face .d{font-size:13px;line-height:1.35;color:var(--ink-2)}
  .cube-face.f0{transform:rotateY(0deg) translateZ(calc(var(--s)/2))}
  .cube-face.f1{transform:rotateY(90deg) translateZ(calc(var(--s)/2))}
  .cube-face.f2{transform:rotateY(180deg) translateZ(calc(var(--s)/2))}
  .cube-face.f3{transform:rotateY(270deg) translateZ(calc(var(--s)/2))}
  .cube-face.ft{transform:rotateX(90deg) rotateZ(180deg) translateZ(calc(var(--s)/2));background:var(--accent);border-color:var(--accent);color:#fff}
  .cube-face.ft .d{color:#fff;opacity:.85}
  .cube-face.fb{transform:rotateX(-90deg) rotateZ(180deg) translateZ(calc(var(--s)/2));background:var(--ink);color:var(--paper)}
  .cube-face.fb .d{color:var(--ink-3)}
  .cube-shadow{width:calc(var(--s)*.9);height:18px;margin-top:calc(var(--s)*.18);border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.28),transparent);filter:blur(4px);transition:transform .2s}
  .cube-caption{text-align:center;min-height:3.2em}
  .cube-caption .mono{color:var(--ink-3);display:block;margin-bottom:6px}
  .cube-caption strong{font-family:var(--serif);font-weight:400;font-size:26px;line-height:1.1;display:block}
  @media (max-width:820px){
    .indent.has-cube{display:block}
    .indent.has-cube>.cube-scene{position:relative;top:auto;margin:0 0 56px;--s:170px}
  }
  @media (prefers-reduced-motion:reduce){.cube-scene .cube{transition:none}}
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const face = (cls, f) =>
    `<div class="cube-face ${cls}" aria-hidden="true"><span class="k">${f.k}</span><span class="d">${f.d}</span></div>`;

  const scene = document.createElement('div');
  scene.className = 'cube-scene';
  scene.setAttribute('role', 'img');
  scene.setAttribute('aria-label', 'Cube tournant présentant mes quatre domaines : développement, santé numérique, données et cybersécurité');
  scene.innerHTML = `
    <div class="cube-stage"><div class="cube">
      ${faces.map((f, i) => face('f' + i, f)).join('')}
      ${face('ft', top)}${face('fb', bottom)}
    </div></div>
    <div class="cube-shadow"></div>
    <div class="cube-caption" aria-hidden="true"><span class="mono">Domaine</span><strong></strong></div>`;
  host.classList.add('has-cube');
  host.prepend(scene);

  const cube = scene.querySelector('.cube');
  const shadow = scene.querySelector('.cube-shadow');
  const label = scene.querySelector('.cube-caption strong');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let target = 0, current = 0, last = -1, raf = 0;

  // progression 0→1 pendant que la section traverse l'écran
  const measure = () => {
    const r = host.getBoundingClientRect();
    const vh = innerHeight;
    target = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.3)));
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const render = p => {
    const rotY = p * 360 * 1.0 + 20;              // un tour complet
    const rotX = -22 + Math.sin(p * Math.PI) * -26 + p * 14; // bascule pour dévoiler le dessus
    cube.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
    shadow.style.transform = `scale(${(0.9 + Math.abs(Math.sin(rotY * Math.PI / 180)) * 0.2).toFixed(3)})`;
    const idx = ((Math.round((rotY) / 90) % 4) + 4) % 4;  // face la plus proche de l'écran
    const front = (4 - idx) % 4;
    if (front !== last) { last = front; label.textContent = faces[front].n; }
  };

  const tick = () => {
    raf = 0;
    current += (target - current) * (reduce ? 1 : 0.12);
    if (Math.abs(target - current) < 0.0004) current = target;
    render(current);
    if (current !== target) raf = requestAnimationFrame(tick);
  };

  addEventListener('scroll', measure, { passive: true });
  addEventListener('resize', measure);
  measure();
  render(current);
})();