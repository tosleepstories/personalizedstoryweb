// Free sample ebook request form → Forminit (https://forminit.com).
// Static site, no build step. Photos are shrunk in the browser before upload.
// Text on screen comes from i18n.js; what is sent to Forminit stays in English.

// The English labels below are what Ivo receives in the submission ("cast" lines).
// The page shows the translated "role.*" / "age.*" text from i18n.js instead.
const ROLES = [
  { id: "child", label: "Child" },
  { id: "adult", label: "Adult" },
  { id: "pet", label: "Pet" },
];
const CHILD_AGES = [
  { id: "baby", label: "Baby (under 1)" },
  { id: "toddler", label: "Toddler (1–2)" },
  { id: "3-5", label: "3–5 years" },
  { id: "6-9", label: "6–9 years" },
  { id: "10-12", label: "10–12 years" },
];

// ---- Translations (from i18n.js) -----------------------------------------
const I18N = window.I18N;
const t = I18N.t;

// ---- Settings (from config.js) ------------------------------------------
const SITE = window.SITE || {};
const FORM_ID = String(SITE.forminitFormId || "").trim();
const FORM_READY = FORM_ID !== "" && FORM_ID !== "YOUR_FORMINIT_FORM_ID";
const MAX_PHOTOS_PER_CHARACTER = SITE.maxPhotosPerCharacter || 3;
const MAX_TOTAL_BYTES = (SITE.maxTotalUploadMB || 20) * 1024 * 1024;

// Image compression targets.
const MAX_SIDE = 1600; // px, longest side
const TARGET_BYTES = 1.5 * 1024 * 1024; // aim for under ~1.5 MB per photo
const QUALITIES = [0.8, 0.7, 0.6, 0.5];
const MAX_RAW_FALLBACK_BYTES = 8 * 1024 * 1024; // HEIC files the browser cannot decode are sent as-is up to this size

// ---- Elements -------------------------------------------------------------
const peopleEl = document.getElementById("people");
const form = document.getElementById("form");
const go = document.getElementById("go");
const stepCount = document.getElementById("step-count");
const stepPerson = document.getElementById("step-person");
const stepBook = document.getElementById("step-book");
const personProgress = document.getElementById("person-progress");
const nextPersonBtn = document.getElementById("next-person");
const statusEl = document.getElementById("form-status");
const setupWarn = document.getElementById("setup-warn");
const nameInput = form.elements["fi-sender-fullName"];
const emailInput = form.elements["fi-sender-email"];

let totalPeople = 1; // default; the real value is read from #char-count on the first step
let currentPerson = 0;
let sending = false;
// photoJobs[i] = Promise<File[]> of already-compressed photos for character i.
const photoJobs = [];

function setBrandTitle() {
  if (SITE.brand) document.title = t("doc.brandTitle", { brand: SITE.brand });
}
if (SITE.brand) {
  setBrandTitle();
  const brand = document.getElementById("brand-eyebrow");
  if (brand) brand.textContent = SITE.brand;
}
if (!FORM_READY) setupWarn.classList.remove("hidden");

// ---- Helpers --------------------------------------------------------------
function setStatus(message, kind) {
  statusEl.textContent = message;
  statusEl.className = "hint" + (kind ? " " + kind : "");
}

function formatMB(bytes) {
  return I18N.decimal(bytes / (1024 * 1024)) + " MB";
}

// Safe file-name fragment, e.g. "Zé Maria" -> "Ze-Maria".
function slug(text) {
  return (
    String(text)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30) || "photo"
  );
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

// Checks name and email. Shows the browser bubble on the first problem.
function validateContact() {
  nameInput.value = nameInput.value.trim();
  emailInput.value = emailInput.value.trim();
  nameInput.setCustomValidity(nameInput.value ? "" : t("check.yourName"));
  emailInput.setCustomValidity(validEmail(emailInput.value) ? "" : t("check.email"));
  for (const input of [nameInput, emailInput]) {
    if (!input.checkValidity()) {
      input.reportValidity();
      input.focus();
      return false;
    }
  }
  return true;
}
[nameInput, emailInput].forEach((input) =>
  input.addEventListener("input", () => input.setCustomValidity(""))
);

// ---- Image compression ----------------------------------------------------
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode"));
    };
    img.src = url;
  });
}

function canvasToJpeg(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

// Resize to MAX_SIDE and re-encode as JPEG, lowering quality (then size) until
// under TARGET_BYTES. HEIC files the browser cannot decode (outside Safari)
// are sent unchanged if small enough; other unreadable files are rejected.
async function compressPhoto(file, baseName) {
  let img;
  try {
    img = await loadImage(file);
  } catch (e) {
    // HEIC/HEIF (iPhone format) can't be decoded outside Safari: send it unchanged.
    const isHeic = /hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
    if (isHeic && file.size <= MAX_RAW_FALLBACK_BYTES) {
      const ext = (file.name.match(/\.[^.]+$/) || [".img"])[0].toLowerCase();
      return new File([file], baseName + ext, { type: file.type || "application/octet-stream" });
    }
    throw new Error(t("photo.unreadable", { file: file.name }));
  }

  let side = MAX_SIDE;
  let blob = null;
  for (let attempt = 0; attempt < 3 && !blob; attempt += 1) {
    const scale = Math.min(1, side / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; // transparent PNGs would otherwise turn black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    for (const q of QUALITIES) {
      const out = await canvasToJpeg(canvas, q);
      if (!out) break;
      if (out.size <= TARGET_BYTES) {
        blob = out;
        break;
      }
    }
    side = Math.round(side * 0.75);
  }
  if (!blob) throw new Error(t("photo.tooLarge", { file: file.name }));

  // Keep the original if it is already a small JPEG and re-encoding didn't help.
  if (file.type === "image/jpeg" && file.size <= blob.size &&
      Math.max(img.naturalWidth, img.naturalHeight) <= MAX_SIDE) {
    blob = file;
  }
  return new File([blob], baseName + ".jpg", { type: "image/jpeg" });
}

// ---- Character cards ------------------------------------------------------
function kidAgeField(n, selected) {
  return `<label class="age-field"><span data-i18n="card.howOld">${t("card.howOld")}</span>
    <select name="fi-select-char${n}Age">
      ${CHILD_AGES.map((a) => `<option value="${a.id}" ${a.id === (selected || "6-9") ? "selected" : ""} data-i18n="age.${a.id}">${t("age." + a.id)}</option>`).join("")}
    </select>
  </label>`;
}

function buildCard(index) {
  const n = index + 1; // 1-based for field names and file names
  const card = document.createElement("div");
  card.className = "character-card";
  card.dataset.index = String(index);
  const roleOpts = ROLES.map((r) =>
    `<option value="${r.id}" ${r.id === "child" ? "selected" : ""} data-i18n="role.${r.id}">${t("role." + r.id)}</option>`
  ).join("");
  // The file input has no name on purpose: compressed copies are added on submit as fi-file-photos[].
  card.innerHTML = `
    <h3 data-i18n="card.title" data-i18n-vars='{"n":${n}}'>${t("card.title", { n })}</h3>
    <label><span data-i18n="card.who">${t("card.who")}</span>
      <select name="fi-select-char${n}Role" class="role-select">${roleOpts}</select>
    </label>
    <label><span data-i18n="card.name">${t("card.name")}</span>
      <input type="text" name="fi-text-char${n}Name" class="name-input" maxlength="40" required placeholder="${t("card.namePlaceholder")}" data-i18n-placeholder="card.namePlaceholder" />
    </label>
    <div class="age-wrap">${kidAgeField(n, "6-9")}</div>
    <label><span data-i18n="card.photo">${t("card.photo")}</span>
      <input type="file" class="photo-input" accept="image/*" required />
    </label>
    <p class="hint photo-status" data-i18n="photo.hint">${t("photo.hint")}</p>
  `;
  const roleSel = card.querySelector(".role-select");
  const ageWrap = card.querySelector(".age-wrap");
  roleSel.addEventListener("change", () => {
    const kid = roleSel.value === "child";
    ageWrap.innerHTML = kid ? kidAgeField(n, "6-9") : "";
  });

  const fileInput = card.querySelector(".photo-input");
  const photoStatus = card.querySelector(".photo-status");
  fileInput.addEventListener("change", () => {
    const files = [...(fileInput.files || [])];
    fileInput.setCustomValidity("");
    photoStatus.classList.remove("warn");
    if (!files.length) {
      photoJobs[index] = null;
      I18N.set(photoStatus, "photo.hint");
      return;
    }
    if (files.length > MAX_PHOTOS_PER_CHARACTER) {
      photoJobs[index] = null;
      fileInput.setCustomValidity(t("photo.oneOnlyBubble"));
      fileInput.reportValidity();
      I18N.set(photoStatus, "photo.oneOnly");
      photoStatus.classList.add("warn");
      return;
    }
    I18N.set(photoStatus, "photo.preparing");
    // Compress right away so problems show up here, not at the end.
    const job = Promise.all(files.map((f, k) => compressPhoto(f, `c${n}-${k + 1}`)));
    photoJobs[index] = job;
    job.then((packed) => {
      if (photoJobs[index] !== job) return; // superseded by a newer selection
      const size = packed.reduce((sum, f) => sum + f.size, 0);
      I18N.set(photoStatus, packed.length > 1 ? "photo.readyMany" : "photo.readyOne", { count: packed.length, size: formatMB(size) });
    }).catch((err) => {
      if (photoJobs[index] !== job) return;
      I18N.setText(photoStatus, err.message);
      photoStatus.classList.add("warn");
    });
  });
  return card;
}

function showPerson(i) {
  currentPerson = i;
  [...peopleEl.children].forEach((el, idx) => {
    el.classList.toggle("hidden", idx !== i);
  });
  if (totalPeople === 1) I18N.set(personProgress, "progress.single");
  else I18N.set(personProgress, "progress.many", { n: i + 1, total: totalPeople });
  I18N.set(nextPersonBtn, i === totalPeople - 1 ? "btn.toStory" : "btn.nextChar");
}

// Adds or removes cards to match totalPeople, keeping what was already filled in.
function syncPeople() {
  while (peopleEl.children.length > totalPeople) {
    peopleEl.lastElementChild.remove();
  }
  photoJobs.length = Math.min(photoJobs.length, totalPeople);
  for (let i = peopleEl.children.length; i < totalPeople; i += 1) {
    peopleEl.appendChild(buildCard(i));
  }
  showPerson(0);
}

// Returns an error message for character i, or "" if it is complete.
async function checkCharacter(i, focus) {
  const card = peopleEl.children[i];
  const nameEl = card.querySelector(".name-input");
  const fileInput = card.querySelector(".photo-input");
  nameEl.value = nameEl.value.trim();
  const fail = (el, msg) => {
    if (focus) {
      showPerson(i);
      el.setCustomValidity(msg);
      el.reportValidity();
      el.addEventListener("input", () => el.setCustomValidity(""), { once: true });
    }
    return msg;
  };
  if (!nameEl.value) return fail(nameEl, t("check.charName"));
  if (!fileInput.files || !fileInput.files.length) return fail(fileInput, t("check.photoMissing"));
  if (fileInput.files.length > MAX_PHOTOS_PER_CHARACTER || !photoJobs[i]) {
    return fail(fileInput, t("check.photoOne"));
  }
  try {
    await photoJobs[i];
  } catch (err) {
    return fail(fileInput, err.message);
  }
  return "";
}

// ---- Step navigation ------------------------------------------------------
document.getElementById("start-people").addEventListener("click", () => {
  if (!validateContact()) return;
  totalPeople = Math.min(6, Math.max(1, parseInt(document.getElementById("char-count").value, 10) || 1));
  syncPeople();
  stepCount.classList.add("hidden");
  stepPerson.classList.remove("hidden");
});

document.getElementById("prev-person").addEventListener("click", () => {
  if (currentPerson === 0) {
    stepPerson.classList.add("hidden");
    stepCount.classList.remove("hidden");
    return;
  }
  showPerson(currentPerson - 1);
});

nextPersonBtn.addEventListener("click", async () => {
  nextPersonBtn.disabled = true;
  const problem = await checkCharacter(currentPerson, true);
  nextPersonBtn.disabled = false;
  if (problem) return;
  if (currentPerson === totalPeople - 1) {
    stepPerson.classList.add("hidden");
    stepBook.classList.remove("hidden");
    return;
  }
  showPerson(currentPerson + 1);
});

document.getElementById("back-book").addEventListener("click", () => {
  stepBook.classList.add("hidden");
  stepPerson.classList.remove("hidden");
  showPerson(totalPeople - 1);
});

// ---- Submit ---------------------------------------------------------------
function friendlyError(error) {
  const code = Number(error && error.code);
  const msg = String((error && error.message) || "");
  if (code === 429 || /rate|too many/i.test(msg)) {
    return t("err.rate");
  }
  if (code === 413 || /too large|size/i.test(msg)) {
    return t("err.tooLargeTotal");
  }
  if (code === 0 || /network|failed to fetch/i.test(msg)) {
    return t("err.network");
  }
  if (code === 401 || code === 403 || code === 404) {
    return t("err.setup");
  }
  if (code === 400 || code === 422) {
    return msg ? t("err.rejectedMsg", { msg }) : t("err.rejected");
  }
  return msg ? t("err.genericMsg", { msg }) : t("err.generic");
}

function setSending(on) {
  sending = on;
  go.disabled = on;
  document.getElementById("back-book").disabled = on;
  I18N.set(go, on ? "btn.sending" : "btn.request");
  form.setAttribute("aria-busy", on ? "true" : "false");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (sending) return;

  if (!FORM_READY) {
    setStatus(t("status.notConnected"), "warn");
    return;
  }
  if (typeof window.Forminit !== "function") {
    setStatus(t("status.sdkMissing"), "warn");
    return;
  }

  // Bots fill the honeypot; pretend success and send nothing.
  if (form.elements._gotcha.value) {
    window.location.href = "thanks.html";
    return;
  }

  setSending(true);
  setStatus(t("status.checking"));
  try {
    // 1. Validate contact details (visible above every step).
    if (!validateContact()) throw new Error(t("status.checkDetails"));

    // 2. Validate every character and collect the compressed photos.
    const photos = [];
    const castLines = [];
    for (let i = 0; i < totalPeople; i += 1) {
      const problem = await checkCharacter(i, false);
      if (problem) {
        stepBook.classList.add("hidden");
        stepPerson.classList.remove("hidden");
        await checkCharacter(i, true); // show the bubble on that card
        throw new Error(t("status.charProblem", { n: i + 1, problem }));
      }
      const card = peopleEl.children[i];
      const name = card.querySelector(".name-input").value.trim();
      const roleSel = card.querySelector(".role-select");
      const ageSel = card.querySelector(".age-field select");
      const packed = await photoJobs[i];
      // Prefix file names with the character's name so they're easy to match up.
      packed.forEach((f, k) => {
        photos.push(new File([f], `c${i + 1}-${slug(name)}-${k + 1}${f.name.slice(f.name.lastIndexOf("."))}`, { type: f.type }));
      });
      // English labels for the submission, whatever language the page is shown in.
      const role = ROLES.find((r) => r.id === roleSel.value).label;
      const age = ageSel ? ", " + CHILD_AGES.find((a) => a.id === ageSel.value).label : "";
      castLines.push(`${i + 1}. ${name} (${role}${age}) — ${packed.length} photo${packed.length > 1 ? "s" : ""}`);
    }

    // 3. Total size check (Forminit limit: 25 MB per submission).
    const total = photos.reduce((sum, f) => sum + f.size, 0);
    if (total > MAX_TOTAL_BYTES) {
      throw new Error(t("status.totalTooBig", { total: formatMB(total), limit: formatMB(MAX_TOTAL_BYTES) }));
    }

    // 4. Build the submission. Named fields come straight from the form
    //    (fi-sender-*, fi-select-*, fi-text-*, _gotcha); photos are added separately.
    const data = new FormData(form);
    data.set("fi-select-characterCount", String(totalPeople));
    if (!data.get("fi-sender-company")) data.delete("fi-sender-company");
    if (!data.get("fi-text-notes")) data.delete("fi-text-notes");
    data.set("fi-text-cast", castLines.join("\n"));
    // Page language the visitor used (e.g. "pt-PT"), so the book can be made in it.
    // Not "fi-text-language": Forminit rejects duplicate names and fi-select-language exists.
    data.set("fi-text-siteLanguage", I18N.lang);
    photos.forEach((f) => data.append("fi-file-photos[]", f, f.name));

    setStatus(t(photos.length > 1 ? "status.sendingMany" : "status.sendingOne", { count: photos.length, size: formatMB(total) }));
    const { error } = await new window.Forminit().submit(FORM_ID, data);
    if (error) {
      console.error("Forminit error", error);
      throw new Error(friendlyError(error));
    }
    window.location.href = "thanks.html";
  } catch (err) {
    setStatus(err.message || t("status.couldNotSend"), "warn");
    setSending(false);
  }
});

// ---- Language switch --------------------------------------------------------
// i18n.js has already re-translated everything marked with data-i18n; only the
// tab title set above needs refreshing.
document.addEventListener("i18n:change", setBrandTitle);
