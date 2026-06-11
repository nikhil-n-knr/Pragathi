// JAGATHI - Modular Premium Preloader & Reveal Sequence
// Powered by GSAP

class JagathiPreloader {
  constructor() {
    this.badgePath = "M -150 -100 A 50 50 0 1 1 -100 -150 A 50 50 0 0 1 0 -150 A 50 50 0 0 1 100 -150 A 50 50 0 1 1 150 -100 A 50 50 0 0 1 150 0 A 50 50 0 0 1 150 100 A 50 50 0 1 1 100 150 A 50 50 0 0 1 0 150 A 50 50 0 0 1 -100 150 A 50 50 0 1 1 -150 100 A 50 50 0 0 1 -150 0 A 50 50 0 0 1 -150 -100 Z";

    this.init();
  }

  init() {
    this.injectDOM();
    this.startTimeline();
  }

  injectDOM() {
    // Lock body scrolling during preloader phase
    document.body.classList.add('preloader-active');

    // 1. Create Preloader Overlay
    const overlay = document.createElement('div');
    overlay.id = 'preloader-overlay';

    // 2. Create Heritage Counter Ticker with brand typography hierarchy
    const counterContainer = document.createElement('div');
    counterContainer.className = 'preloader-brand-container';

    const ampersand = document.createElement('span');
    ampersand.className = 'preloader-ampersand';
    ampersand.textContent = '&';
    counterContainer.appendChild(ampersand);

    const estLabel = document.createElement('span');
    estLabel.className = 'preloader-est-label';
    estLabel.textContent = ' EST. ';
    counterContainer.appendChild(estLabel);

    const yearDigits = document.createElement('span');
    yearDigits.className = 'year-digits';
    yearDigits.textContent = '1900';
    counterContainer.appendChild(yearDigits);

    overlay.appendChild(counterContainer);

    // 3. Create Dashed Loading Bar (12 blocks)
    const dashedContainer = document.createElement('div');
    dashedContainer.className = 'preloader-dashed-container';
    for (let i = 0; i < 12; i++) {
      const segment = document.createElement('div');
      segment.className = 'preloader-dash-segment';
      dashedContainer.appendChild(segment);
    }
    overlay.appendChild(dashedContainer);

    // 4. Create Typography Box for 'JAGATHI'
    const textBox = document.createElement('div');
    textBox.className = 'preloader-text-box';
    const text = document.createElement('div');
    text.className = 'preloader-text';
    text.textContent = 'JAGATHI';
    textBox.appendChild(text);
    overlay.appendChild(textBox);

    // 4b. Create JAGATHI Logo Badge (renders logo/image.png)
    const logoBadge = document.createElement('div');
    logoBadge.className = 'preloader-logo-badge';
    
    const logoImg = document.createElement('img');
    logoImg.className = 'preloader-logo-image';
    logoImg.src = 'logo/image.png';
    logoBadge.appendChild(logoImg);
    overlay.appendChild(logoBadge);

    // 5. Create SVG outlines for Phase 4 Topographic Waves
    const svgContainer = document.createElement('div');
    svgContainer.className = 'preloader-svg-container';
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '-200 -200 400 400');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.position = 'absolute';
    svg.style.overflow = 'visible';

    // SVG Defs with reused contour shape group
    const defsEl = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const shapeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    shapeGroup.id = 'jagathi-contour-shape';
    
    const contourPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    contourPath.setAttribute('d', this.badgePath);
    shapeGroup.appendChild(contourPath);
    defsEl.appendChild(shapeGroup);
    svg.appendChild(defsEl);

    // Generate 18 concentric outline layers using <path> (dense, ultra-smooth fluid finish)
    for (let i = 0; i < 18; i++) {
      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('d', this.badgePath);
      pathEl.setAttribute('class', 'preloader-scallop-outline');
      svg.appendChild(pathEl);
    }
    svgContainer.appendChild(svg);
    overlay.appendChild(svgContainer);

    // Append preloader overlay to body as first child
    document.body.insertBefore(overlay, document.body.firstChild);

  }

  startTimeline() {
    const tl = gsap.timeline({
      onComplete: () => {
        // Restore body scrolling
        document.body.classList.remove('preloader-active');

        // Remove overlay DOM entirely after fade-out completes
        const overlay = document.getElementById('preloader-overlay');
        if (overlay) overlay.remove();

        // Dispatch modular complete event for app.js initiation hooks
        window.dispatchEvent(new Event('preloaderComplete'));
      }
    });

    // Phase 1: Block loader fills and Counter ticker increments from 1900 to 1989
    const counterObj = { val: 1900 };
    const yearDigits = document.querySelector('.year-digits');
    const segments = document.querySelectorAll('.preloader-dash-segment');

    tl.to(counterObj, {
      val: 1989,
      duration: 1.8, // dynamic count-up mechanism over 1.8s
      ease: "power2.inOut",
      snap: "val",
      onUpdate: () => {
        if (yearDigits) yearDigits.textContent = counterObj.val;
      }
    }, 0);

    // Incrementally fill dash segments based on counter timeline progress
    segments.forEach((seg, index) => {
      const triggerTime = (index / segments.length) * 1.65;
      tl.to(seg, {
        backgroundColor: '#FFE600',
        boxShadow: '0 0 10px rgba(255, 230, 0, 0.5)',
        duration: 0.05
      }, triggerTime);
    });

    // Phase 2: Instant swap to boxed text 'JAGATHI' with typography flash
    tl.set('.preloader-dashed-container', { display: 'none' }, 1.8);
    tl.set('.preloader-text-box', { display: 'block' }, 1.8);

    // Reveal '& EST.' text exactly when counter reaches 1989 (at 1.8s) — gray, smooth fade-in
    tl.to(['.preloader-ampersand', '.preloader-est-label'], {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }, 1.8);

    // Initial typography zoom in and rapid flash sequence
    tl.fromTo('.preloader-text-box', 
      { scale: 0.85, opacity: 0 },
      { scale: 1.05, opacity: 1, duration: 0.4, ease: "back.out(1.5)" },
      1.8
    );

    // Flash opacity in rapid succession mimicking screen/glitch impacts
    tl.to('.preloader-text-box', { opacity: 0.2, duration: 0.06, repeat: 4, yoyo: true }, 2.0);
    tl.to('.preloader-text-box', { opacity: 1, duration: 0.08 }, 2.3);

    // Phase 3: Collapse text box into a tiny central outline icon
    tl.to('.preloader-text-box', {
      scale: 0.0,
      opacity: 0.0,
      duration: 0.45,
      ease: "power3.in"
    }, 2.6);

    // Innermost logo scallop outline and full logo badge fade/scale in at the origin center
    const outlines = document.querySelectorAll('.preloader-scallop-outline');
    
    // Hide all outlines at t=0 — they will be revealed solid on their stagger time (not faded in)
    tl.set(outlines, { opacity: 0 }, 0);

    // Step 2: Symmetrically from the center, the yellow contour lines begin their slow, smooth outward flow ripple.
    // The outermost border starts flowing first and leads the transition (from: "end")
    // Gap sizes grow proportionally using a cubic power ramp (power of 2.5)
    // Stroke width increases DRAMATICALLY using attr{} — the correct GSAP method for SVG attributes.
    // Innermost line = 1.5px → outermost = 15px (1000% increase)
    // Formula: 1.5 + 13.5 * Math.pow(t, 1.2) where t = normalized line index 0→1
    // Lines appear SOLID (opacity: 1) from the very first frame — no fade-in.
    // immediateRender: false keeps them invisible until their scheduled stagger time.
    tl.fromTo(outlines,
      {
        scale: 1.0,
        opacity: 1,          // solid from first frame — no fade
        attr: { 'stroke-width': 1.5 }
      },
      {
        scale: (i) => 1.0 + 59.0 * Math.pow(i / (outlines.length - 1), 2.5),
        attr: {
          'stroke-width': (i) => {
            const t = i / (outlines.length - 1); // 0 (innermost) → 1 (outermost)
            return parseFloat((1.5 + 13.5 * Math.pow(t, 1.2)).toFixed(2));
          }
        },
        transformOrigin: "50% 50%",
        duration: 8.0,
        ease: "sine.inOut",
        immediateRender: false,
        stagger: {
          each: 0.35,
          from: "end"
        }
      },
      3.05
    );

    // Step 3 & 4: Logo appears ~0.8s after waves start (at 3.05s + 0.8s = 3.85s)
    // Smoothly fade in the central logo icon (opacity 0 to 1, scale 0.9 to 1.0) over a gentle 1.5s
    tl.set('.preloader-logo-badge', { display: 'block' }, 3.85);
    tl.fromTo('.preloader-logo-badge',
      { scale: 0.9, opacity: 0 },
      { scale: 1.0, opacity: 1, duration: 1.5, ease: "power2.out", immediateRender: false },
      3.85
    );

    // Step 5: Start portal reveal mask expansion, logo fade-out, and brand container fade-out at 9.0s
    // 1. Logo badge scale only shifts by max 10% (1.0 -> 1.1) and fades out over 5.0s
    tl.to('.preloader-logo-badge', {
      scale: 1.1,
      opacity: 0,
      duration: 5.0,
      ease: "power1.inOut"
    }, 9.0);

    // 2. Smoothly fade out the bottom-left branding block
    tl.to('.preloader-brand-container', {
      opacity: 0,
      duration: 2.0,
      ease: "power2.out"
    }, 9.0);

    // 3. Fade out the entire preloader overlay (cinematic dissolve)
    tl.to('#preloader-overlay', {
      opacity: 0,
      duration: 2.5,
      ease: "power2.inOut"
    }, 9.0);

  }
}

// Instantiate preloader sequence on DOM read
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new JagathiPreloader());
} else {
  new JagathiPreloader();
}
