import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiBriefcase, FiUser, FiLogOut, FiMenu, FiX, 
  FiHome, FiSearch, FiFileText, FiPlusCircle, FiList,
  FiShield
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated, isRecruiter, isCandidate, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-1.5 rounded-xl">
              <FiBriefcase className="text-white text-xl" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              JobBoard
            </span>
            {isAdmin && (
              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                Admin
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Accueil */}
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiHome size={18} />
              <span>Accueil</span>
            </Link>
            
            {/* Offres */}
            <Link
              to="/jobs"
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                isActive('/jobs') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FiSearch size={18} />
              <span>Offres</span>
            </Link>

            {/* Admin Dashboard - visible uniquement pour les admins */}
            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  isActive('/admin') ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiShield size={18} />
                <span>Admin</span>
              </Link>
            )}

            {/* Recruteur - visible uniquement pour les recruteurs */}
            {isAuthenticated && isRecruiter && (
              <>
                <Link
                  to="/post-job"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    isActive('/post-job') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FiPlusCircle size={18} />
                  <span>Publier</span>
                </Link>
                <Link
                  to="/my-jobs"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    isActive('/my-jobs') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FiList size={18} />
                  <span>Mes offres</span>
                </Link>
              </>
            )}

            {/* Candidat - visible uniquement pour les candidats */}
            {isAuthenticated && isCandidate && (
              <Link
                to="/my-applications"
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  isActive('/my-applications') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiFileText size={18} />
                <span>Mes candidatures</span>
              </Link>
            )}

            {/* Utilisateur connecté (tous rôles) */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FiUser size={18} />
                  <span>{user?.name?.split(' ')[0] || 'Profil'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-2 flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200"
                >
                  <FiLogOut size={18} />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              /* Utilisateur non connecté */
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-100 text-gray-600"
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <FiHome size={18} />
              <span>Accueil</span>
            </Link>
            
            <Link 
              to="/jobs" 
              onClick={() => setIsOpen(false)} 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              <FiSearch size={18} />
              <span>Offres</span>
            </Link>

            {/* Admin Dashboard - mobile */}
            {isAuthenticated && isAdmin && (
              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-purple-600 bg-purple-50"
              >
                <FiShield size={18} />
                <span>Dashboard Admin</span>
              </Link>
            )}

            {/* Recruteur - mobile */}
            {isAuthenticated && isRecruiter && (
              <>
                <Link 
                  to="/post-job" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <FiPlusCircle size={18} />
                  <span>Publier une offre</span>
                </Link>
                <Link 
                  to="/my-jobs" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <FiList size={18} />
                  <span>Mes offres</span>
                </Link>
              </>
            )}

            {/* Candidat - mobile */}
            {isAuthenticated && isCandidate && (
              <Link 
                to="/my-applications" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <FiFileText size={18} />
                <span>Mes candidatures</span>
              </Link>
            )}

            {/* Utilisateur connecté - mobile */}
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  onClick={() => setIsOpen(false)} 
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <FiUser size={18} />
                  <span>Mon profil</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
                >
                  <FiLogOut size={18} />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              /* Non connecté - mobile */
              <>
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="block px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Connexion
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsOpen(false)} 
                  className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg text-center"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;