import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiUpload } from 'react-icons/fi';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        profile: {
            phone: user?.profile?.phone || '',
            location: user?.profile?.location || '',
            title: user?.profile?.title || '',
            bio: user?.profile?.bio || '',
            skills: (user?.profile?.skills || []).join(', ')
        },
        company: {
            name: user?.company?.name || '',
            website: user?.company?.website || '',
            description: user?.company?.description || ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Créer une copie profonde pour ne pas muter le state
            const dataToSend = {
                ...formData,
                profile: { ...formData.profile },
                company: { ...formData.company }
            };

            if (typeof dataToSend.profile.skills === 'string') {
                dataToSend.profile.skills = dataToSend.profile.skills
                    .split(',')
                    .map(skill => skill.trim())
                    .filter(skill => skill !== '');
            }

            const response = await api.put('/auth/profile', dataToSend);
            setUser(response.data.user);
            toast.success('Profil mis à jour avec succès !');
        } catch (error) {
            console.error('Erreur détaillée:', error);
            
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'Erreur lors de la mise à jour du profil';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const formData = new FormData();
        formData.append('resume', file);
        
        setUploading(true);
        try {
            const response = await api.post('/auth/upload-resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('CV téléchargé avec succès !');
            setUser({
                ...user,
                profile: { ...user.profile, resume: response.data.resumeUrl }
            });
        } catch (error) {
            toast.error('Erreur lors du téléchargement');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations personnelles */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FiUser className="mr-2" /> Informations personnelles
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FiMail className="inline mr-1" /> Email
                                </label>
                                <input
                                    type="email"
                                    value={user?.email}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FiPhone className="inline mr-1" /> Téléphone
                                </label>
                                <input
                                    type="tel"
                                    name="profile.phone"
                                    value={formData.profile.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FiMapPin className="inline mr-1" /> Localisation
                                </label>
                                <input
                                    type="text"
                                    name="profile.location"
                                    value={formData.profile.location}
                                    onChange={handleChange}
                                    placeholder="Paris, France"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* CV Upload pour candidats */}
                    {user?.role === 'candidate' && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">CV</h2>
                            <div className="space-y-4">
                                {user.profile?.resume && (
                                    <div className="mb-2">
                                        <a 
                                            href={user.profile.resume} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Voir mon CV actuel
                                        </a>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Télécharger un nouveau CV
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeUpload}
                                        disabled={uploading}
                                        className="w-full"
                                    />
                                    {uploading && <p className="text-sm text-gray-500 mt-1">Téléchargement...</p>}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Informations professionnelles */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <FiBriefcase className="mr-2" /> Informations professionnelles
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Titre professionnel
                                </label>
                                <input
                                    type="text"
                                    name="profile.title"
                                    value={formData.profile.title}
                                    onChange={handleChange}
                                    placeholder="Développeur Full Stack"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bio
                                </label>
                                <textarea
                                    name="profile.bio"
                                    value={formData.profile.bio}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Parlez-nous de vous..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Compétences (séparées par des virgules)
                                </label>
                                <input
                                    type="text"
                                    name="profile.skills"
                                    value={formData.profile.skills}
                                    onChange={handleChange}
                                    placeholder="React, Node.js, MongoDB, Python"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Informations entreprise (pour recruteurs) */}
                    {user?.role === 'recruiter' && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Entreprise</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom de l'entreprise
                                    </label>
                                    <input
                                        type="text"
                                        name="company.name"
                                        value={formData.company.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Site web
                                    </label>
                                    <input
                                        type="url"
                                        name="company.website"
                                        value={formData.company.website}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="company.description"
                                        value={formData.company.description}
                                        onChange={handleChange}
                                        rows="4"
                                        placeholder="Décrivez votre entreprise..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Bouton de sauvegarde */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;