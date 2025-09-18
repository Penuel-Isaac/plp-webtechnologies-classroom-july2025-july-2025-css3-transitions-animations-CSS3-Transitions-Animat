// script.js
// CSS + JS Animations Playground
// - Demonstrates CSS transitions & keyframes
// - JS functions with parameters and return values
// - JS triggers CSS animations by adding/removing classes
// - A few examples of local vs global scope

document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     GLOBAL STATE (global scope)
     ========================= */
  // Example global variable (demonstrating global scope)
  let globalAnimationCount = 0;

  /* -------------------------
     Utility: animateOnce
     - element: DOM element
     - animationClass: class name to add that runs a keyframe animation
     - durationMs (optional): number in ms to set CSS variable --anim-dur
     Returns a Promise that resolves with an integer id showing which animation run finished.
  */
  function animateOnce(element, animationClass, durationMs = 800) {
    if (!element) return Promise.reject(new Error('No element provided'));
    // local variable inside function (local scope)
    const localRunId = ++globalAnimationCount; // increments global, but localRunId is local
    // set CSS animation duration via CSS variable
    element.style.setProperty('--anim-dur', `${durationMs}ms`);
    element.classList.add(animationClass);

    // Return a promise that resolves when animation ends (clean removal)
    return new Promise((resolve) => {
      function onEnd() {
        element.classList.remove(animationClass);
        element.removeEventListener('animationend', onEnd);
        resolve(localRunId); // return the local run id
      }
      element.addEventListener('animationend', onEnd);
    });
  }

  /* =========================
     PART 1: Animate box (JS triggers CSS)
     ========================= */
  const animBox = document.getElementById('animBox');
  const animateBtn = document.getElementById('animateBtn');
  const durationInput = document.getElementById('durationInput');

  animateBtn.addEventListener('click', async () => {
    const ms = Number(durationInput.value) || 800;
    try {
      const runId = await animateOnce(animBox, 'animate-pulse', ms);
      console.log('Animation finished run id:', runId);
    } catch (err) {
      console.error(err);
    }
  });

  /* =========================
     PART 2: JS functions example (parameters, returns)
     ========================= */
  const runFnBtn = document.getElementById('runFnBtn');
  const fnOutput = document.getElementById('fnOutput');

  // simple reusable function with parameters + return
  function summarizeAnimation(name, runs) {
    // local variable inside function
    const localNote = `Local note for ${name}`;
    // return an object showing values (demonstrates return value)
    return {
      name,
      runs,
      message: `Will run ${name} ${runs} time(s).`,
      localNote
    };
  }

  runFnBtn.addEventListener('click', () => {
    const result = summarizeAnimation('pulse', globalAnimationCount + 1);
    console.log('summarizeAnimation result:', result);
    fnOutput.textContent = `Function returned: ${result.message}`;
  });

  /* =========================
     PART 3A: Flip card (toggle class)
     ========================= */
  const flipCard = document.getElementById('flipCard');
  const flipBtn = document.getElementById('flipBtn');

  function toggleFlip(cardEl) {
    if (!cardEl) return false;
    cardEl.classList.toggle('flipped');
    // return boolean state (true if flipped after toggle)
    return cardEl.classList.contains('flipped');
  }

  flipBtn.addEventListener('click', () => {
    const state = toggleFlip(flipCard);
    console.log('Flip state:', state);
  });

  // Also clicking the card toggles flip
  flipCard.addEventListener('click', () => toggleFlip(flipCard));

  /* =========================
     PART 3B: Loader control (start/stop CSS animation)
     ========================= */
  const spinner = document.getElementById('spinner');
  const startLoaderBtn = document.getElementById('startLoaderBtn');
  const stopLoaderBtn = document.getElementById('stopLoaderBtn');

  function startSpinner(spinnerEl) {
    if (!spinnerEl) return false;
    spinnerEl.classList.add('spinning');
    return true; // return value indicates success
  }
  function stopSpinner(spinnerEl) {
    if (!spinnerEl) return false;
    spinnerEl.classList.remove('spinning');
    return true;
  }

  startLoaderBtn.addEventListener('click', () => {
    const ok = startSpinner(spinner);
    console.log('Spinner started:', ok);
  });
  stopLoaderBtn.addEventListener('click', () => {
    const ok = stopSpinner(spinner);
    console.log('Spinner stopped:', ok);
  });

  /* =========================
     PART 3C: Modal open/close (JS toggles class -> CSS animates)
     ========================= */
  const modalOverlay = document.getElementById('modalOverlay');
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalActionBtn = document.getElementById('modalActionBtn');

  function openModal() {
    modalOverlay.classList.remove('hidden');
    // force reflow and then add show class so CSS transition runs
    requestAnimationFrame(() => modalOverlay.classList.add('show'));
  }
  function closeModal() {
    modalOverlay.classList.remove('show');
    // wait for CSS transition then hide fully
    setTimeout(() => modalOverlay.classList.add('hidden'), 300);
  }

  openModalBtn.addEventListener('click', openModal);
  closeModalBtn.addEventListener('click', closeModal);
  modalActionBtn.addEventListener('click', () => {
    // demo: animate modal content and close
    animateOnce(modalOverlay.querySelector('.modal'), 'animate-slide', 420).then(() => {
      console.log('Modal action animation complete, closing.');
      closeModal();
    });
  });

  // close modal when clicking overlay background
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  /* =========================
     Example: run an animation on page load to show the box
     ========================= */
  // quick demo: slide the box in on load
  animateOnce(animBox, 'animate-slide', 600).catch(()=>{});
});
