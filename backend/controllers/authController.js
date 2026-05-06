const User = require('../models/User');
const jwt = require('jsonwebtoken');
const cloudinary = require('../utils/cloudinary');

// Générer JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Inscription utilisateur
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Vérifier si l'utilisateur existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }

        // Créer l'utilisateur
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'candidate'
        });

        // Générer token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier l'email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Générer token
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir profil utilisateur
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mettre à jour profil
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        // Mettre à jour les champs de base
        if (req.body.name) {
            user.name = req.body.name;
        }

        // Mettre à jour le profil de manière sécurisée
        if (req.body.profile) {
            Object.keys(req.body.profile).forEach(key => {
                // Ignore empty strings for certain optional fields to prevent validation errors
                if (req.body.profile[key] === '' && (key === 'phone' || key === 'location' || key === 'title' || key === 'bio' || key === 'resume' || key === 'avatar')) {
                    user.set(`profile.${key}`, undefined);
                } else {
                    user.set(`profile.${key}`, req.body.profile[key]);
                }
            });
        }

        // Mettre à jour l'entreprise (uniquement pour les recruteurs)
        if (req.body.company && user.role === 'recruiter') {
            Object.keys(req.body.company).forEach(key => {
                if (req.body.company[key] === '' && (key === 'website' || key === 'description' || key === 'name')) {
                    user.set(`company.${key}`, undefined);
                } else {
                    user.set(`company.${key}`, req.body.company[key]);
                }
            });
        }

        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profile: user.profile,
                company: user.company
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Erreur lors de la mise à jour du profil' 
        });
    }
};

// @desc    Upload CV
// @route   POST /api/auth/upload-resume
// @access  Private
const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier fourni' });
        }

        let resumeUrl = '';

        // Si Cloudinary est configuré, on l'utilise, sinon on utilise le fichier local
        if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'votre_api_key') {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'resumes',
                resource_type: 'auto'
            });
            resumeUrl = result.secure_url;
        } else {
            // Configuration de repli en local
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            resumeUrl = `${baseUrl}/uploads/${req.file.filename}`;
        }

        const user = await User.findById(req.user.id);
        
        // Utiliser set pour s'assurer que profile est initialisé correctement
        user.set('profile.resume', resumeUrl);
        await user.save();

        res.json({
            success: true,
            resumeUrl: resumeUrl
        });
    } catch (error) {
        console.error('Upload CV error:', error);
        res.status(500).json({ message: error.message || 'Erreur lors du téléchargement' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    uploadResume
};