import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialisation de Supabase
const SUPABASE_URL = 'https://prpdoztjsbkntvbxfpqp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBycGRvenRqc2JrbnR2YnhmcHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2ODAxODcsImV4cCI6MjA0NzI1NjE4N30.zdUHRJy86ExhQ4Mri_JlI9VvlAxSnKQl1dAGQjhKi7I';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Gestion de la connexion
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const { user, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Erreur de connexion:', error.message);
            alert('Erreur : ' + error.message);
        } else {
            alert('Connexion réussie ! Redirection...');
            window.location.href = 'formulaire.html';
        }
    } catch (err) {
        console.error('Erreur inattendue:', err);
        alert('Une erreur est survenue.');
    }
});
