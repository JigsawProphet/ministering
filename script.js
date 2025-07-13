// script.js
(function() {
  const ORG_SLUG = "cherry-hill-1st-elders-quorum";
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSM4nBsrNsbNXMgaLFoBC9oqM34ZAaP2HPAXX9NlDqnRkt3gQJNSp3V_Hg61X5Nua4ORtd_W_h_oXRz/pub?gid=0&single=true&output=csv";
  let roster = []; // will hold { name: string, calendarId: string }

  // Parse CSV text into array of row objects
  function parseCSV(text) {
    const lines = text.trim().split("\n");
    const headers = lines.shift().split(",").map(h => h.trim());
    return lines.map(line => {
      const cols = line.split(",").map(c => c.trim());
      const obj = {};
      headers.forEach((h, i) => obj[h] = cols[i] || "");
      return obj;
    });
  }

  // DOM references
  const loader    = document.getElementById("loader");
  const container = document.querySelector(".container");
  const nameInput = document.getElementById("name-input");
  const datalist  = document.getElementById("names");
  const button    = document.getElementById("open-popup-button");

  // Fetch sheet, build roster & datalist
  fetch(CSV_URL)
    .then(response => response.text())
    .then(text => {
      const rows = parseCSV(text);
      rows.forEach(row => {
        const calendarId = row["Calendar ID"];
        const companions = [row["Companion 1"], row["Companion 2"]];
        companions.forEach(fullName => {
          if (fullName) {
            roster.push({ name: fullName, calendarId });
            const opt = document.createElement("option");
            opt.value = fullName;
            datalist.appendChild(opt);
          }
        });
      });
    })
    .catch(err => console.error("Failed to load sheet:", err))
    .finally(() => {
      loader.style.display    = "none";
      container.style.display = "block";
    });

  // Show suggestions only once typing starts & enable on exact match
  nameInput.addEventListener("input", () => {
    const val = nameInput.value.trim();
    if (val.length > 0) {
      nameInput.setAttribute("list", "names");
    } else {
      nameInput.removeAttribute("list");
    }
    const lower = val.toLowerCase();
    const match = roster.find(r => r.name.toLowerCase() === lower);
    if (match) {
      button.disabled = false;
      window.neetoCal.embed({
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
