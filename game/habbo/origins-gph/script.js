const STORAGE_KEY = "fragmentTracker";
const COUNT_KEY = "completedMaps";

const grid = document.getElementById("grid");
const mapCountEl = document.getElementById("mapCount");
const dupeList = document.getElementById("dupeList");
const missingList = document.getElementById("missingList");
const tradeList = document.getElementById("tradeList");
const mergeSound = document.getElementById("mergeSound");
const themeSelect = document.getElementById("themeSelect");
const compactToggle = document.getElementById("compactToggle");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

fetch("icons.svg")
  .then(res => res.text())
  .then(svg => document.body.insertAdjacentHTML("beforeend", svg));

function createGrid() {
  for (let i = 0; i < 24; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";

    const label = document.createElement("label");

    const icon = document.createElement("img");
    icon.src = "icons.svg#fragment";
    icon.setAttribute("src", "icons.svg");

    label.appendChild(icon);
    label.append(` Fragment ${i}`);

    const qty = document.createElement("input");
    qty.type = "number";
    qty.min = "0";
    qty.id = "qty_" + i;

    const row = document.createElement("div");
    row.className = "qty-row";

    const minus = document.createElement("button");
    minus.className = "qty-btn";
    minus.textContent = "-";

    const plus = document.createElement("button");
    plus.className = "qty-btn";
    plus.textContent = "+";

    minus.addEventListener("click", () => {
      qty.value = Math.max(0, parseInt(qty.value || 0) - 1);
      saveState();
    });

    plus.addEventListener("click", () => {
      qty.value = parseInt(qty.value || 0) + 1;
      saveState();
    });

    row.appendChild(minus);
    row.appendChild(qty);
    row.appendChild(plus);

    cell.appendChild(label);
    cell.appendChild(row);
    grid.appendChild(cell);
  }
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    JSON.parse(saved).forEach((item, i) => {
      document.getElementById("qty_" + i).value = item.qty;
    });
  }

  const savedCount = localStorage.getItem(COUNT_KEY);
  if (savedCount !== null) mapCountEl.textContent = savedCount;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.className = savedTheme;
    themeSelect.value = savedTheme;
  }

  if (localStorage.getItem("compactMode") === "true") {
    document.body.classList.add("compact");
  }

  updateProgress();
  highlightMissing();
  updateDuplicates();
  updateMissing();
  updateTradeSuggestions();
}

function saveState() {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({ qty: document.getElementById("qty_" + i).value });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  updateProgress();
  highlightMissing();
  updateDuplicates();
  updateMissing();
  updateTradeSuggestions();
}

function updateProgress() {
  let have = 0;
  for (let i = 0; i < 24; i++) {
    if (parseInt(document.getElementById("qty_" + i).value || 0) >= 1) have++;
  }
  const percent = Math.round((have / 24) * 100);
  progressFill.style.width = percent + "%";
  progressText.textContent = percent + "%";
}

function highlightMissing() {
  for (let i = 0; i < 24; i++) {
    const qty = parseInt(document.getElementById("qty_" + i).value || 0);
    grid.children[i].classList.toggle("missing", qty < 1);
  }
}

function updateDuplicates() {
  dupeList.innerHTML = "";

  let duplicates = [];

  for (let i = 0; i < 24; i++) {
    const qty = parseInt(document.getElementById("qty_" + i).value || 0);
    if (qty > 1) duplicates.push(i);
  }

  if (duplicates.length === 0) {
    dupeList.innerHTML = "<div class='dupe-item'>None</div>";
    return;
  }

  duplicates.forEach(num => {
    const div = document.createElement("div");
    div.className = "dupe-item";
    div.textContent = num;
    dupeList.appendChild(div);
  });
}

function updateMissing() {
  missingList.innerHTML = "";
  let missing = [];

  for (let i = 0; i < 24; i++) {
    if (parseInt(document.getElementById("qty_" + i).value || 0) === 0) {
      missing.push(i);
    }
  }

  if (missing.length === 0) {
    missingList.innerHTML = "<div class='missing-item'>None</div>";
    return;
  }

  missing.forEach(num => {
    const div = document.createElement("div");
    div.className = "missing-item";
    div.textContent = num;
    missingList.appendChild(div);
  });
}

function updateTradeSuggestions() {
  let duplicates = [];
  let missing = [];

  for (let i = 0; i < 24; i++) {
    const qty = parseInt(document.getElementById("qty_" + i).value || 0);
    if (qty > 1) duplicates.push(i);
    if (qty === 0) missing.push(i);
  }

  if (!duplicates.length || !missing.length) {
    tradeList.textContent = "None";
    return;
  }

  let output = "";
  let maxPairs = Math.min(duplicates.length, missing.length);

  for (let i = 0; i < maxPairs; i++) {
    output += `Trade Fragment ${duplicates[i]} → Fragment ${missing[i]}\n`;
  }

  tradeList.textContent = output;
}

function mergeMap() {
  for (let i = 0; i < 24; i++) {
    if (parseInt(document.getElementById("qty_" + i).value || 0) < 1) {
      alert("You need at least 1 of every fragment to merge a complete map.");
      return;
    }
  }

  for (let i = 0; i < 24; i++) {
    const qtyEl = document.getElementById("qty_" + i);
    qtyEl.value = Math.max(0, parseInt(qtyEl.value) - 1);
  }

  let count = parseInt(localStorage.getItem(COUNT_KEY) || "0");
  count++;
  localStorage.setItem(COUNT_KEY, count);
  mapCountEl.textContent = count;

  mergeSound.play();
  saveState();
}

function resetCounter() {
  if (!confirm("Reset completed map count?")) return;
  localStorage.setItem(COUNT_KEY, "0");
  mapCountEl.textContent = "0";
}

themeSelect.addEventListener("change", () => {
  document.body.className = themeSelect.value;
  localStorage.setItem("theme", themeSelect.value);
});

compactToggle.addEventListener("click", () => {
  document.body.classList.toggle("compact");
  localStorage.setItem("compactMode", document.body.classList.contains("compact"));
});

createGrid();
loadState();

document.getElementById("saveBtn").addEventListener("click", saveState);
document.getElementById("mergeBtn").addEventListener("click", mergeMap);
document.getElementById("resetBtn").addEventListener("click", resetCounter);
grid.addEventListener("change", saveState);
