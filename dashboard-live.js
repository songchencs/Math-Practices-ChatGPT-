async function loadDashboard() {
  const stats = await window.mathlyAnalytics.dashboard();
  if (!stats) return;
  const values = [stats.visitors, stats.problems, stats.sessions, `${stats.accuracy}%`];
  document.querySelectorAll('.metric-grid strong').forEach((node, index) => node.textContent = values[index]);
  const locations = document.querySelector('.locations');
  if (locations && stats.locales?.length) {
    const max = Math.max(...stats.locales.map(item => item.visitors), 1);
    locations.innerHTML = stats.locales.map(item => `<div><span>◉</span><b>${item.locale}</b><em>${item.visitors} visitors</em><i style="width:${Math.round(item.visitors / max * 76)}%"></i></div>`).join('');
  }
  document.querySelector('.dashboard-heading p:not(.eyebrow)').textContent = 'Live totals from Mathly practice sessions.';
  document.querySelector('.live-pill').innerHTML = '<i></i> Live data';
}
loadDashboard();
