/* site.js — common behavior across pages
   - Sticky blur header shadow on scroll
   - Mobile menu toggle (captures click to avoid duplicate inline handlers)
   - Active menu item highlight
   - Footer year
*/
(() => {
  const header = document.querySelector("header");
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mainmenu");

  // Set year (if present)
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Shadow when scrolled
  const updateHeaderShadow = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 10);
  };
  updateHeaderShadow();
  window.addEventListener("scroll", updateHeaderShadow, { passive: true });

  // Active link highlight (safe on static hosting)
  try {
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    if (menu) {
      menu.querySelectorAll("a[href]").forEach(a => {
        const href = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
        const isActive = href === path;
        if (isActive) {
          a.classList.add("active");
          a.setAttribute("aria-current", "page");
        } else if (a.getAttribute("aria-current") === "page" && !a.classList.contains("active")) {
          // leave existing active as-is
        }
      });
    }
  } catch (_) {}

  const closeMenu = () => {
    if (!menu || !toggle) return;
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    if (!menu || !toggle) return;
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  };

  // Capture click on hamburger to avoid duplicate inline handlers firing in bubble phase
  if (toggle) {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      toggleMenu();
    }, true);
  }

  // Close on outside click (capture)
  document.addEventListener("click", (e) => {
    if (!menu || !toggle) return;
    const target = e.target;
    const clickedInside = menu.contains(target) || toggle.contains(target);
    if (!clickedInside) closeMenu();
  }, true);

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Close after choosing a link (mobile)
  if (menu) {
    menu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) closeMenu();
    });
  }
})();


/* Contact forms (kapcsolat + mini): reason dropdown logic */
(() => {
  const reason = document.getElementById("reason");
  const otherWrap = document.getElementById("other-wrap");
  const otherText = document.getElementById("other_text");
  const noteWrap = document.getElementById("note-wrap");

  const sync = () => {
    if (!reason) return;
    const isOther = reason.value === "other";
    if (otherWrap) otherWrap.style.display = isOther ? "" : "none";
    if (noteWrap) noteWrap.style.display = isOther ? "none" : "";
    if (otherText) {
      otherText.required = isOther;
      if (!isOther) otherText.value = "";
    }
  };

  if (reason) {
    reason.addEventListener("change", sync);
    sync();
  }
})();


/* --- FAQ SEARCH CLEAR (bigger hitbox) --- */
(function () {
  const input = document.getElementById("faqSearch");
  const clearBtn = document.querySelector(".faq-clear");
  if (!input || !clearBtn) return;

  function sync() {
    clearBtn.style.display = input.value ? "flex" : "none";
  }

  clearBtn.addEventListener("click", function () {
    input.value = "";
    sync();
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  });

  input.addEventListener("input", sync);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      input.value = "";
      sync();
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });

  sync();
})();
