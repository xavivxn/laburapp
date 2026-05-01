# Supabase Skill — Schema, Auth, RLS

## Setup (pasos del usuario, una sola vez)

1. **Crear proyecto** en [supabase.com/dashboard](https://supabase.com/dashboard) → "New project".
   - Region: la más cercana a Buenos Aires (`sa-east-1` São Paulo es la mejor opción AR).
   - Plan: Free para empezar.
2. **Copiar credenciales** desde *Project Settings → API*:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Crear `.env.local`** desde el example:
   ```bash
   cp .env.local.example .env.local
   # editar y pegar las dos claves
   ```
4. **Correr el schema inicial** (`supabase/migrations/0001_initial_schema.sql`):
   - Opción A (web): *SQL Editor → New query → pegar el archivo entero → Run*.
   - Opción B (CLI): `npx supabase link --project-ref <ref>` → `npx supabase db push`.
5. **Verificar**: en *Authentication → Providers* dejá habilitado solo `Email` por ahora.
   - En *Authentication → URL Configuration*, agregá tu URL de Vercel a `Site URL` y a `Redirect URLs`.
6. Redeploy en Vercel después de setear las env vars (`Production`, `Preview`, `Development`).

## Schema

Ver `supabase/migrations/0001_initial_schema.sql`. Tablas:

| Tabla | Propósito |
|---|---|
| `profiles` | Extiende `auth.users` con datos de perfil, skills, categorías, rol habilitado |
| `swipes` | Cada acción de descarte / match / super (uno por (swiper, target, role)) |
| `matches` | Par mutuo cuando ambos hicieron `match` (orden estable: `user_a_id < user_b_id`) |
| `messages` | Chat dentro de un match |
| `reviews` | Reseñas de un usuario sobre otro (1–5 estrellas) |

Tipos / enums:
- `swipe_action` enum: `pass | match | super`.

Triggers:
- `on_auth_user_created` → crea fila en `profiles` automáticamente al signup.
- `profiles_updated_at` → mantiene `updated_at`.

## RLS (Row Level Security) — política

**Todas las tablas tienen RLS activo.** Resumen:

| Tabla | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | `authenticated` | propio (`auth.uid() = id`) | propio | — |
| `swipes` | propio (`swiper_id`) | propio | — | — |
| `matches` | participante | (creado por trigger en backend, no desde cliente) | — | — |
| `messages` | participante del match | sender que es participante | — | — |
| `reviews` | `authenticated` | propio (no auto-review) | — | — |

**Regla:** el cliente no puede leer perfiles si no está autenticado. La página pública (landing) no necesita data de DB.

## Convenciones

### Clientes

- **Browser** (Client Components, hooks): `import { createSupabaseBrowserClient } from "@/shared/lib/supabase/client"`. Uno por interacción, no se reusa global.
- **Server** (Server Components, Route Handlers, Server Actions): `import { createSupabaseServerClient } from "@/shared/lib/supabase/server"`. Lee/escribe cookies de sesión.
- **Middleware**: necesita su propio client con manejo de cookies — agregar `src/middleware.ts` cuando se wireé auth.

### Tipos

- Generar tipos: `npx supabase gen types typescript --project-id <ref> > src/shared/lib/supabase/types.ts`.
- Importar como `Database` y tipar clientes con `createBrowserClient<Database>(...)`.
- Re-correr cada vez que cambia el schema.

### Llamadas

- Cada feature tiene su propio `api/` con funciones puras que reciben un client.
- **Never** instanciar el client adentro de la función — recibirlo como parámetro o crearlo desde el caller del componente.
- Errores: devolver `{ data, error }` consistente con la API de Supabase. No envolver en try/catch a menos que necesites transformar.

### Match logic (cuando se wireé)

`features/swipe-deck/api/swipes.ts`:
1. Insert en `swipes` con la acción.
2. Si `action in ('match','super')`, hacer un `select` en `swipes` buscando uno recíproco (target → swiper) con acción match/super.
3. Si existe → insert en `matches` (`user_a_id < user_b_id` para idempotencia con `on conflict do nothing`).
4. Devolver `{ matched: boolean }` para que la UI muestre celebración.

Esto se puede mover a una función Postgres (`create_match_if_mutual`) cuando crezca.

## Seed de prueba

Para dev local con datos: `supabase/seed.sql` (no incluido aún) puede insertar 5–10 perfiles dummy. **No correr en producción.**

## Storage (futuro)

Cuando se agreguen fotos de perfil:
- Crear bucket `avatars` (público).
- Path convention: `{user_id}/avatar.jpg`.
- RLS en `storage.objects`: el dueño puede insert/update; todos pueden read.

## Realtime (futuro)

Para chat en tiempo real:
- Habilitar Realtime en la tabla `messages` desde el dashboard.
- Suscribirse desde `features/messaging/hooks/use-conversation.ts` con `channel().on('postgres_changes', ...)`.
- Filtrar por `match_id` para no recibir mensajes de otros chats.
