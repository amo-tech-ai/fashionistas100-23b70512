-- Create complete designer data: auth users -> profiles -> designer_profiles
-- 1) Create auth.users for our sample designers (if not exists)
DO $$
DECLARE
    user_id_1 uuid := '550e8400-e29b-41d4-a716-446655440001';
    user_id_2 uuid := '550e8400-e29b-41d4-a716-446655440002';
    user_id_3 uuid := '550e8400-e29b-41d4-a716-446655440003';
BEGIN
    -- Insert sample auth users
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, confirmation_token, recovery_token, 
        email_change_token_new, email_change, phone, phone_confirmed_at, 
        raw_app_meta_data, raw_user_meta_data, is_super_admin, 
        created_at, updated_at, phone_change, phone_change_token, 
        email_change_token_current, email_change_confirm_status, 
        banned_until, reauthentication_token, reauthentication_sent_at
    )
    VALUES
        (
            '00000000-0000-0000-0000-000000000000', user_id_1, 'authenticated', 'authenticated',
            'alessandro@rossicouture.com', crypt('samplepassword', gen_salt('bf')),
            now(), '', '', '', '', null, null,
            '{"provider":"email","providers":["email"]}',
            '{"brand_name":"Rossi Couture"}',
            false, now(), now(), '', '', '', 0, null, '', null
        ),
        (
            '00000000-0000-0000-0000-000000000000', user_id_2, 'authenticated', 'authenticated',
            'sofia@chenstudios.com', crypt('samplepassword', gen_salt('bf')),
            now(), '', '', '', '', null, null,
            '{"provider":"email","providers":["email"]}',
            '{"brand_name":"Chen Studios"}',
            false, now(), now(), '', '', '', 0, null, '', null
        ),
        (
            '00000000-0000-0000-0000-000000000000', user_id_3, 'authenticated', 'authenticated',
            'maya@laurentparis.com', crypt('samplepassword', gen_salt('bf')),
            now(), '', '', '', '', null, null,
            '{"provider":"email","providers":["email"]}',
            '{"brand_name":"Laurent Paris"}',
            false, now(), now(), '', '', '', 0, null, '', null
        )
    ON CONFLICT (id) DO NOTHING;

    -- 2) Create profiles
    INSERT INTO public.profiles (id, email, full_name, profile_visibility)
    VALUES
        (user_id_1, 'alessandro@rossicouture.com', 'Alessandro Rossi', 'public'),
        (user_id_2, 'sofia@chenstudios.com', 'Sofia Chen', 'public'),
        (user_id_3, 'maya@laurentparis.com', 'Maya Laurent', 'public')
    ON CONFLICT (id) DO NOTHING;

    -- 3) Create designer profiles
    INSERT INTO public.designer_profiles (
        user_id, brand_name, brand_slug, bio, website_url, portfolio_urls, social_links, is_verified
    )
    VALUES
        (
            user_id_1, 'Rossi Couture', 'rossi-couture',
            'Italian haute couture with timeless silhouettes crafted with precision and luxury fabrics. Over 15 years of experience creating pieces for global elite.',
            'https://rossicouture.com',
            ARRAY[
                'https://images.unsplash.com/photo-1542718610-a1d656d1884b?w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1510678960173-b2f28be1d00d?w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=800&auto=format&fit=crop'
            ]::text[],
            '{"instagram":"https://instagram.com/rossicouture","website":"https://rossicouture.com"}'::jsonb,
            true
        ),
        (
            user_id_2, 'Chen Studios', 'chen-studios',
            'Sustainable fashion with innovative materials and ethical production methods. Revolutionizing the industry with eco-friendly designs.',
            'https://chenstudios.com',
            ARRAY[
                'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1537832816519-689ad163238b?w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop'
            ]::text[],
            '{"instagram":"https://instagram.com/chenstudios","website":"https://chenstudios.com"}'::jsonb,
            true
        ),
        (
            user_id_3, 'Laurent Paris', 'laurent-paris',
            'Parisian elegance in modern ready-to-wear for the contemporary woman. Sophisticated pieces with timeless appeal.',
            'https://laurentparis.com',
            ARRAY[
                'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1520975661595-6453be3f7070?w=800&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1548426166-5f32dba0d7b3?w=800&auto=format&fit=crop'
            ]::text[],
            '{"instagram":"https://instagram.com/laurentparis","website":"https://laurentparis.com"}'::jsonb,
            true
        )
    ON CONFLICT (brand_slug) DO NOTHING;

    -- 4) Add constraints and triggers if not present
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'designer_profiles_brand_slug_key'
    ) THEN
        ALTER TABLE public.designer_profiles
            ADD CONSTRAINT designer_profiles_brand_slug_key UNIQUE (brand_slug);
    END IF;

    -- Add triggers
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger t
        JOIN pg_class c ON c.oid = t.tgrelid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE t.tgname = 'set_updated_at_designer_profiles'
            AND c.relname = 'designer_profiles' AND n.nspname = 'public'
    ) THEN
        CREATE TRIGGER set_updated_at_designer_profiles
            BEFORE UPDATE ON public.designer_profiles
            FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger t
        JOIN pg_class c ON c.oid = t.tgrelid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE t.tgname = 'generate_designer_slug_trigger'
            AND c.relname = 'designer_profiles' AND n.nspname = 'public'
    ) THEN
        CREATE TRIGGER generate_designer_slug_trigger
            BEFORE INSERT OR UPDATE ON public.designer_profiles
            FOR EACH ROW EXECUTE FUNCTION public.generate_designer_slug();
    END IF;
END$$;