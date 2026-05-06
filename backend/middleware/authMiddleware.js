const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Vérifier le token JWT
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Non autorisé, token invalide' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Non autorisé, pas de token' });
    }
};

// Vérifier les rôles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Rôle ${req.user.role} non autorisé pour cette action` 
            });
        }
        next();
    };
};

module.exports = { protect, authorize };