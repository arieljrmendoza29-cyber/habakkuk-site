(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var BUSINESS_EMAIL = "QuinnGoodlow@habakkukmanagementllc.com";
  var FOUNDED = 2018;
  var thisYear = new Date().getFullYear();

  document.getElementById("year").textContent = thisYear;

  /* Mobile menu */
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  var header = document.querySelector(".header");

  function setMenu(open) {
    // Position the panel right under the header, wherever the sticky header sits
    nav.style.setProperty("--nav-top", header.getBoundingClientRect().bottom + "px");
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 880) setMenu(false); });

  var canObserve = "IntersectionObserver" in window;

  /* Headlines: split into words that rise into place */
  function splitWords(h) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
            var w = document.createElement("span"); w.className = "w";
            var inner = document.createElement("span"); inner.style.setProperty("--i", n++); inner.textContent = t;
            w.appendChild(inner); frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && !c.classList.contains("w")) {
          walk(c);
        }
      });
    })(h);
  }
  if (!reduceMotion) {
    document.documentElement.classList.add("anim");
    document.querySelectorAll("main h1").forEach(splitWords);
    var h2s = document.querySelectorAll("main h2");
    if (canObserve) {
      h2s.forEach(function (h) { splitWords(h); h.classList.add("h-wait"); });
      var ho = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.remove("h-wait"); e.target.classList.add("h-in"); ho.unobserve(e.target);
        });
      }, { threshold: 0.4 });
      h2s.forEach(function (h) { ho.observe(h); });
      // Never leave a heading hidden
      setTimeout(function () { h2s.forEach(function (h) { h.classList.remove("h-wait"); }); }, 8000);
    }
  }

  /* Accent line grows in under the hero */
  var heroLine = document.querySelector(".hero-line");
  if (heroLine) setTimeout(function () { heroLine.classList.add("is-in"); }, 80);

  /* Scroll reveal: fade up, staggered among siblings */
  document.querySelectorAll(".values li, .nap li, .footer__inner > *, .stat").forEach(function (el) { el.classList.add("reveal"); });
  var reveals = document.querySelectorAll(".reveal");
  reveals.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.classList.contains("reveal"); });
    var i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty("--delay", (Math.min(i, 6) * 0.09) + "s");
  });
  function showReveal(el) {
    el.classList.add("is-in");
    // Once in place, switch to quick hover transitions
    setTimeout(function () { el.classList.add("is-done"); }, 1400);
  }
  if (canObserve && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { showReveal(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
    // Safety net: anything already on screen at load shows even if the observer is slow to report
    window.addEventListener("load", function () {
      reveals.forEach(function (el) {
        if (!el.classList.contains("is-in") && el.getBoundingClientRect().top < window.innerHeight) { showReveal(el); io.unobserve(el); }
      });
    });
  } else {
    reveals.forEach(showReveal);
  }

  /* 03 Rolling numbers: digits roll into place, 100 ms apart */
  function buildRoll(el) {
    var raw = el.dataset.value === "years" ? String(thisYear - FOUNDED) : el.dataset.value;
    el.setAttribute("aria-label", raw + (el.dataset.suffix || ""));
    raw.split("").forEach(function (d, i) {
      var col = document.createElement("span");
      col.className = "roll__digit";
      col.setAttribute("aria-hidden", "true");
      for (var n = 0; n <= 9; n++) { var s = document.createElement("span"); s.textContent = n; col.appendChild(s); }
      col.style.transitionDelay = (i * 100) + "ms";
      col.dataset.target = d;
      el.appendChild(col);
    });
    if (el.dataset.suffix) {
      var suf = document.createElement("span");
      suf.className = "roll__suffix"; suf.setAttribute("aria-hidden", "true"); suf.textContent = el.dataset.suffix;
      el.appendChild(suf);
    }
  }
  function playRoll(el) {
    el.querySelectorAll(".roll__digit").forEach(function (col) {
      col.style.transform = "translateY(-" + col.dataset.target + "em)";
    });
  }
  var rolls = document.querySelectorAll(".roll");
  rolls.forEach(buildRoll);
  if ("IntersectionObserver" in window && !reduceMotion) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { playRoll(entry.target); rio.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    rolls.forEach(function (el) { rio.observe(el); });
  } else {
    rolls.forEach(playRoll);
  }

  /* 05 Card expand */
  function toggleCard(card, open) {
    card.classList.toggle("is-open", open);
    card.querySelector(".card__head").setAttribute("aria-expanded", String(open));
  }
  document.querySelectorAll(".card__head").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".card");
      toggleCard(card, !card.classList.contains("is-open"));
    });
  });
  // services.html#residential etc. (linked from the home page) opens that card
  var linkedCard = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  if (linkedCard && linkedCard.classList.contains("card")) toggleCard(linkedCard, true);
  // Bring links like contact.html#contact-form to their spot once the page has laid out
  if (linkedCard) {
    window.addEventListener("load", function () {
      linkedCard.scrollIntoView({ block: linkedCard.classList.contains("card") ? "center" : "start" });
    });
  }

  /* Testimonials carousel: swipe, arrows, dots, keyboard, gentle autoplay */
  document.querySelectorAll("[data-slider]").forEach(function (sl) {
    var track = sl.querySelector(".slider__track");
    var slides = track.children;
    var dots = sl.querySelectorAll(".slider__dot");
    var cur = 0, timer = null, stopped = reduceMotion;

    function go(i) {
      cur = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[cur].offsetLeft - track.offsetLeft, behavior: reduceMotion ? "auto" : "smooth" });
    }
    function mark() {
      var i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      if (i >= 0 && i < slides.length) cur = i;
      dots.forEach(function (d, j) {
        if (j === cur) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
    }
    function stop() { stopped = true; clearInterval(timer); }
    function start() {
      clearInterval(timer);
      timer = setInterval(function () { if (!document.hidden) go(cur + 1); }, 7000);
    }

    sl.querySelectorAll(".slider__arrow").forEach(function (b) {
      b.addEventListener("click", function () { stop(); go(cur + Number(b.dataset.dir)); });
    });
    dots.forEach(function (d, j) { d.addEventListener("click", function () { stop(); go(j); }); });
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); stop(); go(cur + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); stop(); go(cur - 1); }
    });
    var raf;
    track.addEventListener("scroll", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(mark); }, { passive: true });
    ["pointerdown", "touchstart", "wheel"].forEach(function (ev) { track.addEventListener(ev, stop, { passive: true }); });
    sl.addEventListener("mouseenter", function () { clearInterval(timer); });
    sl.addEventListener("mouseleave", function () { if (!stopped) start(); });
    if (!stopped) start();
  });

  /* Privacy page: "Jump to a section" dropdown + floating "Back to sections" */
  var jump = document.getElementById("sections");
  var backBtn = document.querySelector(".back-to-sections");
  if (jump && backBtn) {
    jump.addEventListener("click", function (e) { if (e.target.closest("a")) jump.open = false; });
    backBtn.addEventListener("click", function (e) {
      e.preventDefault();
      jump.open = true;
      jump.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      jump.querySelector("summary").focus({ preventScroll: true });
    });
    var toggleBack = function () {
      var show = jump.getBoundingClientRect().bottom < 0;
      backBtn.classList.toggle("is-visible", show);
      backBtn.setAttribute("aria-hidden", String(!show));
      backBtn.tabIndex = show ? 0 : -1;
    };
    window.addEventListener("scroll", toggleBack, { passive: true });
    toggleBack();
  }

  /* contact.html?role=Tenant preselects "I'm a" on the contact form */
  var form = document.getElementById("contactForm");
  var role = new URLSearchParams(location.search).get("role");
  if (form && role) {
    var radio = Array.prototype.find.call(form.elements.role, function (r) { return r.value === role; });
    if (radio) radio.checked = true;
  }

  /* Forms (contact + popup): send straight to the business inbox, then 06 success tick */
  function setupForm(f) {
    var errorEl = f.querySelector(".form__error");
    var success = f.querySelector(".success");
    var successText = f.querySelector(".success__text");
    var submitBtn = f.querySelector("[type='submit']");
    var submitLabel = submitBtn.textContent;

    function validate() {
      var ok = true;
      ["name", "email", "message"].forEach(function (name) {
        var field = f.elements[name];
        var valid = field.value.trim() !== "" && (name !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()));
        field.setAttribute("aria-invalid", String(!valid));
        if (!valid && ok) { field.focus(); ok = false; }
      });
      errorEl.textContent = ok ? "" : "Please add your name, a valid email, and a short message.";
      return ok;
    }

    function showSuccess(text) {
      successText.textContent = text;
      success.hidden = false;
      // Restart the draw animation on every submit
      success.querySelectorAll("circle, path").forEach(function (el) {
        el.style.animation = "none"; void el.getBoundingClientRect(); el.style.animation = "";
      });
      success.querySelector("button").focus();
    }

    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;
      var data = new FormData(f);
      var endpoint = f.dataset.endpoint;

      if (endpoint) {
        data.set("_replyto", data.get("email"));
        submitBtn.disabled = true; submitBtn.textContent = "Sending…";
        fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } })
          .then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (reply) {
              // FormSubmit can answer 200 with success "false" (e.g. inbox not activated yet),
              // so only a confirmed success counts as sent
              var sent = res.ok && (reply.success === true || reply.success === "true");
              if (!sent) throw new Error(reply.message || "HTTP " + res.status);
              showSuccess("Your message has been sent. We'll be in touch shortly.");
              f.reset();
            });
          })
          .catch(function (err) {
            if (window.console) console.warn("Form not delivered:", err.message);
            errorEl.textContent = /activat/i.test(err.message)
              ? "Our online form isn't active yet. Please call 414-374-5062 or email QuinnGoodlow@habakkukmanagementllc.com."
              : "Sorry, your message couldn't be sent. Please call 414-374-5062 or email QuinnGoodlow@habakkukmanagementllc.com.";
          })
          .then(function () { submitBtn.disabled = false; submitBtn.textContent = submitLabel; });
        return;
      }

      // No form service configured: open a pre-filled email instead
      var body = "Name: " + data.get("name") + "\nEmail: " + data.get("email") + "\nPhone: " + (data.get("phone") || "-") +
        "\nI'm a: " + data.get("role") + "\n\n" + data.get("message");
      var subject = "Website inquiry from " + data.get("name") + " (" + data.get("role") + ")";
      window.location.href = "mailto:" + BUSINESS_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      showSuccess("Your email app should open with your message ready to send.");
      f.reset();
    });

    f.addEventListener("input", function (e) {
      if (e.target.getAttribute("aria-invalid") === "true") e.target.setAttribute("aria-invalid", "false");
    });
    var again = f.querySelector("[data-again]");
    if (again) again.addEventListener("click", function () { success.hidden = true; f.elements.name.focus(); });

    return { reset: function () { success.hidden = true; errorEl.textContent = ""; } };
  }

  if (form) setupForm(form);

  /* Popup (home page only): opens 6 seconds after every load and refresh */
  var POPUP_DELAY = 6000;
  var popup = document.getElementById("popup");
  if (!popup) return;
  var popupForm = setupForm(document.getElementById("popupForm"));
  var lastFocus = null;

  function openPopup() {
    if (!popup.hidden) return;
    lastFocus = document.activeElement;
    popup.hidden = false;
    document.body.classList.add("no-scroll");
    requestAnimationFrame(function () { popup.classList.add("is-open"); });
    setTimeout(function () { popup.querySelector(".popup__close").focus(); }, 50);
  }
  function closePopup() {
    popup.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(function () { popup.hidden = true; popupForm.reset(); }, reduceMotion ? 0 : 300);
    if (lastFocus) lastFocus.focus();
  }
  popup.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closePopup(); });
  document.addEventListener("keydown", function (e) {
    if (popup.hidden) return;
    if (e.key === "Escape") closePopup();
    if (e.key === "Tab") {
      // Keep keyboard focus inside the popup
      var items = Array.prototype.filter.call(popup.querySelectorAll("button, a, input:not([type='hidden']):not(.hp), textarea"),
        function (el) { return el.offsetParent !== null; });
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  setTimeout(openPopup, POPUP_DELAY);
})();
