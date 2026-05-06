import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiX, FiArrowLeft, FiSave } from 'react-icons/fi';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        experience: 'Entry',
        salary: { min: '', max: '', currency: 'EUR' },
        description: '',
        requirements: [''],
        benefits: [''],
        status: 'active'
    });

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const response = await api.get(`/jobs/${id}`);
            const job = response.data.job;
            setFormData({
                title: job.title,
                company: job.company,
                location: job.location,
                type: job.type,
                experience: job.experience,
                salary: {
                    min: job.salary?.min || '',
                    max: job.salary?.max || '',
                    currency: job.salary?.currency || 'EUR'
                },
                description: job.description,
                requirements: job.requirements?.length ? job.requirements : [''],
                benefits: job.benefits?.length ? job.benefits : [''],
                status: job.status
            });
        } catch (error) {
            toast.error('Offre non trouvée');
            navigate('/my-jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanData = {
            ...formData,
            requirements: formData.requirements.filter(r => r.trim()),
            benefits: formData.benefits.filter(b => b.trim()),
            salary: {
                min: formData.salary.min ? Number(formData.salary.min) : undefined,
                max: formData.salary.max ? Number(formData.salary.max) : undefined,
                currency: formData.salary.currency
            }
        };
        
        setSaving(true);
        try {
            await api.put(`/jobs/${id}`, cleanData);
            toast.success('Offre modifiée avec succès !');
            navigate('/my-jobs');
        } catch (error) {
            toast.error('Erreur lors de la modification');
        } finally {
            setSaving(false);
        }
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
            <div className="container mx-auto px-4 max-w-4xl">
                <button
                    onClick={() => navigate('/my-jobs')}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
                >
                    <FiArrowLeft size={18} />
                    Retour à mes offres
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                        <h1 className="text-xl font-semibold text-white">Modifier l'offre</h1>
                        <p className="text-blue-100 text-sm">{formData.title}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Titre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Titre du poste *
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Entreprise *
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    required
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Localisation *
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type de contrat
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="Full-time">Temps plein</option>
                                    <option value="Part-time">Temps partiel</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Contract">Contrat</option>
                                    <option value="Internship">Stage</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Statut
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="active">Active</option>
                                    <option value="closed">Fermée</option>
                                    <option value="draft">Brouillon</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                rows={8}
                                required
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Prérequis */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prérequis
                            </label>
                            {formData.requirements.map((req, index) => (
                                <div key={index} className="flex mb-2">
                                    <input
                                        type="text"
                                        value={req}
                                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                        placeholder="Ex: React.js"
                                    />
                                    {index === formData.requirements.length - 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => addArrayItem('requirements')}
                                            className="ml-2 w-10 h-10 bg-green-500 text-white rounded-lg"
                                        >
                                            <FiPlus className="mx-auto" />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('requirements', index)}
                                            className="ml-2 w-10 h-10 bg-red-500 text-white rounded-lg"
                                        >
                                            <FiX className="mx-auto" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Boutons */}
                        <div className="flex gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => navigate('/my-jobs')}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                <FiSave size={18} />
                                {saving ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditJob;