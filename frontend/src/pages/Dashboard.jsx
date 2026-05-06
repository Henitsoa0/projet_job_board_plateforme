import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiUsers, FiBriefcase, FiCheckCircle, FiClock } from 'react-icons/fi';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalJobs: 0,
        totalApplications: 0,
        activeJobs: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [users, jobs, applications] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/jobs'),
                api.get('/admin/applications')
            ]);
            
            setStats({
                totalUsers: users.data.count,
                totalJobs: jobs.data.count,
                totalApplications: applications.data.count,
                activeJobs: jobs.data.activeCount
            });
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        { title: 'Utilisateurs', value: stats.totalUsers, icon: FiUsers, color: 'bg-blue-500' },
        { title: 'Offres totales', value: stats.totalJobs, icon: FiBriefcase, color: 'bg-green-500' },
        { title: 'Offres actives', value: stats.activeJobs, icon: FiCheckCircle, color: 'bg-purple-500' },
        { title: 'Candidatures', value: stats.totalApplications, icon: FiClock, color: 'bg-yellow-500' }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Admin</h1>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-full`}>
                                <stat.icon className="text-white" size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Ajoute ici d'autres sections admin : liste des utilisateurs, modération des offres, etc. */}
        </div>
    );
};

export default Dashboard;