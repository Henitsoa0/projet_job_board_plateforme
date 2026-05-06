const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log pour debug
    console.error(err);

    // Erreur Mongoose: ID invalide
    if (err.name === 'CastError') {
        const message = 'Ressource non trouvée';
        error = { message, statusCode: 404 };
    }

    // Erreur Mongoose: duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const message = `${field} existe déjà`;
        error = { message, statusCode: 400 };
    }

    // Erreur Mongoose: validation
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Erreur serveur'
    });
};

module.exports = errorHandler;