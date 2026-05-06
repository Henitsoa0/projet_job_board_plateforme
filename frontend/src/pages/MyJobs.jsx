import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiEye, FiUsers } from 'react-icons/fi';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const response = await api.get('/jobs/my-jobs');
            setJobs(response.data.jobs);
        } catch (error) {
            toast.error('Erreur lors du chargement');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
            try {
                await api.delete(`/jobs/${id}`);
                toast.success('Offre supprimée');
                fetchMyJobs();
            } catch (error) {
                toast.error('Erreur lors de la suppression');
            }
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/jobs/${id}`, { status });
            toast.success('Statut mis à jour');
            fetchMyJobs();
        } catch (error) {
            toast.error('Erreur lors de la mise à jour');
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
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mes offres</h1>
                    <Link
                        to="/post-job"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        + Nouvelle offre
                    </Link>
                </div>
                
                {jobs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">Vous n'avez pas encore publié d'offres.</p>
                        <Link to="/post-job" className="text-blue-600 hover:underline mt-2 inline-block">
                            Publier ma première offre →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div key={job._id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {job.title}
                                        </h3>
                                        <p className="text-gray-600 mb-2">{job.company} • {job.location}</p>
                                        <div className="flex items-center space-x-4 mb-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                job.status === 'active' ? 'bg-green-100 text-green-800' :
                                                job.status === 'closed' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {job.status === 'active' ? 'Active' : 
                                                 job.status === 'closed' ? 'Fermée' : 'Brouillon'}
                                            </span>
                                            <span className="flex items-center text-gray-500 text-sm">
                                                <FiUsers className="mr-1" />
                                                {job.applicationsCount} candidature(s)
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/jobs/${job._id}`}
                                            className="text-gray-600 hover:text-blue-600"
                                            title="Voir"
                                        >
                                            <FiEye size={20} />
                                        </Link>
                                        <Link
                                            to={`/edit-job/${job._id}`}
                                            className="text-gray-600 hover:text-green-600"
                                            title="Modifier"
                                        >
                                            <FiEdit2 size={20} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(job._id)}
                                            className="text-gray-600 hover:text-red-600"
                                            title="Supprimer"
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <Link
                                            to={`/jobs/${job._id}/applications`}
                                            className="text-blue-600 hover:underline flex items-center"
                                        >
                                            <FiUsers className="mr-1" />
                                            Voir les candidatures ({job.applicationsCount})
                                        </Link>
                                        
                                        {job.status === 'active' ? (
                                            <button
                                                onClick={() => handleStatusChange(job._id, 'closed')}
                                                className="text-red-600 hover:text-red-700 text-sm"
                                            >
                                                Fermer l'offre
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusChange(job._id, 'active')}
                                                className="text-green-600 hover:text-green-700 text-sm"
                                            >
                                                Rouvrir l'offre
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyJobs;