import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiSearch, FiBriefcase, FiUsers, FiAward, 
  FiTrendingUp, FiShield, FiArrowRight, FiStar 
} from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FiSearch,
      title: 'Recherche intelligente',
      description: 'Trouvez l\'emploi parfait avec nos filtres avancés',
      color: 'bg-blue-500'
    },
    {
      icon: FiShield,
      title: 'Offres vérifiées',
      description: 'Toutes nos offres sont authentifiées',
      color: 'bg-green-500'
    },
    {
      icon: FiTrendingUp,
      title: 'Carrière en croissance',
      description: 'Rejoignez les meilleures entreprises',
      color: 'bg-purple-500'
    },
    {
      icon: FiUsers,
      title: 'Communauté active',
      description: 'Plus de 10 000 professionnels',
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Offres d\'emploi' },
    { value: '5K+', label: 'Entreprises' },
    { value: '50K+', label: 'Candidats' },
    { value: '95%', label: 'Taux de satisfaction' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <FiStar className="text-yellow-400" />
              <span className="text-white text-sm">Plateforme #1 en France</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Trouvez l'emploi qui
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                {' '}vous correspond
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Des milliers d'offres d'emploi dans les meilleures entreprises. 
              Votre prochaine opportunité professionnelle vous attend.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiSearch size={20} />
                Rechercher un emploi
                <FiArrowRight size={18} />
              </Link>
              
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-200"
                >
                  <FiBriefcase size={20} />
                  Publier une offre
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète pour faciliter votre recherche d'emploi
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à commencer votre recherche ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de candidats qui ont trouvé leur emploi idéal
          </p>
          <Link
            to={isAuthenticated ? "/jobs" : "/register"}
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg"
          >
            {isAuthenticated ? "Voir les offres" : "Créer un compte gratuit"}
            <FiArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;