// Free sample storybook request form → Forminit (https://forminit.com).
// Static site, no build step. Photos are shrunk in the browser before upload.

const ROLES = [
  { id: "child", label: "Child" },
  { id: "parent", label: "Parent" },
  { id: "grandparent", label: "Grandparent" },
  { id: "uncle", label: "Uncle" },
  { id: "aunt", label: "Aunt" },
  { id: "cousin", label: "Cousin" },
  { id: "pet", label: "Pet" },
  { id: "other", label: "Other" },
];
const CHILD_AGES = [
  { id: "baby", label: "Baby (under 1)" },
  { id: "toddler", label: "Toddler (1–2)" },
  { id: "3-5", label: "3–5 years" },
  { id: "6-9", label: "6–9 years" },
  { id: "10-12", label: "10–12 years" },
];

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

if (SITE.brand) {
  document.title = SITE.brand + " — free sample storybook";
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
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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
  nameInput.setCustomValidity(nameInput.value ? "" : "Please add your name.");
  emailInput.setCustomValidity(validEmail(emailInput.value) ? "" : "Please add a valid email address so we can send the book.");
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
    throw new Error(`“${file.name}” could not be read. Please use a JPEG or PNG photo.`);
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
  if (!blob) throw new Error(`“${file.name}” is too large to send. Please choose a smaller photo.`);

  // Keep the original if it is already a small JPEG and re-encoding didn't help.
  if (file.type === "image/jpeg" && file.size <= blob.size &&
      Math.max(img.naturalWidth, img.naturalHeight) <= MAX_SIDE) {
    blob = file;
  }
  return new File([blob], baseName + ".jpg", { type: "image/jpeg" });
}

// ---- Character cards ------------------------------------------------------
function kidAgeField(n, selected) {
  return `<label class="age-field">How old?
    <select name="fi-select-char${n}Age">
      ${CHILD_AGES.map((a) => `<option value="${a.id}" ${a.id === (selected || "6-9") ? "selected" : ""}>${a.label}</option>`).join("")}
    </select>
  </label>`;
}

function buildCard(index) {
  const n = index + 1; // 1-based for field names and file names
  const card = document.createElement("div");
  card.className = "character-card";
  card.dataset.index = String(index);
  const roleOpts = ROLES.map((r) =>
    `<option value="${r.id}" ${r.id === "child" ? "selected" : ""}>${r.label}</option>`
  ).join("");
  // The file input has no name on purpose: compressed copies are added on submit as fi-file-photos[].
  card.innerHTML = `
    <h3>Character ${n}</h3>
    <label>Who is this?
      <select name="fi-select-char${n}Role" class="role-select">${roleOpts}</select>
    </label>
    <label>Name
      <input type="text" name="fi-text-char${n}Name" class="name-input" maxlength="40" required placeholder="Name" />
    </label>
    <div class="age-wrap">${kidAgeField(n, "6-9")}</div>
    <label>Photos (1–${MAX_PHOTOS_PER_CHARACTER})
      <input type="file" class="photo-input" accept="image/*" multiple required />
    </label>
    <p class="hint photo-status">Close-up of the face (or pet’s head). More than one angle helps.</p>
  `;
  const roleSel = card.querySelector(".role-select");
  const ageWrap = card.querySelector(".age-wrap");
  roleSel.addEventListener("change", () => {
    const kid = roleSel.value === "child" || roleSel.value === "cousin";
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
      photoStatus.textContent = "Close-up of the face (or pet’s head). More than one angle helps.";
      return;
    }
    if (files.length > MAX_PHOTOS_PER_CHARACTER) {
      photoJobs[index] = null;
      fileInput.setCustomValidity(`Please choose up to ${MAX_PHOTOS_PER_CHARACTER} photos for this character.`);
      fileInput.reportValidity();
      photoStatus.textContent = `Too many photos — up to ${MAX_PHOTOS_PER_CHARACTER}, please.`;
      photoStatus.classList.add("warn");
      return;
    }
    photoStatus.textContent = "Preparing photos…";
    // Compress right away so problems show up here, not at the end.
    const job = Promise.all(files.map((f, k) => compressPhoto(f, `c${n}-${k + 1}`)));
    photoJobs[index] = job;
    job.then((packed) => {
      if (photoJobs[index] !== job) return; // superseded by a newer selection
      const size = packed.reduce((sum, f) => sum + f.size, 0);
      photoStatus.textContent = `${packed.length} photo${packed.length > 1 ? "s" : ""} ready (${formatMB(size)}).`;
    }).catch((err) => {
      if (photoJobs[index] !== job) return;
      photoStatus.textContent = err.message;
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
  personProgress.textContent = totalPeople === 1 ? "Who is in the book" : `Character ${i + 1} of ${totalPeople}`;
  nextPersonBtn.textContent = i === totalPeople - 1 ? "Continue to the story" : "Next character";
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
  if (!nameEl.value) return fail(nameEl, "Please add a name.");
  if (!fileInput.files || !fileInput.files.length) return fail(fileInput, "Please add at least one photo.");
  if (fileInput.files.length > MAX_PHOTOS_PER_CHARACTER || !photoJobs[i]) {
    return fail(fileInput, `Please choose 1–${MAX_PHOTOS_PER_CHARACTER} photos.`);
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
    return "Please wait about 30 seconds and press Send again.";
  }
  if (code === 413 || /too large|size/i.test(msg)) {
    return "The photos are too large together. Try fewer photos per character.";
  }
  if (code === 0 || /network|failed to fetch/i.test(msg)) {
    return "Could not reach the server. Check your connection and try again.";
  }
  if (code === 401 || code === 403 || code === 404) {
    return "The form is not set up correctly on our side. Please email us instead.";
  }
  if (code === 400 || code === 422) {
    return "Something in the form was not accepted" + (msg ? ": " + msg : ".") + " Please check and try again.";
  }
  return "Sorry, something went wrong" + (msg ? " (" + msg + ")" : "") + ". Please try again.";
}

function setSending(on) {
  sending = on;
  go.disabled = on;
  document.getElementById("back-book").disabled = on;
  go.textContent = on ? "Sending…" : "Request my sample book";
  form.setAttribute("aria-busy", on ? "true" : "false");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (sending) return;

  if (!FORM_READY) {
    setStatus("This form is not connected yet: add the Forminit form ID in config.js.", "warn");
    return;
  }
  if (typeof window.Forminit !== "function") {
    setStatus("The sending service did not load (an ad blocker can cause this). Please disable it for this page, or reload.", "warn");
    return;
  }

  // Bots fill the honeypot; pretend success and send nothing.
  if (form.elements._gotcha.value) {
    window.location.href = "thanks.html";
    return;
  }

  setSending(true);
  setStatus("Checking your details…");
  try {
    // 1. Validate contact details (visible above every step).
    if (!validateContact()) throw new Error("Please check your details above.");

    // 2. Validate every character and collect the compressed photos.
    const photos = [];
    const castLines = [];
    for (let i = 0; i < totalPeople; i += 1) {
      const problem = await checkCharacter(i, false);
      if (problem) {
        stepBook.classList.add("hidden");
        stepPerson.classList.remove("hidden");
        await checkCharacter(i, true); // show the bubble on that card
        throw new Error(`Character ${i + 1}: ${problem}`);
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
      const role = roleSel.options[roleSel.selectedIndex].text;
      const age = ageSel ? ", " + ageSel.options[ageSel.selectedIndex].text : "";
      castLines.push(`${i + 1}. ${name} (${role}${age}) — ${packed.length} photo${packed.length > 1 ? "s" : ""}`);
    }

    // 3. Total size check (Forminit limit: 25 MB per submission).
    const total = photos.reduce((sum, f) => sum + f.size, 0);
    if (total > MAX_TOTAL_BYTES) {
      throw new Error(`The photos add up to ${formatMB(total)}; the limit is ${formatMB(MAX_TOTAL_BYTES)}. Please use fewer photos.`);
    }

    // 4. Build the submission. Named fields come straight from the form
    //    (fi-sender-*, fi-select-*, fi-text-*, _gotcha); photos are added separately.
    const data = new FormData(form);
    data.set("fi-select-characterCount", String(totalPeople));
    if (!data.get("fi-sender-company")) data.delete("fi-sender-company");
    if (!data.get("fi-text-notes")) data.delete("fi-text-notes");
    data.set("fi-text-cast", castLines.join("\n"));
    photos.forEach((f) => data.append("fi-file-photos[]", f, f.name));

    setStatus(`Sending ${photos.length} photo${photos.length > 1 ? "s" : ""} (${formatMB(total)})… please keep this page open.`);
    const { error } = await new window.Forminit().submit(FORM_ID, data);
    if (error) {
      console.error("Forminit error", error);
      throw new Error(friendlyError(error));
    }
    window.location.href = "thanks.html";
  } catch (err) {
    setStatus(err.message || "Could not send. Please try again.", "warn");
    setSending(false);
  }
});
