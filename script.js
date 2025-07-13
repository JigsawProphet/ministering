(function() {
  const ORG_SLUG = "cherry-hill-1st-elders-quorum";
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSM4nBsrNsbNXMgaLFoBC9oqM34ZAaP2HPAXX9NlDqnRkt3gQJNSp3V_Hg61X5Nua4ORtd_W_h_oXRz/pub?output=csv";
  let roster = []; // will hold { name: string, calendarId: string }

  // Parse CSV text into an array of row objects
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
  const loader = document.getElementById("loader");
  const container = document.querySelector(".container");
  const nameInput = document.getElementById("name-input");
  const datalist  = document.getElementById("names");
  const button    = document.getElementById("open-popup-button");

  // Fetch CSV and build roster entries for each companion
  fetch(CSV_URL)
    .then(response => response.text())
    .then(text => {
      const rows = parseCSV(text);
      rows.forEach(row => {
        const calId = row["Calendar ID"];
        const comp1 = `${row["Companion 1 FN"]} ${row["Companion 1 LN"]}`.trim();
        const comp2 = `${row["Companion 2 FN"]} ${row["Companion 2 LN"]}`.trim();
        [comp1, comp2].forEach(name => {
          if (name) {
            roster.push({ name, calendarId: calId });
            const opt = document.createElement("option");
            opt.value = name;
            datalist.appendChild(opt);
          }
        });
      });
    })
    .catch(err => console.error("Failed to load sheet:", err))
    .finally(() => {
      loader.style.display = "none";
      container.style.display = "block";
    });

  // On input, enable button if there's an exact match and bind the correct calendar
  nameInput.addEventListener("input", () => {
    const val = nameInput.value.trim().toLowerCase();
    const match = roster.find(r => r.name.toLowerCase() === val);
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
