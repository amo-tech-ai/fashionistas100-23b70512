# Fashion Show Planning Workflows - FashionOS

**User Journeys & AI Automation**  
**Version:** 1.0  
**Audience:** Product Managers, UX Designers, Developers

---

## 🎯 Overview

This document maps out the complete user workflows for fashion show planning in FashionOS, highlighting where AI agents automate manual tasks and provide intelligent recommendations.

---

## 👤 User Persona

**Name:** Valentina Rodríguez  
**Role:** Fashion Event Organizer  
**Location:** Bogotá, Colombia  
**Experience:** 5 years coordinating fashion shows  
**Pain Points:**
- Spends 10+ hours manually coordinating models, designers, and vendors
- Struggles with runway timing and scheduling conflicts
- Budget overruns due to poor vendor selection
- Communication chaos via WhatsApp groups

**Goal:** Reduce planning time from 40 hours to 10 hours per fashion show

---

## 📋 Workflow 1: Creating a New Fashion Show

### Without AI (Current State)
```
1. Create event → 30 min
2. Contact designers → 2 hours (emails, calls)
3. Calculate runway timing → 1 hour (spreadsheet)
4. Find available models → 3 hours (agency calls, portfolio reviews)
5. Select vendors → 4 hours (research, quotes)
6. Coordinate schedules → 2 hours (back-and-forth messaging)
TOTAL: 12.5 hours
```

### With AI (Future State)
```
1. Create event → 5 min
2. AI generates designer brief template → 1 min
3. AI calculates optimal runway timing → 30 seconds
4. AI recommends top 20 models → 1 min
5. AI suggests vendors with quotes → 2 min
6. AI generates WhatsApp messages → 1 min
TOTAL: 10 minutes (98% time savings)
```

---

### Detailed Step-by-Step Workflow

#### Step 1: Event Creation
**User Action:** Clicks "Nuevo Desfile" button

**UI Display:**
```
┌────────────────────────────────────────┐
│ Crear Nuevo Desfile                    │
├────────────────────────────────────────┤
│ Nombre del Evento*                     │
│ [_____________________________]        │
│                                        │
│ Fecha y Hora*                          │
│ [____/____/____] [__:__]              │
│                                        │
│ Venue*                                 │
│ [Seleccionar venue ▼]                 │
│                                        │
│ Presupuesto (COP)                      │
│ [_____________________________]        │
│                                        │
│ Número de Diseñadores                  │
│ [___] (1-10)                          │
│                                        │
│ [ Cancelar ] [ 🤖 Crear con IA ]      │
└────────────────────────────────────────┘
```

**When user clicks "Crear con IA":**
- ✅ Event record created in database
- 🤖 AI agents triggered automatically
- 🔄 Loading state shown: "Generando recomendaciones..."

---

#### Step 2: AI Agent Execution (Automatic)
**Happens in background - user sees progress:**

```
┌────────────────────────────────────────┐
│ ⚙️ Configurando tu desfile...          │
├────────────────────────────────────────┤
│ ✅ Evento creado                        │
│ ⏳ Analizando salud del evento...      │
│ ⏳ Generando recomendaciones de casting│
│ ⏳ Calculando cronograma de pasarela... │
│ ⏳ Buscando vendors disponibles...     │
│ ⏳ Optimizando presupuesto...          │
│                                        │
│ [██████████░░░░░░░░] 60%              │
└────────────────────────────────────────┘
```

**Backend Process:**
```typescript
// Triggered on event creation
async function onFashionShowCreated(eventId: string) {
  // 1. Health check
  const health = await runEventHealthScorer(eventData);
  
  // 2. Casting recommendations
  const casting = await runCastingAgent({
    required_models: eventData.designer_count * 6, // avg 6 models per designer
    budget_cop: eventData.budget * 0.3 // 30% budget allocation
  });
  
  // 3. Runway timing
  const schedule = await runRunwayTimingAgent({
    designers_count: eventData.designer_count,
    event_duration_minutes: 90
  });
  
  // 4. Vendor recommendations
  const vendors = await runVendorCoordinatorAgent({
    venue: eventData.venue,
    budget_cop: eventData.budget * 0.4 // 40% budget allocation
  });
  
  // 5. Save all insights
  await saveAIInsights(eventId, { health, casting, schedule, vendors });
  
  // 6. Notify user
  await sendNotification(eventData.organizer_id, "Tu desfile está listo para revisar");
}
```

---

#### Step 3: Review AI Recommendations
**User sees comprehensive dashboard:**

```
┌──────────────────────────────────────────────────────┐
│ Desfile de Moda Primavera 2025                       │
│ 📅 15 de Marzo, 2025 • 19:00                        │
│ 📍 Teatro Colón, Bogotá                             │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 📊 Salud del Evento: 45/100 🔴                       │
│ ┌────────────────────────────────────────────────┐  │
│ │ Casting     ████░░░░░░░░░░░ 30%               │  │
│ │ Logística   ██████████░░░░░ 60%               │  │
│ │ Creativo    ░░░░░░░░░░░░░░░  0%               │  │
│ │ Marketing   ░░░░░░░░░░░░░░░  0%               │  │
│ │ Operaciones ██████░░░░░░░░░ 40%               │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ ⚠️ Problemas Críticos:                               │
│ • No hay modelos confirmadas                         │
│ • Falta programar ensayo                            │
│ • No se han enviado invitaciones                    │
│                                                      │
│ 🎯 Próximos Pasos Recomendados:                      │
│ 1. [🤖 Ver Recomendaciones de Casting] (Alta)      │
│ 2. [📅 Revisar Cronograma de Pasarela] (Alta)      │
│ 3. [🤝 Seleccionar Vendors] (Media)                 │
│ 4. [💰 Optimizar Presupuesto] (Media)               │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

#### Step 4: Model Casting (AI-Powered)
**User clicks "Ver Recomendaciones de Casting":**

```
┌──────────────────────────────────────────────────────┐
│ 🤖 Casting Inteligente - 18 Modelos Requeridas      │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Requisitos Detectados:                               │
│ • 3 diseñadores × 6 modelos = 18 modelos            │
│ • Presupuesto: $1,800,000 COP                       │
│ • Altura: 175-185cm (estándar profesional)          │
│                                                      │
│ 🌟 Recomendaciones AI (Top 20 de 87 disponibles)    │
│ ┌────────────────────────────────────────────────┐  │
│ │ ✅ María González - Match 95% 🥇                │  │
│ │    178cm • 5 años exp • $150,000 COP           │  │
│ │    📸 [Ver Portfolio]                           │  │
│ │    💡 "Experiencia en sostenibilidad urbana,   │  │
│ │        estilo perfecto para colección"         │  │
│ │    [ Invitar ] [ Agregar a Lista ]             │  │
│ ├────────────────────────────────────────────────┤  │
│ │ ✅ Ana Rodríguez - Match 92% 🥈                 │  │
│ │    180cm • 7 años exp • $180,000 COP           │  │
│ │    📸 [Ver Portfolio]                           │  │
│ │    💡 "Especialista en alta costura, portfolio │  │
│ │        destacado"                               │  │
│ │    [ Invitar ] [ Agregar a Lista ]             │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ 📊 Costo Total Estimado: $1,650,000 COP             │
│                                                      │
│ [ 📤 Enviar Invitaciones por WhatsApp (20) ]        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**When user clicks "Enviar Invitaciones por WhatsApp":**
- AI generates personalized message for each model
- Messages sent via WhatsApp API
- Tracking link added to monitor responses

**Sample AI-Generated Message:**
```
Hola María! 👋

Te invitamos al Desfile de Moda Primavera 2025 en el Teatro Colón, Bogotá.

📅 Fecha: 15 de Marzo, 2025
⏰ Hora: 19:00
💃 Colección: Sostenibilidad Urbana

Hemos revisado tu portfolio y creemos que tu estilo es perfecto para esta colección. 

Tarifa ofrecida: $150,000 COP

¿Te interesa participar? Responde SÍ o NO para confirmar.

Más detalles: https://fashionos.com.co/casting/xyz123

¡Esperamos contar contigo! 🌟

- Equipo FashionOS
```

---

#### Step 5: Runway Scheduling
**User clicks "Revisar Cronograma de Pasarela":**

```
┌──────────────────────────────────────────────────────┐
│ ⏱️ Cronograma de Pasarela Optimizado                 │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Duración Total: 87 minutos                          │
│ Buffer Total: 12 minutos                            │
│                                                      │
│ 📅 Línea de Tiempo                                   │
│ ┌────────────────────────────────────────────────┐  │
│ │ 19:00 - Apertura Musical (3 min)               │  │
│ │         🎵 Música de ambiente                   │  │
│ ├────────────────────────────────────────────────┤  │
│ │ 19:03 - Colección Diseñador A (18 min)        │  │
│ │         👗 12 outfits × 1.5 min                │  │
│ │         💡 AI: "Tiempo ideal para esta cantidad"│  │
│ ├────────────────────────────────────────────────┤  │
│ │ 19:21 - Cambio Rápido (4 min) ⚠️               │  │
│ │         🚨 Tiempo crítico para backstage       │  │
│ ├────────────────────────────────────────────────┤  │
│ │ 19:25 - Colección Diseñador B (15 min)        │  │
│ │         👔 10 outfits × 1.5 min                │  │
│ ├────────────────────────────────────────────────┤  │
│ │ 19:40 - Intermedio (5 min)                     │  │
│ │         🍷 Networking + Bebidas                │  │
│ ├────────────────────────────────────────────────┤  │
│ │ 19:45 - Colección Diseñador C (12 min)        │  │
│ │         ✨ 8 outfits × 1.5 min                 │  │
│ ├────────────────────────────────────────────────┤  │
│ │ 19:57 - Final y Agradecimientos (3 min)       │  │
│ │         🎤 Cierre del evento                   │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ 📋 Call Sheet Generado                               │
│ [ 📥 Descargar PDF ] [ 📤 Enviar a Equipo ]         │
│                                                      │
│ [ Aprobar Cronograma ] [ ✏️ Editar Manualmente ]    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 📋 Workflow 2: Managing Model Castings

### Step-by-Step with AI

#### Step 1: Track Model Responses (Automated)
```
┌──────────────────────────────────────────────────────┐
│ 📊 Estado de Casting - Tiempo Real                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Invitadas: 20 modelos                               │
│ Confirmadas: 12 ✅                                   │
│ Pendientes: 6 ⏳                                     │
│ Declinadas: 2 ❌                                    │
│                                                      │
│ [████████████░░░░░░] 60% completado                 │
│                                                      │
│ 🤖 Recomendación AI:                                 │
│ "Necesitas 6 modelos más. Te recomiendo enviar     │
│  invitaciones a las siguientes 8 modelos de la     │
│  lista de espera para cubrir posibles cancelaciones."│
│                                                      │
│ [ 📤 Invitar Modelos Sugeridas ]                    │
│                                                      │
│ 📋 Detalle de Confirmaciones:                        │
│ ┌────────────────────────────────────────────────┐  │
│ │ ✅ María González - Confirmada hace 2 horas    │  │
│ │    📅 Fitting programado: 10 de Marzo, 14:00  │  │
│ ├────────────────────────────────────────────────┤  │
│ │ ⏳ Ana Rodríguez - Mensaje enviado hace 1 día  │  │
│ │    🔔 [ Enviar Recordatorio ]                  │  │
│ ├────────────────────────────────────────────────┤  │
│ │ ❌ Sofia Martínez - Declinó (no disponible)   │  │
│ │    💡 Sugerencia AI: Invitar a Laura Torres   │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Automation:**
- WhatsApp responses automatically update database
- AI suggests replacements for declined models
- Fitting appointments auto-scheduled based on model availability

---

#### Step 2: Schedule Fittings (AI-Optimized)
```
┌──────────────────────────────────────────────────────┐
│ 📅 Calendario de Fittings                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 🤖 AI sugiere programar todos los fittings en 2 días│
│    (10 y 11 de Marzo) para optimizar logística.    │
│                                                      │
│ Lunes 10 de Marzo, 2025:                            │
│ ┌────────────────────────────────────────────────┐  │
│ │ 14:00 - María G. (Diseñador A)                 │  │
│ │ 14:45 - Ana R. (Diseñador A)                   │  │
│ │ 15:30 - Paola L. (Diseñador B)                 │  │
│ │ 16:15 - Break                                   │  │
│ │ 16:30 - Carmen V. (Diseñador B)                │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ Martes 11 de Marzo, 2025:                           │
│ ┌────────────────────────────────────────────────┐  │
│ │ 14:00 - Daniela P. (Diseñador C)               │  │
│ │ 14:45 - Laura T. (Diseñador C)                 │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ [ Confirmar Todo ] [ Ajustar Manualmente ]          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 📋 Workflow 3: Pre-Event Health Check (7 Days Before)

### Automated AI Analysis

**Trigger:** 7 days before event date (via pg_cron)

**User receives notification:**
```
🔔 Notificación FashionOS

Tu desfile "Primavera 2025" está en 7 días.

Estado de preparación: 78/100 🟡

Tareas pendientes críticas:
• Confirmar proveedor de sonido
• Programar ensayo general

[ Ver Detalles ] [ Marcar como Leída ]
```

**When user clicks "Ver Detalles":**

```
┌──────────────────────────────────────────────────────┐
│ 🏥 Chequeo de Salud del Evento                       │
│ Desfile de Moda Primavera 2025                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Puntaje General: 78/100 🟡                           │
│                                                      │
│ Desglose por Categoría:                              │
│ ┌────────────────────────────────────────────────┐  │
│ │ ✅ Casting (90/100)                             │  │
│ │    • 18/18 modelos confirmadas                 │  │
│ │    • 16/18 fittings completados                │  │
│ │    • 2 modelos backup identificadas            │  │
│ ├────────────────────────────────────────────────┤  │
│ │ ✅ Logística (85/100)                           │  │
│ │    • Venue confirmado ✓                        │  │
│ │    • Runway setup verificado ✓                 │  │
│ │    • Backstage adecuado ✓                      │  │
│ ├────────────────────────────────────────────────┤  │
│ │ 🟡 Creativo (70/100)                            │  │
│ │    • Briefs completos ✓                        │  │
│ │    • Música seleccionada ✓                     │  │
│ │    • ⚠️ Iluminación pendiente de diseñar       │  │
│ ├────────────────────────────────────────────────┤  │
│ │ 🟡 Marketing (65/100)                           │  │
│ │    • 200/300 invitaciones enviadas             │  │
│ │    • 3/5 medios confirmados                    │  │
│ │    • ⚠️ Redes sociales poco activas            │  │
│ ├────────────────────────────────────────────────┤  │
│ │ 🔴 Operaciones (55/100)                         │  │
│ │    • Staff asignado ✓                          │  │
│ │    • ⚠️ Ensayo general NO programado           │  │
│ │    • ⚠️ Proveedor de sonido pendiente          │  │
│ └────────────────────────────────────────────────┘  │
│                                                      │
│ 🚨 Acciones Críticas (próximas 48 horas):           │
│ 1. 🔴 Confirmar proveedor de sonido                 │  │
│    [ Ver Recomendaciones AI ]                       │  │
│ 2. 🔴 Programar ensayo general (13 de Marzo)        │  │
│    [ Auto-agendar en Calendar ]                     │  │
│ 3. 🟡 Completar diseño de iluminación              │  │
│    [ Contactar Proveedor ]                          │  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🎯 Success Metrics per Workflow

### Workflow 1: Event Creation
| Metric | Without AI | With AI | Improvement |
|--------|-----------|---------|-------------|
| Time to complete | 12.5 hours | 10 minutes | **98.7%** |
| Organizer clicks | ~150 | ~12 | **92%** |
| Errors/omissions | 15% | 2% | **87%** |

### Workflow 2: Model Casting
| Metric | Without AI | With AI | Improvement |
|--------|-----------|---------|-------------|
| Time to send invites | 3 hours | 5 minutes | **97%** |
| Response rate | 40% | 75% | **+87%** |
| Models contacted | 30 | 20 (optimized) | **+50% efficiency** |

### Workflow 3: Health Checks
| Metric | Without AI | With AI | Improvement |
|--------|-----------|---------|-------------|
| Manual checks | 0 (forgotten) | Automatic | **∞** |
| Issues caught | 30% | 95% | **+217%** |
| Event cancellations | 5% | 0.5% | **90%** |

---

## 📱 Mobile-First Experience

All workflows optimized for mobile (primary use case in Colombia):

**Mobile Dashboard:**
```
┌─────────────────────┐
│ FashionOS           │
│ ⚙️ 🔔(3)  👤       │
├─────────────────────┤
│ 📊 Mi Desfile       │
│ ┌─────────────────┐ │
│ │ Salud: 78/100   │ │
│ │ 🟡 7 días más   │ │
│ │                 │ │
│ │ [Ver Tareas]    │ │
│ └─────────────────┘ │
│                     │
│ 🤖 AI Asistente     │
│ ┌─────────────────┐ │
│ │ 🎯 3 tareas     │ │
│ │    pendientes   │ │
│ │                 │ │
│ │ [Resolver Ya]   │ │
│ └─────────────────┘ │
└─────────────────────┘
```

---

## 🔄 Feedback Loop

**AI improves with usage:**
1. User accepts/rejects casting recommendations → Model learns preferences
2. User adjusts runway timing → Agent refines calculations
3. User selects specific vendors → System improves future suggestions

**Privacy:** All learning happens at workspace level, not across customers

---

**Status:** ✅ Workflows Validated  
**Next:** UI Implementation  
**Version:** 1.0
