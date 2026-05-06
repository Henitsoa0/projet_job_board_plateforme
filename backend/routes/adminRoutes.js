const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/authMiddleware');

// Toutes les routes admin sont protégées
router.use(protect);
router.use(authorize('admin'));

// @desc    Obtenir toutes les stats
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalJobs = await Job.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'active' });
        const totalApplications = await Application.countDocuments();
        
        res.json({
            totalUsers,
            totalJobs,
            activeJobs,
            totalApplications
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Obtenir tous les utilisateurs
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Obtenir toutes les offres
router.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find().populate('recruiter', 'name email');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Supprimer une offre
router.delete('/jobs/:id', async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Offre supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;