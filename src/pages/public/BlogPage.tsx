import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { BlogPost } from '../../types';
import { SafeImage } from '../../components/ui/SafeImage';
import { ArrowRight, Calendar, User } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    db.getBlogPosts().then((data) => {
      setPosts(data.filter(p => p.published));
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">Artigos & Tutoriais</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink ">
          Blog NextWin AI
        </h1>
        <p className="text-muted text-sm sm:text-base max-w-2xl leading-relaxed">
          Estratégias avançadas, guias de engenharia de prompts, notícias e métodos práticos para aplicar IA em estudos e negócios digitais.
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-100"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-20 text-center text-muted text-sm">
          Nenhum artigo publicado no momento.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-white border border-line rounded-xl overflow-hidden hover:border-line transition duration-300 flex flex-col justify-between"
            >
              <div>
                <Link to={`/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden bg-white">
                  <SafeImage
                    src={post.cover_image}
                    alt={post.title}
                    fallbackTitle={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </Link>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-brand uppercase tracking-wider">
                    <span>{post.category}</span>
                    <span aria-hidden="true" className="text-muted">·</span>
                    <span className="text-muted">{post.published_at}</span>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-lg font-bold text-ink group-hover:text-brand-strong transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-muted line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-line flex items-center justify-between text-xs">
                <span className="text-muted">Por {post.author}</span>
                <Link
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 font-semibold text-brand group-hover:text-brand-strong"
                >
                  <span>Ler artigo</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  );
};
