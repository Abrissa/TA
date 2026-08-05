import React from 'react';
import { ArrowLeft, ArrowUpRight, Calendar, ChevronRight, MessageSquare, User } from 'lucide-react';
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
  const whatsappNumber = SCHOOL_INFO.whatsapp.replace(/\D/g, '');
  const relatedArticles = ARTICLES_DATA.filter((item) => item.id !== article.id).slice(0, 3);
  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="pb-16">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Berita
          </button>

          <div className="mt-8 max-w-4xl space-y-5 text-white">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-100 ring-1 ring-emerald-300/25">
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1 text-slate-200">
                <Calendar className="h-3.5 w-3.5" />
                {article.date}
              </span>
              <span className="inline-flex items-center gap-1 text-slate-200">
                <User className="h-3.5 w-3.5" />
                {article.author}
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
              {article.excerpt}
            </p>
          </div>
        </div>
      </section>

      <section className="relative -mt-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4 sm:px-8">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Ringkasan Artikel
                </p>
                <p className="mt-2 text-base font-semibold leading-relaxed text-slate-900 sm:text-lg">
                  {article.excerpt}
                </p>
              </div>

              <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-sm leading-8 text-slate-700 sm:text-[15px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Info Artikel
              </p>
              <div className="mt-4 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Tanggal Terbit
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">{article.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-600">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Penulis
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">{article.author}</p>
                    <p className="text-xs text-slate-500">{article.authorRole}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Artikel Terkait
              </p>

              <div className="mt-4 space-y-3">
                {relatedArticles.map((related) => (
                  <button
                    key={related.id}
                    onClick={() => onSelectArticle(related)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50/60"
                  >
                    <img
                      src={related.imageUrl}
                      alt={related.title}
                      className="h-16 w-16 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        {related.category}
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 group-hover:text-emerald-700">
                        {related.title}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">{related.date}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-600" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Akses Cepat
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Ingin melihat semua berita yang sudah tayang? Buka daftar artikel untuk mencari topik lain.
              </p>
              <button
                onClick={onBack}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 transition-colors hover:text-emerald-800"
              >
                Lihat daftar artikel
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            <button
            onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/60"
          >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Tanya Sekolah
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Hubungi panitia jika butuh info lanjutan
                </p>
              </div>
              <MessageSquare className="h-5 w-5 text-emerald-600" />
            </button>
          </aside>
        </div>
      </section>
    </article>
  );
};
