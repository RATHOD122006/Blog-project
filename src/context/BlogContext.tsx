import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Post, Comment } from '../types';

interface BlogContextType {
  posts: Post[];
  comments: Comment[];
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  getPost: (slug: string) => Post | undefined;
  createComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  deleteComment: (id: string) => void;
  getCommentsByPostId: (postId: string) => Comment[];
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const storedPosts = localStorage.getItem('posts');
    const storedComments = localStorage.getItem('comments');

    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts);
      setPosts(parsedPosts.map((p: Post) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt)
      })));
    }

    if (storedComments) {
      const parsedComments = JSON.parse(storedComments);
      setComments(parsedComments.map((c: Comment) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt)
      })));
    }
  }, []);

  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
  };

  const saveComments = (newComments: Comment[]) => {
    setComments(newComments);
    localStorage.setItem('comments', JSON.stringify(newComments));
  };

  const createPost = (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: Post = {
      ...post,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    savePosts([...posts, newPost]);
  };

  const updatePost = (id: string, updatedPost: Partial<Post>) => {
    const newPosts = posts.map(post =>
      post.id === id
        ? { ...post, ...updatedPost, updatedAt: new Date() }
        : post
    );
    savePosts(newPosts);
  };

  const deletePost = (id: string) => {
    savePosts(posts.filter(post => post.id !== id));
    saveComments(comments.filter(comment => comment.postId !== id));
  };

  const getPost = (slug: string) => {
    return posts.find(post => post.slug === slug);
  };

  const createComment = (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    saveComments([...comments, newComment]);
  };

  const deleteComment = (id: string) => {
    saveComments(comments.filter(comment => comment.id !== id));
  };

  const getCommentsByPostId = (postId: string) => {
    return comments.filter(comment => comment.postId === postId);
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        comments,
        createPost,
        updatePost,
        deletePost,
        getPost,
        createComment,
        deleteComment,
        getCommentsByPostId
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
