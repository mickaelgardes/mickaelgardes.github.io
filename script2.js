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

/* =========================================================
   Clignotement chaotique du prénom (par salves aléatoires)
   ========================================================= */
(function () {
    'use strict';

    var title = document.querySelector('.hero-content h1');
    if (!title) return;

    if (window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Réglages : plus les valeurs sont petites, plus ça clignote souvent
    var PAUSE_MIN = 300;        // pause minimale entre deux salves (ms)
    var PAUSE_MAX = 2200;       // pause maximale entre deux salves (ms)
    var FLASHES_MIN = 3;        // nombre minimal de scintillements par salve
    var FLASHES_MAX = 9;        // nombre maximal de scintillements par salve
    var BLACKOUT_CHANCE = 0.12; // probabilité d'une longue extinction

    var GLOW_ON = '0 0 18px rgba(200, 0, 0, 0.7), 0 0 50px rgba(160, 0, 0, 0.45)';
    var GLOW_OFF = '0 0 4px rgba(200, 0, 0, 0.3)';

    function rand(min, max) { return min + Math.random() * (max - min); }

    function setLevel(level) {
        title.style.opacity = level;
        title.style.textShadow = level > 0.8 ? GLOW_ON : GLOW_OFF;
    }

    function burst() {
        var flashes = Math.floor(rand(FLASHES_MIN, FLASHES_MAX + 1));
        var i = 0;

        (function step() {
            if (i >= flashes) {
                setLevel(1);
                setTimeout(burst, rand(PAUSE_MIN, PAUSE_MAX));
                return;
            }
            var blackout = Math.random() < BLACKOUT_CHANCE;
            setLevel(blackout ? 0.05 : (i % 2 === 0 ? rand(0.1, 0.6) : rand(0.7, 1)));
            i++;
            setTimeout(step, blackout ? rand(150, 380) : rand(25, 110));
        })();
    }

    setTimeout(burst, rand(PAUSE_MIN, PAUSE_MAX));
})();
