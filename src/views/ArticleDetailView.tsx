import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Check,
  ExternalLink,
  Bookmark,
  ChevronRight,
  Quote,
} from 'lucide-react';
import { Article } from '../types';
import { ARTICLES_DATA, SCHOOL_INFO } from '../data/mockData';

interface ArticleDetailViewProps {
  article: Article;
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  onBack,
  onSelectArticle,
}) => {
  const [copied, setCopied] = useState(false);

  const relatedArticles = ARTICLES_DATA.filter((item) => item.id !== article.id).slice(0, 4);

  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWA = () => {
    const text = encodeURIComponent(
      `*${article.title}*\n\n${article.excerpt}\n\nBaca selengkapnya di MI AL-AHMAD: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <article className="pb-20 bg-slate-50/50 min-h-screen">
      {/* Top Breadcrumb & Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Berita</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-all cursor-pointer shadow-2xs"
              title="Salin Tautan Berita"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
            </button>
            <button
              onClick={handleShareWA}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all cursor-pointer shadow-xs"
              title="Bagikan ke WhatsApp"
            >
              WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Article Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-900 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-400">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="flex flex-wrap items-center gap-2.5 text-sm font-medium">
            <span className="px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider">
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Calendar className="w-4 h-4 text-amber-300" />
              {article.date}
            </span>
            {article.readTime && (
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-4 h-4 text-amber-300" />
                {article.readTime}
              </span>
            )}
            {article.sourceName && (
              <span className="px-3 py-1 rounded-lg bg-white/10 text-emerald-200 text-xs font-semibold">
                Sumber: {article.sourceName}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading leading-tight text-white tracking-tight">
            {article.title}
          </h1>

          <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-3xl">
            {article.excerpt}
          </p>

          <div className="pt-3 flex items-center gap-3.5 border-t border-white/15">
            <div className="w-11 h-11 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-base">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-base font-bold text-white">{article.author}</p>
              <p className="text-sm text-emerald-200 font-medium">{article.authorRole}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Article Body */}
          <div className="lg:col-span-8 space-y-6">
            {/* Featured Image */}
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-slate-950">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full max-h-[480px] object-cover object-center"
              />
            </div>

            {/* Content Container */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
              {/* Highlight Excerpt Lead */}
              <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-100 text-emerald-950 font-semibold text-base sm:text-lg leading-relaxed">
                {article.excerpt}
              </div>

              {/* Body Paragraphs */}
              <div className="space-y-6 text-slate-800 text-base sm:text-lg leading-relaxed font-body">
                {paragraphs.map((para, idx) => {
                  // Check if paragraph contains quote characters
                  const isQuote = para.startsWith('“') || para.startsWith('"') || para.includes('“');
                  if (isQuote && para.length > 80) {
                    return (
                      <div
                        key={idx}
                        className="my-6 p-6 sm:p-7 rounded-2xl bg-slate-50 border-l-4 border-amber-400 space-y-2 relative"
                      >
                        <Quote className="w-7 h-7 text-amber-500/60 mb-1" />
                        <p className="italic text-slate-800 font-medium text-base sm:text-lg leading-relaxed">
                          {para}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <p key={idx} className="leading-relaxed">
                      {para}
                    </p>
                  );
                })}
              </div>

              {/* Tags & Source */}
              <div className="pt-6 border-t border-slate-200 space-y-4">
                {article.tags && (
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-sm font-bold text-slate-600">Topik Terkait:</span>
                    {article.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {article.sourceUrl && (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                    <div>
                      <p className="font-bold text-slate-900 text-base">Publikasi Eksternal Terverifikasi</p>
                      <p className="text-slate-600 text-sm">Berita ini telah dimuat di media daring nasional.</p>
                    </div>
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors shrink-0"
                    >
                      <span>Lihat Artikel Asli di Media</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              {/* Bottom Back Button */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Semua Berita
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Author Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
              <span className="text-sm font-bold uppercase tracking-wider text-emerald-700">
                Tentang Liputan
              </span>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-lg">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{article.author}</h4>
                  <p className="text-sm text-slate-500 font-medium">{article.authorRole}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dipublikasikan melalui kanal informasi resmi MI AL-AHMAD Krian untuk menyebarkan kabar prestasi dan kegiatan positif madrasah.
              </p>
            </div>

            {/* Related Articles */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold font-heading text-slate-900 text-lg">
                  Kabar & Prestasi Lainnya
                </h3>
              </div>

              <div className="space-y-3.5">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      onSelectArticle(rel);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-emerald-50/60 transition-colors cursor-pointer group"
                  >
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      className="w-16 h-16 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="text-xs font-bold text-amber-700 uppercase">
                        {rel.category}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {rel.title}
                      </h4>
                      <p className="text-xs text-slate-500">{rel.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
};
