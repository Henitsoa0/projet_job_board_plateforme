import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  FiArrowLeft, FiUser, FiMail, FiCalendar, FiDownload,
  FiCheckCircle, FiXCircle, FiClock, FiEye, FiPhone,
  FiMessageSquare, FiDollarSign, FiBriefcase, FiMapPin
} from 'react-icons/fi';

const JobApplications = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('all');

  // États pour le modal d'entretien
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [currentAppId, setCurrentAppId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false); // Nouveau: mode édition
  const [interviewData, setInterviewData] = useState({
    date: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    fetchJobAndApplications();
  }, [id]);

  const fetchJobAndApplications = async () => {
    try {
      const jobRes = await api.get(`/jobs/${id}`);
      setJob(jobRes.data.job);
      
      const appsRes = await api.get(`/applications/job/${id}`);
      setApplications(appsRes.data.applications || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des candidatures');
      navigate('/my-jobs');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    // Si le statut est "interview", ouvrir le modal pour saisir la date
    if (newStatus === 'interview') {
      setCurrentAppId(applicationId);
      setShowInterviewModal(true);
      return;
    }
    
    // Pour les autres statuts, mise à jour directe
    setUpdatingId(applicationId);
    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      toast.success(`Statut mis à jour avec succès`);
      fetchJobAndApplications();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour du statut';
      toast.error(errorMessage);
    } finally {
      setUpdatingId(null);
    }
  };

  // Fonction pour ouvrir le modal en mode édition
  const editInterview = (application) => {
    setCurrentAppId(application._id);
    setIsEditMode(true);
    
    // Pré-remplir avec les données existantes
    const interviewDate = application.interviewDate ? 
      new Date(application.interviewDate).toISOString().slice(0, 16) : '';
    
    setInterviewData({
      date: interviewDate,
      location: application.interviewLocation || '',
      notes: application.interviewNotes || ''
    });
    setShowInterviewModal(true);
  };

  // Fonction pour confirmer l'entretien avec date
  const confirmInterview = async () => {
    if (!interviewData.date) {
      toast.error('Veuillez saisir une date');
      return;
    }
    
    setUpdatingId(currentAppId);
    try {
      await api.put(`/applications/${currentAppId}/status`, {
        status: 'interview',
        interviewDate: interviewData.date,
        interviewLocation: interviewData.location,
        interviewNotes: interviewData.notes
      });
      
      const message = isEditMode ? 'Entretien modifié avec succès' : 'Entretien programmé avec succès';
      toast.success(message);
      setShowInterviewModal(false);
      setInterviewData({ date: '', location: '', notes: '' });
      setIsEditMode(false);
      fetchJobAndApplications();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la ' + (isEditMode ? 'modification' : 'programmation'));
    } finally {
      setUpdatingId(null);
      setCurrentAppId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: FiClock },
      reviewed: { label: 'Examinée', color: 'bg-blue-100 text-blue-700', icon: FiEye },
      interview: { label: 'Entretien', color: 'bg-purple-100 text-purple-700', icon: FiCalendar },
      accepted: { label: 'Acceptée', color: 'bg-green-100 text-green-700', icon: FiCheckCircle },
      rejected: { label: 'Refusée', color: 'bg-red-100 text-red-700', icon: FiXCircle }
    };
    return statusMap[status] || statusMap.pending;
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    interview: applications.filter(a => a.status === 'interview').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

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
        <button
          onClick={() => navigate('/my-jobs')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <FiArrowLeft size={18} />
          Retour à mes offres
        </button>

        {job && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-500 text-sm">
              <span className="flex items-center gap-1"><FiBriefcase size={14} /> {job.company}</span>
              <span className="flex items-center gap-1"><FiMapPin size={14} /> {job.location}</span>
              <span className="flex items-center gap-1">{job.type === 'Full-time' ? 'Temps plein' : job.type === 'Part-time' ? 'Temps partiel' : job.type === 'Remote' ? 'Remote' : job.type}</span>
              <span className="text-green-600 font-medium">{stats.total} candidature{stats.total > 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-3 text-center border-t-4 border-gray-500"><p className="text-xl font-bold">{stats.total}</p><p className="text-xs text-gray-500">Total</p></div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center border-t-4 border-yellow-500"><p className="text-xl font-bold">{stats.pending}</p><p className="text-xs text-gray-500">En attente</p></div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center border-t-4 border-blue-500"><p className="text-xl font-bold">{stats.reviewed}</p><p className="text-xs text-gray-500">Examinées</p></div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center border-t-4 border-purple-500"><p className="text-xl font-bold">{stats.interview}</p><p className="text-xs text-gray-500">Entretien</p></div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center border-t-4 border-green-500"><p className="text-xl font-bold">{stats.accepted}</p><p className="text-xs text-gray-500">Acceptées</p></div>
          <div className="bg-white rounded-xl shadow-sm p-3 text-center border-t-4 border-red-500"><p className="text-xl font-bold">{stats.rejected}</p><p className="text-xs text-gray-500">Refusées</p></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Toutes ({stats.total})</button>
            <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>En attente ({stats.pending})</button>
            <button onClick={() => setFilter('reviewed')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'reviewed' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Examinées ({stats.reviewed})</button>
            <button onClick={() => setFilter('interview')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'interview' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Entretien ({stats.interview})</button>
            <button onClick={() => setFilter('accepted')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'accepted' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Acceptées ({stats.accepted})</button>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><FiUser className="text-3xl text-gray-400" /></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune candidature</h3>
            <p className="text-gray-500">{filter !== 'all' ? "Aucune candidature dans cette catégorie" : "Cette offre n'a pas encore reçu de candidatures"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const StatusBadge = getStatusBadge(app.status);
              const StatusIcon = StatusBadge.icon;
              const candidate = app.candidate || {};
              return (
                <div key={app._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`h-1 ${app.status === 'pending' ? 'bg-yellow-500' : app.status === 'reviewed' ? 'bg-blue-500' : app.status === 'interview' ? 'bg-purple-500' : app.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`} />
                  <div className="p-5">
                    <div className="flex flex-wrap md:flex-nowrap gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">{candidate.name?.charAt(0) || '?'}</div>
                          <div><h3 className="font-semibold text-gray-900">{candidate.name || 'Candidat'}</h3><p className="text-sm text-gray-500 flex items-center gap-1"><FiMail size={12} /> {candidate.email || 'Email non disponible'}</p></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 text-sm">
                          {candidate.profile?.phone && (<div className="flex items-center gap-2 text-gray-600"><FiPhone size={14} /> {candidate.profile.phone}</div>)}
                          {candidate.profile?.location && (<div className="flex items-center gap-2 text-gray-600"><FiMapPin size={14} /> {candidate.profile.location}</div>)}
                          <div className="flex items-center gap-2 text-gray-500"><FiCalendar size={14} /> Postulé le {new Date(app.appliedAt).toLocaleDateString()}</div>
                        </div>
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-4 ${StatusBadge.color}`}>
                          <StatusIcon size={14} /> {StatusBadge.label}
                        </div>
                        
                        {/* Afficher les infos d'entretien si existantes */}
                        {app.status === 'interview' && (
                          <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-sm font-medium text-purple-700">📅 Entretien programmé</p>
                              <button
                                onClick={() => editInterview(app)}
                                className="text-xs text-purple-600 hover:text-purple-800 underline"
                              >
                                Modifier
                              </button>
                            </div>
                            {app.interviewDate ? (
                              <>
                                <p className="text-sm text-purple-600">
                                  {new Date(app.interviewDate).toLocaleDateString()} à {new Date(app.interviewDate).toLocaleTimeString()}
                                </p>
                                {app.interviewLocation && (
                                  <p className="text-sm text-purple-600">📍 {app.interviewLocation}</p>
                                )}
                                {app.interviewNotes && (
                                  <p className="text-sm text-purple-600 mt-1">📝 {app.interviewNotes}</p>
                                )}
                              </>
                            ) : (
                              <p className="text-sm text-purple-600">📅 Date à définir</p>
                            )}
                          </div>
                        )}
                        
                        {app.coverLetter && (<div className="bg-gray-50 rounded-lg p-3 mb-4"><div className="flex items-center gap-2 mb-2"><FiMessageSquare className="text-gray-400" /><span className="text-sm font-medium text-gray-700">Lettre de motivation</span></div><p className="text-sm text-gray-600 whitespace-pre-wrap">{app.coverLetter}</p></div>)}
                      </div>
                      <div className="md:w-48 flex flex-row md:flex-col gap-2">
                        {candidate.profile?.resume ? (<a href={candidate.profile.resume} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors"><FiDownload size={14} /> Télécharger CV</a>) : (<div className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-400 rounded-lg text-sm"><FiDownload size={14} /> CV non disponible</div>)}
                        <select 
                          value={app.status} 
                          onChange={(e) => updateStatus(app._id, e.target.value)} 
                          disabled={updatingId === app._id} 
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <option value="pending">📝 En attente</option>
                          <option value="reviewed">👁️ Examiner</option>
                          <option value="interview">📅 Entretien</option>
                          <option value="accepted">✅ Accepter</option>
                          <option value="rejected">❌ Refuser</option>
                        </select>
                        {updatingId === app._id && <p className="text-xs text-gray-400 text-center">Mise à jour...</p>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de planification d'entretien */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {isEditMode ? 'Modifier l\'entretien' : 'Planifier un entretien'}
              </h3>
              <button 
                onClick={() => {
                  setShowInterviewModal(false);
                  setInterviewData({ date: '', location: '', notes: '' });
                  setIsEditMode(false);
                }} 
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date et heure *
                </label>
                <input
                  type="datetime-local"
                  value={interviewData.date}
                  onChange={(e) => setInterviewData({...interviewData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu / Lien visio
                </label>
                <input
                  type="text"
                  placeholder="Ex: Google Meet, Zoom, Salle 101..."
                  value={interviewData.location}
                  onChange={(e) => setInterviewData({...interviewData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optionnel)
                </label>
                <textarea
                  rows="3"
                  placeholder="Informations supplémentaires pour le candidat..."
                  value={interviewData.notes}
                  onChange={(e) => setInterviewData({...interviewData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={confirmInterview}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {isEditMode ? 'Modifier' : 'Programmer'}
                </button>
                <button
                  onClick={() => {
                    setShowInterviewModal(false);
                    setInterviewData({ date: '', location: '', notes: '' });
                    setIsEditMode(false);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplications;