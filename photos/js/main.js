/*
=============================================================
  MAIN.JS — Основной JavaScript / Main JavaScript
  Весь интерактив сайта в одном файле.
  Каждый блок отвечает за отдельную функцию.
  
  All site interactivity in one file.
  Each block handles a separate function.
=============================================================
*/

/* ════════════════════════════════════════════════════════════
   ОПРЕДЕЛЯЕМ ТИП УСТРОЙСТВА / DETECT DEVICE TYPE
   Проверяем, есть ли у устройства мышь (hover).
   Если нет — отключаем эффекты мыши для производительности.
   
   Check if device has a mouse (hover).
   If not — disable mouse effects for performance.
════════════════════════════════════════════════════════════ */
const isDesktop = window.matchMedia('(hover: hover)').matches;


/* ════════════════════════════════════════════════════════════
   КАСТОМНЫЙ КУРСОР / CUSTOM CURSOR
   Три элемента:
   — cur-dot: точка, следует точно за мышью
   — cur-ring: кольцо, следует с небольшой задержкой (CSS transition)
   — cur-glow: большое свечение, следует медленно (CSS transition)
   
   Three elements:
   — cur-dot: dot, follows mouse precisely
   — cur-ring: ring, follows with slight delay (CSS transition)
   — cur-glow: large glow, follows slowly (CSS transition)
════════════════════════════════════════════════════════════ */
if (isDesktop) {
  const curDot  = document.getElementById('cur-dot');
  const curRing = document.getElementById('cur-ring');
  const curGlow = document.getElementById('cur-glow');

  /* Обновляем позицию при каждом движении мыши / Update position on every mouse move */
  document.addEventListener('mousemove', e => {
    curDot.style.left  = e.clientX + 'px';
    curDot.style.top   = e.clientY + 'px';
    curRing.style.left = e.clientX + 'px';
    curRing.style.top  = e.clientY + 'px';
    curGlow.style.left = e.clientX + 'px';
    curGlow.style.top  = e.clientY + 'px';
  }, { passive: true });

  /* Расширяем курсор при наведении на кликабельные элементы
     Expand cursor when hovering over clickable elements */
  const hoverTargets = 'a, button, .photo-card, .print-card, .filter-btn, .gear-item, .about-frame, .ct-card, .howto-step';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
  });

  /* Скрываем кастомный курсор внутри лайтбокса
     Hide custom cursor inside lightbox */
  const lbEl = document.getElementById('lb');
  lbEl.addEventListener('mouseenter', () => {
    curDot.style.display  = 'none';
    curRing.style.display = 'none';
    curGlow.style.display = 'none';
  });
  lbEl.addEventListener('mouseleave', () => {
    curDot.style.display  = '';
    curRing.style.display = '';
    curGlow.style.display = '';
  });
}


/* ════════════════════════════════════════════════════════════
   КНОПКА «НАВЕРХ» / BACK TO TOP BUTTON
   Появляется когда пользователь прокрутил больше 400px.
   Appears when user has scrolled more than 400px.
════════════════════════════════════════════════════════════ */
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
  /* toggle добавляет/убирает класс в зависимости от условия
     toggle adds/removes class based on condition */
  backTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });


/* ════════════════════════════════════════════════════════════
   ПОСИМВОЛЬНАЯ АНИМАЦИЯ ЗАГОЛОВКА / CHARACTER-BY-CHARACTER HEADING
   Разбивает текст заголовка на отдельные буквы.
   Каждая буква получает задержку анимации (animationDelay).
   
   Splits heading text into individual letters.
   Each letter gets an animation delay (animationDelay).
════════════════════════════════════════════════════════════ */
(function splitHeroTitle() {
  const el = document.getElementById('heroTitle');
  if (!el) return;

  /* Два варианта текста: обычный и акцентный (курсив+градиент)
     Two text variants: regular and accent (italic+gradient) */
  const lines = [
    { text: 'Каждый кадр —', accent: false },
    { text: 'отдельный мир',  accent: true  }
  ];

  let delay = 0.42; /* начальная задержка в секундах / initial delay in seconds */

  lines.forEach((line, lineIndex) => {
    const wrapper = document.createElement('span');
    /* Вторая строка начинается с новой строки / Second line starts on new line */
    if (lineIndex > 0) wrapper.classList.add('br');

    line.text.split('').forEach(char => {
      /* Пробел — отдельный элемент / Space — separate element */
      if (char === ' ') {
        const sp = document.createElement('span');
        sp.className = 'sp';
        wrapper.appendChild(sp);
        delay += 0.018;
        return;
      }

      /* Обычная буква или акцентная / Regular or accent letter */
      const span = document.createElement('span');
      span.className = 'char' + (line.accent ? ' ac' : '');
      span.textContent = char;
      span.style.animationDelay = delay + 's';
      delay += 0.038;
      wrapper.appendChild(span);
    });

    el.appendChild(wrapper);
  });
})();


/* ════════════════════════════════════════════════════════════
   МАГНИТНЫЙ ЭФФЕКТ КАРТОЧЕК / MAGNETIC CARD EFFECT
   Только на десктопе. Карточки слегка тянутся к курсору
   и наклоняются в 3D при наведении.
   
   Desktop only. Cards slightly attract to cursor
   and tilt in 3D on hover.
════════════════════════════════════════════════════════════ */
if (isDesktop) {
  document.querySelectorAll('.card-mag').forEach(wrapper => {
    const card = wrapper.querySelector('.photo-card');

    wrapper.addEventListener('mousemove', e => {
      const rect = wrapper.getBoundingClientRect();
      /* Нормализуем позицию от -1 до 1 / Normalize position from -1 to 1 */
      const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
      const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const force = Math.max(0, 1 - dist) * 9; /* сила притяжения / attraction force */

      card.style.transition = 'transform .1s ease';
      card.style.transform  = `translate(${dx*force}px, ${dy*force}px) rotateY(${dx*3.5}deg) rotateX(${-dy*3.5}deg) scale(1.018)`;
    }, { passive: true });

    /* Возврат в исходное положение / Return to original position */
    wrapper.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .55s cubic-bezier(.34, 1.4, .64, 1)';
      card.style.transform  = '';
    });
  });
}


/* ════════════════════════════════════════════════════════════
   ФИЛЬТРЫ ГАЛЕРЕИ + КНОПКА «ЕЩЁ» / GALLERY FILTERS + SHOW MORE
   Фильтрует карточки по категории.
   Показывает только первые 8, остальные скрыты.
   
   Filters cards by category.
   Shows only first 8, rest are hidden.
════════════════════════════════════════════════════════════ */
const VISIBLE_COUNT = 8; /* количество видимых карточек по умолчанию / default visible cards count */
const allCards = Array.from(document.querySelectorAll('.card-mag'));
const btnMore  = document.getElementById('btnMore');
let currentFilter = 'effects'; /* начальный фильтр / initial filter */
let isExpanded    = false;

/* Применяет текущий фильтр / Applies current filter */
function applyFilter() {
  isExpanded = false;

  /* Получаем карточки, подходящие под фильтр / Get cards matching filter */
  const filtered = allCards.filter(c =>
    currentFilter === 'all' || c.dataset.cat === currentFilter
  );

  /* Скрываем все карточки / Hide all cards */
  allCards.forEach(c => {
    c.style.display = 'none';
    c.classList.remove('hidden-card');
  });

  /* Показываем отфильтрованные, первые VISIBLE_COUNT открыты
     Show filtered, first VISIBLE_COUNT are open */
  filtered.forEach((c, i) => {
    c.style.display = '';
    if (i >= VISIBLE_COUNT) c.classList.add('hidden-card');
  });

  /* Показываем/скрываем кнопку «Ещё» / Show/hide «More» button */
  btnMore.classList.toggle('hidden', filtered.length <= VISIBLE_COUNT);
  btnMore.textContent = 'Ещё фотографии';
}

/* Применяем фильтр при загрузке / Apply filter on load */
applyFilter();

/* Обработчики кнопок фильтра / Filter button handlers */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    /* Убираем активный класс со всех кнопок / Remove active class from all buttons */
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    applyFilter();
  });
});

/* Кнопка «Ещё фотографии» / Show more button */
btnMore.addEventListener('click', () => {
  if (!isExpanded) {
    /* Показываем все скрытые карточки текущего фильтра
       Show all hidden cards of current filter */
    allCards
      .filter(c => currentFilter === 'all' || c.dataset.cat === currentFilter)
      .forEach(c => c.classList.remove('hidden-card'));
    btnMore.textContent = 'Скрыть';
    isExpanded = true;
  } else {
    /* Возвращаем к сокращённому виду / Return to collapsed view */
    applyFilter();
  }
});


/* ════════════════════════════════════════════════════════════
   ЛАЙТБОКС / LIGHTBOX
   Полноэкранный просмотр фотографий.
   Поддерживает: клик, клавиатуру, свайп мобильный.
   
   Full-screen photo viewer.
   Supports: click, keyboard, mobile swipe.
════════════════════════════════════════════════════════════ */
const lb     = document.getElementById('lb');
const lbImg  = document.getElementById('lbImg');
let currentIndex = 0;

/* Получаем только видимые карточки (учитывает фильтр)
   Get only visible cards (respects filter) */
function getVisibleCards() {
  return allCards.filter(c => c.style.display !== 'none');
}

/* Открываем лайтбокс / Open lightbox */
function lbOpen(index) {
  currentIndex = index;
  const visible = getVisibleCards();
  lbImg.src = visible[currentIndex].querySelector('img').src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden'; /* блокируем прокрутку страницы / lock page scroll */
}

/* Закрываем лайтбокс / Close lightbox */
function lbClose() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

/* Навигация / Navigation */
function lbPrev() {
  const visible = getVisibleCards();
  currentIndex = (currentIndex - 1 + visible.length) % visible.length;
  lbImg.src = visible[currentIndex].querySelector('img').src;
}
function lbNext() {
  const visible = getVisibleCards();
  currentIndex = (currentIndex + 1) % visible.length;
  lbImg.src = visible[currentIndex].querySelector('img').src;
}

/* Клик по карточке открывает лайтбокс / Card click opens lightbox */
allCards.forEach(card => {
  card.querySelector('.photo-card').addEventListener('click', () => {
    const visible = getVisibleCards();
    lbOpen(visible.indexOf(card));
  });
});

/* Кнопки управления / Control buttons */
document.getElementById('lbClose').addEventListener('click', lbClose);
document.getElementById('lbPrev').addEventListener('click', lbPrev);
document.getElementById('lbNext').addEventListener('click', lbNext);

/* Клик вне фото закрывает / Click outside photo closes */
lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });

/* Клавиатура / Keyboard */
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape')     lbClose();
  if (e.key === 'ArrowLeft')  lbPrev();
  if (e.key === 'ArrowRight') lbNext();
});

/* Свайп на мобиле / Mobile swipe */
let touchStartX = 0;
lb.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
lb.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) { /* минимальный свайп 50px / minimum swipe 50px */
    diff > 0 ? lbNext() : lbPrev();
  }
});


/* ════════════════════════════════════════════════════════════
   АКТИВНАЯ ССЫЛКА В НАВИГАЦИИ / ACTIVE NAV LINK
   Подсвечивает ссылку в шапке когда пользователь
   долистывает до соответствующей секции.
   
   Highlights nav link when user scrolls
   to the corresponding section.
════════════════════════════════════════════════════════════ */
const sections = ['gallery', 'prints', 'about', 'contact'];
const navLinks  = document.querySelectorAll('[data-section]');

function updateActiveNav() {
  const scrollY = window.scrollY + 120; /* смещение для шапки / offset for navbar */
  let activeSection = '';

  sections.forEach(id => {
    const el = document.getElementById(id);
    /* Если верх секции выше текущей позиции — она активна
       If section top is above current position — it's active */
    if (el && el.offsetTop <= scrollY) activeSection = id;
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === activeSection);
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav(); /* запуск сразу при загрузке / run immediately on load */


/* ════════════════════════════════════════════════════════════
   АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ / SCROLL REVEAL ANIMATION
   Элементы с классом .reveal невидимы.
   Когда они попадают в область видимости — получают класс .on
   и плавно появляются (CSS transition в base.css).
   
   Elements with .reveal class are invisible.
   When they enter viewport — they get .on class
   and smoothly appear (CSS transition in base.css).
════════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      /* Задержка для каждого элемента создаёт каскадный эффект
         Delay for each element creates cascade effect */
      setTimeout(() => entry.target.classList.add('on'), i * 70);
    }
  });
}, {
  threshold: 0.08 /* элемент должен быть виден на 8% / element must be 8% visible */
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
