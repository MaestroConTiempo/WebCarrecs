# 🚀 WebIAMARXA — Deploy a Vercel

## ✅ Estructura correcta (ja creada)

```
WebIAMARXA/
├── app/
│   ├── page.jsx          ✓ Centre IA landing
│   ├── layout.jsx        ✓ HTML wrapper
│   └── globals.css       ✓ Tailwind + estilos
├── package.json          ✓
├── tailwind.config.js    ✓ Colors blaus (#0f172a)
├── postcss.config.js     ✓
├── next.config.js        ✓
```

---

## 🎯 Com deployar a Vercel (3 opcions)

### **OPCIÓ 1: Drag & Drop (MÉS FÀCIL) ⭐**

1. **Descarrega** tots els fitxers de `/WebIAMARXA/`
2. Va a https://vercel.com/new
3. **Drag & Drop** la carpeta `WebIAMARXA`
4. **Espera 2-3 minuts** — Vercel fa build automàtic
5. ✅ **DONE** — La web és live

---

### **OPCIÓ 2: GitHub + Vercel (RECOMANAT)**

1. **Descarrega** la carpeta `WebIAMARXA`
2. **Crea un repositori a GitHub** (nou, buit, públic o privat)
3. **A la terminal**, dins de `WebIAMARXA`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Centre IA en Marxa landing"
   git branch -M main
   git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
   git push -u origin main
   ```
4. Va a https://vercel.com/new
5. **Selecciona el repositori**
6. Vercel **detecta Next.js automàticament**
7. **Click "Deploy"** — DONE ✅

---

### **OPCIÓ 3: Vercel CLI**

```bash
# 1. Descarrega WebIAMARXA
# 2. Obri terminal a la carpeta

npm install -g vercel
vercel

# Segueix les instruccions
# Selecciona: 
#  - "Deploy from current directory" 
#  - "Link to existing project?" → No
# 3. ✅ URL live en 2-3 minuts
```

---

## 📍 Assignar un domini propi

Un cop deploy exitós:

1. Va a **Vercel Dashboard** → Teu projecte
2. **Settings** → **Domains**
3. Clica **"Add Domain"**
4. Entra el domini (ex: `centreiaenmarxa.cat`)
5. Segueix DNS instructions:
   - Obri registrar del teu domini
   - Afegeix els records DNS que Vercel mostra
   - **Espera 24-48h** (propagació)
6. **SSL activat automàticament** (gratis) ✅

---

## ✅ Com verificar que funciona

Després del deploy, hauries de veure:

- ✓ **URL** funciona (ex: `webiamarxa.vercel.app`)
- ✓ **Header** fix amb nav
- ✓ **Hero** en cobalt fosc (#0f172a)
- ✓ **Botons** blaus
- ✓ **Totes seccions** carreguen
- ✓ **WhatsApp** i email links funcionen

---

## ❌ Si hi ha error 404

**NO ÉS NORMAL si segueixis les instruccions.** Però si passa:

1. **Verifica que tens** dins de la carpeta:
   ```
   ✓ app/page.jsx
   ✓ app/layout.jsx
   ✓ app/globals.css
   ✓ package.json
   ✓ tailwind.config.js
   ✓ next.config.js
   ✓ postcss.config.js
   ```

2. **Si deployes per GitHub**, assegura't que el `.git/` no està al repo (ho fa automàticament)

3. **Obri Vercel Logs**:
   - Va al projecte a Vercel
   - **Deployments** → últim deploy
   - **View Logs** → mira els errors

---

## 🎨 Si vols personalitzar els colors

Obri `tailwind.config.js`:

```javascript
colors: {
  'blue-900': '#0f172a',  ← Canvia aquí el blau
}
```

Després, **git push** (si estàs a GitHub) i Vercel fa redeploy automàtic.

---

## 📝 Notes

- **Zero configuracions complexes** — Vercel detecta Next.js
- **SSL gratis** — Automàtic per a tots els dominis
- **Redeploy automàtic** — Cada `git push` fa build nou
- **Logs visibles** — Vercel Dashboard → Deployments

---

**Rubén Fabri** | mestreambtemps@gmail.com | +34 639 525 092

🚀 **Bon deploy!**
