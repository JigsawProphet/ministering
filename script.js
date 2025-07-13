// script.js
(function() {
  const ORG_SLUG = "cherry-hill-1st-elders-quorum";
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSM4nBsrNsbNXMgaLFoBC9oqM34ZAaP2HPAXX9NlDqnRkt3gQJNSp3V_Hg61X5Nua4ORtd_W_h_oXRz/pub?output=csv";
  let roster = [];

  // Parse CSV text into array of row objects
  function parseCSV(text) {
    const lines = text.trim().split("\n");
    const headers = lines.shift().split(",").map(h => h.trim());
    return lines.map(line => {
      const cols = line.split(",").map(c => c.trim());
      return headers.reduce((obj, h, i) => {
        obj[h] = cols[i] || "";
        return obj;
      }, {});
    });
  }

  // DOM elements
  const loader    = document.getElementById("loader");
  const container = document.querySelector(".container");
  const nameInput = document.getElementById("name-input");
  const datalist  = document.getElementById("names");
  const button    = document.getElementById("open-popup-button");

  // Load and process sheet data
  fetch(CSV_URL)
    .then(res => res.text())
    .then(text => {
      const rows = parseCSV(text);
      // Use a Map to dedupe and associate names to calendar IDs
      const nameMap = new Map();
      rows.forEach(row => {
        const id = row["Calendar ID"];
        const c1 = `${row["Companion 1 FN"] || ""} ${row["Companion 1 LN"] || ""}`.trim();
        const c2 = `${row["Companion 2 FN"] || ""} ${row["Compantion 2 LN"] || ""}`.trim();
        if (c1) nameMap.set(c1, id);
        if (c2) nameMap.set(c2, id);
      });
      // Build roster array
      roster = Array.from(nameMap, ([name, calendarId]) => ({ name, calendarId }));
      // Populate datalist options (only from the four name columns)
      roster.forEach(({ name }) => {
        const opt = document.createElement("option");
        opt.value = name;
        datalist.appendChild(opt);
      });
    })
    .catch(err => console.error("Failed to load sheet:", err))
    .finally(() => {
      loader.style.display = "none";
      container.style.display = "block";
    });

  // Input event: show suggestions & enable button on exact match
  nameInput.addEventListener("input", () => {
    const val = nameInput.value.trim();
    if (val.length > 0) {
      nameInput.setAttribute("list", "names");
    } else {
      nameInput.removeAttribute("list");
    }
    const lower = val.toLowerCase();
    const match = roster.find(item => item.name.toLowerCase() === lower);
    if (match) {
      button.disabled = false;
      neetoCal.embed({
        type: "elementClick",
        id: match.calendarId,
        organization: ORG_SLUG,
        elementSelector: "#open-popup-button"
      });
    } else {
      button.disabled = true;
    }
  });
})();
