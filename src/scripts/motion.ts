/**
 * All site motion lives here. Rules:
 *  - Only transform and opacity are animated, so nothing shifts layout.
 *  - Nothing runs when the visitor prefers reduced motion; the page is fully usable without it.
 *  - Above-the-fold items are hidden by CSS only while <html class="motion"> is set,
 *    and a fallback in Base.astro removes that class if this script never runs.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const EASE = 'expo.out';

const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T & HTMLElement>(sel));

/* ---------------------------------------------------------------- hero entrance */

function heroIntro() {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return;

  const tl = gsap.timeline({ defaults: { ease: EASE } });

  tl.fromTo(
    $$('[data-hero-title] .line__inner', hero),
    // y: 0 resets the CSS pre-hide offset so only yPercent moves the line.
    { y: 0, yPercent: 110 },
    { y: 0, yPercent: 0, duration: 1.1, stagger: 0.09 },
  )
    .fromTo(
      $$('[data-hero-item]', hero),
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 },
      0.35,
    )
    .fromTo(
      $$('[data-hero-photo]', hero),
      { autoAlpha: 0, y: 60 },
      { autoAlpha: 1, y: 0, duration: 1.4 },
      0.2,
    )
    .fromTo(
      $$('.shape:not(.shape--line)', hero),
      { autoAlpha: 0, scale: 0.6 },
      { autoAlpha: 0.85, scale: 1, duration: 1.2, stagger: 0.06 },
      0.3,
    )
    .fromTo(
      $$('.shape--line', hero),
      { autoAlpha: 0, scaleX: 0 },
      { autoAlpha: 0.85, scaleX: 1, duration: 1.4, ease: 'power3.inOut' },
      0.4,
    );

  // Hand control back to the stylesheet once the entrance is done.
  tl.eventCallback('onComplete', () => root.classList.add('motion-ready'));
}

/* ---------------------------------------------------------------- living shapes */

function ambientShapes() {
  // Slow drift on every outline shape except lines.
  $$('.shape:not(.shape--line)').forEach((el, i) => {
    const square = el.classList.contains('shape--square');
    gsap.to(el, {
      x: gsap.utils.random(-10, 10),
      y: gsap.utils.random(-14, 14),
      rotation: square ? gsap.utils.random(-8, 8) : 0,
      duration: gsap.utils.random(6, 10),
      delay: i * 0.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  });

  // Mouse parallax: each shape shifts against the cursor by its depth.
  if (!finePointer) return;
  const wraps = $$('.shape-wrap').map((el) => ({
    depth: Number(el.dataset.depth ?? 0.5),
    x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
  }));
  window.addEventListener('pointermove', (e) => {
    const dx = e.clientX / window.innerWidth - 0.5;
    const dy = e.clientY / window.innerHeight - 0.5;
    wraps.forEach((w) => {
      w.x(-dx * 40 * w.depth);
      w.y(-dy * 30 * w.depth);
    });
  });
}

/* ---------------------------------------------------------------- scroll reveals */

// Single elements that fade up as they enter.
const REVEAL = [
  '.section-head > *',
  '.center-head',
  '.featured',
  '.shot',
  '.prose',
  '.cta__title',
  '.cta__sub',
  '.cta__email',
].join(',');

// Groups whose items come in one after another.
const BATCH = [
  '.track',
  '.stat',
  '.facts > div',
  '.edu__card',
  '.exp',
  '.toolkit > div',
  '.area',
  '.paper',
  '.card',
  '.ciren__grid > div',
  '.ciren__stat',
  '.partners__label',
  '.partners__list li',
  '.role',
  '.rows > li',
  '.story__row',
].join(',');

function scrollReveals() {
  const inHero = (el: Element) => el.closest('.hero');

  $$(REVEAL)
    .filter((el) => !inHero(el))
    .forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 32, transition: 'none' },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: EASE,
          clearProps: 'transform,transition',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
    });

  const items = $$(BATCH).filter((el) => !inHero(el));
  // CSS hover transitions are paused during the reveal, then the inline styles are cleared
  // so hover effects (lifts, fills) work normally afterwards.
  gsap.set(items, { autoAlpha: 0, y: 36, transition: 'none' });
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: EASE,
        stagger: 0.08,
        overwrite: true,
        clearProps: 'transform,transition',
      }),
  });

  // Section rule lines draw across from the left.
  $$('.rule-list').forEach((el) => {
    gsap.fromTo(
      el,
      { '--rule': 0 },
      {
        '--rule': 1,
        duration: 1.3,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      },
    );
  });

  // Toolkit tags pop in group by group.
  $$('.chips').forEach((list) => {
    gsap.fromTo(
      list.children,
      { autoAlpha: 0, scale: 0.85 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(2)',
        stagger: 0.04,
        scrollTrigger: { trigger: list, start: 'top 90%', once: true },
      },
    );
  });

  // Shapes outside the hero (CTA, cards) fade in when reached.
  $$('.shapes').forEach((layer) => {
    if (inHero(layer)) return;
    gsap.fromTo(
      $$('.shape', layer),
      { autoAlpha: 0, scale: 0.6 },
      {
        autoAlpha: 0.85,
        scale: 1,
        duration: 1.2,
        ease: EASE,
        stagger: 0.1,
        scrollTrigger: { trigger: layer, start: 'top 85%', once: true },
      },
    );
  });
}

/* ---------------------------------------------------------------- count-ups */

function countUps() {
  $$('.stat__value, .ciren__value, .role__stats strong').forEach((el) => {
    const final = el.textContent?.trim() ?? '';
    const match = final.match(/^([^\d]*)([\d.]+)(.*)$/);
    if (!match) return;
    const [, prefix, num, suffix] = match;
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const counter = { v: 0 };

    el.setAttribute('aria-label', final);
    el.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;

    gsap.to(counter, {
      v: Number(num),
      duration: Number(num) > 10 ? 1.8 : 1.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => {
        el.textContent = `${prefix}${counter.v.toFixed(decimals)}${suffix}`;
      },
      onComplete: () => {
        el.textContent = final;
      },
    });
  });
}

/* ---------------------------------------------------------------- filters */

// Filter rows (Innovations "More builds", Blog "Latest posts").
// Markup: [data-filter-group] wraps buttons [data-filter] and items [data-categories].
function filters(animate: boolean) {
  $$('[data-filter-group]').forEach((group) => {
    const buttons = $$<HTMLButtonElement>('[data-filter]', group);
    const items = $$('[data-categories]', group);

    buttons.forEach((btn) =>
      btn.addEventListener('click', () => {
        const value = btn.dataset.filter!;
        const state = animate ? Flip.getState(items) : null;
        const grid = items[0]?.parentElement;
        const startHeight = grid?.offsetHeight ?? 0;

        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        items.forEach((item) => {
          const cats = item.dataset.categories!.split('|');
          item.hidden = value !== 'All' && !cats.includes(value);
        });

        if (!state || !grid) return;
        // Grow/shrink the grid smoothly so the sections below don't jump.
        gsap.fromTo(
          grid,
          { height: startHeight },
          { height: grid.offsetHeight, duration: 0.6, ease: 'power3.inOut', clearProps: 'height' },
        );
        Flip.from(state, {
          duration: 0.6,
          ease: 'power3.inOut',
          absolute: true,
          nested: true,
          onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.5, delay: 0.15 }),
          onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.3 }),
        });
      }),
    );
  });
}

/* ---------------------------------------------------------------- magnetic buttons */

function magneticButtons() {
  if (!finePointer) return;
  $$('.btn').forEach((btn) => {
    const x = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
    const y = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.22);
      y((e.clientY - r.top - r.height / 2) * 0.3);
    });
    btn.addEventListener('pointerleave', () => {
      x(0);
      y(0);
    });
  });
}

/* ---------------------------------------------------------------- custom cursor */

function customCursor() {
  if (!finePointer) return;
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);
  root.classList.add('has-cursor');

  const x = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3.out' });
  const y = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3.out' });
  const interactive = 'a, button, [role="button"], .filter, label, summary';

  window.addEventListener('pointermove', (e) => {
    cursor.classList.add('is-visible');
    x(e.clientX);
    y(e.clientY);
    cursor.classList.toggle('is-hover', !!(e.target as Element).closest?.(interactive));
  });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));

  // The résumé pop-up sits in the browser's top layer, above the cursor, so the circle is hidden
  // while it's open (the normal mouse pointer is always visible).
  const dialog = document.getElementById('resume-modal');
  if (dialog) {
    new MutationObserver(() => {
      cursor.classList.toggle('is-off', dialog.hasAttribute('open'));
    }).observe(dialog, { attributes: true, attributeFilter: ['open'] });
  }
}

/* ---------------------------------------------------------------- photo hover */

// Hovering the headshot tilts it toward the cursor in 3D, while an outline circle grows in
// behind the head and follows at a different rate for depth.
function photoHover() {
  if (!finePointer) return;
  $$('[data-hero-photo]').forEach((wrap) => {
    const img = wrap.querySelector<HTMLElement>('[data-photo-img]');
    const halo = wrap.querySelector<HTMLElement>('[data-photo-halo]');
    if (!img || !halo) return;

    gsap.set(halo, { scale: 0.7 });
    const tilt = {
      ry: gsap.quickTo(img, 'rotationY', { duration: 0.8, ease: 'power3.out' }),
      rx: gsap.quickTo(img, 'rotationX', { duration: 0.8, ease: 'power3.out' }),
      hx: gsap.quickTo(halo, 'x', { duration: 1, ease: 'power3.out' }),
      hy: gsap.quickTo(halo, 'y', { duration: 1, ease: 'power3.out' }),
    };

    wrap.addEventListener('pointerenter', () => {
      gsap.to(img, { scale: 1.03, y: 6, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
      gsap.to(halo, { opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out', overwrite: 'auto' });
    });
    wrap.addEventListener('pointermove', (e) => {
      const r = wrap.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      tilt.ry(dx * 10);
      tilt.rx(-dy * 4);
      tilt.hx(dx * 50);
      tilt.hy(dy * 36);
    });
    wrap.addEventListener('pointerleave', () => {
      tilt.ry(0);
      tilt.rx(0);
      tilt.hx(0);
      tilt.hy(0);
      gsap.to(img, { scale: 1, y: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
      gsap.to(halo, { opacity: 0, scale: 0.7, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
    });
  });
}

/* ---------------------------------------------------------------- reading progress */

function readingProgress() {
  const bar = document.querySelector<HTMLElement>('[data-reading-progress]');
  const article = document.querySelector('[data-article]');
  if (!bar || !article) return;
  gsap.fromTo(
    bar,
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: article, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
    },
  );
}

/* ---------------------------------------------------------------- boot */

filters(!reduceMotion);

if (!reduceMotion) {
  heroIntro();
  ambientShapes();
  scrollReveals();
  countUps();
  magneticButtons();
  customCursor();
  photoHover();
  readingProgress();
  // Fonts and images can shift trigger positions after load.
  window.addEventListener('load', () => ScrollTrigger.refresh());
} else {
  root.classList.add('motion-ready');
}

(window as Window & { __motion?: boolean }).__motion = true;
