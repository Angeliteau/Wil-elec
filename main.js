document.addEventListener("DOMContentLoaded", () => {
  // === UTILITAIRES ===
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  // === CARROUSEL ===
  const carrousel = $("#carrousel");
  const cards = $$(".realisation-card");
  const prevBtn = $("#prev");
  const nextBtn = $("#next");
  const wrapper = $(".carrousel-wrapper");
  const dotsContainer = $(".carousel-dots");

  let activeIndex = 4;
  let startX = 0;
  let currentX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;
  let animationID;

  function getTranslateX(index) {
    const wrapperWidth = wrapper.offsetWidth;
    const cardStyle = getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth;
    const cardMargin = parseInt(cardStyle.marginRight) || 0;
    const totalCardWidth = cardWidth + cardMargin;
    return totalCardWidth * index - (wrapperWidth / 2 - cardWidth / 2);
  }

  function setTranslate(x, withTransition = false) {
    carrousel.style.transition = withTransition ? "transform 0.4s ease" : "none";
    carrousel.style.transform = `translateX(${x}px)`;
  }

  function centerCard(index) {
    activeIndex = Math.max(0, Math.min(index, cards.length - 1));
    currentTranslate = -getTranslateX(activeIndex);
    prevTranslate = currentTranslate;
    setTranslate(currentTranslate, true);

    cards.forEach((card, i) => card.classList.toggle("active", i === activeIndex));
    updateDots();
  }

  function createDots() {
    dotsContainer.innerHTML = "";
    cards.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "dot";
      if (i === activeIndex) dot.classList.add("active");
      dot.addEventListener("click", () => centerCard(i));
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    dotsContainer.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === activeIndex);
    });
  }

  function animate() {
    setTranslate(currentTranslate, false);
    if (isDragging) requestAnimationFrame(animate);
  }

  // --- Touches tactiles ---
  carrousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    animationID = requestAnimationFrame(animate);
    carrousel.style.transition = "none";
  }, { passive: true });

  carrousel.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;

    const max = 0;
    const min = -getTranslateX(cards.length - 1);
    currentTranslate = Math.min(max, Math.max(currentTranslate, min));
  }, { passive: true });

  carrousel.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;
    const threshold = cards[0].offsetWidth / 4;

    if (movedBy < -threshold && activeIndex < cards.length - 1) {
      activeIndex++;
    } else if (movedBy > threshold && activeIndex > 0) {
      activeIndex--;
    }
    centerCard(activeIndex);
  }, { passive: true });

  // --- Boutons ---
  prevBtn.addEventListener("click", () => centerCard(activeIndex - 1));
  nextBtn.addEventListener("click", () => centerCard(activeIndex + 1));

  createDots();
  centerCard(activeIndex);

  // === MENU MOBILE ===
  const burgerIcon = $("#burger-icon");
  const closeIcon = $("#close-icon");
  const navLinks = $("#nav-links");

  let isMobile = window.innerWidth < 1085;

  function closeMenu() {
    navLinks.classList.remove("slide-down");
    navLinks.classList.add("slide-up");
    setTimeout(() => {
      navLinks.style.display = "none";
      navLinks.classList.remove("slide-up");
    }, 400);
    closeIcon.style.display = "none";
    burgerIcon.style.display = "inline-block";
  }

  function openMenu() {
    burgerIcon.style.display = "none";
    closeIcon.style.display = "inline-block";
    closeIcon.classList.add("rotate-in");
    navLinks.style.display = "flex";
    navLinks.classList.remove("slide-up");
    navLinks.classList.add("slide-down");
  }

  burgerIcon.addEventListener("click", openMenu);
  closeIcon.addEventListener("click", closeMenu);

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      if (isMobile) closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    isMobile = window.innerWidth < 1085;
  });
});
