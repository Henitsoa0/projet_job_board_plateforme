import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiBriefcase, FiTrendingUp } from 'react-icons/fi';

const JobFilters = ({ filters, onFilterChange }) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
    const experienceLevels = ['Entry', 'Intermediate', 'Expert'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters({
            ...localFilters,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilterChange(localFilters);
    };

    const handleReset = () => {
        const resetFilters = {
            search: '',
            location: '',
            type: '',
            experience: ''
        };
        setLocalFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Filtres</h3>
            
            <form onSubmit={handleSubmit}>
                {/* Recherche */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiSearch className="inline mr-1" /> Recherche
                    </label>
                    <input
                        type="text"
                        name="search"
                        value={localFilters.search}
                        onChange={handleChange}
                        placeholder="Titre, entreprise..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Localisation */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiMapPin className="inline mr-1" /> Localisation
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={localFilters.location}
                        onChange={handleChange}
                        placeholder="Ville, région..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Type de contrat */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiBriefcase className="inline mr-1" /> Type de contrat
                    </label>
                    <select
                        name="type"
                        value={localFilters.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Tous</option>
                        {jobTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Niveau d'expérience */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiTrendingUp className="inline mr-1" /> Expérience
                    </label>
                    <select
                        name="experience"
                        value={localFilters.experience}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Tous</option>
                        {experienceLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>

                {/* Boutons */}
                <div className="space-y-2">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Appliquer les filtres
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
                    >
                        Réinitialiser
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JobFilters;