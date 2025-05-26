import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://prpdoztjsbkntvbxfpqp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBycGRvenRqc2JrbnR2YnhmcHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2ODAxODcsImV4cCI6MjA0NzI1NjE4N30.zdUHRJy86ExhQ4Mri_JlI9VvlAxSnKQl1dAGQjhKi7I';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Charger les données de la base
// Fonction pour récupérer les données 18h55 25/11
async function fetchexpensedb() {
    const { data, error } = await supabase.from('expensedb').select('*');

    if (error) {
        console.error('Erreur de récupération des données :', error.message);
        return;
    }

    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    data.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${expense.prenom || ''}</td>
            <td>${expense.intitule || ''}</td>
            <td>${expense.commentaire || ''}</td>
            <td>${expense.date || ''}</td>
            <td class="somme">${expense.somme ? expense.somme.toFixed(2) : '0.00'}</td>
            <td class="total_cumulatif">${expense.total_cumulatif ? expense.total_cumulatif.toFixed(2) : '0.00'}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Appel initial de récupération des données
fetchexpensedb();

// Attacher les fonctions globalement
window.downloadPDF = function () {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
    doc.text("Liste des Dépenses Enregistrées", 20, 10);
    doc.autoTable({ html: "#dataTable" });

    doc.save("tableau_depenses.pdf");
};

window.searchTable = function () {
    const input = document.getElementById("searchInput");
    const filter = input.value.toLowerCase();
    const rows = document.querySelectorAll("#dataTable tbody tr");

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
};
// Fonction pour calculer les contributions
function calculateContributions() {
    const rows = document.querySelectorAll("#dataTable tbody tr");
    const resultBox = document.getElementById("resultBox");
    resultBox.innerHTML = "Calcul en cours...";

    // Liste fixe des membres du groupe
    const group = ["Saïd", "Django", "Mohamed", "Koutah"];
    const contributions = {};
    let totalExpenses = 0;

    // Initialiser les contributions à zéro pour tous les membres
    group.forEach(person => {
        contributions[person] = { paid: 0 };
    });

    // Récupérer les données du tableau
    rows.forEach(row => {
        const person = row.cells[0].textContent.trim(); // Nom de la personne
        const amountPaid = parseFloat(row.cells[4].textContent.trim()); // Somme payée

        if (group.includes(person)) {
            totalExpenses += amountPaid;

            // Ajouter le montant payé à la bonne personne
            contributions[person].paid += amountPaid;
        }
    });

    // Calculer la part égale par personne
    const equalShare = totalExpenses / group.length;

    // Calculer ce que chacun doit encore payer ou récupérer
    const results = [];
    for (const person of group) {
        const paid = contributions[person].paid;
        const balance = equalShare - paid;
        results.push({
            person,
            paid,
            equalShare: equalShare.toFixed(2),
            balance: balance.toFixed(2)
        });
    }

    // Afficher les résultats
    resultBox.innerHTML = `<h4>Total des dépenses : ${totalExpenses.toFixed(2)}€</h4>`;
    results.forEach(result => {
        resultBox.innerHTML += `
            <p>
                <strong>${result.person}</strong> a payé ${result.paid.toFixed(2)}€.<br>
                Part égale : ${result.equalShare}€. <br>
                <span style="color: ${result.balance < 0 ? 'red' : 'green'};">
                    ${result.balance < 0 ? `Doit Recevoir ${Math.abs(result.balance)}€` : `Doit encore payer ${result.balance}€`}
                </span>
            </p>
        `;
    });
}

// Attacher la fonction au contexte global
window.calculateContributions = calculateContributions;
