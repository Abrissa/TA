import React, { useState, useEffect, useRef } from 'react';
import { Article, PageTab } from '../types';
import { api } from '../services/api';
import { mockAdminStore } from '../services/mockAdminData';
import { ARTICLES_DATA } from '../data/mockData';
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

const ITEMS_PER_ROW = 3;
const ROWS_PER_PAGE = 3;
const ITEMS_PER_PAGE = ITEMS_PER_ROW * ROWS_PER_PAGE; // 9 artikel per tab/halaman (3 baris penuh)

interface NewsViewProps {
  onSelectArticle: (art: Article) => void;
  setActiveTab?: (tab: PageTab) => void;
  settings?: Record<string, string>;
}

export const NewsView: React.FC<NewsViewProps> = ({ onSelectArticle, setActiveTab }) => {
  const [articles, setArticles] = useState<Article[]>(() => {
    return mockAdminStore.getArticles();
  });
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [isFeaturedHovered, setIsFeaturedHovered] = useState<boolean>(false);
  const articlesListRef = useRef<HTMLDivElement>(null);

  // Reset tab/halaman ke pertama saat kategori atau pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const handleArticlesChanged = () => {
      setArticles(mockAdminStore.getArticles());
    };

    window.addEventListener('mi_articles_changed', handleArticlesChanged);
    window.addEventListener('storage', handleArticlesChanged);

    api.getArticles().then((data) => {
      if (data && data.length > 0) {
        setArticles(data);
      }
    }).catch(() => {
      // Keep local
    }).finally(() => {
      setIsLoadingArticles(false);
    });

    return () => {
      window.removeEventListener('mi_articles_changed', handleArticlesChanged);
      window.removeEventListener('storage', handleArticlesChanged);
    };
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

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredArticles.length);
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (articlesListRef.current) {
      const yOffset = -90;
      const y = articlesListRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 pb-20 bg-slate-50/50 min-h-screen">
      <PageHeroBanner
        breadcrumbs={[
          { label: 'Beranda', onClick: () => setActiveTab && setActiveTab('beranda') },
          { label: 'Berita & Artikel' },
        ]}
        title={<>Berita, Artikel & <br /><span className="text-amber-300 underline decoration-amber-400/60 underline-offset-8">Kabar Prestasi</span></>}
        subtitle="Ikuti perkembangan terkini seputar prestasi santri, liputan kegiatan sekolah, pengumuman resmi, dan artikel edukasi islami di MI AL-AHMAD."
        backgroundImageUrl="/assets/gedung-berita-mi-al-ahmad.jpg"
        imagePosition="object-[center_45%]"
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
        <div ref={articlesListRef} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 flex items-center gap-2">
                <Bookmark className="w-6 h-6 text-emerald-700" />
                Daftar Artikel & Berita
              </h2>
              <div className="text-base sm:text-lg text-slate-600 mt-1">
                {filteredArticles.length === 0 ? (
                  <span>Tidak ada artikel yang sesuai</span>
                ) : totalPages > 1 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span>
                      Menampilkan <strong className="text-slate-900 font-bold">{startIndex + 1}–{endIndex}</strong> dari{' '}
                      <strong className="text-slate-900 font-bold">{filteredArticles.length}</strong> artikel
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Tab / Halaman {currentPage} dari {totalPages}
                    </span>
                  </div>
                ) : (
                  <span>Menampilkan <strong className="text-slate-900 font-bold">{filteredArticles.length}</strong> artikel terpublikasi</span>
                )}
              </div>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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

          {/* Navigasi Tab Cepat (Jika lebih dari 3 baris / 9 artikel) */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 pb-1 border-t border-slate-200/80">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Tab Berita (Maksimal 3 Baris):
                </span>
                <div className="inline-flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                        currentPage === pageNum
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:text-emerald-800 hover:bg-white'
                      }`}
                    >
                      <span>{pageNum === 1 ? 'Tab 1 (Baris 1–3)' : `Tab ${pageNum} (Selanjutnya)`}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          currentPage === pageNum ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {(pageNum - 1) * ITEMS_PER_PAGE + 1}–{Math.min(pageNum * ITEMS_PER_PAGE, filteredArticles.length)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {currentPage < totalPages && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer ml-auto"
                >
                  <span>Buka Tab Selanjutnya ({currentPage + 1})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
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
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {currentArticles.map((art) => (
                  <ArticleCard key={art.id} article={art} onSelect={onSelectArticle} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination & Next Tab Controls */}
            {totalPages > 1 && (
              <div className="space-y-6 pt-4">
                {/* Banner jika sudah 3 baris dan ada tab selanjutnya */}
                {currentPage < totalPages && (
                  <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50/70 border-2 border-emerald-200/90 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        3 Baris Selesai
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        Masih ada {filteredArticles.length - endIndex} artikel lainnya di tab berikutnya
                      </h3>
                      <p className="text-sm text-slate-600">
                        Klik tombol di samping untuk melanjutkan membaca artikel di tab selanjutnya.
                      </p>
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer shrink-0"
                    >
                      <span>Buka Tab Selanjutnya (Tab {currentPage + 1})</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Bar Tombol Halaman & Sebelumnya/Selanjutnya */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
                  <div className="text-sm text-slate-600 font-medium text-center sm:text-left">
                    Menampilkan <span className="font-bold text-slate-900">{startIndex + 1}–{endIndex}</span> dari{' '}
                    <span className="font-bold text-slate-900">{filteredArticles.length}</span> artikel
                    <span className="mx-2 text-slate-300">•</span>
                    Tab / Halaman <span className="font-bold text-slate-900">{currentPage}</span> dari{' '}
                    <span className="font-bold text-slate-900">{totalPages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Tombol Sebelumnya */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all border ${
                        currentPage === 1
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 shadow-xs cursor-pointer'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Sebelumnya</span>
                    </button>

                    {/* Nomor Tab / Halaman */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`min-w-[42px] h-10 px-3 rounded-xl text-sm font-black transition-all cursor-pointer flex items-center justify-center border ${
                            currentPage === pageNum
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-700/20 scale-105'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    {/* Tombol Selanjutnya */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all border ${
                        currentPage === totalPages
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-emerald-700 text-white border-emerald-700 hover:bg-emerald-800 shadow-md shadow-emerald-700/20 active:scale-95 cursor-pointer'
                      }`}
                    >
                      <span>Selanjutnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
