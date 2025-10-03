import { Post, User } from '../types';
import { Calendar, User as UserIcon, Clock } from 'lucide-react';

interface PostCardProps {
  post: Post;
  author: User | undefined;
  onClick: () => void;
}

export const PostCard = ({ post, author, onClick }: PostCardProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  return (
    <article
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 overflow-hidden group"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
          {post.title}
        </h2>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <UserIcon size={16} />
            <span>{author?.username || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{getReadingTime(post.content)} min read</span>
          </div>
        </div>

        <p className="text-gray-700 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-blue-600 font-medium text-sm group-hover:underline">
            Read more →
          </span>
        </div>
      </div>
    </article>
  );
};
