import { useState, useEffect } from 'react';
import { Post, User } from '../types';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { ArrowLeft, Calendar, User as UserIcon, Clock, CreditCard as Edit2, Trash2 } from 'lucide-react';
import { CommentSection } from './CommentSection';

interface PostDetailProps {
  slug: string;
  onBack: () => void;
  onEdit: (post: Post) => void;
}

export const PostDetail = ({ slug, onBack, onEdit }: PostDetailProps) => {
  const { user } = useAuth();
  const { getPost, deletePost } = useBlog();
  const [post, setPost] = useState<Post | undefined>();
  const [author, setAuthor] = useState<User | undefined>();

  useEffect(() => {
    const foundPost = getPost(slug);
    setPost(foundPost);

    if (foundPost) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundAuthor = users.find((u: User) => u.id === foundPost.authorId);
      setAuthor(foundAuthor);
    }
  }, [slug, getPost]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900">Post not found</h2>
        </div>
      </div>
    );
  }

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

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(post.id);
      onBack();
    }
  };

  const isAuthor = user?.id === post.authorId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition"
      >
        <ArrowLeft size={20} />
        Back to all posts
      </button>

      <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <img
                  src={author?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author?.username}`}
                  alt={author?.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-1 font-medium text-gray-900">
                    <UserIcon size={14} />
                    <span>{author?.fullName || author?.username || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{getReadingTime(post.content)} min read</span>
              </div>
            </div>

            {isAuthor && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(post)}
                  className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {post.content}
            </div>
          </div>
        </div>
      </article>

      <div className="mt-8">
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
};
