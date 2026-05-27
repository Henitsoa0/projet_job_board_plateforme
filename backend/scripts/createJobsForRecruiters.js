const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/User');
require('dotenv').config();

// ===== 50 TITRES "DÉVELOPPEUR + SPÉCIALITÉ" =====
const jobTitles = [
  "Développeur Full Stack JavaScript",
  "Développeur Frontend React",
  "Développeur Backend Node.js",
  "Développeur Angular",
  "Développeur Vue.js",
  "Développeur Python",
  "Développeur Java Spring",
  "Développeur PHP Symfony",
  "Développeur Ruby on Rails",
  "Développeur Go",
  "Développeur C# .NET",
  "Développeur Flutter",
  "Développeur React Native",
  "Développeur iOS Swift",
  "Développeur Android Kotlin",
  "Développeur TypeScript",
  "Développeur GraphQL",
  "Développeur Next.js",
  "Développeur NestJS",
  "Développeur Express.js",
  "Développeur Django",
  "Développeur Flask",
  "Développeur FastAPI",
  "Développeur Laravel",
  "Développeur Spring Boot",
  "Développeur MongoDB",
  "Développeur PostgreSQL",
  "Développeur Redis",
  "Développeur Elasticsearch",
  "Développeur Docker",
  "Développeur Kubernetes",
  "Développeur AWS",
  "Développeur Azure",
  "Développeur GCP",
  "Développeur Terraform",
  "Développeur Jenkins",
  "Développeur GitLab CI",
  "Développeur GitHub Actions",
  "Développeur Web3",
  "Développeur Blockchain",
  "Développeur Smart Contract",
  "Développeur Machine Learning",
  "Développeur IA",
  "Développeur Computer Vision",
  "Développeur NLP",
  "Développeur Cybersécurité",
  "Développeur DevSecOps",
  "Développeur Mobile Hybride",
  "Développeur Desktop Electron",
  "Développeur Jeux Vidéo Unity"
];

// Types de contrat
const jobTypes = [
  "Full-time", "Full-time", "Full-time", "Full-time", "Remote", 
  "Remote", "Part-time", "Contract", "Internship"
];

// Niveaux d'expérience
const experienceLevels = [
  "Entry", "Intermediate", "Intermediate", "Expert", "Expert"
];

// Villes
const locations = [
  "Paris, France", "Lyon, France", "Marseille, France", "Toulouse, France",
  "Bordeaux, France", "Lille, France", "Nantes, France", "Strasbourg, France",
  "Montpellier, France", "Rennes, France", "Nice, France", "Toulon, France",
  "Grenoble, France", "Dijon, France", "Angers, France", "Le Havre, France",
  "Reims, France", "Saint-Étienne, France", "Orléans, France", "Nancy, France",
  "Remote - France", "Remote - Europe", "Remote - Worldwide"
];

// Fourchettes de salaire par niveau
const salaryRanges = {
  Entry: { min: 35000, max: 45000 },
  Intermediate: { min: 45000, max: 65000 },
  Expert: { min: 65000, max: 95000 }
};

// Compétences par titre
const getSkillsForTitle = (title) => {
  const skillsMap = {
    "Développeur Full Stack JavaScript": ["React", "Node.js", "MongoDB", "Express", "TypeScript", "Git", "Docker"],
    "Développeur Frontend React": ["React", "Redux", "Next.js", "Tailwind CSS", "JavaScript", "HTML/CSS", "Git"],
    "Développeur Backend Node.js": ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST API", "GraphQL", "Docker"],
    "Développeur Python": ["Python", "Django", "Flask", "FastAPI", "PostgreSQL", "Docker", "Git", "Pytest"],
    "Développeur Java Spring": ["Java", "Spring Boot", "Hibernate", "Maven", "PostgreSQL", "Docker", "Git", "JUnit"],
    "Développeur DevOps": ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins", "GitLab CI", "Prometheus"],
    "Développeur Machine Learning": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "SQL"],
    "Développeur Mobile React Native": ["React Native", "React", "JavaScript", "TypeScript", "Redux", "Git", "Firebase"]
  };
  
  for (const [key, skills] of Object.entries(skillsMap)) {
    if (title.includes(key)) return skills;
  }
  
  // Compétences génériques
  const tech = title.split(" ").pop();
  return [`${tech}`, "JavaScript/TypeScript", "Git", "Tests unitaires", "API REST", "Agile/Scrum", "Résolution de problèmes"];
};

// Avantages
const benefitsList = [
  "🏠 Télétravail 2j/semaine", "🏠 100% télétravail", "🏠 Télétravail flexible",
  "🍱 Tickets restaurant (12€/j)", "🍱 Tickets restaurant (10€/j)",
  "🩺 Mutuelle prise en charge 100%", "🩺 Mutuelle familiale",
  "🎯 RTT (12 jours/an)", "🎯 RTT (10 jours/an)",
  "🚗 Prise en charge transports 50%", "🚗 Prise en charge transports 100%",
  "📚 Budget formation 2000€/an", "📚 Budget formation 5000€/an",
  "💻 MacBook Pro fourni", "💻 Équipement haut de gamme",
  "🎄 CE avantageux", "🎄 Chèques cadeaux", "🎄 Prime vacances",
  "🏊 Salle de sport", "🏊 Abonnement gym",
  "🍻 Afterworks", "🍻 Team buildings",
  "📈 Participation aux bénéfices", "📈 Intéressement", "📈 Prime annuelle",
  "🌍 Congés illimités", "🌍 Semaine de 4 jours"
];

// Description
const getDescription = (title, company, location, type, experience) => {
  const experienceText = {
    Entry: "débutant(e) motivé(e) avec une première expérience (1-2 ans)",
    Intermediate: "confirmé(e) avec au moins 3 ans d'expérience",
    Expert: "expert(e) avec au moins 5 ans d'expérience"
  };
  
  return `**${title} - ${company}**

## 🎯 Contexte
Nous recherchons un(e) ${title} ${experienceText[experience]} pour rejoindre notre équipe technique basée à **${location}**.

## 📝 Missions
- Développer et maintenir des applications de qualité
- Participer aux choix techniques et à l'architecture
- Collaborer avec les équipes produit et design
- Assurer la qualité du code (tests, revues de code)
- Participer aux rituels agiles (daily, sprint, rétro)

## 🔧 Compétences recherchées
- Maîtrise des technologies liées au poste
- Bonnes pratiques de développement (clean code, SOLID)
- Esprit d'équipe et bonnes capacités de communication

## ✨ Ce que nous offrons
- Type de contrat : **${type}**
- Rémunération attractive
- Environnement technique moderne
- Équipe dynamique et bienveillante
- Perspectives d'évolution rapide

**Rejoignez-nous pour relever de nouveaux défis techniques !**`;
};

const createJobsForRecruiters = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connecté à MongoDB\n');

    const recruiters = await User.find({ role: 'recruiter' });
    console.log(`🏢 ${recruiters.length} recruteurs trouvés\n`);

    let jobsCreated = 0;
    let usedTitles = new Set();

    for (const recruiter of recruiters) {
      const companyName = recruiter.company?.name || "Tech Entreprise";
      
      for (let i = 0; i < 2; i++) {
        let availableTitles = jobTitles.filter(t => !usedTitles.has(t));
        if (availableTitles.length === 0) {
          usedTitles.clear();
          availableTitles = jobTitles;
        }
        
        const title = availableTitles[Math.floor(Math.random() * availableTitles.length)];
        usedTitles.add(title);
        
        const type = jobTypes[Math.floor(Math.random() * jobTypes.length)];
        const experience = experienceLevels[Math.floor(Math.random() * experienceLevels.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const salary = salaryRanges[experience];
        const skills = getSkillsForTitle(title);
        
        const shuffledBenefits = [...benefitsList].sort(() => 0.5 - Math.random());
        const benefits = shuffledBenefits.slice(0, Math.floor(Math.random() * 4) + 3);
        
        const jobData = {
          title: title,
          company: companyName,
          location: location,
          type: type,
          experience: experience,
          salary: { min: salary.min, max: salary.max, currency: "EUR" },
          description: getDescription(title, companyName, location, type, experience),
          requirements: skills,
          benefits: benefits,
          recruiter: recruiter._id,
          status: "active",
          createdAt: new Date()
        };
        
        const existing = await Job.findOne({
          title: jobData.title,
          company: jobData.company,
          recruiter: recruiter._id
        });
        
        if (!existing) {
          await Job.create(jobData);
          jobsCreated++;
          console.log(`✅ ${recruiter.name.padEnd(25)} : "${title}" (${type} - ${experience})`);
        }
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 RÉSULTAT :`);
    console.log(`${'='.repeat(60)}`);
    console.log(`✅ ${jobsCreated} offres créées`);
    console.log(`📊 ${recruiters.length} recruteurs`);
    console.log(`📊 ${jobsCreated / recruiters.length} offres/recruteur`);
    console.log(`\n📋 Total offres : ${await Job.countDocuments()}`);
    console.log(`🎯 Titres uniques : ${usedTitles.size}/50`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

createJobsForRecruiters();