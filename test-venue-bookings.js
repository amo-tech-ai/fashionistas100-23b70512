const SUPABASE_URL = 'https://vuvfqjhkppmbdeqsflbn.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk';

fetch(`${SUPABASE_URL}/rest/v1/venue_bookings?select=*&limit=5`, {
  headers: {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  }
})
.then(r => r.json())
.then(data => {
  console.log('Venue Bookings Response:', JSON.stringify(data, null, 2));
  console.log('Type:', typeof data);
  console.log('Is Array:', Array.isArray(data));
});
