// Middleware de validation pour la mise à jour du profil
const validateProfileUpdate = (req, res, next) => {
    const { name, profile, company } = req.body;
    const errors = [];

    // Validation du nom
    if (name && (typeof name !== 'string' || name.trim().length < 2)) {
        errors.push('Le nom doit contenir au moins 2 caractères');
    }

    // Validation du profil
    if (profile) {
        if (profile.phone && !/^[\d\s\+\-\(\)]+$/.test(profile.phone)) {
            errors.push('Le numéro de téléphone est invalide');
        }
        
        if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) {
            errors.push('L\'email du profil est invalide');
        }
        
        if (profile.bio && profile.bio.length > 500) {
            errors.push('La biographie ne doit pas dépasser 500 caractères');
        }
    }

    // Validation de l'entreprise (pour les recruteurs)
    if (company) {
        if (company.name && (typeof company.name !== 'string' || company.name.trim().length < 2)) {
            errors.push('Le nom de l\'entreprise doit contenir au moins 2 caractères');
        }
        
        if (company.website && !/^https?:\/\/.+/.test(company.website)) {
            errors.push('Le site web doit commencer par http:// ou https://');
        }
        
        if (company.description && company.description.length > 1000) {
            errors.push('La description de l\'entreprise ne doit pas dépasser 1000 caractères');
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors
        });
    }

    next();
};

module.exports = { validateProfileUpdate };
