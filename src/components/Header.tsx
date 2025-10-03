import { useAuth } from '../context/AuthContext';
import { SquarePen as PenSquare, LogOut, User } from 'lucide-react';

interface HeaderProps {
  onAuthClick: () => void;
  onNewPostClick: () => void;
  onLogoClick: () => void;
}

export const Header = ({ onAuthClick, onNewPostClick, onLogoClick }: HeaderProps) => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={onLogoClick}
            className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition"
          >
            BlogPress
          </button>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={onNewPostClick}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <PenSquare size={18} />
                  <span className="hidden sm:inline">New Post</span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                      alt={user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="hidden sm:inline text-sm font-medium text-gray-700">
                      {user.username}
                    </span>
                  </div>

                  <button
                    onClick={signOut}
                    className="text-gray-600 hover:text-gray-900 transition"
                    title="Sign out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <User size={18} />
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
