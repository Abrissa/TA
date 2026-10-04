import React, { useState, useEffect } from 'react';
import { Article, PageTab } from '../types';
import { api } from '../services/api';
import {
  Newspaper,
  ChevronRight,
  ChevronLeft,
  Search,
  Calendar,
  User,
  Clock,
  ExternalLink,
  Sparkles,
  Trophy,
  X,
  Bookmark,
  Home,
  Loader2,
} from 'lucide-react';
import { ArticleCard } from '../components/cards/ArticleCard';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeroBanner } from '../components/ui/PageHeroBanner';

interface NewsViewProps {
  onSelectArticle: (art: Article) => void;
  setActiveTab?: (tab: PageTab) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ onSelectArticle, setActiveTab }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [isFeaturedHovered, setIsFeaturedHovered] = useState<boolean>(false);

  useEffect(() => {
    api.getArticles().then((data) => {
      setArticles(data);
    }).catch(() => {
      setArticles([]);
    }).finally(() => {
      setIsLoadingArticles(false);
    });
  }, []);

  const categories = [
    { label: 'Semua', count: articles.length },
    { label: 'Prestasi', count: articles.filter((a) => a.category === 'Prestasi').length },
    { label: 'Kegiatan', count: articles.filter((a) => a.category === 'Kegiatan').length },
    { label: 'Informasi', count: articles.filter((a) => a.category === 'Informasi').length },
    { label: 'Edukasi', count: articles.filter((a) => a.category === 'Edukasi').length },
  ].filter((c) => c.count > 0);

  // Filter featured articles by selected category if applicable
  const activeCategoryArticles =
    selectedCategory === 'Semua'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);
  const featuredList = activeCategoryArticles.length > 0 ? activeCategoryArticles : articles;
  const currentFeatured = featuredList.length > 0 ? (featuredList[featuredIndex % featuredList.length] || featuredList[0]) : null;

  const handleNextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % featuredList.length);
  };

  const handlePrevFeatured = () => {
    setFeaturedIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length);
  };

  // Auto-play timer: slides automatically every 4.5 seconds and pauses on hover
  useEffect(() => {
    if (isFeaturedHovered || featuredList.length <= 1) return;

    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredList.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isFeaturedHovered, featuredList.length]);

  const filteredArticles = articles.filter((art) => {
    const matchesCategory =
      selectedCategory === 'Semua' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.tags && art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-20 bg-slate-50/50 min-h-screen">
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Beranda', onClick: () => setActiveTab && setActiveTab('beranda') },
          { label: 'Berita & Artikel' },
        ]}
        title={<>Berita, Artikel & <br /><span className="text-amber-300 underline decoration-amber-400/60 underline-offset-8">Kabar Prestasi</span></>}
        subtitle="Ikuti perkembangan terkini seputar prestasi santri, liputan kegiatan sekolah, pengumuman resmi, dan artikel edukasi islami di MI AL-AHMAD."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {isLoadingArticles ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          </div>
        ) : !searchQuery && currentFeatured ? (
          <div
            onMouseEnter={() => setIsFeaturedHovered(true)}
            onMouseLeave={() => setIsFeaturedHovered(false)}
            className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/40 shadow-xl overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

            {/* Slider Controls Bar */}
            <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs sm:text-sm font-black uppercase tracking-wider shadow-sm">
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  Berita Pilihan
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold">
                  Bergeser Otomatis
                </span>
              </div>

              {/* Prev / Next Buttons & Counter */}
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-mono font-bold text-amber-300 mr-1">
                  {String((featuredIndex % featuredList.length) + 1).padStart(2, '0')} / {String(featuredList.length).padStart(2, '0')}
                </span>
                <button
                  onClick={handlePrevFeatured}
                  aria-label="Berita Sebelumnya"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
                  title="Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleNextFeatured}
                  aria-label="Berita Selanjutnya"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
                  title="Berikutnya"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Animated Slide Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentFeatured.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10"
              >
                {/* Photo Thumbnail */}
                <div className="lg:col-span-5 flex justify-center">
                  <div
                    onClick={() => onSelectArticle(currentFeatured)}
                    className="relative cursor-pointer rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/60 w-full aspect-[4/3] bg-slate-950/60"
                  >
                    <img
                      src={currentFeatured.imageUrl || '/assets/berita-maulana-ksm.jpg'}
                      alt={currentFeatured.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/berita-maulana-ksm.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="px-3 py-1 rounded-md bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
                        {currentFeatured.category}
                      </span>
                      {currentFeatured.readTime && (
                        <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-300" />
                          {currentFeatured.readTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Text Info */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-emerald-800/80 text-emerald-200 text-sm font-semibold border border-emerald-600/50 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-300" />
                      {currentFeatured.date}
                    </span>
                    {currentFeatured.sourceName && (
                      <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-sm font-medium">
                        Liputan {currentFeatured.sourceName}
                      </span>
                    )}
                  </div>

                  <div>
                    <h2
                      onClick={() => onSelectArticle(currentFeatured)}
                      className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-white leading-tight hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      {currentFeatured.title}
                    </h2>
                    <p className="text-amber-300 font-bold text-sm sm:text-base mt-1.5 flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-400" />
                      Oleh {currentFeatured.author} ({currentFeatured.authorRole})
                    </p>
                  </div>

                  <p className="text-slate-200 text-base sm:text-lg leading-relaxed line-clamp-3">
                    {currentFeatured.excerpt}
                  </p>

                  {currentFeatured.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {currentFeatured.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-3 py-1 rounded-md bg-white/10 text-slate-200 text-xs font-medium border border-white/10"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => onSelectArticle(currentFeatured)}
                      className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm sm:text-base flex items-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <span>Baca Berita Selengkapnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {currentFeatured.sourceUrl && (
                      <a
                        href={currentFeatured.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Sumber Media
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots Indicator */}
            <div className="flex items-center justify-center gap-2 pt-4 mt-3 border-t border-white/10 relative z-10">
              {featuredList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setFeaturedIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    (featuredIndex % featuredList.length) === idx
                      ? 'w-7 bg-amber-400'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Filter & Search Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 flex items-center gap-2">
                <Bookmark className="w-6 h-6 text-emerald-700" />
                Daftar Artikel & Berita
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mt-1">
                Menampilkan {filteredArticles.length} artikel terpublikasi
              </p>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] max-w-sm">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berita atau prestasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Categories Filter Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`px-4 py-2 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  selectedCategory === cat.label
                    ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    selectedCategory === cat.label
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">Tidak ada artikel yang ditemukan</h3>
            <p className="text-sm text-slate-500">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
              }}
              className="mt-2 text-sm font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((art) => (
              <ArticleCard key={art.id} article={art} onSelect={onSelectArticle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
