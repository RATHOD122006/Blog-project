import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import { Header } from './components/Header';
import { Auth } from './components/Auth';
import { PostEditor } from './components/PostEditor';
import { PostList } from './components/PostList';
import { PostDetail } from './components/PostDetail';
import { Post } from './types';

type View = 'list' | 'detail' | 'editor';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [view, setView] = useState<View>('list');
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [editingPost, setEditingPost] = useState<Post | undefined>();

  const handlePostClick = (slug: string) => {
    setSelectedSlug(slug);
    setView('detail');
  };

  const handleNewPost = () => {
    setEditingPost(undefined);
    setView('editor');
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setView('editor');
  };

  const handleCloseEditor = () => {
    setEditingPost(undefined);
    setView('list');
  };

  const handleBack = () => {
    setView('list');
    setSelectedSlug('');
  };

  const handleLogoClick = () => {
    setView('list');
    setSelectedSlug('');
  };

  return (
    <AuthProvider>
      <BlogProvider>
        <div className="min-h-screen bg-gray-50">
          <Header
            onAuthClick={() => setShowAuth(true)}
            onNewPostClick={handleNewPost}
            onLogoClick={handleLogoClick}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {view === 'list' && <PostList onPostClick={handlePostClick} />}
            {view === 'detail' && (
              <PostDetail
                slug={selectedSlug}
                onBack={handleBack}
                onEdit={handleEditPost}
              />
            )}
          </main>

          {showAuth && <Auth onClose={() => setShowAuth(false)} />}
          {view === 'editor' && (
            <PostEditor post={editingPost} onClose={handleCloseEditor} />
          )}
        </div>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;
