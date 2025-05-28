import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://prpdoztjsbkntvbxfpqp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBycGRvenRqc2JrbnR2YnhmcHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2ODAxODcsImV4cCI6MjA0NzI1NjE4N30.zdUHRJy86ExhQ4Mri_JlI9VvlAxSnKQl1dAGQjhKi7I';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Vérification de l'authentification
(async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        alert('Vous devez être connecté pour accéder à cette page.');
        window.location.href = 'index.html';
    }
})();

// Gestion de l'envoi du formulaire
document.getElementById('expenseForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const prenom = document.getElementById('prenom').value;
    const intitule = document.getElementById('intitule').value;
    const commentaire = document.getElementById('commentaire').value;
    const date = document.getElementById('date').value;
    const somme = parseFloat(document.getElementById('somme').value);

    try {
        const { data, error } = await supabase.from('expensedb').insert([
            { prenom, intitule, commentaire, date, somme }
        ]);

        if (error) {
            console.error('Erreur lors de l\'insertion:', error.message);
            alert('Erreur : ' + error.message);
        } else {
            alert('Dépense enregistrée avec succès !');
            document.getElementById('expenseForm').reset();
        }
    } catch (err) {
        console.error('Erreur inattendue:', err);
        alert('Une erreur est survenue.');
    }
});
