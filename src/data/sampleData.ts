import { useAppStore } from '@/stores/appStore';

// Fonction pour initialiser des données d'exemple
export function initializeSampleData() {
  const store = useAppStore.getState();

  // Ajouter des textes juridiques d'exemple
  const sampleLegalTexts = [
    {
      title: "Code Civil Algérien - Livre Premier",
      content: `
        <h1>LIVRE PREMIER - DES PERSONNES</h1>
        
        <h2>TITRE PREMIER - DES DROITS CIVILS</h2>
        
        <h3>Article 25</h3>
        <p>Toute personne a droit au respect de sa vie privée.</p>
        <p>Les juges peuvent, même en référé, prescrire toutes mesures propres à empêcher ou faire cesser une atteinte à l'intimité de la vie privée.</p>
        
        <h3>Article 26</h3>
        <p>Chacun a droit au respect de son nom.</p>
        <p>Le nom patronymique est celui qui figure dans l'acte de naissance.</p>
        
        <h3>Article 27</h3>
        <p>Toute personne peut demander la rectification d'une erreur matérielle contenue dans un acte de l'état civil la concernant.</p>
      `,
      type: 'law' as const,
      status: 'published' as const,
      category: 'Droit Civil',
      author: 'Législateur Algérien',
      tags: ['code civil', 'personnes', 'droits civils', 'vie privée', 'nom'],
      metadata: {
        source: 'Journal Officiel de la République Algérienne',
        references: ['Ordonnance n° 75-58 du 26 septembre 1975'],
        validity: 'En vigueur'
      }
    },
    {
      title: "Loi sur le Commerce Électronique",
      content: `
        <h1>LOI RELATIVE AU COMMERCE ÉLECTRONIQUE</h1>
        
        <h2>Chapitre I - Dispositions générales</h2>
        
        <h3>Article 1er</h3>
        <p>La présente loi a pour objet de fixer les règles générales relatives au commerce électronique.</p>
        
        <h3>Article 2</h3>
        <p>Au sens de la présente loi, on entend par :</p>
        <ul>
          <li>Commerce électronique : toute activité économique par laquelle une personne propose ou assure à distance et par voie électronique la fourniture de biens ou de services.</li>
          <li>Contrat électronique : tout contrat conclu par voie électronique.</li>
        </ul>
        
        <h2>Chapitre II - Des obligations du commerçant électronique</h2>
        
        <h3>Article 5</h3>
        <p>Tout commerçant électronique doit fournir de manière claire et non ambiguë les informations suivantes :</p>
        <ul>
          <li>Son identité et ses coordonnées</li>
          <li>Les caractéristiques essentielles du bien ou du service</li>
          <li>Le prix et les modalités de paiement</li>
          <li>Les modalités de livraison</li>
        </ul>
      `,
      type: 'law' as const,
      status: 'published' as const,
      category: 'Droit Commercial',
      author: 'Parlement Algérien',
      tags: ['commerce électronique', 'internet', 'contrat', 'obligations'],
      metadata: {
        source: 'Journal Officiel de la République Algérienne',
        references: ['Loi n° 18-05 du 10 mai 2018'],
        validity: 'En vigueur'
      }
    },
    {
      title: "Décret sur la Protection des Données Personnelles",
      content: `
        <h1>DÉCRET RELATIF À LA PROTECTION DES DONNÉES PERSONNELLES</h1>
        
        <h2>Article 1er</h2>
        <p>Le présent décret fixe les modalités d'application de la loi relative à la protection des données à caractère personnel.</p>
        
        <h2>Article 2</h2>
        <p>Constitue une donnée à caractère personnel toute information relative à une personne physique identifiée ou qui peut être identifiée.</p>
        
        <h2>Article 3</h2>
        <p>Le traitement des données personnelles doit respecter les principes suivants :</p>
        <ul>
          <li>Licéité, loyauté et transparence</li>
          <li>Limitation des finalités</li>
          <li>Minimisation des données</li>
          <li>Exactitude</li>
          <li>Limitation de la conservation</li>
          <li>Intégrité et confidentialité</li>
        </ul>
        
        <h2>Article 4</h2>
        <p>Toute personne a le droit d'accéder aux données personnelles la concernant et d'en obtenir la rectification ou l'effacement.</p>
      `,
      type: 'decree' as const,
      status: 'published' as const,
      category: 'Protection des Données',
      author: 'Gouvernement Algérien',
      tags: ['données personnelles', 'protection', 'vie privée', 'RGPD', 'traitement'],
      metadata: {
        source: 'Journal Officiel de la République Algérienne',
        references: ['Décret exécutif n° 20-05'],
        validity: 'En vigueur'
      }
    }
  ];

  // Ajouter des procédures d'exemple
  const sampleProcedures = [
    {
      title: "Création d'une Entreprise Individuelle",
      description: "Procédure complète pour créer une entreprise individuelle en Algérie",
      steps: [
        {
          id: '1',
          title: 'Réservation de la dénomination',
          description: 'Réserver la dénomination sociale auprès du Centre National du Registre de Commerce (CNRC)',
          order: 1,
          isRequired: true,
          documents: ['Demande de réservation', 'Pièce d\'identité du demandeur']
        },
        {
          id: '2',
          title: 'Ouverture d\'un compte bancaire',
          description: 'Ouvrir un compte bancaire professionnel au nom de l\'entreprise',
          order: 2,
          isRequired: true,
          documents: ['Certificat de réservation de dénomination', 'Pièce d\'identité', 'Justificatif de domicile']
        },
        {
          id: '3',
          title: 'Dépôt du dossier au CNRC',
          description: 'Déposer le dossier complet d\'immatriculation au registre de commerce',
          order: 3,
          isRequired: true,
          documents: ['Formulaire d\'immatriculation', 'Statuts', 'Attestation de dépôt de capital', 'Certificat de domiciliation']
        },
        {
          id: '4',
          title: 'Obtention de l\'extrait du registre de commerce',
          description: 'Récupérer l\'extrait du registre de commerce après validation du dossier',
          order: 4,
          isRequired: true
        },
        {
          id: '5',
          title: 'Déclaration fiscale',
          description: 'Effectuer les déclarations fiscales nécessaires auprès des impôts',
          order: 5,
          isRequired: true,
          documents: ['Extrait du registre de commerce', 'Formulaires fiscaux']
        }
      ],
      category: 'Création d\'Entreprise',
      difficulty: 'medium' as const,
      estimatedTime: '2-3 semaines',
      requiredDocuments: [
        'Pièce d\'identité nationale',
        'Justificatif de domicile',
        'Certificat de résidence',
        'Casier judiciaire',
        'Diplômes ou certificats professionnels (si applicable)'
      ],
      status: 'active' as const
    },
    {
      title: "Demande de Passeport Biométrique",
      description: "Procédure pour obtenir un passeport biométrique algérien",
      steps: [
        {
          id: '1',
          title: 'Prise de rendez-vous en ligne',
          description: 'Prendre rendez-vous sur le site officiel ou se présenter directement',
          order: 1,
          isRequired: true
        },
        {
          id: '2',
          title: 'Préparation du dossier',
          description: 'Rassembler tous les documents requis',
          order: 2,
          isRequired: true,
          documents: ['Formulaire de demande', 'Photos d\'identité', 'Pièce d\'identité', 'Justificatifs']
        },
        {
          id: '3',
          title: 'Dépôt du dossier',
          description: 'Se présenter au service des passeports avec le dossier complet',
          order: 3,
          isRequired: true
        },
        {
          id: '4',
          title: 'Paiement des frais',
          description: 'Régler les frais de confection du passeport',
          order: 4,
          isRequired: true
        },
        {
          id: '5',
          title: 'Retrait du passeport',
          description: 'Récupérer le passeport selon les délais indiqués',
          order: 5,
          isRequired: true
        }
      ],
      category: 'État Civil',
      difficulty: 'easy' as const,
      estimatedTime: '15-20 jours',
      requiredDocuments: [
        'Formulaire de demande dûment rempli',
        '2 photos d\'identité récentes',
        'Copie certifiée conforme de la carte d\'identité nationale',
        'Extrait d\'acte de naissance (moins de 3 mois)',
        'Certificat de nationalité (si nécessaire)'
      ],
      status: 'active' as const
    },
    {
      title: "Inscription au Registre de Commerce",
      description: "Procédure d'inscription d'une activité commerciale au registre de commerce",
      steps: [
        {
          id: '1',
          title: 'Constitution du dossier',
          description: 'Préparer tous les documents nécessaires à l\'inscription',
          order: 1,
          isRequired: true,
          documents: ['Formulaire d\'inscription', 'Statuts de la société', 'PV d\'AG constitutive']
        },
        {
          id: '2',
          title: 'Domiciliation de l\'entreprise',
          description: 'Obtenir une adresse de domiciliation pour l\'entreprise',
          order: 2,
          isRequired: true,
          documents: ['Contrat de bail commercial', 'Certificat de domiciliation']
        },
        {
          id: '3',
          title: 'Dépôt au CNRC',
          description: 'Déposer le dossier au Centre National du Registre de Commerce',
          order: 3,
          isRequired: true
        },
        {
          id: '4',
          title: 'Publication au BOAL',
          description: 'Publier un avis de constitution au Bulletin Officiel des Annonces Légales',
          order: 4,
          isRequired: true
        }
      ],
      category: 'Commerce',
      difficulty: 'hard' as const,
      estimatedTime: '3-4 semaines',
      requiredDocuments: [
        'Formulaire d\'inscription au registre de commerce',
        'Statuts de la société certifiés conformes',
        'Procès-verbal de l\'assemblée générale constitutive',
        'Attestation de versement du capital social',
        'Certificat de domiciliation',
        'Copie des pièces d\'identité des associés'
      ],
      status: 'active' as const
    }
  ];

  // Ajouter des actualités d'exemple
  const sampleNews = [
    {
      title: "Nouvelle Réglementation sur le Commerce Électronique",
      content: "Le gouvernement algérien a adopté de nouvelles mesures pour encadrer le commerce électronique. Ces mesures visent à protéger les consommateurs et à favoriser le développement du secteur numérique.",
      category: "Réglementation",
      author: "Ministère du Commerce",
      tags: ["commerce électronique", "réglementation", "protection consommateur"],
      isImportant: true
    },
    {
      title: "Simplification des Procédures Administratives",
      content: "Dans le cadre de la modernisation de l'administration, plusieurs procédures ont été simplifiées pour réduire les délais et améliorer l'efficacité des services publics.",
      category: "Administration",
      author: "Secrétariat Général du Gouvernement",
      tags: ["simplification", "administration", "modernisation"],
      isImportant: false
    },
    {
      title: "Mise à Jour du Code de Procédure Civile",
      content: "Le Code de procédure civile a été mis à jour pour intégrer les nouvelles technologies et améliorer l'accès à la justice. Les principales modifications concernent la dématérialisation des procédures.",
      category: "Justice",
      author: "Ministère de la Justice",
      tags: ["procédure civile", "dématérialisation", "justice"],
      isImportant: true
    }
  ];

  // Ajouter des modèles de documents d'exemple
  const sampleTemplates = [
    {
      name: "Contrat de Travail CDI",
      content: `
        CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE
        
        Entre les soussignés :
        
        L'employeur : {{nom_employeur}}
        Adresse : {{adresse_employeur}}
        
        Et le salarié : {{nom_salarie}}
        Adresse : {{adresse_salarie}}
        
        Il a été convenu ce qui suit :
        
        Article 1 - Engagement
        {{nom_salarie}} est engagé(e) en qualité de {{poste}} à compter du {{date_debut}}.
        
        Article 2 - Rémunération
        La rémunération mensuelle brute est fixée à {{salaire}} DA.
        
        Article 3 - Durée du travail
        La durée hebdomadaire du travail est de {{heures_hebdo}} heures.
        
        Fait à {{lieu}}, le {{date}}
        
        L'employeur                    Le salarié
      `,
      category: "Droit du Travail",
      variables: ["nom_employeur", "adresse_employeur", "nom_salarie", "adresse_salarie", "poste", "date_debut", "salaire", "heures_hebdo", "lieu", "date"],
      isPublic: true,
      createdBy: "Système"
    },
    {
      name: "Bail Commercial",
      content: `
        CONTRAT DE BAIL COMMERCIAL
        
        Entre :
        Le bailleur : {{nom_bailleur}}
        Demeurant : {{adresse_bailleur}}
        
        Et :
        Le preneur : {{nom_preneur}}
        Demeurant : {{adresse_preneur}}
        
        Il a été convenu et arrêté ce qui suit :
        
        Article 1 - Objet
        Le bailleur donne à bail au preneur qui accepte, les locaux situés {{adresse_locaux}}.
        
        Article 2 - Durée
        Le présent bail est consenti pour une durée de {{duree}} ans à compter du {{date_debut}}.
        
        Article 3 - Loyer
        Le loyer annuel est fixé à {{loyer}} DA, payable {{modalite_paiement}}.
        
        Article 4 - Destination
        Les locaux sont destinés exclusivement à {{destination}}.
        
        Fait à {{lieu}}, le {{date}}
        
        Le bailleur                    Le preneur
      `,
      category: "Droit Commercial",
      variables: ["nom_bailleur", "adresse_bailleur", "nom_preneur", "adresse_preneur", "adresse_locaux", "duree", "date_debut", "loyer", "modalite_paiement", "destination", "lieu", "date"],
      isPublic: true,
      createdBy: "Système"
    }
  ];

  // Nouvelles données d'exemple pour les fonctionnalités étendues
  
  // Ajouter des discussions de forum d'exemple
  const sampleForumDiscussions = [
    {
      title: "Interprétation de l'article 1240 du Code civil",
      content: "Je cherche des clarifications sur l'application de l'article 1240 du Code civil dans le contexte des dommages causés par négligence. Quelles sont les dernières jurisprudences applicables ?",
      author: "Maître Benali",
      category: "Droit Civil",
      status: 'active' as const,
      tags: ["responsabilité", "dommages", "jurisprudence", "code civil"],
      isPinned: true,
      isLocked: false
    },
    {
      title: "Nouvelle jurisprudence en droit commercial",
      content: "Discussion sur les récentes décisions de la Cour suprême concernant les contrats commerciaux et leur impact sur la pratique quotidienne.",
      author: "Dr. Amara",
      category: "Droit Commercial",
      status: 'active' as const,
      tags: ["commercial", "contrat", "jurisprudence", "cour suprême"],
      isPinned: false,
      isLocked: false
    },
    {
      title: "Procédure d'urgence en référé - Cas pratiques",
      content: "Partage d'expériences sur les procédures d'urgence en référé. Quels sont les critères déterminants pour obtenir une ordonnance favorable ?",
      author: "Mme Kaci",
      category: "Procédure",
      status: 'resolved' as const,
      tags: ["référé", "urgence", "procédure", "ordonnance"],
      isPinned: false,
      isLocked: false
    }
  ];

  // Ajouter des ressources partagées d'exemple
  const sampleSharedResources = [
    {
      title: "Modèles de Contrats Commerciaux 2024",
      description: "Collection complète de modèles de contrats commerciaux mis à jour selon la nouvelle réglementation",
      type: 'document' as const,
      url: '/resources/contrats-commerciaux-2024.pdf',
      sharedBy: "Cabinet Juridique Alger",
      category: "Contrats",
      tags: ["contrats", "commercial", "modèles", "2024"],
      isPublic: true
    },
    {
      title: "Guide Pratique du Droit du Travail",
      description: "Guide complet sur les dernières modifications du droit du travail en Algérie",
      type: 'document' as const,
      url: '/resources/guide-droit-travail.pdf',
      sharedBy: "Ministère du Travail",
      category: "Droit du Travail",
      tags: ["travail", "guide", "réglementation", "pratique"],
      isPublic: true
    },
    {
      title: "Formulaires Administratifs Numérisés",
      description: "Collection de formulaires administratifs au format numérique pour faciliter les démarches",
      type: 'file' as const,
      url: '/resources/formulaires-admin.zip',
      sharedBy: "Administration Publique",
      category: "Formulaires",
      tags: ["formulaires", "administratif", "numérique", "démarches"],
      isPublic: true
    }
  ];

  // Ajouter des tutoriels vidéo d'exemple
  const sampleVideoTutorials = [
    {
      title: "Introduction au Droit Civil Algérien",
      description: "Cours complet d'introduction aux principes fondamentaux du droit civil algérien",
      url: "https://example.com/video/droit-civil-intro",
      duration: "45:30",
      category: "Formation Juridique",
      instructor: "Professeur Mahmoud",
      tags: ["droit civil", "introduction", "formation", "principes"],
      transcript: "Bienvenue dans ce cours d'introduction au droit civil algérien. Nous allons explorer les principes fondamentaux..."
    },
    {
      title: "Procédures Judiciaires : Guide Pratique",
      description: "Guide pratique des procédures judiciaires avec exemples concrets et cas d'étude",
      url: "https://example.com/video/procedures-judiciaires",
      duration: "32:15",
      category: "Procédures",
      instructor: "Maître Saida",
      tags: ["procédures", "judiciaire", "pratique", "exemples"],
      transcript: "Dans cette vidéo, nous allons examiner les différentes étapes des procédures judiciaires..."
    },
    {
      title: "Droit Commercial : Contrats et Obligations",
      description: "Formation approfondie sur les contrats commerciaux et les obligations des parties",
      url: "https://example.com/video/droit-commercial",
      duration: "58:45",
      category: "Droit Commercial",
      instructor: "Dr. Karim",
      tags: ["commercial", "contrats", "obligations", "formation"],
      transcript: "Le droit commercial régit les relations entre commerçants et les actes de commerce..."
    }
  ];

  // Ajouter des configurations d'exemple
  const sampleConfigurations = [
    {
      key: 'theme',
      value: 'light',
      category: 'appearance' as const,
      userId: 'user-1'
    },
    {
      key: 'notifications',
      value: true,
      category: 'notifications' as const,
      userId: 'user-1'
    },
    {
      key: 'language',
      value: 'fr',
      category: 'appearance' as const,
      userId: 'user-1'
    },
    {
      key: 'offline-mode',
      value: false,
      category: 'performance' as const,
      userId: 'user-1'
    }
  ];

  // Ajouter des membres du forum d'exemple
  const sampleForumMembers = [
    {
      name: "Maître Ahmed Benali",
      email: "a.benali@avocat-dz.com",
      role: 'moderator' as const
    },
    {
      name: "Dr. Fatima Amara",
      email: "f.amara@univ-alger.dz",
      role: 'member' as const
    },
    {
      name: "Professeur Karim Ziani",
      email: "k.ziani@law-school.dz",
      role: 'admin' as const
    }
  ];

  // Ajouter les données au store
  sampleLegalTexts.forEach((text: any, index: number) => store.addLegalText({
    ...text,
    id: String(index + 1),
    publishDate: new Date().toISOString(),
    description: text.content?.substring(0, 200) || '',
    authority: 'République Algérienne',
    joNumber: `JO-${2024}-${index + 1}`,
    date: new Date(),
    source: 'Journal Officiel',
    insertionMethod: 'manual',
    views: Math.floor(Math.random() * 1000),
    popularity: Math.floor(Math.random() * 100)
  }));
  sampleProcedures.forEach((proc: any, index: number) => store.addProcedure({
    ...proc,
    id: String(index + 1),
    requirements: proc.steps?.map((step: any) => step.description) || [],
    processingTime: '5-10 jours ouvrés',
    cost: 'Gratuit',
    authority: 'Administration publique'
  }));
  sampleNews.forEach((news: any, index: number) => store.addNews({
    ...news,
    id: String(index + 1),
    publishDate: new Date().toISOString(),
    views: Math.floor(Math.random() * 500)
  }));
  sampleTemplates.forEach((template: any, index: number) => store.addTemplate({
    id: String(index + 1),
    title: template.name,
    category: template.category,
    description: template.content?.substring(0, 200) || '',
    fileUrl: `/templates/${template.name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
    downloadCount: Math.floor(Math.random() * 100)
  }));
  
  // Ajouter les nouvelles données
  sampleForumDiscussions.forEach(discussion => store.addForumDiscussion(discussion));
  sampleSharedResources.forEach(resource => store.addSharedResource(resource));
  sampleVideoTutorials.forEach(tutorial => store.addVideoTutorial(tutorial));
  sampleConfigurations.forEach(config => store.setConfiguration(config));
  sampleForumMembers.forEach(member => store.addForumMember(member));

}

// Fonction pour réinitialiser les données
export function resetSampleData() {
  const store = useAppStore.getState();
  
  // Vider toutes les données
  store.legalTexts.forEach(text => store.deleteLegalText(text.id));
  store.procedures.forEach(procedure => store.deleteProcedure(procedure.id));
  store.news.forEach(news => store.deleteNews(news.id));
  store.templates.forEach(template => store.deleteTemplate(template.id));
  store.savedSearches.forEach(search => store.deleteSavedSearch(search.id));
  store.favorites.forEach(favorite => store.removeFromFavorites(favorite.itemId, favorite.itemType));

}