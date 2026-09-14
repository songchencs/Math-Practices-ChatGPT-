async function loadDashboard() {
  const cfg = window.MATHLY_SUPABASE;
  if (!cfg) return;
  const response = await fetch(`${cfg.url}/rest/v1/rpc/dashboard_stats`, {
    method: 'POST',
    headers: { apikey: cfg.publishableKey, Authorization: `Bearer ${cfg.publishableKey}`, 'Content-Type': 'application/json' },
    body: '{}'
  });
  if (!response.ok) return;
  const stats = await response.json();
  const values = [stats.visitors, stats.problems, stats.sessions, `${stats.accuracy}%`];
  document.querySelectorAll('.metric-grid strong').forEach((node, index) => node.textContent = values[index]);
  const locations = document.querySelector('.locations');
  const cityLocations = (stats.locales || []).filter(item => !/^[a-z]{2}-[A-Z]{2}$/.test(item.location));
  if (locations && cityLocations.length) {
    const max = Math.max(...cityLocations.map(item => item.visitors), 1);
    locations.innerHTML = cityLocations.map(item => `<div><span>◉</span><b>${item.location}</b><em>${item.visitors} visitors</em><i style="width:${Math.round(item.visitors / max * 76)}%"></i></div>`).join('');
  } else if (locations) {
    locations.innerHTML = '<div><span>◉</span><b>No city/state data yet</b><em>New visits will appear here</em><i style="width:0%"></i></div>';
  }
  document.querySelector('.dashboard-heading p:not(.eyebrow)').textContent = 'Live totals from Mathly practice sessions.';
  document.querySelector('.live-pill').innerHTML = '<i></i> Live data';
  const locationPanel = document.querySelector('.locations')?.closest('.panel');
  if (locationPanel) { locationPanel.querySelector('.eyebrow').textContent = 'VISITOR LOCATIONS'; locationPanel.querySelector('h2').textContent = 'Top cities & states'; }
}
loadDashboard();
