import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { BlogPost } from '../../types';
import { SafeImage } from '../../components/ui/SafeImage';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);

    db.getBlogPostBySlug(slug).then((data) => {
      if (data) {
        setPost(data);
        document.title = data.seo_title || `${data.title} | Blog NextWin`;
      }
      setIsLoading(false);
    });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-100"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-ink">Artigo não encontrado</h2>
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-semibold text-brand">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Voltar para todos os artigos
      </Link>

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
          <span>{post.category}</span>
          <span aria-hidden="true" className="text-muted">·</span>
          <span className="text-muted font-normal">{post.published_at}</span>
          <span aria-hidden="true" className="text-muted">·</span>
          <span className="text-muted font-normal">Por {post.author}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink  text-balance leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-muted leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      {/* Featured Image */}
      <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-white border border-line">
        <SafeImage
          src={post.cover_image}
          alt={post.title}
          fallbackTitle={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content body */}
      <div className="prose prose-slate prose-indigo max-w-none text-muted leading-relaxed space-y-4 text-sm sm:text-base">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl font-bold text-ink  pt-4">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
            return (
              <p key={idx} className="pl-4 border-l-2 border-blue-100 py-1 font-medium text-ink">
                {paragraph}
              </p>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* Footer Banner */}
      <div className="pt-10 border-t border-line">
        <div className="p-8 rounded-xl bg-gradient-to-r from-blue-50/60 to-violet-50/40 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold text-ink ">Gostou deste conteúdo?</h4>
            <p className="text-xs text-muted">Conheça nossos materiais completos e aprofunde seus conhecimentos.</p>
          </div>
          <Link
            to="/produtos"
            className="px-6 py-2.5 text-xs font-bold text-white bg-brand hover:bg-brand-strong rounded-lg whitespace-nowrap transition-colors"
          >
            Explorar Catálogo de Ebooks
          </Link>
        </div>
      </div>

    </article>
  );
};
