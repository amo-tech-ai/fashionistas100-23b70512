import https from 'https';

const PROJECT_REF = 'vuvfqjhkppmbdeqsflbn';
const ACCESS_TOKEN = 'sbp_7024d97cbc348845b3f00c74c103c6010dc360a8';

async function executeSql(sql) {
  const data = JSON.stringify({ query: sql });
  
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.supabase.io',
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, res => {
      let response = '';
      res.on('data', chunk => response += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200 && res.statusCode !== 201) {
          console.error(`HTTP ${res.statusCode}: ${response}`);
          reject(new Error(`API request failed: ${res.statusCode}`));
          return;
        }
        
        try {
          const result = JSON.parse(response);
          resolve(result);
        } catch (e) {
          console.error('JSON Parse Error. Response:', response);
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function analyzeAndUpdateSchema() {
  console.log('🔍 Analyzing existing sponsorship schema...\n');
  
  try {
    // Test connection
    const test = await executeSql('SELECT 1 as test;');
    console.log('✅ Connected to Supabase\n');
    
    // Check existing tables
    const tables = await executeSql(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'sponsor%'
      ORDER BY table_name;
    `);
    
    console.log('📊 Existing Sponsor Tables:');
    tables.forEach(t => console.log(`  ✓ ${t.table_name}`));
    
    // Check if we need the new tables
    const requiredTables = [
      'sponsor_activations',
      'sponsor_digital_assets',
      'sponsor_brand_guidelines',
      'sponsor_placements'
    ];
    
    const existingTableNames = tables.map(t => t.table_name);
    const missingTables = requiredTables.filter(t => !existingTableNames.includes(t));
    
    if (missingTables.length > 0) {
      console.log('\n⚠️ Missing Tables to Create:');
      missingTables.forEach(t => console.log(`  - ${t}`));
      console.log('\n🔨 Creating missing tables...\n');
      
      // Create the new tables
      await createSponsorActivationsTables();
    } else {
      console.log('\n✅ All required tables exist');
    }
    
    // Verify final state
    const finalCount = await executeSql(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'sponsor%';
    `);
    
    console.log(`\n✅ Total sponsor tables: ${finalCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function createSponsorActivationsTables() {
  try {
    // 1. Create sponsor_activations table
    console.log('Creating sponsor_activations table...');
    await executeSql(`
      CREATE TABLE IF NOT EXISTS public.sponsor_activations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sponsorship_id UUID REFERENCES sponsorships(id) ON DELETE CASCADE,
        activation_type TEXT NOT NULL CHECK (activation_type IN (
          'logo_website', 'logo_event', 'logo_banner', 'logo_screen',
          'social_media', 'email_campaign', 'booth', 'speaking',
          'product_sampling', 'vip_experience', 'branded_content',
          'livestream', 'mobile_app', 'signage', 'custom'
        )),
        placement_location TEXT,
        description TEXT,
        start_date DATE,
        end_date DATE,
        impressions_estimate INTEGER,
        actual_impressions INTEGER,
        engagement_metrics JSONB DEFAULT '{}',
        status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ sponsor_activations created');
    
    // 2. Create sponsor_digital_assets table
    console.log('Creating sponsor_digital_assets table...');
    await executeSql(`
      CREATE TABLE IF NOT EXISTS public.sponsor_digital_assets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE,
        asset_type TEXT NOT NULL CHECK (asset_type IN (
          'logo_primary', 'logo_secondary', 'logo_mono', 'logo_inverse',
          'banner', 'social_media', 'video', 'product_image',
          'executive_photo', 'booth_render', 'other'
        )),
        file_name TEXT NOT NULL,
        file_url TEXT NOT NULL,
        file_size INTEGER,
        mime_type TEXT,
        dimensions JSONB,
        color_space TEXT,
        usage_rights TEXT,
        expiry_date DATE,
        is_approved BOOLEAN DEFAULT FALSE,
        metadata JSONB DEFAULT '{}',
        uploaded_by UUID,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ sponsor_digital_assets created');
    
    // 3. Create sponsor_brand_guidelines table
    console.log('Creating sponsor_brand_guidelines table...');
    await executeSql(`
      CREATE TABLE IF NOT EXISTS public.sponsor_brand_guidelines (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sponsor_id UUID REFERENCES sponsors(id) ON DELETE CASCADE,
        brand_colors JSONB DEFAULT '{}',
        typography JSONB DEFAULT '{}',
        logo_usage_rules TEXT,
        minimum_clear_space TEXT,
        prohibited_usage TEXT,
        brand_voice TEXT,
        tagline TEXT,
        boilerplate TEXT,
        social_handles JSONB DEFAULT '{}',
        guidelines_document_url TEXT,
        version TEXT,
        is_current BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ sponsor_brand_guidelines created');
    
    // 4. Create sponsor_placements table
    console.log('Creating sponsor_placements table...');
    await executeSql(`
      CREATE TABLE IF NOT EXISTS public.sponsor_placements (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        activation_id UUID REFERENCES sponsor_activations(id) ON DELETE CASCADE,
        placement_type TEXT NOT NULL CHECK (placement_type IN (
          'website_header', 'website_footer', 'website_sidebar', 'website_banner',
          'email_header', 'email_footer', 'email_body',
          'social_post', 'social_story', 'social_profile',
          'event_entrance', 'event_stage', 'event_screen', 'event_backdrop',
          'event_program', 'event_badge', 'event_lanyard',
          'mobile_app_splash', 'mobile_app_banner', 'mobile_app_menu'
        )),
        placement_details JSONB DEFAULT '{}',
        display_order INTEGER,
        click_through_url TEXT,
        tracking_code TEXT,
        performance_data JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('  ✓ sponsor_placements created');
    
    // 5. Add indexes
    console.log('Creating indexes...');
    await executeSql(`
      CREATE INDEX IF NOT EXISTS idx_activations_sponsorship ON sponsor_activations(sponsorship_id);
      CREATE INDEX IF NOT EXISTS idx_activations_type ON sponsor_activations(activation_type);
      CREATE INDEX IF NOT EXISTS idx_activations_status ON sponsor_activations(status);
      CREATE INDEX IF NOT EXISTS idx_digital_assets_sponsor ON sponsor_digital_assets(sponsor_id);
      CREATE INDEX IF NOT EXISTS idx_digital_assets_type ON sponsor_digital_assets(asset_type);
      CREATE INDEX IF NOT EXISTS idx_brand_guidelines_sponsor ON sponsor_brand_guidelines(sponsor_id);
      CREATE INDEX IF NOT EXISTS idx_placements_activation ON sponsor_placements(activation_id);
      CREATE INDEX IF NOT EXISTS idx_placements_type ON sponsor_placements(placement_type);
    `);
    console.log('  ✓ Indexes created');
    
    // 6. Update sponsors table to add missing columns if needed
    console.log('\nUpdating sponsors table...');
    await executeSql(`
      ALTER TABLE sponsors 
      ADD COLUMN IF NOT EXISTS brand_assets_complete BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS activation_preferences JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS preferred_placements TEXT[] DEFAULT '{}';
    `);
    console.log('  ✓ sponsors table updated');
    
    // 7. Update sponsorships table
    console.log('Updating sponsorships table...');
    await executeSql(`
      ALTER TABLE sponsorships
      ADD COLUMN IF NOT EXISTS activation_budget NUMERIC(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS activation_status TEXT DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS roi_target JSONB DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS performance_metrics JSONB DEFAULT '{}';
    `);
    console.log('  ✓ sponsorships table updated');
    
    console.log('\n✅ All tables and columns created successfully!');
    
  } catch (error) {
    console.error('Error creating tables:', error.message);
    throw error;
  }
}

// Run the analysis and update
analyzeAndUpdateSchema();