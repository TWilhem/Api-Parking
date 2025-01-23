// Fonction pour calculer la corrélation entre deux séries
function correlation(x, y) {
const n = x.length;
const meanX = x.reduce((a, b) => a + b, 0) / n;
const meanY = y.reduce((a, b) => a + b, 0) / n;

const numerator = x.map((xi, i) => (xi - meanX) * (y[i] - meanY)).reduce((a, b) => a + b, 0);
const denominator = Math.sqrt(
    x.map(xi => Math.pow(xi - meanX, 2)).reduce((a, b) => a + b, 0) *
    y.map(yi => Math.pow(yi - meanY, 2)).reduce((a, b) => a + b, 0)
);

return numerator / denominator;
}

// Fonction pour générer une heatmap des corrélations (vélo en lignes, voiture en colonnes)
function generateCorrelationHeatmap(dataVoiture, dataVelo) {
const table = document.getElementById("heatmap");
const headerRow = document.createElement("tr");

// Créer la première colonne pour les noms des parkings vélo
headerRow.innerHTML = `<th>Station Vélo</th>`;
dataVoiture.forEach(voiture => {
    headerRow.innerHTML += `<th>${voiture.parkingName}</th>`;
});
table.appendChild(headerRow);

// Créer les lignes pour chaque station vélo
dataVelo.forEach(velo => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${velo.parkingName}</td>`;

    dataVoiture.forEach(voiture => {
    // Récupérer les séries temporelles
    const voitureData = voiture.data.map(d => d.nombreSpotavailable);
    const veloData = velo.data.map(d => d.nombreSpotavailable);

    // Aligner les séries temporelles si nécessaire
    const minLength = Math.min(voitureData.length, veloData.length);
    const alignedVoiture = voitureData.slice(0, minLength);
    const alignedVelo = veloData.slice(0, minLength);

    // Calculer la corrélation
    const corr = correlation(alignedVoiture, alignedVelo).toFixed(2);

    // Ajouter une cellule avec la couleur correspondant à la corrélation
    row.innerHTML += `<td style="background-color: ${getColor(corr)};">${corr}</td>`;
    });

    table.appendChild(row);
});
}

// Fonction pour déterminer la couleur selon la corrélation (-1 à 1)
function getColor(value) {
const v = parseFloat(value);
const red = Math.floor(255 * (1 - v)); // Rouge pour les corrélations négatives
const green = Math.floor(255 * (1 + v)); // Vert pour les corrélations positives
return `rgb(${red}, ${green}, 0)`;
}

// Récupérer les données pour les voitures et les vélos
const urlsVoiture = genererURLsVoiture(Temps());
const urlsVelo = genererURLsVelo(Temps());

Promise.all([
getFilteredDataVoiture(urlsVoiture),
getFilteredDataVelo(urlsVelo)
]).then(([dataVoiture, dataVelo]) => {
generateCorrelationHeatmap(dataVoiture, dataVelo);
}).catch(error => {
console.error("Erreur lors de la récupération des données :", error);
});