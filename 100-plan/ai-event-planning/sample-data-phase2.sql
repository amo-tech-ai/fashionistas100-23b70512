-- Phase 2: Sample Runway Schedules
-- Run this AFTER sample-data.sql to add runway schedules to test events

-- Sample runway schedule for Colombia Fashion Week 2025
INSERT INTO public.runway_schedules (
  event_id,
  schedule_name,
  total_duration_minutes,
  designers,
  transitions,
  backstage_calls,
  ai_optimization_score,
  ai_reasoning,
  status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'Main Show Schedule - Opening Night',
  90,
  '[
    {
      "designer_name": "María Fernanda Rodríguez",
      "slot_start": "20:00",
      "slot_end": "20:20",
      "looks_count": 12,
      "backstage_time": "19:30"
    },
    {
      "designer_name": "Valentina Castro",
      "slot_start": "20:25",
      "slot_end": "20:40",
      "looks_count": 10,
      "backstage_time": "19:50"
    },
    {
      "designer_name": "Isabella Moreno",
      "slot_start": "20:45",
      "slot_end": "21:05",
      "looks_count": 14,
      "backstage_time": "20:10"
    },
    {
      "designer_name": "Camila Vargas",
      "slot_start": "21:10",
      "slot_end": "21:30",
      "looks_count": 11,
      "backstage_time": "20:35"
    }
  ]'::jsonb,
  '[
    {
      "from_designer": "María Fernanda Rodríguez",
      "to_designer": "Valentina Castro",
      "duration_minutes": 5,
      "type": "music_change"
    },
    {
      "from_designer": "Valentina Castro",
      "to_designer": "Isabella Moreno",
      "duration_minutes": 5,
      "type": "lighting_setup"
    },
    {
      "from_designer": "Isabella Moreno",
      "to_designer": "Camila Vargas",
      "duration_minutes": 5,
      "type": "stage_reset"
    }
  ]'::jsonb,
  '[
    {
      "designer": "María Fernanda Rodríguez",
      "call_time": "19:00",
      "notes": "Primera en runway - llegada temprana para setup de modelos"
    },
    {
      "designer": "Valentina Castro",
      "call_time": "19:30",
      "notes": "Segunda colección - preparación de accesorios"
    },
    {
      "designer": "Isabella Moreno",
      "call_time": "19:45",
      "notes": "Colección más grande - requiere más tiempo backstage"
    },
    {
      "designer": "Camila Vargas",
      "call_time": "20:00",
      "notes": "Cierre de primera noche - verificar finale"
    }
  ]'::jsonb,
  94,
  'Schedule optimizado para maximizar flow del show. Transiciones cortas de 5 minutos mantienen momentum. Primera diseñadora recibe 30 min extra para setup. Colección más grande de Isabella ubicada estratégicamente en medio para engagement máximo. Buffer times permiten ajustes sin retrasar show completo.',
  'approved'
);

-- Sample runway schedule for Medellín Fashion Night
INSERT INTO public.runway_schedules (
  event_id,
  schedule_name,
  total_duration_minutes,
  designers,
  transitions,
  backstage_calls,
  ai_optimization_score,
  ai_reasoning,
  status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'Intimate Evening Show',
  60,
  '[
    {
      "designer_name": "Sofía Hernández",
      "slot_start": "19:30",
      "slot_end": "19:50",
      "looks_count": 10,
      "backstage_time": "19:00"
    },
    {
      "designer_name": "Daniela Gómez",
      "slot_start": "19:55",
      "slot_end": "20:10",
      "looks_count": 8,
      "backstage_time": "19:20"
    },
    {
      "designer_name": "Laura Martínez",
      "slot_start": "20:15",
      "slot_end": "20:30",
      "looks_count": 9,
      "backstage_time": "19:40"
    }
  ]'::jsonb,
  '[
    {
      "from_designer": "Sofía Hernández",
      "to_designer": "Daniela Gómez",
      "duration_minutes": 5,
      "type": "quick_transition"
    },
    {
      "from_designer": "Daniela Gómez",
      "to_designer": "Laura Martínez",
      "duration_minutes": 5,
      "type": "lighting_adjustment"
    }
  ]'::jsonb,
  '[
    {
      "designer": "Sofía Hernández",
      "call_time": "18:45",
      "notes": "Apertura - coordinación con DJ para música de entrada"
    },
    {
      "designer": "Daniela Gómez",
      "call_time": "19:00",
      "notes": "Colección sostenible - verificar presentación eco-friendly"
    },
    {
      "designer": "Laura Martínez",
      "call_time": "19:15",
      "notes": "Cierre del show - coordinar finale con todas las diseñadoras"
    }
  ]'::jsonb,
  91,
  'Formato íntimo requiere ritmo dinámico. Cada diseñadora recibe tiempo adecuado sin sobrecargar audiencia pequeña. Transiciones rápidas mantienen energía alta. Total de 60 minutos ideal para evento boutique en venue privado.',
  'published'
);

-- Draft schedule for Bogotá Bridal Week (being optimized)
INSERT INTO public.runway_schedules (
  event_id,
  schedule_name,
  total_duration_minutes,
  designers,
  transitions,
  backstage_calls,
  ai_optimization_score,
  ai_reasoning,
  status
) VALUES (
  '550e8400-e29b-41d4-a716-446655440003',
  'Bridal Collections Showcase - Draft',
  120,
  '[
    {
      "designer_name": "Ana María Silva",
      "slot_start": "18:00",
      "slot_end": "18:25",
      "looks_count": 15,
      "backstage_time": "17:30"
    },
    {
      "designer_name": "Gabriela Torres",
      "slot_start": "18:30",
      "slot_end": "18:55",
      "looks_count": 16,
      "backstage_time": "17:55"
    },
    {
      "designer_name": "Paula Jiménez",
      "slot_start": "19:00",
      "slot_end": "19:20",
      "looks_count": 12,
      "backstage_time": "18:25"
    },
    {
      "designer_name": "Carolina Sánchez",
      "slot_start": "19:25",
      "slot_end": "19:50",
      "looks_count": 14,
      "backstage_time": "18:50"
    },
    {
      "designer_name": "Natalia Ramírez",
      "slot_start": "19:55",
      "slot_end": "20:00",
      "looks_count": 3,
      "backstage_time": "19:20"
    }
  ]'::jsonb,
  '[
    {
      "from_designer": "Ana María Silva",
      "to_designer": "Gabriela Torres",
      "duration_minutes": 5,
      "type": "runway_reset"
    },
    {
      "from_designer": "Gabriela Torres",
      "to_designer": "Paula Jiménez",
      "duration_minutes": 5,
      "type": "lighting_change"
    },
    {
      "from_designer": "Paula Jiménez",
      "to_designer": "Carolina Sánchez",
      "duration_minutes": 5,
      "type": "music_transition"
    },
    {
      "from_designer": "Carolina Sánchez",
      "to_designer": "Natalia Ramírez",
      "duration_minutes": 5,
      "type": "finale_prep"
    }
  ]'::jsonb,
  '[
    {
      "designer": "Ana María Silva",
      "call_time": "17:00",
      "notes": "Primera colección nupcial - requiere fitting final de vestidos"
    },
    {
      "designer": "Gabriela Torres",
      "call_time": "17:30",
      "notes": "Colección más grande - coordinación de velos y accesorios"
    },
    {
      "designer": "Paula Jiménez",
      "call_time": "17:55",
      "notes": "Diseños modernos - verificar iluminación para detalles"
    },
    {
      "designer": "Carolina Sánchez",
      "call_time": "18:20",
      "notes": "Colección clásica - preparación de cola de vestidos"
    },
    {
      "designer": "Natalia Ramírez",
      "call_time": "18:45",
      "notes": "Finale especial - coordinación con todas las diseñadoras"
    }
  ]'::jsonb,
  88,
  'Schedule para evento nupcial largo requiere timing preciso debido a complejidad de vestidos. Colecciones más grandes al inicio cuando audiencia está fresca. Finale corto (3 looks) con todos los diseñadores cierra el show. Backstage time extendido para cambios complejos de vestidos de novia.',
  'draft'
);
