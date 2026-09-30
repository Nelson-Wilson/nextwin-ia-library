import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../../types';
import { SafeImage } from '../ui/SafeImage';

export const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="group flex items-center gap-3 bg-white border border-line rounded-2xl p-3 shadow-card hover:shadow-soft transition-shadow h-full"
  >
    <div className="w-[88px] h-[88px] shrink-0 rounded-xl overflow-hidden bg-brand-soft">
      <SafeImage
        src={post.cover_image}
        alt={post.title}
        fallbackTitle={post.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div className="min-w-0 space-y-1">
      <span className="inline-block text-[10px] font-bold text-violet bg-violet-50 rounded-full px-2 py-0.5">{post.category}</span>
      <h3 className="text-xs font-extrabold text-ink leading-snug line-clamp-3">{post.title}</h3>
      {post.published_at && <p className="text-[10px] text-muted">{post.published_at}</p>}
    </div>
  </Link>
);
