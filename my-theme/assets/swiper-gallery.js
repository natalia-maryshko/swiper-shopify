(function () {
  const norm = (str) => (str || "").toString().trim().toLowerCase();

  function extractColorFromAlt(alt) {
    const m = norm(alt).match(/color\s*:\s*([^\|,;\/]+)/i);
    return m ? norm(m[1]) : "";
  }


  function readSelectedColor(container, colorOptionName) {
    if (!colorOptionName) return "";
    const names = [
      `options[${colorOptionName}]`,
      colorOptionName,
      `options[${norm(colorOptionName)}]`,
      norm(colorOptionName),
    ];

    let sel = null;
    for (const n of names) {
      sel =
        container.querySelector(`input[name="${n}"]:checked, select[name="${n}"]`) ||
        document.querySelector(`input[name="${n}"]:checked, select[name="${n}"]`);
      if (sel) break;
    }

    if (!sel) {
      const fsets = Array.from(container.querySelectorAll("fieldset"));
      for (const fs of fsets) {
        const lg = norm(fs.querySelector("legend")?.textContent);
        if (lg && lg.includes(norm(colorOptionName))) {
          sel = fs.querySelector('input[type="radio"]:checked, select');
          if (sel) break;
        }
      }
    }

    if (!sel) return "";
    return sel.tagName === "SELECT"
      ? norm(sel.options[sel.selectedIndex]?.value)
      : norm(sel.value);
  }

  function applyFilter(swiper, slides, selectedColor) {
    const want = norm(selectedColor);
    let shown = 0;

    slides.forEach((slide) => {
      const have = norm(slide.dataset.colorValue);
      const match = !want || have === want;
      slide.classList.toggle("is-hidden", !match);
      if (match) shown++;
    });

    if (swiper && swiper.el) {
      swiper.updateSlides();
      swiper.updateSize();
      swiper.updateSlidesClasses();
      if (swiper.pagination && swiper.pagination.el) {
        swiper.pagination.render();
        swiper.pagination.update();
      }
      if (swiper.navigation) {
        swiper.navigation.update();
      }
      swiper.update();
      if (shown) swiper.slideTo(0, 0);
    }
  }

  function initOne(root) {
    if (root.__swiperInited) return;
    root.__swiperInited = true;

    const swiperEl = root.querySelector(".swiper");
    if (!swiperEl) return;

    const swiper = new Swiper(swiperEl, {
      spaceBetween: 16,
      slidesPerView: 1,
      breakpoints: {},
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      resizeObserver: true,
      updateOnWindowResize: true,
      watchOverflow: false,

      pagination: { el: root.querySelector(".swiper-pagination"), clickable: false },
      navigation: {
            nextEl: root.querySelector(".swiper-button-next"),
            prevEl: root.querySelector(".swiper-button-prev"),
          },
    });


    const slides = Array.from(root.querySelectorAll(".swiper-slide"));
    slides.forEach((slide) => {
      const alt =
        slide.getAttribute("data-alt") ||
        slide.querySelector("img")?.getAttribute("alt") ||
        "";
      slide.dataset.colorValue = extractColorFromAlt(alt);
    });

    const colorOptionName = root.dataset.colorOptionName || "";
    const sectionScope =
      root.closest("[data-section]") || root.closest("section") || document;

    const run = () => {
      const selected = readSelectedColor(sectionScope, colorOptionName);
      applyFilter(swiper, slides, selected);
    };

    run();

    const changeHandler = () => run();
    sectionScope.addEventListener("change", changeHandler, true);
    sectionScope.addEventListener("input", (e) => {
      const t = e.target;
      if (t && (t.matches('input[type="radio"]') || t.matches("select"))) run();
    }, true);

    sectionScope.addEventListener("variant:change", run);
    document.addEventListener("variant:change", run);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".js-product-swiper").forEach(initOne);
  });
})();
