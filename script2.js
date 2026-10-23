/* =========================================================
   Ouverture du rideau — à charger APRÈS script.js
   ========================================================= */
(function () {
    'use strict';

    // Mettre true pour ne jouer l'animation qu'une fois par session
    var PLAY_ONCE_PER_SESSION = false;

    var OPEN_DELAY = 1600;      // attente avant l'ouverture automatique (ms)
    var OPEN_DURATION = 2800;   // doit correspondre à la transition CSS (ms)

    var root = document.documentElement;
    var curtain = document.getElementById('lodge-curtain');
    if (!curtain) return;

    var reduced = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var seen = false;
    try {
        seen = PLAY_ONCE_PER_SESSION && sessionStorage.getItem('lodgeSeen') === '1';
    } catch (e) { /* stockage indisponible */ }

    function finish() {
        if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain);
        root.classList.remove('lodge-lock');
        root.classList.remove('lodge-hide-hero');
    }

    if (reduced || seen) {
        finish();
        return;
    }

    // Bloque le scroll et cache le texte du hero pendant que le rideau est fermé
    root.classList.add('lodge-lock');
    root.classList.add('lodge-hide-hero');

    var opened = false;
    var timer = null;

    function openCurtain() {
        if (opened) return;
        opened = true;
        clearTimeout(timer);
        curtain.classList.add('open');

        // Le texte du hero apparaît pendant que le rideau se retire
        setTimeout(function () {
            root.classList.remove('lodge-hide-hero');
        }, 900);

        setTimeout(finish, OPEN_DURATION + 400);

        try { sessionStorage.setItem('lodgeSeen', '1'); } catch (e) { /* ignore */ }
    }

    timer = setTimeout(openCurtain, OPEN_DELAY);
    curtain.addEventListener('click', openCurtain);
    document.addEventListener('keydown', function (e) {
        if (opened) return;
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') openCurtain();
    });
})();
