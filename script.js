// ============================
// Configuration
// ============================
const CONFIG = {
  timeZone: 'America/Detroit',
  timeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    hourCycle: 'h12'
  }
};

// ============================
// Theme Management
// ============================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themes = ['dark', 'light'];
let currentThemeIndex = 0;

// Function to update the theme icon
function updateIconToNextTheme() {
    const nextThemeIndex = (currentThemeIndex + 1) % themes.length;
    const nextTheme = themes[nextThemeIndex];
    
    if (nextTheme === 'dark') {
        themeIcon.src = 'assets/moon-icon.png'; // Show moon icon in dark mode
        themeIcon.alt = 'Switch to Dark Mode';
    } else {
        themeIcon.src = 'assets/sun-icon.png'; // Show sun icon in light mode
        themeIcon.alt = 'Switch to Light Mode';
    }
}

// Function to apply the theme
function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    currentThemeIndex = themes.indexOf(theme);
    updateIconToNextTheme();

    // Change logo based on theme
    const logo = document.getElementById('theme-logo');
    if (theme === 'dark') {
        logo.src = 'assets/my-logo-dark.png'; // Dark mode logo
    } else {
        logo.src = 'assets/my-logo-light.png'; // Light mode logo
    }
}

// Load the theme from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light theme
    applyTheme(savedTheme);
});

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const newTheme = themes[(currentThemeIndex + 1) % themes.length];
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Save the theme to local storage
});

// ============================
// Language Management
// ============================
const translations = {
  en: {
    past: 'past',
    current: 'current',
    projects: 'projects',
    location: 'Ann Arbor, MI',
  },
  es: {
    past: 'pasado',
    current: 'presente',
    projects: 'proyectos',
    location: 'Ann Arbor, MI',
  },
  te: {
    past: 'గతం',
    current: 'ప్రస్తుతం',
    projects: 'ప్రాజెక్టులు',
    location: 'అన్నార్బర్, MI',
  },
  hi: {
    past: 'अतीत',
    current: 'वर्तमान',
    projects: 'परियोजनाएँ',
    location: 'ऐन आर्बर, MI',
  },
  zh: {
    past: '过去',
    current: '现在',
    projects: '项目',
    location: '安娜堡, MI',
  },
};

function initializeLanguageSwitcher() {
  const dropdown = document.getElementById('language-dropdown');
  dropdown.addEventListener('change', () => {
    const selectedLanguage = dropdown.value;
    updateLanguage(selectedLanguage);
  });
}

function updateLanguage(lang) {
  const content = translations[lang];
  if (!content) return;

  // Update sections
  document.querySelector('.section-title:nth-of-type(1)').textContent = content.past;
  document.querySelector('.section-title:nth-of-type(2)').textContent = content.current;
  document.querySelector('.section-title:nth-of-type(3)').textContent = content.projects;

  // Update location text
  const locationElement = document.getElementById('location-time');
  if (locationElement) {
    locationElement.childNodes[0].nodeValue = `${content.location} `;
  }
}

// ============================
// Initialize Everything
// ============================
document.addEventListener('DOMContentLoaded', () => {
  initializeLanguageSwitcher();
  initializeTimeDisplay();
  initializeSmoothScroll();
});

// ============================
// Time Display
// ============================
function initializeTimeDisplay() {
  // Update immediately
  updateTime();
  
  // Sync with the next second
  const now = new Date();
  const delay = 1000 - now.getMilliseconds();
  
  // Initial sync
  setTimeout(() => {
    updateTime();
    // Then update every second
    setInterval(updateTime, 1000);
  }, delay);
}

function updateTime() {
  const timeElement = document.getElementById('time');
  if (!timeElement) return;

  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Detroit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  
  timeElement.textContent = formatter.format(now);
}

// ============================
// Smooth Scrolling
// ============================
function initializeSmoothScroll() {
  document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', handleSmoothScroll);
  });
}

function handleSmoothScroll(e) {
  e.preventDefault();
  const targetId = this.getAttribute('href').substring(1);
  const targetElement = document.getElementById(targetId);
  
  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: 'smooth'
    });
  }
}

// Initialize immediately if DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initializeTimeDisplay();
} else {
  document.addEventListener('DOMContentLoaded', initializeTimeDisplay);
}
