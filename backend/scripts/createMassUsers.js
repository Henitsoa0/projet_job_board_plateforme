const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Prénoms et noms pour générer des noms aléatoires
const firstNames = [
  'Jean', 'Marie', 'Pierre', 'Sophie', 'Thomas', 'Julie', 'Nicolas', 'Emma', 'Lucas', 'Camille',
  'Alexandre', 'Claire', 'Julien', 'Laura', 'Maxime', 'Pauline', 'Antoine', 'Manon', 'Benoit', 'Chloé',
  'David', 'Sarah', 'François', 'Alice', 'Olivier', 'Elodie', 'Philippe', 'Marine', 'Vincent', 'Aurélie',
  'Sébastien', 'Vanessa', 'Laurent', 'Céline', 'Romain', 'Amandine', 'Guillaume', 'Anaïs', 'Cédric', 'Mélanie',
  'Jérôme', 'Nathalie', 'Mathieu', 'Sandrine', 'Florent', 'Isabelle', 'Mickaël', 'Laetitia', 'Raphaël', 'Juliette'
];

const lastNames = [
  'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau',
  'Simon', 'Laurent', 'Michel', 'Lefebvre', 'Bertrand', 'Garcia', 'David', 'Roux', 'Vincent', 'Fournier',
  'Morel', 'Girard', 'Andre', 'Lefevre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'Francois', 'Martinez'
];

// Villes françaises
const cities = [
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux', 'Lille', 'Nantes', 'Strasbourg', 'Montpellier', 'Rennes',
  'Reims', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne', 'Clermont-Ferrand'
];

// Compétences possibles
const skillSets = {
  candidate: [
    ['React', 'Node.js', 'JavaScript'], ['Python', 'Django', 'PostgreSQL'], ['Java', 'Spring Boot', 'Angular'],
    ['PHP', 'Laravel', 'MySQL'], ['Ruby', 'Rails', 'React'], ['Go', 'Docker', 'Kubernetes'],
    ['AWS', 'Terraform', 'Jenkins'], ['Vue.js', 'Nuxt.js', 'Tailwind'], ['Flutter', 'Dart', 'Firebase'],
    ['Swift', 'iOS', 'UIKit'], ['C#', '.NET', 'Azure'], ['WordPress', 'PHP', 'SEO']
  ],
  recruiter: [
    ['Recrutement', 'Sourcing', 'LinkedIn'], ['RH', 'Entretiens', 'Onboarding'], ['Talent Acquisition', 'ATS', 'CVthèque'],
    ['Management', 'Équipe', 'Formation'], ['Psychologie du travail', 'Droit social', 'Paie']
  ]
};

// Noms d'entreprises pour les recruteurs
const companyNames = [
  'TechCorp', 'DigitalSolutions', 'CloudFactory', 'AI Innovations', 'WebAgency', 
  'DevStudio', 'DataMind', 'CyberSecure', 'MobileFirst', 'SoftwareLab',
  'CodeCraft', 'NetSolutions', 'InfoTech', 'SysAdmin', 'CloudNative',
  'AgileTeam', 'DevOpsPro', 'FullStackCo', 'FrontendFactory', 'BackendBuilders'
];

// Générer un email aléatoire
const generateEmail = (name, role, index) => {
  const cleanName = name.toLowerCase().replace(/ /g, '.');
  const domain = role === 'recruiter' ? 'entreprise.com' : 'email.com';
  return `${cleanName}.${index}@${domain}`;
};

// Générer un téléphone aléatoire
const generatePhone = () => {
  return `+33 ${Math.floor(Math.random() * 7) + 1}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
};

const createMassUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connecté à MongoDB\n');
    console.log('🚀 Création de 50 candidats et 50 recruteurs...\n');

    let created = 0;
    let skipped = 0;

    // ===== CRÉATION DES 50 CANDIDATS =====
    console.log('👥 Création des candidats...');
    
    for (let i = 1; i <= 50; i++) {
      const firstName = firstNames[(i - 1) % firstNames.length];
      const lastName = lastNames[(i - 1) % lastNames.length];
      const name = `${firstName} ${lastName}`;
      const email = `candidat.${i}@example.com`;
      
      const existing = await User.findOne({ email });
      
      if (!existing) {
        const skills = skillSets.candidate[(i - 1) % skillSets.candidate.length];
        const city = cities[(i - 1) % cities.length];
        
        await User.create({
          name,
          email,
          password: "password123",
          role: "candidate",
          profile: {
            phone: generatePhone(),
            location: city,
            title: `${skills[0]} Developer`,
            bio: `Développeur passionné avec ${Math.floor(Math.random() * 5) + 1} ans d'expérience. Je recherche un nouveau défi professionnel.`,
            skills: skills,
            resume: ""
          }
        });
        created++;
        process.stdout.write(`\r   ✅ ${created}/50 candidats créés`);
      } else {
        skipped++;
      }
    }
    
    console.log(`\n   ✅ ${created} candidats créés\n`);

    // ===== CRÉATION DES 50 RECRUTEURS =====
    console.log('🏢 Création des recruteurs...');
    const recruiterCount = created;
    let recruiterCreated = 0;
    
    for (let i = 1; i <= 50; i++) {
      const firstName = firstNames[(i - 1) % firstNames.length];
      const lastName = lastNames[(i - 1) % lastNames.length];
      const name = `${firstName} ${lastName}`;
      const email = `recruteur.${i}@entreprise.com`;
      
      const existing = await User.findOne({ email });
      
      if (!existing) {
        const skills = skillSets.recruiter[(i - 1) % skillSets.recruiter.length];
        const city = cities[(i - 1) % cities.length];
        const companyName = companyNames[(i - 1) % companyNames.length];
        
        await User.create({
          name,
          email,
          password: "password123",
          role: "recruiter",
          profile: {
            phone: generatePhone(),
            location: city,
            title: "Recruteur Tech",
            bio: `Professionnel du recrutement spécialisé dans les métiers techniques.`,
            skills: skills
          },
          company: {
            name: companyName,
            website: `https://${companyName.toLowerCase()}.com`,
            description: `Entreprise leader dans le domaine du ${Math.random() > 0.5 ? 'développement web' : 'cloud computing'}`
          }
        });
        recruiterCreated++;
        process.stdout.write(`\r   ✅ ${recruiterCreated}/50 recruteurs créés`);
      } else {
        skipped++;
      }
    }
    
    console.log(`\n   ✅ ${recruiterCreated} recruteurs créés\n`);

    // ===== RÉSUMÉ =====
    console.log('='.repeat(50));
    console.log('📊 RÉSUMÉ DES CRÉATIONS :');
    console.log('='.repeat(50));
    console.log(`✅ Candidats créés  : 50`);
    console.log(`✅ Recruteurs créés : 50`);
    console.log(`📊 Total : 100 utilisateurs`);
    console.log(`\n🔑 Mot de passe commun : password123`);
    console.log(`\n📋 Exemples de comptes :`);
    console.log(`   - Candidat  : candidat.1@example.com / password123`);
    console.log(`   - Recruteur : recruteur.1@entreprise.com / password123`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

createMassUsers();