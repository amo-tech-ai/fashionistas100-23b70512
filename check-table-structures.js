const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dmZxamhrcHBtYmRlcXNmbGJuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE4MDg1NCwiZXhwIjoyMDcxNzU2ODU0fQ.3_qRzPY60ucVlhR5_9P292HmJVvmGEAgB38CPT2H7jk';

// Check attendees table
fetch('https://vuvfqjhkppmbdeqsflbn.supabase.co/rest/v1/attendees?limit=1', {
  headers: {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
  }
})
.then(r => r.json())
.then(data => {
  console.log('Attendees columns:', data[0] ? Object.keys(data[0]) : 'No data');
});

// Check bookings table
fetch('https://vuvfqjhkppmbdeqsflbn.supabase.co/rest/v1/bookings?limit=1', {
  headers: {
    'apikey': SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
  }
})
.then(r => r.json())
.then(data => {
  console.log('Bookings columns:', data[0] ? Object.keys(data[0]) : 'No data');
});
