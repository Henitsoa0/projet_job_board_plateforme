const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Postuler à une offre
// @route   POST /api/applications
// @access  Private (Candidate)
const applyToJob = async (req, res) => {
    try {
        const { jobId, coverLetter } = req.body;

        // Vérifier si l'offre existe
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Offre non trouvée' });
        }

        // Vérifier si déjà postulé
        const alreadyApplied = await Application.findOne({
            job: jobId,
            candidate: req.user.id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'Vous avez déjà postulé' });
        }

        // Vérifier si l'utilisateur a un CV dans son profil
        if (!req.user.profile || !req.user.profile.resume) {
            return res.status(400).json({ 
                message: 'Vous devez télécharger un CV dans votre profil avant de postuler' 
            });
        }

        // Créer la candidature
        const application = await Application.create({
            job: jobId,
            candidate: req.user.id,
            coverLetter,
            resume: req.user.profile.resume
        });

        // Incrémenter le compteur
        job.applicationsCount += 1;
        await job.save();

        res.status(201).json({
            success: true,
            application
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir mes candidatures (POUR LE CANDIDAT)
// @route   GET /api/applications/my-applications
// @access  Private (Candidate)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ candidate: req.user.id })
            .populate('job', 'title company location type salary')
            .sort('-appliedAt');

        res.json({
            success: true,
            applications
        });
    } catch (error) {
        console.error('Erreur getMyApplications:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir les candidatures pour une offre (POUR LE RECRUTEUR)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        
        if (!job) {
            return res.status(404).json({ message: 'Offre non trouvée' });
        }

        // Vérifier que le recruteur est propriétaire
        if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('candidate', 'name email profile')
            .sort('-appliedAt');

        res.json({
            success: true,
            applications
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mettre à jour le statut d'une candidature (avec date d'entretien)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status, interviewDate, interviewLocation, interviewNotes } = req.body;
        const application = await Application.findById(req.params.id)
            .populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Candidature non trouvée' });
        }

        // Vérifier les permissions
        if (application.job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        // Mettre à jour le statut
        application.status = status;
        
        // Si le statut est "interview", sauvegarder les infos d'entretien
        if (status === 'interview') {
            console.log('Données reçues pour entretien:', { interviewDate, interviewLocation, interviewNotes });
            if (interviewDate) {
                application.interviewDate = new Date(interviewDate);
                console.log('Date d\'entretien sauvegardée:', application.interviewDate);
            }
            if (interviewLocation !== undefined) {
                application.interviewLocation = interviewLocation || '';
                console.log('Lieu d\'entretien sauvegardé:', application.interviewLocation);
            }
            if (interviewNotes !== undefined) {
                application.interviewNotes = interviewNotes || '';
                console.log('Notes d\'entretien sauvegardées:', application.interviewNotes);
            }
        }
        
        application.updatedAt = Date.now();
        await application.save();
        console.log('Application sauvegardée:', JSON.stringify(application, null, 2));

        res.json({
            success: true,
            application
        });
    } catch (error) {
        console.error('Erreur updateStatus:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyToJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus
};