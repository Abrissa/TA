import React, { useState } from 'react';
import { Article } from '../types';
import { ARTICLES_DATA } from '../data/mockData';
import { Newspaper, ChevronRight, Search } from 'lucide-react';

interface NewsViewProps {
  onSelectArticle: (art: Article) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ onSelectArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Semua', 'Kegiatan', 'Prestasi', 'Informasi', 'Edukasi'];

  const filteredArticles = ARTICLES_DATA.filter((art) => {
    const matchesCategory = selectedCategory === 'Semua' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      
      {/* HEADER BANNER */}
      <section className="bg-gradient-to-r from-[#059669] via-[#10b981] to-[#047857] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 border border-white/20 text-xs font-semibold">
            <Newspaper className="w-4 h-4 text-amber-400" />
            <span>Kabar & Informasi Publik</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
            Berita & Artikel MI AL-AHMAD
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Pusat berita, informasi kegiatan siswa, pengumuman sekolah, dan edukasi bagi orang tua.
          </p>
        </div>
      </section>

      {/* FILTER & SEARCH BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#059669] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari berita..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#059669]"
            />
          </div>
        </div>

        {/* ARTICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <div 
              key={art.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <img src={art.imageUrl} alt={art.title} className="w-full h-48 object-cover" />
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#059669] font-bold text-[10px]">
                      {art.category}
                    </span>
                    <span>{art.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-2 hover:text-[#059669] transition-colors cursor-pointer" onClick={() => onSelectArticle(art)}>
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectArticle(art)}
                  className="text-xs font-bold text-[#059669] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  Baca Selengkapnya
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
