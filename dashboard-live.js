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
  if (locations && stats.locales?.length) {
    const max = Math.max(...stats.locales.map(item => item.visitors), 1);
    locations.innerHTML = stats.locales.map(item => `<div><span>◉</span><b>${item.location}</b><em>${item.visitors} visitors</em><i style="width:${Math.round(item.visitors / max * 76)}%"></i></div>`).join('');
  }
  document.querySelector('.dashboard-heading p:not(.eyebrow)').textContent = 'Live totals from Mathly practice sessions.';
  document.querySelector('.live-pill').innerHTML = '<i></i> Live data';
  const locationPanel = document.querySelector('.locations')?.closest('.panel');
  if (locationPanel) { locationPanel.querySelector('.eyebrow').textContent = 'VISITOR LOCATIONS'; locationPanel.querySelector('h2').textContent = 'Top cities & states'; }
}
loadDashboard();
