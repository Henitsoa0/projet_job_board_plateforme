const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'interview', 'accepted', 'rejected'],
        default: 'pending'
    },
    coverLetter: {
        type: String,
        required: [true, 'La lettre de motivation est requise']
    },
    resume: {
        type: String, // URL du CV sur Cloudinary
        required: true
    },
    notes: {
        type: String
    },
    // ===== NOUVEAUX CHAMPS POUR L'ENTRETIEN =====
    interviewDate: {
        type: Date,
        default: null
    },
    interviewLocation: {
        type: String,
        default: ''
    },
    interviewNotes: {
        type: String,
        default: ''
    },
    // ===========================================
    appliedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Index pour recherche rapide
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);