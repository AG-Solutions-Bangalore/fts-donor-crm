import { Settings, User, LogOut, UserCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Logout from '../auth/log-out';
import { appLogout } from '@/utils/logout';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // 👉 GET CURRENT ROUTE

  const navItems = [
    { name: 'Dashboard', path: '/home' },
    { name: 'School', path: '/school' },
    { name: 'Receipt', path: '/receipt' },
  ];

  const handleLogoutConfirm = () => {
    appLogout();
    navigate('/');
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsLogoutOpen(true);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-100 to-amber-50 px-8 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center px-6 py-2 bg-white rounded-full border border-gray-300">
              <span className="font-medium text-gray-900">FTS Champ</span>
            </div>
          </div>

          {/* NAV ITEMS */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path; // 👉 ACTIVE CHECK

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-white/50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center gap-4">
            {/* Settings icon */}
            <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-700" />
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <User className="w-5 h-5 text-gray-700" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Modal */}
      <Logout
        open={isLogoutOpen}
        setOpen={setIsLogoutOpen}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default Navbar;
