import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import { MessageSquare, Trash2 } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const { user } = useAuth();
  const { getCommentsByPostId, createComment, deleteComment } = useBlog();
  const [content, setContent] = useState('');

  const comments = getCommentsByPostId(postId);
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please sign in to comment');
      return;
    }

    if (!content.trim()) {
      return;
    }

    createComment({
      postId,
      userId: user.id,
      content: content.trim()
    });

    setContent('');
  };

  const handleDelete = (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteComment(commentId);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <MessageSquare size={24} />
        Comments ({comments.length})
      </h3>

      {user && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Write a comment..."
            required
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Post Comment
            </button>
          </div>
        </form>
      )}

      {!user && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">Please sign in to leave a comment</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map(comment => {
              const commentAuthor = users.find((u: { id: string }) => u.id === comment.userId);
              const isCommentAuthor = user?.id === comment.userId;

              return (
                <div
                  key={comment.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={commentAuthor?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${commentAuthor?.username}`}
                        alt={commentAuthor?.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {commentAuthor?.fullName || commentAuthor?.username || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                    </div>

                    {isCommentAuthor && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded transition"
                        title="Delete comment"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap ml-13">
                    {comment.content}
                  </p>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};
