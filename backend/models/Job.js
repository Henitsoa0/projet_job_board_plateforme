const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est requis'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Le nom de l\'entreprise est requis']
    },
    location: {
        type: String,
        required: [true, 'La localisation est requise']
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'],
        default: 'Full-time'
    },
    experience: {
        type: String,
        enum: ['Entry', 'Intermediate', 'Expert'],
        default: 'Entry'
    },
    salary: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'EUR'
        }
    },
    description: {
        type: String,
        required: [true, 'La description est requise']
    },
    requirements: [String],
    benefits: [String],
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'closed', 'draft'],
        default: 'active'
    },
    applicationsCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: () => Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 jours
    }
});

module.exports = mongoose.model('Job', jobSchema);