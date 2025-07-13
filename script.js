<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quick Follow-Up Scheduler</title>
  <link rel="stylesheet" href="styles.css" />
  <script>
    window.neetoCal = window.neetoCal || {
      embed: function() {
        (neetoCal.q = neetoCal.q || []).push(arguments);
      }
    };
  </script>
  <script async src="https://cdn.neetocal.com/javascript/embed.js"></script>
</head>
<body>
  <!-- Loader Overlay -->
  <div id="loader">
    <div class="spinner"></div>
  </div>

  <!-- Main Container -->
  <div class="container" style="display:none;">
    <h1>Find Your Name</h1>
    <div class="input-group">
      <label for="name-input">Your Name</label>
      <input
        type="text"
        id="name-input"
        placeholder="Start typing..."
        autocomplete="off"
      />
      <datalist id="names"></datalist>
    </div>
    <button id="open-popup-button" disabled>
      Open Scheduling Calendar
    </button>
  </div>

  <!-- External Script -->
  <script src="script.js"></script>
</body>
</html>
