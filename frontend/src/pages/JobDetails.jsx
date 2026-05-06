import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    FiMapPin, FiBriefcase, FiDollarSign, FiClock, 
    FiCheckCircle, FiSend, FiX, FiUser, FiMail, 
    FiPhone, FiUpload, FiFileText, FiCalendar,
    FiAward, FiTrendingUp, FiShare2, FiBookmark,
    FiHeart
} from 'react-icons/fi';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, isCandidate, isRecruiter } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [applicationData, setApplicationData] = useState({
        coverLetter: '',
        phone: '',
        availableFrom: 'immediate',
        salaryExpectation: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploadingCV, setUploadingCV] = useState(false);
    const [similarJobs, setSimilarJobs] = useState([]);

    useEffect(() => {
        fetchJob();
        if (isAuthenticated && isCandidate) {
            checkApplication();
        }
        window.scrollTo(0, 0);
    }, [id, isAuthenticated]);

    const fetchJob = async () => {
        try {
            const response = await api.get(`/jobs/${id}`);
            setJob(response.data.job);
            // Fetch similar jobs
            if (response.data.job) {
                fetchSimilarJobs(response.data.job.title, response.data.job.type);
            }
        } catch (error) {
            toast.error('Offre non trouvée');
            navigate('/jobs');
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarJobs = async (title, type) => {
        try {
            const response = await api.get('/jobs', {
                params: {
                    search: title.split(' ')[0],
                    type: type,
                    limit: 3
                }
            });
            setSimilarJobs(response.data.jobs.filter(j => j._id !== id).slice(0, 3));
        } catch (error) {
            console.error('Erreur similar jobs:', error);
        }
    };

    const checkApplication = async () => {
        try {
            const response = await api.get('/applications/my-applications');
            const applied = response.data.applications.some(app => app.job._id === id);
            setHasApplied(applied);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleCVUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Le fichier ne doit pas dépasser 5MB');
            return;
        }
        
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Format accepté : PDF, DOC, DOCX');
            return;
        }
        
        const formData = new FormData();
        formData.append('resume', file);
        setUploadingCV(true);
        
        try {
            const response = await api.post('/auth/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('CV téléchargé avec succès !');
            // Mettre à jour le profil utilisateur
            if (user) {
                if (!user.profile) user.profile = {};
                user.profile.resume = response.data.resumeUrl;
            }
        } catch (error) {
            toast.error('Erreur lors du téléchargement du CV');
        } finally {
            setUploadingCV(false);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        
        if (!user?.profile?.resume && !applicationData.cvFile) {
            toast.error('Veuillez télécharger votre CV');
            return;
        }
        
        if (!applicationData.coverLetter.trim()) {
            toast.error('Veuillez ajouter une lettre de motivation');
            return;
        }
        
        setSubmitting(true);
        
        try {
            await api.post('/applications', {
                jobId: id,
                coverLetter: applicationData.coverLetter,
                phone: applicationData.phone,
                availableFrom: applicationData.availableFrom,
                salaryExpectation: applicationData.salaryExpectation
            });
            toast.success('Candidature envoyée avec succès ! 🎉');
            setHasApplied(true);
            setShowApplicationForm(false);
            // Reset form
            setApplicationData({
                coverLetter: '',
                phone: '',
                availableFrom: 'immediate',
                salaryExpectation: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de la candidature');
        } finally {
            setSubmitting(false);
        }
    };

    const getDaysAgo = (date) => {
        const diff = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
        if (diff === 0) return "Aujourd'hui";
        if (diff === 1) return "Hier";
        return `Il y a ${diff} jours`;
    };

    const getTypeColor = (type) => {
        const colors = {
            'Full-time': 'bg-emerald-100 text-emerald-700',
            'Part-time': 'bg-amber-100 text-amber-700',
            'Remote': 'bg-blue-100 text-blue-700',
            'Contract': 'bg-purple-100 text-purple-700',
            'Internship': 'bg-orange-100 text-orange-700'
        };
        return colors[type] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Bouton retour */}
                <button
                    onClick={() => navigate('/jobs')}
                    className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    ← Retour aux offres
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* En-tête */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(job.type)}`}>
                                    {job.type}
                                </span>
                                {getDaysAgo(job.createdAt) === "Aujourd'hui" && (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                                        Nouveau
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                            
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600 font-bold">
                                    {job.company?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{job.company}</p>
                                    <p className="text-sm text-gray-500">Recruteur vérifié</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100">
                                <span className="flex items-center text-gray-500 text-sm">
                                    <FiMapPin className="mr-1 text-gray-400" /> {job.location}
                                </span>
                                {job.salary && job.salary.min && (
                                    <span className="flex items-center text-gray-500 text-sm">
                                        <FiDollarSign className="mr-1 text-gray-400" /> 
                                        {job.salary.min.toLocaleString()} - {job.salary.max.toLocaleString()} {job.salary.currency}/an
                                    </span>
                                )}
                                <span className="flex items-center text-gray-500 text-sm">
                                    <FiClock className="mr-1 text-gray-400" /> 
                                    Publié {getDaysAgo(job.createdAt)}
                                </span>
                                <span className="flex items-center text-gray-500 text-sm">
                                    <FiBriefcase className="mr-1 text-gray-400" /> 
                                    {job.applicationsCount || 0} candidatures
                                </span>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex flex-wrap gap-3">
                                {isAuthenticated && isCandidate && !hasApplied && !showApplicationForm && (
                                    <button
                                        onClick={() => {
                                            if (!user?.profile?.resume) {
                                                toast((t) => (
                                                    <div className="flex flex-col gap-2">
                                                        <span>Vous n'avez pas de CV. Téléchargez-en un d'abord.</span>
                                                        <button
                                                            onClick={() => {
                                                                toast.dismiss(t.id);
                                                                navigate('/profile');
                                                            }}
                                                            className="text-blue-600 font-semibold"
                                                        >
                                                            Aller dans mon profil
                                                        </button>
                                                    </div>
                                                ), { duration: 5000 });
                                                return;
                                            }
                                            setShowApplicationForm(true);
                                        }}
                                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-sm hover:shadow-md"
                                    >
                                        <FiSend size={18} />
                                        Postuler maintenant
                                    </button>
                                )}

                                {isAuthenticated && isRecruiter && job.recruiter?._id === user?.id && (
                                    <button
                                        onClick={() => navigate(`/edit-job/${job._id}`)}
                                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                                    >
                                        Modifier l'offre
                                    </button>
                                )}

                                <button
                                    onClick={() => setIsSaved(!isSaved)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition border ${
                                        isSaved 
                                            ? 'bg-blue-50 text-blue-600 border-blue-200' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <FiBookmark size={18} className={isSaved ? 'fill-blue-600' : ''} />
                                    {isSaved ? 'Sauvegardé' : 'Sauvegarder'}
                                </button>

                                <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white text-gray-600 border border-gray-200 hover:border-gray-300 transition">
                                    <FiShare2 size={18} />
                                    Partager
                                </button>
                            </div>
                        </div>

                        {/* Formulaire de candidature amélioré */}
                        {showApplicationForm && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-semibold text-white">Formulaire de candidature</h2>
                                        <button
                                            onClick={() => setShowApplicationForm(false)}
                                            className="text-white/80 hover:text-white"
                                        >
                                            <FiX size={24} />
                                        </button>
                                    </div>
                                    <p className="text-blue-100 text-sm mt-1">Complétez ce formulaire pour postuler</p>
                                </div>
                                
                                <form onSubmit={handleApply} className="p-6 space-y-5">
                                    {/* CV Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CV * 
                                            <span className="text-xs text-gray-400 ml-1">(PDF, DOC, max 5MB)</span>
                                        </label>
                                        {user?.profile?.resume ? (
                                            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <FiFileText className="text-green-600" />
                                                    <span className="text-sm text-green-700">CV déjà téléchargé</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => document.getElementById('cv-upload').click()}
                                                    className="text-sm text-blue-600 hover:text-blue-700"
                                                >
                                                    Changer
                                                </button>
                                                <input
                                                    id="cv-upload"
                                                    type="file"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleCVUpload}
                                                    className="hidden"
                                                />
                                            </div>
                                        ) : (
                                            <div className="mt-1">
                                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <FiUpload className="text-gray-400 text-2xl mb-2" />
                                                        <p className="text-sm text-gray-500">Cliquez pour télécharger votre CV</p>
                                                        <p className="text-xs text-gray-400">PDF, DOC (max 5MB)</p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={handleCVUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                                {uploadingCV && (
                                                    <p className="text-sm text-blue-600 mt-2">Téléchargement en cours...</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Lettre de motivation */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Lettre de motivation *
                                        </label>
                                        <textarea
                                            rows={5}
                                            required
                                            value={applicationData.coverLetter}
                                            onChange={(e) => setApplicationData({
                                                ...applicationData,
                                                coverLetter: e.target.value
                                            })}
                                            placeholder="Bonjour, je suis très intéressé par ce poste car..."
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <p className="mt-1 text-xs text-gray-400">
                                            {applicationData.coverLetter.length} caractères
                                        </p>
                                    </div>

                                    {/* Téléphone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <FiPhone className="inline mr-1" /> Téléphone (optionnel)
                                        </label>
                                        <input
                                            type="tel"
                                            value={applicationData.phone}
                                            onChange={(e) => setApplicationData({
                                                ...applicationData,
                                                phone: e.target.value
                                            })}
                                            placeholder="+33 6 12 34 56 78"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* Disponibilité */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FiCalendar className="inline mr-1" /> Disponibilité
                                            </label>
                                            <select
                                                value={applicationData.availableFrom}
                                                onChange={(e) => setApplicationData({
                                                    ...applicationData,
                                                    availableFrom: e.target.value
                                                })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="immediate">Immédiate</option>
                                                <option value="1month">1 mois</option>
                                                <option value="2months">2 mois</option>
                                                <option value="3months">3 mois</option>
                                            </select>
                                        </div>

                                        {/* Prétention salariale */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FiDollarSign className="inline mr-1" /> Prétention salariale (optionnel)
                                            </label>
                                            <input
                                                type="text"
                                                value={applicationData.salaryExpectation}
                                                onChange={(e) => setApplicationData({
                                                    ...applicationData,
                                                    salaryExpectation: e.target.value
                                                })}
                                                placeholder="45 000 € / an"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Boutons */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={submitting || uploadingCV}
                                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50"
                                        >
                                            {submitting ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Envoi en cours...
                                                </div>
                                            ) : (
                                                'Envoyer ma candidature'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowApplicationForm(false)}
                                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {hasApplied && (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                                <div className="flex items-center gap-3">
                                    <FiCheckCircle className="text-green-600 text-2xl" />
                                    <div>
                                        <h3 className="font-semibold text-green-800">Candidature envoyée !</h3>
                                        <p className="text-green-600 text-sm">Vous avez déjà postulé à cette offre. Vous recevrez une réponse sous 48h.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description du poste</h2>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
                            </div>
                        </div>

                        {/* Prérequis */}
                        {job.requirements && job.requirements.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Prérequis</h2>
                                <ul className="space-y-3">
                                    {job.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start">
                                            <FiCheckCircle className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Avantages */}
                        {job.benefits && job.benefits.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                    <FiAward className="inline mr-2 text-blue-500" />
                                    Avantages
                                </h2>
                                <ul className="space-y-3">
                                    {job.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start">
                                            <FiCheckCircle className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar droite */}
                    <div className="space-y-6">
                        {/* Informations entreprise */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">À propos de l'entreprise</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">
                                    {job.company?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{job.company}</p>
                                    <p className="text-sm text-gray-500">Recruteur vérifié</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <FiMapPin size={14} />
                                    <span>{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <FiBriefcase size={14} />
                                    <span>+ de 10 offres publiées</span>
                                </div>
                            </div>
                        </div>

                        {/* Offres similaires */}
                        {similarJobs.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Offres similaires</h3>
                                <div className="space-y-4">
                                    {similarJobs.map(similar => (
                                        <div key={similar._id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                                            <button
                                                onClick={() => navigate(`/jobs/${similar._id}`)}
                                                className="text-left hover:text-blue-600 transition-colors"
                                            >
                                                <p className="font-medium text-gray-900 hover:text-blue-600">
                                                    {similar.title}
                                                </p>
                                                <p className="text-sm text-gray-500">{similar.company}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs text-gray-400">{similar.location}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(similar.type)}`}>
                                                        {similar.type}
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Compétences recherchées */}
                        {job.requirements && job.requirements.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Compétences recherchées</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.requirements.map((req, index) => (
                                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                                            {req}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;