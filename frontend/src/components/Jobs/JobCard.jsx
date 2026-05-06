import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiMapPin, FiBriefcase, FiDollarSign, FiClock, 
  FiHeart, FiShare2, FiBookmark, FiArrowRight,
  FiAward, FiTrendingUp, FiStar
} from 'react-icons/fi';

const JobCard = ({ job, viewMode = 'grid' }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const getTypeStyles = (type) => {
    const styles = {
      'Full-time': 'bg-emerald-100 text-emerald-700',
      'Part-time': 'bg-amber-100 text-amber-700',
      'Remote': 'bg-blue-100 text-blue-700',
      'Contract': 'bg-purple-100 text-purple-700',
      'Internship': 'bg-orange-100 text-orange-700'
    };
    return styles[type] || 'bg-gray-100 text-gray-700';
  };

  const getDaysAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return "Hier";
    return `Il y a ${diff} jours`;
  };

  const getUrgencyLevel = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (diff <= 3) return { label: 'Nouveau', color: 'bg-red-100 text-red-700' };
    if (diff <= 7) return { label: 'Urgent', color: 'bg-orange-100 text-orange-700' };
    return null;
  };

  const urgency = getUrgencyLevel(job.createdAt);

  // Grid View
  if (viewMode === 'grid') {
    return (
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 overflow-hidden">
        {/* Image d'en-tête */}
        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        
        <div className="p-6">
          {/* Header avec icône entreprise */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg">
                {job.company?.charAt(0) || 'C'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  <Link to={`/jobs/${job._id}`} className="hover:text-blue-600 transition-colors">
                    {job.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500">{job.company}</p>
              </div>
            </div>
            
            <div className="flex gap-1">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <FiHeart className={isLiked ? 'fill-red-500 text-red-500' : ''} size={18} />
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <FiBookmark className={isSaved ? 'fill-blue-500 text-blue-500' : ''} size={18} />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getTypeStyles(job.type)}`}>
              {job.type}
            </span>
            {urgency && (
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${urgency.color}`}>
                {urgency.label}
              </span>
            )}
            {job.featured && (
              <span className="px-2 py-1 rounded-lg text-xs font-medium bg-yellow-100 text-yellow-700">
                <FiStar className="inline mr-1" size={10} />
                À la une
              </span>
            )}
          </div>

          {/* Détails */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-500 text-sm">
              <FiMapPin className="mr-2 flex-shrink-0" size={14} />
              <span>{job.location}</span>
            </div>
            {job.salary?.min && (
              <div className="flex items-center text-gray-500 text-sm">
                <FiDollarSign className="mr-2 flex-shrink-0" size={14} />
                <span>{job.salary.min} - {job.salary.max} {job.salary.currency}/an</span>
              </div>
            )}
            <div className="flex items-center text-gray-400 text-xs">
              <FiClock className="mr-1" size={12} />
              <span>Publié {getDaysAgo(job.createdAt)}</span>
            </div>
          </div>

          {/* Tags compétences */}
          <div className="flex flex-wrap gap-1 mb-4">
            {job.requirements?.slice(0, 3).map((req, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {req}
              </span>
            ))}
            {job.requirements?.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                +{job.requirements.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <FiBriefcase size={12} />
              <span>{job.applicationsCount || 0} candidatures</span>
            </div>
            <Link
              to={`/jobs/${job._id}`}
              className="inline-flex items-center gap-1 text-blue-600 font-medium text-sm hover:gap-2 transition-all"
            >
              Postuler
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Logo */}
        <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
          {job.company?.charAt(0) || 'C'}
        </div>
        
        {/* Contenu principal */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Link to={`/jobs/${job._id}`}>
              <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
            </Link>
            <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getTypeStyles(job.type)}`}>
              {job.type}
            </span>
            {urgency && (
              <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${urgency.color}`}>
                {urgency.label}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{job.company}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <FiMapPin size={14} />
              <span>{job.location}</span>
            </div>
            {job.salary?.min && (
              <div className="flex items-center gap-1">
                <FiDollarSign size={14} />
                <span>{job.salary.min} - {job.salary.max} {job.salary.currency}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <FiClock size={14} />
              <span>{getDaysAgo(job.createdAt)}</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job._id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Postuler
          </Link>
          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <FiHeart className={isLiked ? 'fill-red-500 text-red-500' : ''} size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;