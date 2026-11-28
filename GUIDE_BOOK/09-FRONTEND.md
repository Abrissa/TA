# 09 - FRONTEND: REACT + VITE + TAILWIND — STRUKTUR, ENV, BUILD

## 9.1 Stack & Versi

| Package | Versi | Fungsi |
|---------|-------|--------|
| React | 19.x | UI library (concurrent features) |
| Vite | 6.x | Build tool, HMR, code-split |
| Tailwind CSS | 4.x | Utility-first styling |
| Lucide React | 0.546 | Icons (tree-shakable) |
| Motion (framer-motion) | 12.x | Animations, layout transitions |
| TypeScript | 5.8 | Type safety |
| ESLint + Prettier | - | Linting & formatting |

## 9.2 Struktur Direktori `frontend/src`

```
src/
├── admin/                      # Dashboard Admin (protected routes)
│   ├── tabs/                   # Setiap tab = satu fitur utama
│   │   ├── AdminOverviewTab.tsx      # Ringkasan statistik
│   │   ├── AdminPpdbTab.tsx          # Verifikasi PPDB
│   │   ├── AdminAlumniTab.tsx        # Verifikasi Alumni
│   │   ├── AdminNewsTab.tsx          # Kelola Berita
│   │   ├── AdminGalleryTab.tsx       # Kelola Galeri
│   │   ├── AdminAnnouncementTab.tsx  # Kelola Pengumuman
│   │   ├── AdminProfileTab.tsx       # Profil Madrasah
│   │   └── AdminChangePasswordTab.tsx# Keamanan & Akun (superadmin full, admin sendiri)
│   ├── AdminLayout.tsx         # Shell: sidebar, topbar, routing tab
│   └── AdminRoute.tsx          # Wrapper auth + role check
│
├── views/                      # Halaman Publik (public routes)
│   ├── HomeView.tsx            # Beranda: hero, berita terbaru, pengumuman, stats
│   ├── PpdbView.tsx            # Form pendaftaran PPDB publik
│   ├── AlumniView.tsx          # Form submit alumni + daftar approved
│   ├── NewsView.tsx            # List berita + kategori + pagination
│   ├── NewsDetailView.tsx      # Detail berita by slug
│   ├── GalleryView.tsx         # Grid galeri
│   ├── ProfileView.tsx         # Profil madrasah publik
│   └── LoginView.tsx           # Login admin (redirect ke /admin)
│
├── services/
│   └── api.ts                  # Fetch wrapper, BASE_URL, auth headers, error handling
│
├── components/
│   ├── ui/                     # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── ...
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── forms/                  # Form-specific
│       ├── RichTextEditor.tsx
│       └── FileUpload.tsx
│
├── hooks/                      # Custom hooks
│   ├── useAuth.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
│
├── types/                      # TypeScript interfaces
│   ├── api.ts                  # API response types
│   ├── user.ts
│   ├── ppdb.ts
│   └── ...
│
├── utils/                      # Helper functions
│   ├── date.ts
│   ├── format.ts
│   └── validation.ts
│
├── App.tsx                     # Router + providers + layout switcher
├── main.tsx                    # Entry point (React 18 createRoot)
├── index.css                   # Tailwind imports + global styles
└── vite-env.d.ts               # Vite type declarations
```

## 9.3 Routing (App.tsx)

```tsx
// Public routes
/                    → HomeView
/ppdb                → PpdbView
/alumni              → AlumniView
/berita              → NewsView
/berita/:slug        → NewsDetailView
/galeri              → GalleryView
/profil              → ProfileView
/login               → LoginView

// Admin routes (protected by AdminRoute)
/admin               → AdminLayout (default tab: overview)
/admin/ppdb          → AdminLayout (tab: ppdb)
/admin/alumni        → AdminLayout (tab: alumni)
/admin/berita        → AdminLayout (tab: news)
/admin/galeri        → AdminLayout (tab: gallery)
/admin/pengumuman    → AdminLayout (tab: announcement)
/admin/profil        → AdminLayout (tab: profile)
/admin/keamanan      → AdminLayout (tab: change-password)
```

## 9.4 Environment Variables (`.env`)

| Variable | Contoh | Wajib | Deskripsi |
|----------|--------|-------|-----------|
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000` | ✅ | Base URL backend API |
| `VITE_APP_NAME` | `MI AL-AHMAD` | ❌ | Nama aplikasi (fallback ke school_profile) |

**Contoh `.env` Development**:
```ini
VITE_API_BASE_URL=http://127.0.0.1:8000
```

**Contoh `.env` Production** (di GitHub Actions):
```ini
VITE_API_BASE_URL=https://api.mialahmadkrian.id
```

> **Akses di kode**: `import.meta.env.VITE_API_BASE_URL` → `frontend/src/services/api.ts:128`

## 9.5 API Service Layer (`services/api.ts`)

### 9.5.1 Base Config
```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
```

### 9.5.2 Error Handling
```typescript
async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `HTTP ${res.status}`);
  }
  return json;
}
```

### 9.5.3 Method Helpers
```typescript
// Auth
login(email, password)
logout()
me()
updatePassword(current, newPass, confirm, newEmail?)

// Admin Users (superadmin)
getAdminUsers()
createAdminUser(data)
updateAdminUser(id, data)
deleteAdminUser(id)
resetUserPassword(id, newPass, confirm)
forceLogoutUser(id)

// PPDB
getAdminPpdb(status, search)
updatePpdbStatus(id, status, notes)
deletePpdbRecord(id)
getPpdbStats()

// Alumni
getAdminAlumni(status, search)
updateAlumniStatus(id, status, notes)
deleteAlumniRecord(id)

// News
getAdminNews(params)
createNews(data)
updateNews(id, data)
deleteNews(id)
publishNews(id)
unpublishNews(id)
uploadImage(file)

// Gallery, Announcement, Profile, dll.
```

## 9.6 State Management

- **Auth**: `localStorage` (token, user) + `useAuth` hook
- **Tab State**: React `useState` di `AdminLayout` → pass ke tab via props
- **Form State**: `useState` per field (controlled components)
- **Server State**: `useEffect` + `api.xxx()` → `setData()` (tanpa React Query/TanStack Query)
- **Optimistic Update**: Manual `setRecords(records.map(...))` setelah API sukses

## 9.7 Styling: Tailwind CSS 4

### 9.7.1 Config (`vite.config.ts` + `index.css`)
```css
/* index.css */
@import "tailwindcss";

@theme {
  --color-primary: #059669;      /* emerald-600 */
  --color-primary-hover: #047857; /* emerald-700 */
  --color-primary-light: #d1fae5; /* emerald-100 */
  --color-danger: #e11d48;       /* rose-600 */
  --color-warning: #f59e0b;      /* amber-500 */
  --color-info: #2563eb;         /* blue-600 */
}
```

### 9.7.2 Pattern Umum
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Card**: `bg-white border border-slate-200 rounded-2xl shadow-sm`
- **Button Primary**: `bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold`
- **Button Secondary**: `bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-semibold`
- **Input**: `w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600`
- **Badge**: `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold`
- **Modal/Overlay**: `fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4`

## 9.8 Build & Deploy

### 9.8.1 Development
```bash
npm run dev -- --port=3000 --host=0.0.0.0
# HMR aktif, error overlay, source maps
```

### 9.8.2 Type Check (Lint)
```bash
npm run lint
# tsc --noEmit (type check only, no emit)
```

### 9.8.3 Production Build
```bash
npm run build
# Output: dist/
# - index.html
# - assets/index-[hash].js (main bundle)
# - assets/index-[hash].css
# - assets/vendor-*.js (code-split chunks)
```

### 9.8.4 Preview Build Lokal
```bash
npm run preview
# Serve dist/ di port 4173
```

### 9.8.5 Deploy ke Cloudflare Workers (via Wrangler)
```bash
# wrangler.toml sudah dikonfigurasi
npx wrangler deploy --assets ./dist
```
**Config `wrangler.toml`**:
```toml
name = "ta-mialahmadkrian67"
compatibility_date = "2026-11-28"
workers_dev = true

[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

## 9.9 Code Splitting & Performance

- **Vendor chunks**: `vendor-react`, `vendor-icons`, `vendor-motion` (auto via Vite)
- **Route-based split**: Belum diimplementasikan (semua tab di bundle utama)
- **Lazy load tab**: Bisa ditambah `React.lazy(() => import('./tabs/AdminPpdbTab'))` + `Suspense`
- **Bundle size**: ~660KB gzipped (warning >500KB) → optimasi nanti

## 9.10 Troubleshooting Frontend

| Masalah | Solusi |
|---------|--------|
| `Unable to locate file in Vite manifest` | `npm run build` ulang, cek `dist/.vite/manifest.json` |
| API 401/403 tapi token ada | Cek `localStorage.token` expired → logout manual, login ulang |
| CORS error dev | Backend `config/cors.php` → `allowed_origins` include `http://127.0.0.1:3000` |
| Tailwind class tidak apply | Pastikan `@import "tailwindcss"` di `index.css`, restart dev server |
| Type error `Property 'xxx' does not exist` | `npm run lint` → fix type, atau `// @ts-ignore` sementara |
| Build warning chunk >500KB | Tambah `manualChunks` di `vite.config.ts` / lazy load tab |

---

> **Next**: [10-DEPLOY-CICD.md](./10-DEPLOY-CICD.md) — GitHub Actions → Cloudflare (FE) + cPanel (BE)