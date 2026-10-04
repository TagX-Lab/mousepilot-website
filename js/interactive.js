/**
 * MousePilot by TAGX Labs™ — Interactive Experience & Kinematics Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 0. 3D HERO FLOATING GRAVITY PARTICLES (Interactive Cursor Anti-Gravity)
  // =========================================================================
  const heroCanvas = document.getElementById('heroGravityCanvas');
  const heroSection = document.getElementById('hero');

  if (heroCanvas && heroSection) {
    const ctx = heroCanvas.getContext('2d');
    let animationId;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse state with smooth interpolator
    const mouse = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      active: false,
      radius: 240
    };

    function resizeHeroCanvas() {
      const rect = heroSection.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      heroCanvas.width = width * dpr;
      heroCanvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    resizeHeroCanvas();
    window.addEventListener('resize', resizeHeroCanvas);

    // Brand Master Particle Palette
    const colors = [
      { r: 140, g: 199, b: 196 }, // Cyber Aqua (#8CC7C4)
      { r: 0,   g: 255, b: 234 }, // Neon Cyan (#00FFEA)
      { r: 255, g: 246, b: 246 }, // Specular Cream (#FFF6F6)
      { r: 44,  g: 104, b: 123 }, // Petrol (#2C687B)
      { r: 219, g: 26,  b: 26 }   // Crimson (#DB1A1A)
    ];

    const PARTICLE_COUNT = 90;
    const FOV = 450;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * (window.innerWidth * 1.5),
        y: (Math.random() - 0.5) * (window.innerHeight * 1.5),
        z: Math.random() * 800 + 50,
        baseRadius: Math.random() * 2.8 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        // Gravity floating velocity & harmonic oscillation
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.3 - 0.08, // gentle upward buoyancy
        vz: (Math.random() - 0.5) * 0.2,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: Math.random() * 0.02 + 0.006,
        floatAmplitude: Math.random() * 0.5 + 0.3,
        // Repulsion spring physics
        repelX: 0,
        repelY: 0,
        projX: 0,
        projY: 0,
        projScale: 0,
        alpha: Math.random() * 0.55 + 0.4
      });
    }

    // Mouse Tracking over Hero
    window.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      if (
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right
      ) {
        mouse.targetX = e.clientX - rect.left;
        mouse.targetY = e.clientY - rect.top;
        mouse.active = true;
      } else {
        mouse.active = false;
        mouse.targetX = -9999;
        mouse.targetY = -9999;
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
      mouse.targetX = -9999;
      mouse.targetY = -9999;
    });

    // Main 3D Gravity Floating Render Loop
    function renderHeroGravity() {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.25;
        mouse.y += (mouse.targetY - mouse.y) * 0.25;
      } else {
        mouse.x += (-9999 - mouse.x) * 0.1;
        mouse.y += (-9999 - mouse.y) * 0.1;
      }

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Update 3D Positions & Repulsion
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic gravity float
        p.angle += p.angularSpeed;
        p.x += p.vx + Math.cos(p.angle) * p.floatAmplitude;
        p.y += p.vy + Math.sin(p.angle) * (p.floatAmplitude * 0.8);
        p.z += p.vz;

        // Wrap around 3D bounding box
        const boundX = width * 0.85;
        const boundY = height * 0.85;
        if (p.x < -boundX) p.x = boundX;
        if (p.x > boundX) p.x = -boundX;
        if (p.y < -boundY) p.y = boundY;
        if (p.y > boundY) p.y = -boundY;
        if (p.z < 40) p.z = 850;
        if (p.z > 850) p.z = 40;

        // 3D Perspective Projection
        const scale = FOV / (FOV + p.z);
        p.projScale = scale;
        p.projX = centerX + (p.x + p.repelX) * scale;
        p.projY = centerY + (p.y + p.repelY) * scale;

        // Anti-Gravity Cursor Repulsion (Move away in OPPOSITE direction)
        if (mouse.active) {
          const dx = p.projX - mouse.x;
          const dy = p.projY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            // Strong inverse force pushing dots away in opposite direction
            const force = Math.pow(1 - dist / mouse.radius, 1.5) * 20 * (1 / (scale || 1));
            const nx = dx / dist;
            const ny = dy / dist;

            // Push in opposite direction
            p.repelX += nx * force;
            p.repelY += ny * force;
          }
        }

        // Smooth spring damping return
        p.repelX *= 0.90;
        p.repelY *= 0.90;
      }

      // 2. Draw Constellation Connection Lines between close particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dz = Math.abs(p1.z - p2.z);
          if (dz < 150) {
            const dx = p1.projX - p2.projX;
            const dy = p1.projY - p2.projY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
              const lineAlpha = (1 - dist / 100) * (1 - dz / 150) * 0.16 * p1.projScale;
              ctx.strokeStyle = `rgba(140, 199, 196, ${lineAlpha})`;
              ctx.lineWidth = Math.max(0.5, 1.2 * p1.projScale);
              ctx.beginPath();
              ctx.moveTo(p1.projX, p1.projY);
              ctx.lineTo(p2.projX, p2.projY);
              ctx.stroke();
            }
          }
        }
      }

      // 3. Draw 3D Floating Dots with Glowing Aura
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const radius = Math.max(0.8, p.baseRadius * p.projScale);
        const alpha = Math.min(1, Math.max(0.18, p.alpha * p.projScale * 1.3));
        const col = p.color;

        // Glowing outer aura
        if (radius > 1.6) {
          const glowGrad = ctx.createRadialGradient(p.projX, p.projY, 0, p.projX, p.projY, radius * 3.5);
          glowGrad.addColorStop(0, `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha * 0.45})`);
          glowGrad.addColorStop(1, `rgba(${col.r}, ${col.g}, ${col.b}, 0)`);
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Solid particle core
        ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(renderHeroGravity);
    }

    renderHeroGravity();
  }

  // =========================================================================
  // 1. LIVE KINEMATICS RADAR SIMULATOR PLAYGROUND
  // =========================================================================
  const canvas = document.getElementById('kinematicsCanvas');
  const telemetryX = document.getElementById('telemetryX');
  const telemetryY = document.getElementById('telemetryY');
  const telemetryRadius = document.getElementById('telemetryRadius');
  const modeTitle = document.getElementById('simCurrentModeTitle');
  const modeDesc = document.getElementById('simCurrentModeDesc');
  const modeButtons = document.querySelectorAll('.mode-btn');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let currentMode = 'orbit';
    let t = 0;
    const trail = [];
    const maxTrail = 40;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform matrix to prevent exponential scaling
      ctx.scale(dpr, dpr);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const modeDetails = {
      orbit: {
        title: 'Gentle Orbit Mode',
        desc: 'Smooth 40 FPS circular trajectory with sinusoidal coordinate translation. Ideal for maintaining active status with zero visual distraction.',
        radius: '60px'
      },
      stealth: {
        title: 'Stealth 1-Pixel Mode',
        desc: 'Microscopic 1-pixel micro-jitter imperceptible to human eyes, screen recordings, or meeting screen shares.',
        radius: '1px'
      },
      figure8: {
        title: 'Figure-8 (Lissajous Curve)',
        desc: 'Harmonic infinity curve trajectory simulating natural ergonomic human wrist movements with sinusoidal physics.',
        radius: '75px'
      },
      wander: {
        title: 'Random Wander Mode',
        desc: 'Brownian pseudo-random drift with mathematical anchor bounding. Emulates completely natural non-repetitive activity.',
        radius: '85px'
      }
    };

    // Mode Buttons Handler
    modeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        modeButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;

        if (modeDetails[currentMode]) {
          modeTitle.textContent = modeDetails[currentMode].title;
          modeDesc.textContent = modeDetails[currentMode].desc;
          telemetryRadius.textContent = modeDetails[currentMode].radius;
        }
        trail.length = 0; // Clear trail on mode change
      });
    });

    let wanderX = 0;
    let wanderY = 0;
    let wanderTargetX = 0;
    let wanderTargetY = 0;

    function renderSimulator() {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Draw Grid Lines
      ctx.strokeStyle = 'rgba(140, 199, 196, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 30) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 30) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw Concentric Radar Rings
      ctx.strokeStyle = 'rgba(140, 199, 196, 0.18)';
      ctx.lineWidth = 1;
      [30, 60, 90, 120].forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Calculate Coordinates based on pattern
      let deltaX = 0;
      let deltaY = 0;
      t += 0.035;

      if (currentMode === 'orbit') {
        const radius = 60;
        deltaX = Math.cos(t) * radius;
        deltaY = Math.sin(t) * radius;
      } else if (currentMode === 'stealth') {
        deltaX = (Math.sin(t * 8) > 0 ? 1 : -1) * 2;
        deltaY = (Math.cos(t * 8) > 0 ? 1 : -1) * 2;
      } else if (currentMode === 'figure8') {
        const a = 75;
        deltaX = a * Math.sin(t);
        deltaY = (a / 2) * Math.sin(2 * t);
      } else if (currentMode === 'wander') {
        if (Math.floor(t * 10) % 25 === 0) {
          wanderTargetX = (Math.random() - 0.5) * 130;
          wanderTargetY = (Math.random() - 0.5) * 110;
        }
        wanderX += (wanderTargetX - wanderX) * 0.05;
        wanderY += (wanderTargetY - wanderY) * 0.05;
        deltaX = wanderX;
        deltaY = wanderY;
      }

      const curX = centerX + deltaX;
      const curY = centerY + deltaY;

      // Update Telemetry UI
      if (telemetryX) telemetryX.textContent = (deltaX >= 0 ? '+' : '') + deltaX.toFixed(1);
      if (telemetryY) telemetryY.textContent = (deltaY >= 0 ? '+' : '') + deltaY.toFixed(1);

      // Add to Trail
      trail.push({ x: curX, y: curY });
      if (trail.length > maxTrail) trail.shift();

      // Render Trail
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        const alpha = (i / trail.length) * 0.75;
        ctx.strokeStyle = `rgba(140, 199, 196, ${alpha})`;
        ctx.lineWidth = (i / trail.length) * 3;
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // Render Virtual Autopilot Cursor Arrow
      ctx.save();
      ctx.translate(curX, curY);

      // Glowing cursor shadow
      ctx.shadowColor = '#00FFEA';
      ctx.shadowBlur = 15;

      ctx.fillStyle = '#FFF6F6';
      ctx.strokeStyle = '#8CC7C4';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(12, 14);
      ctx.lineTo(5, 14);
      ctx.lineTo(0, 19);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(renderSimulator);
    }

    renderSimulator();
  }

  // =========================================================================
  // 2. MOBILE NAVIGATION DRAWER
  // =========================================================================
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileNavClose = document.getElementById('mobileNavClose');

  if (mobileNavToggle && mobileNavBackdrop) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavBackdrop.classList.add('open');
    });

    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', () => {
        mobileNavBackdrop.classList.remove('open');
      });
    }

    mobileNavBackdrop.addEventListener('click', (e) => {
      if (e.target === mobileNavBackdrop) {
        mobileNavBackdrop.classList.remove('open');
      }
    });
  }

  // =========================================================================
  // 3. SHA-256 CHECKSUM COPIER & TOAST NOTIFICATION
  // =========================================================================
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  window.copyHash = function (hashText, btnElement) {
    const originalContent = btnElement ? btnElement.innerHTML : '';
    
    function onSuccess() {
      showToast('✓ SHA-256 checksum copied to clipboard!');
      if (btnElement) {
        btnElement.innerHTML = '✓ Copied!';
        setTimeout(() => {
          btnElement.innerHTML = originalContent;
        }, 2000);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hashText).then(onSuccess).catch(() => {
        fallbackCopy(hashText);
        onSuccess();
      });
    } else {
      fallbackCopy(hashText);
      onSuccess();
    }
  };

  function fallbackCopy(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
  }

  function showToast(msg) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // =========================================================================
  // 4. FAQ ACCORDIONS (Smooth Auto-Height)
  // =========================================================================
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const content = trigger.nextElementSibling;

      // Close all other accordions
      faqTriggers.forEach((other) => {
        if (other !== trigger) {
          other.setAttribute('aria-expanded', 'false');
          if (other.nextElementSibling) other.nextElementSibling.classList.remove('open');
        }
      });

      trigger.setAttribute('aria-expanded', !isExpanded);
      if (content) {
        content.classList.toggle('open', !isExpanded);
      }
    });
  });

  // =========================================================================
  // 5. LEGAL MODALS (Privacy, Terms, MIT License & Escape Key)
  // =========================================================================
  window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  };

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  };

  window.closeAllModals = function () {
    document.querySelectorAll('.modal-backdrop').forEach((m) => m.classList.remove('active'));
    if (mobileNavBackdrop) mobileNavBackdrop.classList.remove('open');
  };

  document.querySelectorAll('.modal-backdrop').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeAllModals();
    }
  });
});
