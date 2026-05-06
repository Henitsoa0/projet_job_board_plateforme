import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiBriefcase, FiGithub, FiLinkedin, FiTwitter, 
  FiMail, FiPhone, FiMapPin, FiHeart, FiShield,
  FiUser, FiFileText, FiList, FiPlusCircle
} from 'react-icons/fi';

const Footer = () => {
  const { isAuthenticated, isRecruiter, isCandidate, isAdmin, user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          
          {/* Brand - Colonne 1 */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <FiBriefcase className="text-white text-xl" />
              </div>
              <span className="font-bold text-xl text-white">JobBoard</span>
              {isAdmin && (
                <span className="ml-2 text-xs bg-purple-800 text-purple-200 px-2 py-0.5 rounded-full">
                  Admin
                </span>
              )}
              {isRecruiter && (
                <span className="ml-2 text-xs bg-blue-800 text-blue-200 px-2 py-0.5 rounded-full">
                  Recruteur
                </span>
              )}
              {isCandidate && (
                <span className="ml-2 text-xs bg-green-800 text-green-200 px-2 py-0.5 rounded-full">
                  Candidat
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              La plateforme qui connecte les talents avec les meilleures entreprises.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiGithub size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Navigation principale - Colonne 2 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Accueil</Link></li>
              <li><Link to="/jobs" className="hover:text-white transition-colors">Offres d'emploi</Link></li>
            </ul>
          </div>

          {/* Espace Candidat - Colonne 3 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Candidats</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">🔍 Rechercher un emploi</Link></li>
              {!isAuthenticated && (
                <li><Link to="/register" className="hover:text-white transition-colors">📝 Créer un compte candidat</Link></li>
              )}
              {isAuthenticated && isCandidate && (
                <>
                  <li><Link to="/my-applications" className="hover:text-white transition-colors flex items-center gap-1">
                    <FiFileText size={12} /> Mes candidatures
                  </Link></li>
                  <li><Link to="/profile" className="hover:text-white transition-colors flex items-center gap-1">
                    <FiUser size={12} /> Mon profil
                  </Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Espace Recruteur - Colonne 4 */}
          <div>
            <h3 className="text-white font-semibold mb-4">Recruteurs</h3>
            <ul className="space-y-2 text-sm">
              {!isAuthenticated && (
                <li><Link to="/register?role=recruiter" className="hover:text-white transition-colors">🚀 Créer un compte recruteur</Link></li>
              )}
              {isAuthenticated && isRecruiter && (
                <>
                  <li><Link to="/post-job" className="hover:text-white transition-colors flex items-center gap-1">
                    <FiPlusCircle size={12} /> Publier une offre
                  </Link></li>
                  <li><Link to="/my-jobs" className="hover:text-white transition-colors flex items-center gap-1">
                    <FiList size={12} /> Mes offres
                  </Link></li>
                  <li><Link to="/profile" className="hover:text-white transition-colors flex items-center gap-1">
                    <FiUser size={12} /> Mon profil entreprise
                  </Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Admin - Colonne 5 (visible uniquement pour admin) */}
          {isAdmin && (
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-1">
                <FiShield size={14} /> Administration
              </h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/admin" className="hover:text-purple-300 transition-colors">📊 Dashboard</Link></li>
                <li><Link to="/admin/users" className="hover:text-purple-300 transition-colors">👥 Gérer utilisateurs</Link></li>
                <li><Link to="/admin/jobs" className="hover:text-purple-300 transition-colors">💼 Gérer offres</Link></li>
              </ul>
            </div>
          )}

          {/* Contact - Colonne 5 (si pas admin) */}
          {!isAdmin && (
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><FiMail size={14} /> contact@jobboard.com</li>
                <li className="flex items-center gap-2"><FiPhone size={14} /> +33 1 23 45 67 89</li>
                <li className="flex items-center gap-2"><FiMapPin size={14} /> Paris, France</li>
              </ul>
            </div>
          )}
        </div>

        {/* Si admin, afficher contact en bas */}
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2 text-gray-400 text-sm"><FiMail size={14} /> contact@jobboard.com</div>
            <div className="flex items-center gap-2 text-gray-400 text-sm"><FiPhone size={14} /> +33 1 23 45 67 89</div>
            <div className="flex items-center gap-2 text-gray-400 text-sm"><FiMapPin size={14} /> Paris, France</div>
          </div>
        )}

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span>Made with <FiHeart className="inline text-red-500" /> by JobBoard Team</span>
            </div>
            
            <div className="text-center">
              &copy; {currentYear} JobBoard. Tous droits réservés.
            </div>
            
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <span className="text-xs">Connecté en tant que :</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isAdmin ? 'bg-purple-800 text-purple-200' :
                  isRecruiter ? 'bg-blue-800 text-blue-200' :
                  'bg-green-800 text-green-200'
                }`}>
                  {user?.role === 'admin' ? 'Administrateur' : 
                   user?.role === 'recruiter' ? 'Recruteur' : 'Candidat'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;