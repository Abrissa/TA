import React from "react";
import { Home, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface PageHeroBannerProps {
  title: React.ReactNode;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  children?: React.ReactNode;
}

const IslamicSilhouette: React.FC = () => (
  <svg
    aria-hidden="true"
    className="absolute inset-0 w-full h-full pointer-events-none select-none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid slice"
    viewBox="0 0 1200 320"
  >
    <g fill="none" stroke="white" strokeOpacity="0.08">
      <rect x="-10" y="160" width="60" height="160" strokeWidth="2" />
      <rect x="10" y="130" width="20" height="32" strokeWidth="1.5" />
      <ellipse cx="20" cy="130" rx="20" ry="24" strokeWidth="2" />
      <rect x="5" y="108" width="8" height="24" strokeWidth="1.5" />
      <polygon points="9,108 13,94 17,108" strokeWidth="1.5" />
      <rect x="100" y="100" width="40" height="220" strokeWidth="2" />
      <rect x="112" y="70" width="16" height="32" strokeWidth="1.5" />
      <ellipse cx="120" cy="70" rx="16" ry="20" strokeWidth="2" />
      <rect x="116" y="52" width="8" height="20" strokeWidth="1.5" />
      <polygon points="116,52 120,36 124,52" strokeWidth="1.5" />
      <rect x="100" y="140" width="40" height="4" strokeWidth="1" />
      <rect x="100" y="180" width="40" height="4" strokeWidth="1" />
      <rect x="108" y="108" width="24" height="28" rx="12" strokeWidth="1.2" />
      <rect x="108" y="148" width="24" height="28" rx="12" strokeWidth="1.2" />
      <rect x="300" y="120" width="200" height="200" strokeWidth="2" />
      <ellipse cx="400" cy="120" rx="100" ry="80" strokeWidth="2.5" />
      <ellipse cx="400" cy="108" rx="60" ry="40" strokeWidth="1.5" />
      <rect x="385" y="70" width="30" height="40" strokeWidth="1.5" />
      <ellipse cx="400" cy="70" rx="20" ry="24" strokeWidth="2" />
      <rect x="395" y="48" width="10" height="24" strokeWidth="1.5" />
      <polygon points="395,48 400,30 405,48" strokeWidth="2" />
      <rect x="330" y="170" width="36" height="48" rx="18" strokeWidth="1.5" />
      <rect x="382" y="170" width="36" height="48" rx="18" strokeWidth="1.5" />
      <rect x="434" y="170" width="36" height="48" rx="18" strokeWidth="1.5" />
      <rect x="560" y="100" width="40" height="220" strokeWidth="2" />
      <rect x="572" y="70" width="16" height="32" strokeWidth="1.5" />
      <ellipse cx="580" cy="70" rx="16" ry="20" strokeWidth="2" />
      <rect x="576" y="52" width="8" height="20" strokeWidth="1.5" />
      <polygon points="576,52 580,36 584,52" strokeWidth="1.5" />
      <rect x="560" y="140" width="40" height="4" strokeWidth="1" />
      <rect x="560" y="180" width="40" height="4" strokeWidth="1" />
      <rect x="568" y="108" width="24" height="28" rx="12" strokeWidth="1.2" />
      <rect x="568" y="148" width="24" height="28" rx="12" strokeWidth="1.2" />
      <rect x="720" y="150" width="120" height="170" strokeWidth="2" />
      <ellipse cx="780" cy="150" rx="60" ry="50" strokeWidth="2" />
      <rect x="768" y="102" width="24" height="50" strokeWidth="1.5" />
      <ellipse cx="780" cy="102" rx="14" ry="16" strokeWidth="1.5" />
      <polygon points="776,86 780,72 784,86" strokeWidth="1.5" />
      <rect x="740" y="190" width="28" height="40" rx="14" strokeWidth="1.2" />
      <rect x="792" y="190" width="28" height="40" rx="14" strokeWidth="1.2" />
      <rect x="920" y="140" width="30" height="180" strokeWidth="2" />
      <rect x="930" y="116" width="10" height="26" strokeWidth="1.5" />
      <ellipse cx="935" cy="116" rx="10" ry="14" strokeWidth="1.5" />
      <polygon points="931,102 935,90 939,102" strokeWidth="1.5" />
      <polygon points="660,40 663,50 673,50 665,56 668,66 660,60 652,66 655,56 647,50 657,50" strokeWidth="1" />
      <polygon points="200,30 202,38 210,38 204,43 206,51 200,47 194,51 196,43 190,38 198,38" strokeWidth="1" />
      <polygon points="1050,60 1052,68 1060,68 1054,73 1056,81 1050,77 1044,81 1046,73 1040,68 1048,68" strokeWidth="1" />
      <path d="M0,300 Q150,270 300,300 Q450,330 600,300 Q750,270 900,300 Q1050,330 1200,300" strokeWidth="1.5" />
      <path d="M0,310 Q150,280 300,310 Q450,340 600,310 Q750,280 900,310 Q1050,340 1200,310" strokeWidth="1" />
    </g>
  </svg>
);

export const PageHeroBanner: React.FC<PageHeroBannerProps> = ({
  title,
  subtitle,
  breadcrumbs,
  children,
}) => {
  return (
    <section className="relative bg-gradient-to-r from-[#065F46] via-[#047857] to-[#064E3B] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400 overflow-hidden">
      {/* Background Architectural Silhouette of Gedung MI AL-AHMAD */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <img
          src="/assets/gedung-mi-al-ahmad.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center filter grayscale contrast-150 brightness-90 opacity-20 mix-blend-luminosity scale-105"
        />
        {/* Soft vignette and emerald depth overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#065F46]/90 via-[#047857]/80 to-[#064E3B]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.2),transparent_70%)]" />
      </div>

      <IslamicSilhouette />
      <div className="relative z-10 max-w-7xl mx-auto space-y-4 text-left">
        <nav aria-label="Breadcrumb" className="pb-1">
          <ol className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/20 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-emerald-100">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-white/50 shrink-0" />}
                <li className="inline-flex items-center">
                  {crumb.onClick ? (
                    <button
                      onClick={crumb.onClick}
                      className="inline-flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer text-emerald-100"
                    >
                      {idx === 0 && <Home className="w-4 h-4 text-amber-300" />}
                      <span>{crumb.label}</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold" aria-current="page">
                      {idx === 0 && <Home className="w-4 h-4 text-amber-300" />}
                      {crumb.label}
                    </span>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight max-w-4xl">
          {title}
        </h1>

        {subtitle && (
          <p className="text-emerald-100 text-base sm:text-lg max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </section>
  );
};
