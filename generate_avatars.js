const fs = require('fs');
const path = require('path');

function createTeacherAvatar(name, title, primaryColor, secondaryColor, type) {
  const initials = name
    .replace(/(Drs\.|H\.|Hj\.|M\.Pd|S\.Pd\.I|M\.Sc|S\.Pd|S\.Th\.I|S\.E|Dr\.|B\.Des|S\.Kom|S\.T)/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  const isHijab = type === 'hijab';
  const isPeci = type === 'peci';
  const isSport = type === 'sport';

  let headwearSvg = '';
  if (isHijab) {
    headwearSvg = `
      <!-- Hijab drape -->
      <path d="M120,110 C120,60 170,40 200,40 C230,40 280,60 280,110 C280,170 270,230 250,250 C230,270 170,270 150,250 C130,230 120,170 120,110 Z" fill="${primaryColor}" />
      <!-- Face opening -->
      <path d="M160,115 C160,95 180,85 200,85 C220,85 240,95 240,115 C240,145 225,175 200,175 C175,175 160,145 160,115 Z" fill="#FCE5D8" />
      <!-- Hijab inner fold -->
      <path d="M150,220 C170,245 230,245 250,220 C240,265 220,295 200,295 C180,295 160,265 150,220 Z" fill="${secondaryColor}" opacity="0.9" />
    `;
  } else if (isPeci) {
    headwearSvg = `
      <!-- Peci / Kopiah Hitam -->
      <path d="M155,95 C155,75 160,65 200,65 C240,65 245,75 245,95 L245,108 L155,108 Z" fill="#1E293B" />
      <ellipse cx="200" cy="67" rx="42" ry="7" fill="#0F172A" />
      <!-- Face -->
      <path d="M160,105 C160,100 170,95 200,95 C230,95 240,100 240,105 C240,145 225,168 200,168 C175,168 160,145 160,105 Z" fill="#FCE5D8" />
    `;
  } else {
    // Regular / Sport
    headwearSvg = `
      <!-- Hair -->
      <path d="M158,105 C155,80 175,70 200,70 C225,70 245,80 242,105 C235,90 220,85 200,85 C180,85 165,90 158,105 Z" fill="#1E293B" />
      <!-- Face -->
      <path d="M162,105 C162,95 175,90 200,90 C225,90 238,95 238,105 C238,145 225,168 200,168 C175,168 162,145 162,105 Z" fill="#FCE5D8" />
    `;
  }

  function escapeXml(str) {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  const safeName = escapeXml(name);
  const safeTitle = escapeXml(title);
  const safeInitials = escapeXml(initials);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}" />
      <stop offset="100%" stop-color="${secondaryColor}" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.45" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="400" height="400" rx="32" fill="url(#bgGrad)" />

  <!-- Subtle Islamic Geometric Accent in Background -->
  <g stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="2" fill="none">
    <circle cx="200" cy="200" r="140" />
    <circle cx="200" cy="200" r="170" stroke-dasharray="6,6" />
    <polygon points="200,50 306,124 332,250 250,332 124,306 68,200 124,94 250,68" />
    <polygon points="200,350 94,276 68,150 150,68 276,94 332,200 276,306 150,332" />
  </g>

  <!-- Character Illustration Body / Shoulders -->
  <g filter="url(#shadow)">
    <!-- Shoulders & Outfit -->
    <path d="M100,340 C100,270 140,240 200,240 C260,240 300,270 300,340 C300,380 280,400 200,400 C120,400 100,380 100,340 Z" fill="#FFFFFF" />
    <!-- Collar / Tie / Scarf Accent -->
    <path d="M170,240 L200,285 L230,240 Z" fill="${primaryColor}" opacity="0.85" />
    <!-- Headwear & Face -->
    ${headwearSvg}
    <!-- Gentle Smile & Eyes -->
    <circle cx="188" cy="125" r="3" fill="#334155" />
    <circle cx="212" cy="125" r="3" fill="#334155" />
    <path d="M192,142 Q200,148 208,142" stroke="#334155" stroke-width="2.5" stroke-linecap="round" fill="none" />
  </g>

  <!-- Bottom Name Badge Tag -->
  <rect x="30" y="325" width="340" height="55" rx="16" fill="#0F172A" fill-opacity="0.8" />
  <text x="200" y="348" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#F8FAFC">${safeName}</text>
  <text x="200" y="367" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#34D399">${safeTitle}</text>

  <!-- Initials Badge Top Right -->
  <g transform="translate(325, 35)">
    <circle cx="20" cy="20" r="22" fill="#FFFFFF" fill-opacity="0.2" stroke="#FFFFFF" stroke-width="2" />
    <text x="20" y="26" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="900" fill="#FFFFFF">${safeInitials}</text>
  </g>
</svg>`;
}

const teachers = [
  { file: 'guru-1.svg', name: 'Drs. H. Ahmad Fauzi, M.Pd', title: 'Kepala Sekolah & Guru Tahfidz', p: '#065F46', s: '#047857', t: 'peci' },
  { file: 'guru-2.svg', name: 'Siti Aminah, S.Pd.I', title: 'Guru Bahasa Arab', p: '#0F766E', s: '#14B8A6', t: 'hijab' },
  { file: 'guru-3.svg', name: 'Rahmat Hidayat, M.Sc', title: 'Guru Matematika & IPA', p: '#1E40AF', s: '#3B82F6', t: 'peci' },
  { file: 'guru-4.svg', name: 'Hj. Nurul Jannah, S.Pd', title: 'Guru Bahasa Inggris', p: '#9D174D', s: '#EC4899', t: 'hijab' },
  { file: 'guru-5.svg', name: 'Ustadz Mansur, S.Th.I', title: 'Guru Fiqih & Akidah', p: '#B45309', s: '#F59E0B', t: 'peci' },
  { file: 'guru-6.svg', name: 'Indah Permata, S.E', title: 'Guru SBdP & Prakarya', p: '#6D28D9', s: '#8B5CF6', t: 'hijab' },
  { file: 'guru-7.svg', name: 'Yusuf Mahendra, S.Pd', title: 'Guru PJOK & Olahraga', p: '#0369A1', s: '#0EA5E9', t: 'sport' },
];

const alumni = [
  { file: 'alumni-1.svg', name: 'Dr. Ahmad Faisal, M.Sc.', title: 'Peneliti Senior Global', p: '#1E3A8A', s: '#3B82F6', t: 'peci' },
  { file: 'alumni-2.svg', name: 'Siti Aminah, B.Des.', title: 'Creative Director Jakarta', p: '#831843', s: '#EC4899', t: 'hijab' },
  { file: 'alumni-3.svg', name: 'Budi Santoso, S.Kom.', title: 'Tech Lead BUMN', p: '#065F46', s: '#10B981', t: 'peci' },
  { file: 'alumni-4.svg', name: 'Alumni Berprestasi', title: 'Generasi Emas MI AL-AHMAD', p: '#B45309', s: '#F59E0B', t: 'peci' },
];

const frontendTeacherDir = path.resolve('frontend/public/assets/teachers');
const backendTeacherDir = path.resolve('backend/public/assets/teachers');
const frontendAlumniDir = path.resolve('frontend/public/assets/alumni');
const backendAlumniDir = path.resolve('backend/public/assets/alumni');

for (const t of teachers) {
  const svg = createTeacherAvatar(t.name, t.title, t.p, t.s, t.t);
  fs.writeFileSync(path.join(frontendTeacherDir, t.file), svg, 'utf8');
  fs.writeFileSync(path.join(backendTeacherDir, t.file), svg, 'utf8');
  console.log(`Saved teacher avatar ${t.file}`);
}

for (const a of alumni) {
  const svg = createTeacherAvatar(a.name, a.title, a.p, a.s, a.t);
  fs.writeFileSync(path.join(frontendAlumniDir, a.file), svg, 'utf8');
  fs.writeFileSync(path.join(backendAlumniDir, a.file), svg, 'utf8');
  console.log(`Saved alumni avatar ${a.file}`);
}

console.log('All local avatars generated successfully!');
