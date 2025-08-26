-- Ensure stable search_path on venue slug function
CREATE OR REPLACE FUNCTION public.generate_venue_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(COALESCE(NEW.venue_name,''), '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := btrim(NEW.slug, '-');

    -- Ensure uniqueness
    WHILE EXISTS (
      SELECT 1 FROM public.venues WHERE slug = NEW.slug AND id <> COALESCE(NEW.id, gen_random_uuid())
    ) LOOP
      NEW.slug := NEW.slug || '-' || extract(epoch FROM now())::int;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$function$;