import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  FiClock, FiCheckCircle, FiXCircle, FiCalendar, 
  FiBriefcase, FiMapPin, FiDollarSign, FiEye,
  FiTrendingUp, FiAlertCircle, FiTrash2
} from 'react-icons/fi';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    interview: 0,
    accepted: 0,
    rejected: 0
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      const apps = response.data.applications;
      console.log('Données reçues du backend:', apps);
      console.log('Nombre:', apps.length);
      if (apps.length > 0 && apps[0].status === 'interview') {
        console.log('Candidature entretien:', apps[0]);
        console.log('interviewDate:', apps[0].interviewDate);
        console.log('interviewLocation:', apps[0].interviewLocation);
        console.log('interviewNotes:', apps[0].interviewNotes);
      }
      
      setApplications(apps);
      
      setStats({
        total: apps.length,
        pending: apps.filter(a => a.status === 'pending').length,
        reviewed: apps.filter(a => a.status === 'reviewed').length,
        interview: apps.filter(a => a.status === 'interview').length,
        accepted: apps.filter(a => a.status === 'accepted').length,
        rejected: apps.filter(a => a.status === 'rejected').length
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des candidatures');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelApplication = async (applicationId, jobTitle) => {
    if (window.confirm(`Êtes-vous sûr de vouloir annuler votre candidature pour "${jobTitle}" ? Cette action est irréversible.`)) {
      setCancellingId(applicationId);
      try {
        await api.delete(`/applications/${applicationId}/cancel`);
        toast.success('Candidature annulée avec succès');
        fetchApplications();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Erreur lors de l\'annulation');
      } finally {
        setCancellingId(null);
      }
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { 
        label: 'En attente', 
        color: 'bg-yellow-100 text-yellow-700', 
        icon: FiClock,
        description: 'Votre candidature a été envoyée, le recruteur va l\'examiner',
        canCancel: true
      },
      reviewed: { 
        label: 'Examinée', 
        color: 'bg-blue-100 text-blue-700', 
        icon: FiEye,
        description: 'Le recruteur a consulté votre profil',
        canCancel: false
      },
      interview: { 
        label: 'Entretien', 
        color: 'bg-purple-100 text-purple-700', 
        icon: FiCalendar,
        description: 'Félicitations ! Vous êtes convoqué en entretien',
        canCancel: false
      },
      accepted: { 
        label: 'Acceptée', 
        color: 'bg-green-100 text-green-700', 
        icon: FiCheckCircle,
        description: 'Félicitations ! Votre candidature a été retenue',
        canCancel: false
      },
      rejected: { 
        label: 'Refusée', 
        color: 'bg-red-100 text-red-700', 
        icon: FiXCircle,
        description: 'Le recruteur a choisi un autre candidat',
        canCancel: false
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className={`bg-white rounded-xl shadow-sm p-4 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
          <Icon className={`text-xl ${color.replace('border-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes candidatures</h1>
          <p className="text-gray-500 mt-1">Suivez l'évolution de vos candidatures</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          <StatCard title="Total" value={stats.total} icon={FiBriefcase} color="border-gray-500" bgColor="bg-gray-100" />
          <StatCard title="En attente" value={stats.pending} icon={FiClock} color="border-yellow-500" bgColor="bg-yellow-50" />
          <StatCard title="Examinées" value={stats.reviewed} icon={FiEye} color="border-blue-500" bgColor="bg-blue-50" />
          <StatCard title="Entretien" value={stats.interview} icon={FiCalendar} color="border-purple-500" bgColor="bg-purple-50" />
          <StatCard title="Acceptées" value={stats.accepted} icon={FiCheckCircle} color="border-green-500" bgColor="bg-green-50" />
          <StatCard title="Refusées" value={stats.rejected} icon={FiXCircle} color="border-red-500" bgColor="bg-red-50" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Toutes ({stats.total})</button>
            <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>En attente ({stats.pending})</button>
            <button onClick={() => setFilter('interview')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'interview' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Entretien ({stats.interview})</button>
            <button onClick={() => setFilter('accepted')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'accepted' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Acceptées ({stats.accepted})</button>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBriefcase className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune candidature</h3>
            <p className="text-gray-500 mb-6">
              {filter !== 'all' ? "Aucune candidature dans cette catégorie" : "Vous n'avez pas encore postulé à des offres d'emploi"}
            </p>
            {filter === 'all' && (
              <Link to="/jobs" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition">
                Voir les offres
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const StatusInfo = getStatusInfo(app.status);
              const StatusIcon = StatusInfo.icon;
              return (
                <div key={app._id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                  <div className={`h-1 ${app.status === 'pending' ? 'bg-yellow-500' : app.status === 'reviewed' ? 'bg-blue-500' : app.status === 'interview' ? 'bg-purple-500' : app.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`} />
                  
                  <div className="p-5">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div className="flex-1">
                        <Link to={`/jobs/${app.job._id}`}>
                          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-1">
                            {app.job.title}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-600 font-medium mb-2">{app.job.company}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1"><FiMapPin size={14} /> {app.job.location}</span>
                          <span className="flex items-center gap-1"><FiBriefcase size={14} /> {app.job.type}</span>
                          {app.job.salary?.min && (
                            <span className="flex items-center gap-1"><FiDollarSign size={14} /> {app.job.salary.min} - {app.job.salary.max} {app.job.salary.currency}</span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${StatusInfo.color}`}>
                            <StatusIcon size={14} /> {StatusInfo.label}
                          </span>
                          <span className="text-xs text-gray-400">Postulé le {new Date(app.appliedAt).toLocaleDateString()}</span>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-3">{StatusInfo.description}</p>

                        {/* AFFICHAGE DE LA DATE D'ENTRETIEN - VERSION CORRIGÉE (sans condition sur interviewDate) */}
                        {app.status === 'interview' && (
                          <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                            <p className="text-sm font-medium text-purple-700 flex items-center gap-2">
                              <FiCalendar size={14} /> Entretien programmé
                            </p>
                            {(() => {
                              console.log('Affichage entretien pour app:', app);
                              console.log('interviewDate:', app.interviewDate);
                              console.log('interviewLocation:', app.interviewLocation);
                              console.log('interviewNotes:', app.interviewNotes);
                              return null;
                            })()}
                            {app.interviewDate ? (
                              <>
                                <p className="text-sm text-purple-600 mt-1">
                                  📅 {new Date(app.interviewDate).toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                                <p className="text-sm text-purple-600">
                                  ⏰ à {new Date(app.interviewDate).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm text-purple-600 mt-1">📅 Date à définir</p>
                            )}
                            {app.interviewLocation && (
                              <p className="text-sm text-purple-600 mt-1">📍 {app.interviewLocation}</p>
                            )}
                            {app.interviewNotes && (
                              <p className="text-sm text-purple-600 mt-1">📝 {app.interviewNotes}</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        <Link to={`/jobs/${app.job._id}`} className="flex items-center justify-center gap-2 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                          <FiEye size={14} /> Voir l'offre
                        </Link>
                        
                        {app.status === 'pending' && (
                          <button onClick={() => handleCancelApplication(app._id, app.job.title)} disabled={cancellingId === app._id} className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50">
                            {cancellingId === app._id ? (
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <FiTrash2 size={14} />
                            )}
                            Annuler ma candidature
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Lettre de motivation */}
                    {app.coverLetter && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400 mb-1">Votre message :</p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {app.coverLetter.length > 150 ? app.coverLetter.substring(0, 150) + '...' : app.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Tips Section */}
        {applications.length > 0 && (
          <div className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <FiTrendingUp className="text-blue-500 text-xl mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Conseils pour augmenter vos chances</p>
                <p className="text-xs text-blue-600 mt-1">
                  Personnalisez chaque candidature, mettez à jour votre CV régulièrement, 
                  et soyez réactif aux messages des recruteurs.
                  {stats.pending > 0 && (
                    <span className="block mt-1">
                      💡 Vous avez {stats.pending} candidature(s) en attente. 
                      Vous pouvez les annuler tant qu'elles n'ont pas été traitées.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;