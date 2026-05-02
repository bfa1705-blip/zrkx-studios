export const translations = {
  fr: {
    // Navbar
    logout: 'Déconnexion',
    join_discord: 'Rejoindre notre Discord',
    
    // Home
    home_title: 'Accueil',
    filters: 'Filtres',
    all: 'Toutes',
    search_placeholder: 'Rechercher un leak...',
    search_btn: 'Rechercher',
    add_leak: 'Publier un leak',
    no_leaks: 'Aucun leak trouvé',
    no_leaks_desc: 'Soyez le premier à publier un leak !',
    views: 'vues',
    by: 'Par',
    view_more: 'Voir plus',
    
    // Add Leak
    add_leak_title: 'Publier un leak',
    publish_leak: 'Publier un nouveau leak',
    back: 'Retour',
    back_to_leaks: 'Retour aux leaks',
    leak_title: 'Titre du leak',
    category: 'Catégorie',
    description: 'Description',
    download_link: 'Lien de téléchargement',
    publish_btn: 'Publier le leak',
    all_fields_required: 'Tous les champs sont requis',
    
    // View Leak
    published_by: 'Publié par',
    date: 'Date',
    download_now: 'Télécharger maintenant',
    similar_leaks: 'Leaks similaires',
    comments: 'Commentaires',
    leave_comment: 'Laisser un commentaire',
    your_rating: 'Votre note :',
    post: 'Publier',
    no_comments: 'Aucun commentaire pour le moment',
    downloads: 'Téléchargements',
    
    // Login
    login_title: 'Connexion',
    username_or_email: 'Nom d\'utilisateur ou Email',
    password: 'Mot de passe',
    login_btn: 'Se connecter',
    no_account: 'Pas encore de compte ?',
    register_link: 'S\'inscrire',
    
    // Register
    register_title: 'Inscription',
    username: 'Nom d\'utilisateur',
    email: 'Email',
    confirm_password: 'Confirmer le mot de passe',
    language: 'Langue',
    french: 'Français',
    english: 'Anglais',
    register_btn: 'S\'inscrire',
    have_account: 'Déjà un compte ?',
    login_link: 'Se connecter',
  },
  en: {
    // Navbar
    logout: 'Logout',
    join_discord: 'Join our Discord',
    
    // Home
    home_title: 'Home',
    filters: 'Filters',
    all: 'All',
    search_placeholder: 'Search for a leak...',
    search_btn: 'Search',
    add_leak: 'Publish a leak',
    no_leaks: 'No leaks found',
    no_leaks_desc: 'Be the first to publish a leak!',
    views: 'views',
    by: 'By',
    view_more: 'View more',
    
    // Add Leak
    add_leak_title: 'Publish a leak',
    publish_leak: 'Publish a new leak',
    back: 'Back',
    back_to_leaks: 'Back to leaks',
    leak_title: 'Leak title',
    category: 'Category',
    description: 'Description',
    download_link: 'Download link',
    publish_btn: 'Publish leak',
    all_fields_required: 'All fields are required',
    
    // View Leak
    published_by: 'Published by',
    date: 'Date',
    download_now: 'Download now',
    similar_leaks: 'Similar leaks',
    comments: 'Comments',
    leave_comment: 'Leave a comment',
    your_rating: 'Your rating:',
    post: 'Post',
    no_comments: 'No comments yet',
    downloads: 'Downloads',
    
    // Login
    login_title: 'Login',
    username_or_email: 'Username or Email',
    password: 'Password',
    login_btn: 'Login',
    no_account: 'No account yet?',
    register_link: 'Sign up',
    
    // Register
    register_title: 'Sign up',
    username: 'Username',
    email: 'Email',
    confirm_password: 'Confirm password',
    language: 'Language',
    french: 'French',
    english: 'English',
    register_btn: 'Sign up',
    have_account: 'Already have an account?',
    login_link: 'Login',
  }
};

export function t(key: string, lang: 'fr' | 'en' = 'fr'): string {
  return translations[lang][key as keyof typeof translations.fr] || key;
}
