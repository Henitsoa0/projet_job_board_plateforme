import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link to="/register" className="text-blue-600 hover:underline mb-4 inline-block">← Retour</Link>
      <h1 className="text-3xl font-bold mb-6">Conditions d'utilisation</h1>
      <div className="prose">
        <p className="mb-4">Bienvenue sur JobBoard. En utilisant notre plateforme, vous acceptez les présentes conditions.</p>
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Utilisation de la plateforme</h2>
        <p>Cette plateforme est destinée à mettre en relation des candidats et des recruteurs. Vous vous engagez à fournir des informations exactes.</p>
        <h2 className="text-xl font-semibold mt-6 mb-3">2. Comptes utilisateur</h2>
        <p>Chaque utilisateur est responsable de la confidentialité de son mot de passe et de ses actions sur la plateforme.</p>
        <h2 className="text-xl font-semibold mt-6 mb-3">3. Modification des conditions</h2>
        <p>Nous nous réservons le droit de modifier ces conditions à tout moment.</p>
        <p className="mt-6 text-gray-500 text-sm">© 2025 JobBoard - Tous droits réservés</p>
      </div>
    </div>
  );
};

export default Terms;