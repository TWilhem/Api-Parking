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

function main() {
    const liste1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
    const liste2 = [3,3,4,3,2,5,8,9,13,16,18,18,19,21,22,22,21,17,17,12,10,8,7,4];
    const liste3 = [103,203,4,3,2,5,8,9,13,16,18,18,19,21,22,22,21,17,17,12,10,-92,-93,-96];

    const Liste = [liste1, liste2, liste3];
    
    Liste.forEach((liste, index) => {
        const i = index + 1;
        if (liste.length < 2) {
            console.log(`Erreur liste ${i}`);
        } else {
            console.log(`Moyenne de la liste ${i}: ${moyenne(liste)}`);
            console.log(`Variance de la liste ${i}: ${variance(liste)}`);
            console.log(`Ecart-Type de la liste ${i}: ${ecartType(liste)}`);
        }
    });
    
    Liste.forEach((_, index) => {
        const i = index + 1;
        const nextIndex = (i < Liste.length) ? i : 0;
        console.log(`Covariance des listes: liste ${i}, liste ${nextIndex + 1}: ${covariance(Liste[index], Liste[nextIndex])}`);
    });
    
    Liste.forEach((_, index) => {
        const i = index + 1;
        const nextIndex = (i < Liste.length) ? i : 0;
        console.log(`Coefficient de correlation des listes: liste ${i}, liste ${nextIndex + 1}: ${coefficientCorrel(Liste[index], Liste[nextIndex])}`);
    });
    
    console.log("Matrice de corrélation:");
    matriceCorrelation(Liste).forEach(ligne => {
        console.log(ligne);
    });
}

