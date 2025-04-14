document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  function setTheme(mode) {
      if (mode === "light") {
          document.body.classList.remove("dark-mode");
          document.body.classList.add("light-mode");
          themeIcon.src = "../assets/icons/moon-icon.png";
          localStorage.setItem("theme", "light");
      } else {
          document.body.classList.remove("light-mode");
          document.body.classList.add("dark-mode");
          themeIcon.src = "../assets/icons/sun-icon.png";
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
    const redirects = {
      "umich-hover": "classes/",
      "movies-hover": "movies/",
      "reading-hover": "reading/"
    };
  
    for (const id in redirects) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("click", () => {
          window.location.href = redirects[id];
        });
      }
    }
  });
