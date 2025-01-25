// Calcul de la Moyenne
function moyenne(liste) {
    return Number((liste.reduce((a, b) => a + b, 0) / liste.length).toFixed(2));
}

// Calcul de la Variance
function variance(liste) {
    const moy = moyenne(liste);
    const sommeCarree = liste.reduce((acc, nombre) => {
        const elevation = Math.pow(nombre - moy, 2);
        return acc + elevation;
    }, 0);
    return Number((sommeCarree / liste.length).toFixed(2));
}

// Calcul de l'écart-type
function ecartType(liste) {
    return Number(Math.sqrt(variance(liste)).toFixed(2));
}

// Calcul de la Covariance
function covariance(lis1, lis2) {
    if (lis1.length !== lis2.length) {
        return "Erreur Taille de liste";
    }
    const moy1 = moyenne(lis1);
    const moy2 = moyenne(lis2);
    const lis1Avg = lis1.map(nombre => nombre - moy1);
    const lis2Avg = lis2.map(nombre => nombre - moy2);
    const lisPro = lis1Avg.map((nombre, index) => nombre * lis2Avg[index]);
    return Number((lisPro.reduce((a, b) => a + b, 0) / lis1.length).toFixed(2));
}

// Calcul du coefficient de corrélation
function coefficientCorrel(lis1, lis2) {
    const ecart1 = ecartType(lis1);
    const ecart2 = ecartType(lis2);
    return covariance(lis1, lis2) / (ecart1 * ecart2);
}

// Calcul de la matrice de corrélation
function matriceCorrelation(listes) {
    const n = listes.length;
    return listes.map((_, i) =>
        listes.map((_, j) => coefficientCorrel(listes[i], listes[j]))
    );
}

