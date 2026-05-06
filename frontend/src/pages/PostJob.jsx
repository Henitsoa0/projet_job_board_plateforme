import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  FiPlus, FiX, FiInfo, FiCheck, FiArrowLeft,
  FiBriefcase, FiMapPin, FiDollarSign, FiFileText,
  FiList, FiAward, FiSave, FiSend
} from 'react-icons/fi';

const PostJob = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    experience: 'Entry',
    salary: {
      min: '',
      max: '',
      currency: 'EUR'
    },
    description: '',
    requirements: [''],
    benefits: ['']
  });

  const steps = [
    { number: 1, title: 'Informations', icon: FiBriefcase },
    { number: 2, title: 'Description', icon: FiFileText },
    { number: 3, title: 'Prérequis', icon: FiList },
    { number: 4, title: 'Publication', icon: FiSend }
  ];

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

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.title.trim()) {
        toast.error('Le titre est requis');
        return false;
      }
      if (!formData.company.trim()) {
        toast.error('Le nom de l\'entreprise est requis');
        return false;
      }
      if (!formData.location.trim()) {
        toast.error('La localisation est requise');
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!formData.description.trim()) {
        toast.error('La description est requise');
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
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
    
    setLoading(true);
    try {
      await api.post('/jobs', cleanData);
      toast.success('Offre publiée avec succès !');
      navigate('/my-jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la publication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-jobs')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
          >
            <FiArrowLeft size={18} />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Publier une offre</h1>
          <p className="text-gray-500 mt-1">Créez une annonce pour attirer les meilleurs talents</p>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${currentStep >= step.number 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'}
                    transition-all duration-300
                  `}>
                    {currentStep > step.number ? (
                      <FiCheck size={18} />
                    ) : (
                      <step.icon size={18} />
                    )}
                  </div>
                  <span className={`text-xs mt-2 ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Step 1: Informations */}
          {currentStep === 1 && (
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du poste *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Développeur Full Stack"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Ex: Tech Corp"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline mr-1" /> Localisation *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ex: Paris, France"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiBriefcase className="inline mr-1" /> Type de contrat *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Full-time">Temps plein</option>
                    <option value="Part-time">Temps partiel</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contrat</option>
                    <option value="Internship">Stage</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salaire minimum (optionnel)
                  </label>
                  <input
                    type="number"
                    name="salary.min"
                    value={formData.salary.min}
                    onChange={handleChange}
                    placeholder="40000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salaire maximum (optionnel)
                  </label>
                  <input
                    type="number"
                    name="salary.max"
                    value={formData.salary.max}
                    onChange={handleChange}
                    placeholder="60000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiDollarSign className="inline mr-1" /> Devise
                  </label>
                  <select
                    name="salary.currency"
                    value={formData.salary.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="EUR">€ EUR</option>
                    <option value="USD">$ USD</option>
                    <option value="GBP">£ GBP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau d'expérience
                </label>
                <div className="flex gap-3">
                  {['Entry', 'Intermediate', 'Expert'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, experience: level }))}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        formData.experience === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level === 'Entry' && '🌱 Débutant'}
                      {level === 'Intermediate' && '📈 Intermédiaire'}
                      {level === 'Expert' && '🏆 Expert'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {currentStep === 2 && (
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description du poste *
              </label>
              <textarea
                name="description"
                rows={12}
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez le poste, les responsabilités, l'équipe, les projets..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="mt-2 flex items-start gap-2 text-sm text-gray-400">
                <FiInfo size={14} className="mt-0.5" />
                <span>Conseil : Décrivez précisément les missions et l'environnement de travail</span>
              </div>
            </div>
          )}

          {/* Step 3: Prérequis et avantages */}
          {currentStep === 3 && (
            <div className="p-6 space-y-8">
              {/* Prérequis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Prérequis techniques et compétences
                </label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex mb-3">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                      placeholder="Ex: Maîtrise de React.js"
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {index === formData.requirements.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => addArrayItem('requirements')}
                        className="ml-2 w-12 h-12 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                      >
                        <FiPlus size={20} className="mx-auto" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requirements', index)}
                        className="ml-2 w-12 h-12 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        <FiX size={20} className="mx-auto" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Avantages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <FiAward className="inline mr-1" /> Avantages
                </label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex mb-3">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                      placeholder="Ex: Tickets restaurant, mutuelle, télétravail..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {index === formData.benefits.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => addArrayItem('benefits')}
                        className="ml-2 w-12 h-12 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                      >
                        <FiPlus size={20} className="mx-auto" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('benefits', index)}
                        className="ml-2 w-12 h-12 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        <FiX size={20} className="mx-auto" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review & Publish */}
          {currentStep === 4 && (
            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">📋 Récapitulatif de l'offre</h3>
                <div className="space-y-3 text-sm">
                  <div><span className="font-medium">Titre :</span> {formData.title}</div>
                  <div><span className="font-medium">Entreprise :</span> {formData.company}</div>
                  <div><span className="font-medium">Localisation :</span> {formData.location}</div>
                  <div><span className="font-medium">Type :</span> {formData.type}</div>
                  {formData.salary.min && (
                    <div><span className="font-medium">Salaire :</span> {formData.salary.min} - {formData.salary.max} {formData.salary.currency}</div>
                  )}
                  <div><span className="font-medium">Prérequis :</span> {formData.requirements.filter(r => r).length} compétences listées</div>
                  <div><span className="font-medium">Avantages :</span> {formData.benefits.filter(b => b).length} avantages</div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 flex items-start gap-3">
                <FiInfo className="text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Avant de publier :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Vérifiez que toutes les informations sont correctes</li>
                    <li>Assurez-vous que la description est complète</li>
                    <li>Vous pourrez modifier l'offre après publication</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-between">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publication...
                  </>
                ) : (
                  <>
                    <FiSave size={18} />
                    Publier l'offre
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <FiInfo size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Conseils pour une offre réussie</p>
              <p className="text-xs text-gray-500 mt-1">
                Les offres avec une description détaillée et une fourchette de salaire reçoivent 3x plus de candidatures
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;