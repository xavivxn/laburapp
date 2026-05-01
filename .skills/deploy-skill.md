# Deploy Skill — Vercel

## Pre-flight checklist

Antes de desplegar la primera vez, verificar:

- [ ] `npm run build` corre sin errores ni warnings nuevos.
- [ ] `npm run lint` limpio.
- [ ] Íconos PWA generados (`npm run icons`) — los `.png` deben estar versionados en git.
- [ ] `.env.local` **nunca** se commitea (ya está en `.gitignore`).
- [ ] `.env.local.example` está actualizado con todas las claves que la app espera.
- [ ] Imágenes externas en `next.config.ts > images.remotePatterns` cubren todos los hosts usados.

## Path A — Deploy via GitHub (recomendado para flujo continuo)

1. **Subir a GitHub**
   ```bash
   git add .
   git commit -m "feat: initial scaffold + design system + dummy modules"
   gh repo create laburapp --public --source=. --push
   ```
   (o creá el repo a mano en github.com/new y pusheá con `git remote add origin … && git push -u origin main`).

2. **Importar en Vercel**
   - Entrá a [vercel.com/new](https://vercel.com/new) (logueate con GitHub).
   - Seleccioná el repo `laburapp`.
   - Framework preset: **Next.js** (auto-detectado).
   - Root directory: `./` (default).
   - Build command, output dir, install command: dejarlos en default.
   - Click **Deploy**. Primer deploy tarda ~2 min.

3. **Variables de entorno**
   - Mientras la app esté en modo dummy, no hace falta setear nada.
   - Cuando wireemos Supabase, agregar en *Project Settings → Environment Variables*:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Aplicar a `Production`, `Preview` y `Development`. **Redeploy** después de agregar.

4. **Dominio**
   - Vercel asigna `laburapp.vercel.app` (o variante si está tomado).
   - Si querés dominio propio: *Settings → Domains → Add* y seguir el flow DNS.

## Path B — Deploy via Vercel CLI (rápido para validar)

```bash
npm i -g vercel
vercel login
vercel        # primer deploy: te pregunta config, aceptá defaults
vercel --prod # deploy a producción
```

Útil si no querés crear repo todavía. El proyecto queda asociado a tu cuenta y los próximos `vercel` redeployan.

## Configuración relevante en este repo

- **`next.config.ts`** — `reactStrictMode`, `turbopack.root` (silencia warning de lockfiles), `images.remotePatterns` (Unsplash mock).
- **`public/manifest.webmanifest`** — start_url, icons, theme_color `#4F46E5`. Vercel lo sirve estático.
- **No hay `vercel.json`** — los defaults funcionan para Next.js App Router.

## Headers / caching

Next 16 maneja cache automático. No tocar a menos que haya un caso concreto. Si lo necesitás, se configura en `next.config.ts` con `headers()`, no en `vercel.json`.

## Preview deploys

- Cada PR / push a una branch que no sea `main` genera un Preview deploy con URL única.
- Las env vars marcadas como `Preview` se usan ahí — útil para tener un Supabase project staging separado.

## Rollback

*Project Settings → Deployments* → click en una deploy anterior → **Promote to Production**. Inmediato.

## Logs y errores

- Runtime logs: *Project → Logs*.
- Build logs: en cada deploy, click "View Build Logs".
- Para errores en cliente, integrar Sentry o similar **después** de la fase dummy — no ahora.

## Troubleshooting típico

| Síntoma | Causa probable | Fix |
|---|---|---|
| Build falla con `Image with src "..." has invalid src` | Host no listado en `next.config.ts > images.remotePatterns` | Agregar el host |
| Manifest 404 en mobile | Path incorrecto en `metadata.manifest` | Debe ser `/manifest.webmanifest` |
| Íconos no aparecen al instalar PWA | PNGs no versionados o tamaño incorrecto | Correr `npm run icons` y commitear |
| `Hydration mismatch` en theme | Falta `suppressHydrationWarning` en `<html>` | Ya está en `layout.tsx` — no remover |
| `env not found` en Server Component | Variable sin prefijo `NEXT_PUBLIC_` y no seteada en Vercel | Setear en Project Settings y redeploy |
