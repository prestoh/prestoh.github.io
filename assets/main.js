/* ==========================================================================
   1. Theme toggle
   Stores the choice in localStorage so it survives a reload, and respects
   the operating system setting on a first visit.
   ========================================================================== */

(function () {
  const root   = document.documentElement;
  const button = document.getElementById('theme-toggle');
  if (!button) return;

  const label = button.querySelector('.toggle-label');

  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved || (prefersDark ? 'dark' : 'light'));

  button.addEventListener('click', function () {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    const next = theme === 'dark' ? 'Light' : 'Dark';
    if (label) label.textContent = next;
    button.setAttribute('aria-label', 'Switch to ' + next.toLowerCase() + ' theme');
  }
})();


/* ==========================================================================
   2. Draggable trace chips
   Each chip can be dragged around its container and paints a fading trail
   onto a canvas behind it. Pointer events cover mouse, touch, and pen with
   one code path.
   ========================================================================== */

(function () {
  const surface = document.getElementById('trace');
  const canvas  = document.getElementById('trace-canvas');
  if (!surface || !canvas) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let dpr = 1;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    const r = surface.getBoundingClientRect();
    canvas.width  = r.width  * dpr;
    canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Slowly fade whatever has been drawn, so trails decay instead of piling up.
  if (!reduced) {
    setInterval(function () {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.045)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }, 90);
  }

  function traceColor() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--trace').trim();
  }

  document.querySelectorAll('.chip').forEach(function (chip) {
    let dx = 0, dy = 0;          // accumulated offset from original position
    let startX = 0, startY = 0;  // pointer position when the drag began
    let lastX = null, lastY = null;

    chip.addEventListener('pointerdown', function (e) {
      chip.setPointerCapture(e.pointerId);
      chip.classList.add('dragging');
      startX = e.clientX - dx;
      startY = e.clientY - dy;
      lastX = null;
    });

    chip.addEventListener('pointermove', function (e) {
      if (!chip.classList.contains('dragging')) return;

      dx = e.clientX - startX;
      dy = e.clientY - startY;
      chip.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';

      if (reduced) return;

      // Draw a segment from the previous point to the current one.
      const box = surface.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;

      if (lastX !== null) {
        ctx.strokeStyle = 'rgba(' + traceColor() + ', 0.5)';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      lastX = x;
      lastY = y;
    });

    function release(e) {
      chip.classList.remove('dragging');
      if (e.pointerId !== undefined && chip.hasPointerCapture(e.pointerId)) {
        chip.releasePointerCapture(e.pointerId);
      }
    }
    chip.addEventListener('pointerup', release);
    chip.addEventListener('pointercancel', release);

    // Keyboard access: arrow keys nudge a focused chip.
    chip.addEventListener('keydown', function (e) {
      const step = 12;
      const moves = {
        ArrowUp:    [0, -step],
        ArrowDown:  [0,  step],
        ArrowLeft:  [-step, 0],
        ArrowRight: [ step, 0]
      };
      if (!moves[e.key]) return;
      e.preventDefault();
      dx += moves[e.key][0];
      dy += moves[e.key][1];
      chip.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    });
  });
})();
