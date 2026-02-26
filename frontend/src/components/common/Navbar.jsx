import React from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, TrendingUp, LogOut, Eye } from 'lucide-react';

const Navbar = () => {
  const { user, logout, watchlist } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (['/login', '/signup'].includes(location.pathname)) {
    return null;
  }

  const baseLinkClass = "text-[13px] font-semibold tracking-wide px-3 py-2 rounded-lg transition-colors";
  const getLinkClass = ({ isActive }) =>
    `${baseLinkClass} ${
      isActive 
        ? "text-blue-600 dark:text-blue-500 bg-blue-50/50 dark:bg-blue-500/10" 
        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
    }`;

  const isAdmin = user?.role === 'admin';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        

        <Link to="/" className="flex items-center gap-2 group mr-12 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center group-hover:bg-blue-700 dark:group-hover:bg-blue-400 transition-colors">
            <TrendingUp size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 dark:text-white leading-none tracking-tight text-lg">
              Stocklet
            </span>
            {isAdmin && (
              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-500 tracking-widest uppercase mt-0.5">
                Admin Dashboard
              </span>
            )}
          </div>
        </Link>


        <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {user && (
            <>
              {isAdmin ? (
                <>
                  <NavLink to="/" className={getLinkClass}>Dashboard</NavLink>
                  <NavLink to="/admin" className={getLinkClass}>Requests</NavLink>
                  <NavLink to="/admin/users" className={getLinkClass}>Users</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/" className={getLinkClass}>Dashboard</NavLink>
                  <NavLink to="/market" className={getLinkClass}>Market</NavLink>
                  <NavLink to="/transactions" className={getLinkClass}>Transactions</NavLink>
                </>
              )}
            </>
          )}
        </div>


        <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-gray-100 dark:border-gray-800">
          {user ? (
            <>
              {!isAdmin && (
                <div className="hidden sm:flex items-center gap-2 mr-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                    <Eye size={16} />
                    <span className="text-xs font-semibold">Watchlist</span>
                    <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                      {watchlist?.length || 0}
                    </span>
                  </div>
                </div>
              )}

              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-100 dark:border-gray-800">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                    {isAdmin ? 'Admin' : 'User Account'}
                  </span>
                </div>
                
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-[#0f1115]">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <button 
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors ml-1"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
             <div className="flex items-center gap-3">
               <button 
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors mr-2"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
               </button>
               <Link 
                 to="/login"
                 className="text-[13px] font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
               >
                 Log in
               </Link>
               <Link 
                 to="/signup"
                 className="text-[13px] font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
               >
                 Sign up
               </Link>
             </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;