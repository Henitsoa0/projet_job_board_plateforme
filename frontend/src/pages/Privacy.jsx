import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link to="/register" className="text-blue-600 hover:underline mb-4 inline-block">← Retour</Link>
      <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
      <div className="prose">
        <p className="mb-4">Chez JobBoard, nous prenons la protection de vos données très au sérieux.</p>
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Données collectées</h2>
        <p>Nous collectons les informations que vous nous fournissez : nom, email, CV, etc.</p>
        <h2 className="text-xl font-semibold mt-6 mb-3">2. Utilisation des données</h2>
        <p>Vos données sont utilisées pour vous permettre de postuler ou de publier des offres d'emploi.</p>
        <h2 className="text-xl font-semibold mt-6 mb-3">3. Protection des données</h2>
        <p>Vos informations sont stockées de manière sécurisée et ne sont pas partagées sans votre consentement.</p>
        <p className="mt-6 text-gray-500 text-sm">© 2025 JobBoard - Tous droits réservés</p>
      </div>
    </div>
  );
};

export default Privacy;