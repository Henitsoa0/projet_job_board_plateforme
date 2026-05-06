const Job = require('../models/Job');

// @desc    Créer une offre d'emploi
// @route   POST /api/jobs
// @access  Private (Recruiter/Admin)
const createJob = async (req, res) => {
    try {
        const job = await Job.create({
            ...req.body,
            recruiter: req.user.id
        });

        res.status(201).json({
            success: true,
            job
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir toutes les offres
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const { search, location, type, experience, page = 1, limit = 10 } = req.query;
        
        let query = { status: 'active' };

        // Filtres
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (type) {
            query.type = type;
        }

        if (experience) {
            query.experience = experience;
        }

        const jobs = await Job.find(query)
            .populate('recruiter', 'name company')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Job.countDocuments(query);

        res.json({
            success: true,
            jobs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir une offre spécifique
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('recruiter', 'name email company profile');

        if (!job) {
            return res.status(404).json({ message: 'Offre non trouvée' });
        }

        res.json({
            success: true,
            job
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mettre à jour une offre
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter/Admin)
const updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Offre non trouvée' });
        }

        // Vérifier les permissions
        if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            job
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Supprimer une offre
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter/Admin)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Offre non trouvée' });
        }

        // Vérifier les permissions
        if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Non autorisé' });
        }

        await job.deleteOne();

        res.json({
            success: true,
            message: 'Offre supprimée'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Obtenir les offres d'un recruteur
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter)
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiter: req.user.id })
            .sort('-createdAt');

        res.json({
            success: true,
            jobs
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs
};