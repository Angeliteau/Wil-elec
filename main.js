      document.addEventListener("DOMContentLoaded", () => {
        // --- CARROUSEL ---
        const carrousel = document.getElementById("carrousel");
        const cards = [...document.querySelectorAll(".presentation-card")];
        const prevBtn = document.getElementById("prev");
        const nextBtn = document.getElementById("next");
        const wrapper = document.querySelector(".carrousel-wrapper");
        const dotsContainer = document.getElementById("carousel-dots");
        let activeIndex = 2; // image centrale au départ
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let isDragging = false;

        function createDots() {
          dotsContainer.innerHTML = "";
          cards.forEach((_, i) => {
            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (i === activeIndex) dot.classList.add("active");
            dot.addEventListener("click", () => {
              centerCard(i);
            });
            dotsContainer.appendChild(dot);
          });
        }

        function updateDots() {
          const dots = dotsContainer.querySelectorAll(".dot");
          dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === activeIndex);
          });
        }

        function getTranslateX(index) {
          const wrapperWidth = wrapper.offsetWidth;
          const cardStyle = getComputedStyle(cards[0]);
          const cardWidth = cards[0].offsetWidth;
          const cardMarginRight = parseInt(cardStyle.marginRight) || 0;
          const totalCardWidth = cardWidth + cardMarginRight;
          return totalCardWidth * index - (wrapperWidth / 2 - cardWidth / 2);
        }

        function setTranslate(x, withTransition = false) {
          carrousel.style.transition = withTransition ? "transform 0.4s ease" : "none";
          carrousel.style.transform = `translateX(${x}px)`;
        }

        function centerCard(index) {
          activeIndex = Math.min(Math.max(index, 0), cards.length - 1);
          currentTranslate = -getTranslateX(activeIndex);
          prevTranslate = currentTranslate;
          setTranslate(currentTranslate, true);
          cards.forEach((card, i) => card.classList.toggle("active", i === activeIndex));
          updateDots();
        }
        prevBtn.addEventListener("click", () => {
          centerCard(activeIndex - 1);
        });
        nextBtn.addEventListener("click", () => {
          centerCard(activeIndex + 1);
        });
        carrousel.addEventListener("touchstart", (e) => {
          startX = e.touches[0].clientX;
          isDragging = true;
          carrousel.style.transition = "none";
        });
        carrousel.addEventListener("touchmove", (e) => {
          if (!isDragging) return;
          const currentX = e.touches[0].clientX;
          const diff = currentX - startX;
          let newTranslate = prevTranslate + diff;
          const maxTranslate = 0;
          const minTranslate = -getTranslateX(cards.length - 1);
          if (newTranslate > maxTranslate) newTranslate = maxTranslate;
          if (newTranslate < minTranslate) newTranslate = minTranslate;
          currentTranslate = newTranslate;
          setTranslate(currentTranslate, false);
        });
        carrousel.addEventListener("touchend", () => {
          if (!isDragging) return;
          isDragging = false;
          const movedBy = currentTranslate - prevTranslate;
          const threshold = cards[0].offsetWidth / 4;
          if (movedBy < -threshold && activeIndex < cards.length - 1) {
            activeIndex++;
          } else if (movedBy > threshold && activeIndex > 0) {
            activeIndex--;
          }
          centerCard(activeIndex);
        });
        createDots();
        centerCard(activeIndex);
        // --- MENU MOBILE ---
        const burgerIcon = document.getElementById("burger-icon");
        const closeIcon = document.getElementById("close-icon");
        const navLinks = document.getElementById("nav-links");
        let isMobile = window.innerWidth < 1260;

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

        function initMobileMenu() {
          burgerIcon.addEventListener("click", openMenu);
          closeIcon.addEventListener("click", closeMenu);
          navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
          });
        }
        initMobileMenu();
        window.addEventListener("resize", () => {
          const newIsMobile = window.innerWidth < 1260;
          if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
          }
        });
      });
    