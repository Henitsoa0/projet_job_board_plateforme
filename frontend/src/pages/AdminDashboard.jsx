import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  FiUsers, FiBriefcase, FiFileText, FiCheckCircle, 
  FiXCircle, FiTrendingUp, FiUserPlus, FiCalendar,
  FiTrash2, FiEye, FiEdit2, FiSearch, FiX
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    recentUsers: [],
    recentJobs: []
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/jobs')
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setJobs(jobsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Supprimer cet utilisateur ? Cette action est irréversible.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success('Utilisateur supprimé');
        fetchAllData();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Supprimer cette offre ?')) {
      try {
        await api.delete(`/admin/jobs/${jobId}`);
        toast.success('Offre supprimée');
        fetchAllData();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className="text-3xl" style={{ color: color }} />
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiTrendingUp },
    { id: 'users', label: 'Utilisateurs', icon: FiUsers },
    { id: 'jobs', label: 'Offres', icon: FiBriefcase }
  ];

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredJobs = jobs.filter(j => 
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.company?.toLowerCase().includes(search.toLowerCase())
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
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Administration</h1>
        <p className="text-gray-500 mb-6">Gérez l'ensemble de la plateforme</p>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all ${
                activeTab === tab.id 
                  ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Utilisateurs" value={stats.totalUsers} icon={FiUsers} color="#3B82F6" />
              <StatCard title="Offres totales" value={stats.totalJobs} icon={FiBriefcase} color="#10B981" />
              <StatCard title="Offres actives" value={stats.activeJobs} icon={FiCheckCircle} color="#F59E0B" />
              <StatCard title="Candidatures" value={stats.totalApplications} icon={FiFileText} color="#8B5CF6" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Derniers utilisateurs */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                  <h2 className="font-semibold">Derniers inscrits</h2>
                  <FiUserPlus className="text-gray-400" />
                </div>
                <div className="divide-y">
                  {users.slice(0, 5).map(user => (
                    <div key={user._id} className="px-6 py-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.role === 'candidate' ? 'bg-green-100 text-green-700' :
                        user.role === 'recruiter' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {user.role === 'candidate' ? 'Candidat' : user.role === 'recruiter' ? 'Recruteur' : 'Admin'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dernières offres */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                  <h2 className="font-semibold">Dernières offres</h2>
                  <FiBriefcase className="text-gray-400" />
                </div>
                <div className="divide-y">
                  {jobs.slice(0, 5).map(job => (
                    <div key={job._id} className="px-6 py-3">
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-semibold">Liste des utilisateurs</h2>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nom</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Rôle</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Inscrit le</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${user.role === 'candidate' ? 'bg-green-100 text-green-700' : user.role === 'recruiter' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{user.role === 'candidate' ? 'Candidat' : user.role === 'recruiter' ? 'Recruteur' : 'Admin'}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><button onClick={() => deleteUser(user._id)} className="text-red-500 hover:text-red-700"><FiTrash2 size={18} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-semibold">Liste des offres</h2>
              <div className="relative"><FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} /><input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg text-sm w-64" /></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Titre</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Entreprise</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Localisation</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Statut</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredJobs.map(job => (<tr key={job._id} className="hover:bg-gray-50"><td className="px-6 py-4 text-sm font-medium text-gray-900">{job.title}</td><td className="px-6 py-4 text-sm text-gray-500">{job.company}</td><td className="px-6 py-4 text-sm text-gray-500">{job.location}</td><td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{job.status === 'active' ? 'Active' : 'Fermée'}</span></td><td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => deleteJob(job._id)} className="text-red-500 hover:text-red-700"><FiTrash2 size={18} /></button></div></td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;