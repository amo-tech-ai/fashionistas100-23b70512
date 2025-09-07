import https from 'https';

const PROJECT_REF = 'vuvfqjhkppmbdeqsflbn';
const ACCESS_TOKEN = 'sbp_7024d97cbc348845b3f00c74c103c6010dc360a8';

// Insert test user profile
const SQL_QUERY = `
-- Insert a test profile for the authenticated user
INSERT INTO user_profiles (clerk_user_id, email, full_name, role)
VALUES (
  'user_320k5lHz9hVFhfN6kusiDay8jTE',
  'ai@socialmediaville.ca',
  'S K',
  'organizer'
)
ON CONFLICT (clerk_user_id) 
DO UPDATE SET 
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

-- Also ensure the user exists in the users table
INSERT INTO users (clerk_id, email, first_name, last_name, username, role)
VALUES (
  'user_320k5lHz9hVFhfN6kusiDay8jTE',
  'ai@socialmediaville.ca',
  'S',
  'K',
  'sk_admin',
  'organizer'
)
ON CONFLICT (clerk_id)
DO UPDATE SET
  email = EXCLUDED.email,
  last_seen = NOW(),
  updated_at = NOW();

SELECT 'User profile created/updated successfully' as status;
`;

async function createUserProfile() {
  console.log('📝 Creating/Updating user profile...\n');
  
  const data = JSON.stringify({ query: SQL_QUERY });
  
  const options = {
    hostname: 'api.supabase.com',
    port: 443,
    path: `/v1/projects/${PROJECT_REF}/database/query`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('✅ User profile created/updated!\n');
            console.log('Now refresh the integration test page.');
            resolve(result);
          } else {
            console.error('❌ Failed:', result);
            reject(new Error(JSON.stringify(result)));
          }
        } catch (e) {
          console.error('❌ Error:', e);
          reject(e);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request failed:', error);
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

createUserProfile()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));