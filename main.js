document.addEventListener("DOMContentLoaded", () => {
  // === UTILITAIRES ===
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];


  // === APPARITION REALISATIONS ===
  const cards = document.querySelectorAll('.realisation-card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, {
    threshold: 0.2
  });

  cards.forEach(card => observer.observe(card));

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
    navbarToggle.setAttribute("aria-expanded", "true");
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
