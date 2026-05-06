const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [6, 'Minimum 6 caractères'],
        select: false
    },
    role: {
        type: String,
        enum: ['candidate', 'recruiter', 'admin'],
        default: 'candidate'
    },
    profile: {
        phone: String,
        location: String,
        title: String,
        bio: String,
        skills: [String],
        resume: String, // URL du CV sur Cloudinary
        avatar: String
    },
    company: {
        name: String,
        website: String,
        description: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hasher le mot de passe avant sauvegarde
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Comparer les mots de passe
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);