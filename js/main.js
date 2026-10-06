/* =========================================================
   ARMAN IRON CRAFT - main.js
   EDIT THE VALUES BELOW with the real business details.
   ========================================================= */

const SITE = {
  phone: "+919871500745",      // e.g. "+911234567890"  (numbers only, with country code)
  whatsapp: "918920212909",   // e.g. "911234567890"   (NO + sign, with country code)
  mapsUrl: "https://www.google.com/maps/place/ARMAN+IRON+CRAFT/@28.5761255,77.216915,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce34247014093:0xfbcdf71710664d8d!8m2!3d28.5761255!4d77.2194899!16s%2Fg%2F11vpy_9mtn?entry=ttu&g_ep=EgoyMDI2MDkzMC4wIKXMDSoASAFQAw%3D%3D",    // Google Maps link used by "Get Directions"
  whatsappMessage: "Hello, I found Arman Iron Craft through your website. I would like to enquire about a project."
};

// Builds a WhatsApp link that opens a chat with the message already typed
function whatsappLink(message) {
  if (!SITE.whatsapp) return "#";
  return "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(message);
}

// ---------- Floating WhatsApp button (added to every page) ----------
const floatButton = document.createElement("a");
floatButton.className = "whatsapp-float";
floatButton.target = "_blank";
floatButton.rel = "noopener";
floatButton.setAttribute("data-whatsapp", "");
floatButton.setAttribute("aria-label", "Chat with Arman Iron Craft on WhatsApp");
floatButton.innerHTML =
  '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">' +
  '<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Z"/></svg>' +
  "<span>WhatsApp</span>";
document.body.appendChild(floatButton);

// ---------- Set up every WhatsApp link ----------
// <a data-whatsapp>                          -> general message
// <a data-whatsapp data-whatsapp-service="Iron Gate"> -> message about that service
document.querySelectorAll("[data-whatsapp]").forEach(function (link) {
  const service = link.dataset.whatsappService;
  const message = service
    ? "Hello, I would like to enquire about " + service + ". Please share more details."
    : SITE.whatsappMessage;
  link.href = whatsappLink(message);

  link.addEventListener("click", function (event) {
    if (!SITE.whatsapp) {                       // number not added yet
      event.preventDefault();
      alert("WhatsApp number not added yet. Add it in js/main.js");
      return;
    }
    // On the Contact page, if a service is chosen in the form, include it
    const select = document.querySelector("#service");
    if (link === floatButton && select && select.value) {
      link.href = whatsappLink("Hello, I would like to enquire about " + select.value + ". Please share more details.");
    }
  });
});

// ---------- Call and directions links ----------
document.querySelectorAll("[data-call]").forEach(function (link) {
  if (SITE.phone) link.href = "tel:" + SITE.phone;
});
document.querySelectorAll("[data-directions]").forEach(function (link) {
  if (SITE.mapsUrl) link.href = SITE.mapsUrl;
});


// Makes a number easy to read, e.g. 918920212909 becomes +91 89202 12909
function prettyNumber(number) {
  const digits = number.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return "+91 " + digits.slice(2, 7) + " " + digits.slice(7);
  }
  if (digits.length === 10) {
    return "+91 " + digits.slice(0, 5) + " " + digits.slice(5);
  }
  return "+" + digits;
}

// Show the real numbers in the footer / contact page
if (SITE.phone) {
  document.querySelectorAll('[data-text="phone"]').forEach(function (el) { el.textContent = prettyNumber(SITE.phone); });
}
if (SITE.whatsapp) {
  document.querySelectorAll('[data-text="whatsapp"]').forEach(function (el) { el.textContent = prettyNumber(SITE.whatsapp); });
}

// ---------- FAQ accordion ----------
document.querySelectorAll(".faq__question").forEach(function (button) {
  button.addEventListener("click", function () {
    const item = button.closest(".faq__item");
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", isOpen);
  });
});

// ===== STAGE 8: SCROLL ANIMATIONS =====
// Everything below only runs if the visitor has NOT asked for reduced motion.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 
// ---------- Scroll reveal ----------
// Elements start slightly lower and transparent, then glide into place
// the first time they scroll into view.
if (!reduceMotion && "IntersectionObserver" in window) {
  const targets = document.querySelectorAll(
    ".section__head, .about > *, .service-card, .why-card, .process li, " +
    ".featured__img, .facts, .review, .service-detail, .contact-card, .quote-form, .cta__inner"
  );
  const staggered = ".service-card, .why-card, .process li";   // cards appear one after another
 
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("is-visible");
      observer.unobserve(el);                   // each element animates only once
      setTimeout(function () {                  // then give it back its normal hover behaviour
        el.classList.remove("reveal", "is-visible");
        el.style.transitionDelay = "";
      }, 1500);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
 
  targets.forEach(function (el) {
    el.classList.add("reveal");
    if (el.matches(staggered)) {
      const position = Array.from(el.parentElement.children).indexOf(el);
      el.style.transitionDelay = Math.min(position, 5) * 80 + "ms";
    }
    observer.observe(el);
  });
}
 
// ---------- "How it works" line grows as you scroll ----------
const processList = document.querySelector(".process");
if (processList && !reduceMotion) {
  processList.classList.add("process--animated");
  const steps = Array.from(processList.children);
 
  function updateProcess() {
    const box = processList.getBoundingClientRect();
    const vh = window.innerHeight;
    // progress: 0 (not reached yet) to 1 (fully scrolled through)
    let progress = (vh * 0.85 - box.top) / (box.height + vh * 0.3);
    progress = Math.max(0, Math.min(1, progress));
    processList.style.setProperty("--progress", progress);   // CSS uses this to draw the line
    steps.forEach(function (step, i) {
      step.classList.toggle("is-reached", progress > (i / (steps.length - 1)) * 0.9);
    });
  }
 
  let waiting = false;                          // run at most once per screen refresh
  window.addEventListener("scroll", function () {
    if (waiting) return;
    waiting = true;
    requestAnimationFrame(function () { updateProcess(); waiting = false; });
  }, { passive: true });
  window.addEventListener("resize", updateProcess);
  updateProcess();
}
 
// ===== PHOTO BOXES: hide the label and fill empty space with a blurred copy =====
function markPhotoLoaded(img) {
  const box = img.closest(".img-box");
  if (!box || !img.naturalWidth) return;
  box.style.setProperty("--photo", 'url("' + (img.currentSrc || img.src) + '")');
  box.classList.add("is-loaded");
}
// Image "load" events do not bubble, so listen in capture mode (also catches gallery tiles added later)
document.addEventListener("load", function (event) {
  if (event.target.tagName === "IMG") markPhotoLoaded(event.target);
}, true);
// Photos that already finished loading before this script ran
document.querySelectorAll(".img-box img").forEach(function (img) {
  if (img.complete) markPhotoLoaded(img);
});
 