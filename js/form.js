/* =========================================================
   ARMAN IRON CRAFT - form.js
   Checks the quote form. If everything is valid, it shows a
   "Send on WhatsApp" button with the details filled in.

   NOTE: There is no server, so nothing is emailed or stored.
   To receive form submissions by email later, you can use a free
   service such as Formspree or Web3Forms: create an account, get
   your form URL, then send the form data to it using fetch() inside
   the submit handler below (ask me and I'll add it).
   ========================================================= */

const form = document.querySelector("#quote-form");
const successBox = document.querySelector("#form-success");
const successLink = document.querySelector("#success-whatsapp");

// Each rule returns an error message, or "" if the field is OK
const rules = {
  name: function (v) {
    if (!v.trim()) return "Please enter your full name.";
    if (v.trim().length < 2) return "Name is too short.";
    return "";
  },
  phone: function (v) {
    const digits = v.replace(/\D/g, "");               // keep only the numbers
    if (!v.trim()) return "Please enter your phone number.";
    if (!/^[0-9+\s()-]+$/.test(v)) return "Use only numbers, spaces, + or -.";
    if (digits.length < 7 || digits.length > 15) return "Enter a valid phone number (7 to 15 digits).";
    return "";
  },
  service: function (v) {
    return v ? "" : "Please choose a service.";
  },
  details: function (v) {
    if (!v.trim()) return "Please tell us about your project.";
    if (v.trim().length < 10) return "Please add a little more detail (at least 10 characters).";
    return "";
  }
};

function showError(field, message) {
  const error = document.querySelector("#" + field.id + "-error");
  error.textContent = message ? "\u26A0 " + message : "";   // warning sign so it is not only colour
  field.closest(".field").classList.toggle("has-error", Boolean(message));
  field.setAttribute("aria-invalid", message ? "true" : "false");
}

function checkImage(field) {
  const file = field.files[0];
  let message = "";
  if (file && !file.type.startsWith("image/")) message = "Please choose an image file.";
  else if (file && file.size > 5 * 1024 * 1024) message = "Image is too large (maximum 5 MB).";
  showError(field, message);
  return message === "";
}

function checkField(field) {
  if (field.id === "image") return checkImage(field);
  const message = rules[field.id](field.value);
  showError(field, message);
  return message === "";
}

if (form) {
  const fields = Array.from(form.querySelectorAll("input, select, textarea"));

  // Check a field when the user leaves it; re-check while typing if it had an error
  fields.forEach(function (field) {
    field.addEventListener("blur", function () { checkField(field); });
    field.addEventListener("input", function () {
      if (field.getAttribute("aria-invalid") === "true") checkField(field);
    });
  });

  // Pre-select the service if the link was contact.html?service=Iron%20Gate
  const wanted = new URLSearchParams(window.location.search).get("service");
  if (wanted) {
    Array.from(form.service.options).forEach(function (option) {
      if (option.text.toLowerCase() === wanted.toLowerCase()) form.service.value = option.value || option.text;
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();                          // stop the page from reloading

    const results = fields.map(checkField);          // check every field
    const firstBad = fields[results.indexOf(false)];
    if (firstBad) { firstBad.focus(); return; }      // jump to the first problem

    // All valid: build the WhatsApp message
    const text =
      "Hello, I would like to enquire about: " + form.service.value + ".\n" +
      "Name: " + form.name.value.trim() + "\n" +
      "Phone: " + form.phone.value.trim() + "\n" +
      "Details: " + form.details.value.trim();

    if (SITE.whatsapp) {
      successLink.href = "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(text);
    } else {
      successLink.href = "#";
      console.warn("WhatsApp number is empty. Add it in js/main.js");
    }

    successBox.hidden = false;
    successBox.scrollIntoView({ behavior: "smooth", block: "center" });
    successBox.focus();
  });
}