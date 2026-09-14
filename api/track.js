const SUPABASE_URL = 'https://fuqyyveusbydgvjmseov.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_95bFu2FI4J8Dift9_m6DPw_1HR_zfPi';

module.exports = async (request, response) => {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const body = request.body || {};
  const city = decodeURIComponent(request.headers['x-vercel-ip-city'] || 'Unknown city');
  const region = decodeURIComponent(request.headers['x-vercel-ip-country-region'] || 'Unknown region');
  const country = request.headers['x-vercel-ip-country'] || 'Unknown';
  const event = { visitor_id: body.visitor_id, event_type: body.event_type, locale: body.locale || 'unknown', metadata: { ...(body.metadata || {}), city, region, country } };
  const result = await fetch(`${SUPABASE_URL}/rest/v1/analytics_events`, { method: 'POST', headers: { apikey: PUBLISHABLE_KEY, Authorization: `Bearer ${PUBLISHABLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(event) });
  response.status(result.ok ? 201 : 502).json({ ok: result.ok });
};
