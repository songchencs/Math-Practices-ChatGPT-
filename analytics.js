const cfg = window.MATHLY_SUPABASE;
window.mathlyAnalytics = { track: async () => {}, dashboard: async () => null };
if (cfg?.url && cfg?.publishableKey && window.supabase) {
  const client = window.supabase.createClient(cfg.url, cfg.publishableKey);
  const visitorKey = 'mathly-visitor-id';
  const visitorId = localStorage.getItem(visitorKey) || crypto.randomUUID();
  localStorage.setItem(visitorKey, visitorId);
  const locale = navigator.language || 'unknown';
  window.mathlyAnalytics = {
    track: async (eventType, metadata = {}) => {
      const response = await fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visitor_id: visitorId, event_type: eventType, locale, metadata }) });
      if (!response.ok) console.warn('Analytics event was not recorded.');
    },
    dashboard: async () => {
      const { data, error } = await client.rpc('dashboard_stats');
      if (error) { console.warn('Dashboard data unavailable.', error.message); return null; }
      return data;
    }
  };
  window.mathlyAnalytics.track('visit');
}
