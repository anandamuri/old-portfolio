function updateClock() {
  const now = new Date();
  const options = { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
  document.getElementById('clock').innerHTML = `ann arbor - <span class="small-time">${timeString}</span>`;
}
setInterval(updateClock, 1000);
updateClock();
