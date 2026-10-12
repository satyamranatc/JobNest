import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  User2, 
  LogOut, 
  LayoutDashboard, 
  Briefcase, 
  Building2 
} from 'lucide-react';

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check login and role state whenever route changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    setIsLoggedIn(Boolean(token));

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/auth');
  };

  const isCompany = user?.type === 'Company';

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md sticky top-0 z-40 backdrop-blur-md">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <span className="text-2xl font-black tracking-tight text-white group-hover:scale-105 transition-transform">
          JobNest
        </span>
      </Link>

      {/* Nav Links */}
      <ul className="flex items-center gap-3 sm:gap-6">
        {/* Home */}
        <li>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium hover:text-slate-200 transition px-2 py-1"
          >
            <HomeIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>

        {/* ROLE BASED NAV LINK */}
        {isLoggedIn ? (
          <>
            {isCompany ? (
              // COMPANY VIEW: Show Dashboard
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-xl text-sm font-semibold transition"
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-200" />
                  <span>Dashboard</span>
                  <span className="hidden md:inline-block text-[10px] bg-purple-200 text-purple-900 font-bold px-1.5 py-0.2 rounded-md uppercase ml-1">
                    Company
                  </span>
                </Link>
              </li>
            ) : (
              // CANDIDATE VIEW: Show Jobs
              <li>
                <Link
                  to="/jobs"
                  className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-xl text-sm font-semibold transition"
                >
                  <Briefcase className="w-4 h-4 text-blue-200" />
                  <span>Jobs</span>
                  <span className="hidden md:inline-block text-[10px] bg-blue-200 text-blue-900 font-bold px-1.5 py-0.2 rounded-md uppercase ml-1">
                    Candidate
                  </span>
                </Link>
              </li>
            )}

            {/* Profile Link */}
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-1.5 hover:text-slate-200 text-sm font-medium transition px-2 py-1"
              >
                <User2 className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
            </li>

            {/* Logout Button */}
            <li>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </li>
          </>
        ) : (
          // GUEST / NOT LOGGED IN
          <>
            <li>
              <Link
                to="/jobs"
                className="flex items-center gap-1.5 text-sm font-medium hover:text-slate-200 transition px-2 py-1"
              >
                <Briefcase className="w-4 h-4" />
                <span>Jobs</span>
              </Link>
            </li>
            <li>
              <Link
                to="/auth"
                className="bg-white text-blue-600 hover:bg-slate-100 px-4 py-1.5 rounded-xl font-semibold text-sm transition shadow-sm"
              >
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
