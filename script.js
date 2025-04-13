function updateClock() {
  const now = new Date();
  const options = { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
  document.getElementById('clock').innerHTML = `ann arbor - <span class="small-time">${timeString}</span>`;
}
setInterval(updateClock, 1000);
updateClock();


document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  function setTheme(mode) {
      if (mode === "light") {
          document.body.classList.remove("dark-mode");
          document.body.classList.add("light-mode");
          themeIcon.src = "assets/icons/moon-icon.png";
          localStorage.setItem("theme", "light");
      } else {
          document.body.classList.remove("light-mode");
          document.body.classList.add("dark-mode");
          themeIcon.src = "assets/icons/sun-icon.png";
          localStorage.setItem("theme", "dark");
      }
  }

  themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
      setTheme(currentTheme === "dark" ? "light" : "dark");
  });

  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);
});

document.addEventListener("DOMContentLoaded", function () {
  const umichButton = document.getElementById("umich-hover");
  if (umichButton) {
      umichButton.addEventListener("click", function () {
          window.location.href = "classes/";
      });
  }

  const moviesButton = document.getElementById("movies-hover");
  if (moviesButton) {
      moviesButton.addEventListener("click", function () {
          window.location.href = "movies/";
      });
  }

  const readingButton = document.getElementById("reading-hover");
  if (readingButton) {
    readingButton.addEventListener("click", function () {
          window.location.href = "reading/";
      });
  }
});
