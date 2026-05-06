const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const {
    applyToJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('candidate'), applyToJob);
router.get('/my-applications', protect, authorize('candidate'), getMyApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.put('/:id/status', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

// @desc    Annuler sa candidature
// @route   DELETE /api/applications/:id/cancel
// @access  Private (Candidat uniquement)
router.delete('/:id/cancel', protect, authorize('candidate'), async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        
        if (!application) {
            return res.status(404).json({ message: 'Candidature non trouvée' });
        }
        
        // Vérifier que le candidat est bien le propriétaire
        if (application.candidate.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Non autorisé' });
        }
        
        // Vérifier que la candidature est encore en attente
        if (application.status !== 'pending') {
            return res.status(400).json({ 
                message: 'Impossible d\'annuler une candidature déjà traitée',
                currentStatus: application.status
            });
        }
        
        // Supprimer la candidature
        await Application.findByIdAndDelete(req.params.id);
        
        // Décrémenter le compteur de candidatures de l'offre
        await Job.findByIdAndUpdate(application.job, {
            $inc: { applicationsCount: -1 }
        });
        
        res.json({ 
            success: true,
            message: 'Candidature annulée avec succès' 
        });
    } catch (error) {
        console.error('Erreur annulation:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;