// Check user_profiles table structure
async function checkUserProfilesTable() {
  try {
    console.log('🔍 Checking user_profiles table structure...');
    
    const response = await fetch('https://api.supabase.com/v1/projects/vuvfqjhkppmbdeqsflbn/database/query', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sbp_7024d97cbc348845b3f00c74c103c6010dc360a8',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          -- Check if table exists and get its structure
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = 'user_profiles' 
          AND table_schema = 'public';
        `
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ user_profiles table structure:');
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.error('❌ Failed to check table:', result);
    }

  } catch (err) {
    console.error('Check failed:', err);
  }
}

checkUserProfilesTable();
