function updateClock() {
  const now = new Date();
  const options = { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
  document.getElementById('clock').textContent = `Ann Arbor - ${new Intl.DateTimeFormat('en-US', options).format(now)}`;
}
setInterval(updateClock, 1000);
updateClock();