import { useBlog } from '../context/BlogContext';
import { PostCard } from './PostCard';

interface PostListProps {
  onPostClick: (slug: string) => void;
}

export const PostList = ({ onPostClick }: PostListProps) => {
  const { posts } = useBlog();

  const publishedPosts = posts
    .filter(post => post.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getUsers = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users;
  };

  const users = getUsers();

  if (publishedPosts.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No posts yet</h2>
        <p className="text-gray-600">Be the first to create a post!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {publishedPosts.map(post => {
        const author = users.find((u: { id: string }) => u.id === post.authorId);
        return (
          <PostCard
            key={post.id}
            post={post}
            author={author}
            onClick={() => onPostClick(post.slug)}
          />
        );
      })}
    </div>
  );
};
