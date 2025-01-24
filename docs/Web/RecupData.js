// Prend les valeurs de la liste Date
function Temps() {
    let selectElement = document.getElementById("timePeriod");
    let selectedValue = parseInt(selectElement?.value);
    return isNaN(selectedValue) ? 30 : selectedValue;
}

// Donne la date d'hier en ne renvoyant que Mois et Année sans affiché le jour
function Aujourdhui(jAjout = 0) {
    const maintenant = new Date();
    maintenant.setDate(maintenant.getDate() + jAjout);
    const mois = (maintenant.getMonth() + 1).toString().padStart(2, '0');
    const annee = maintenant.getFullYear();
    return `${mois}-${annee}`;
}

// Donne toutes les Urls nécessaires a la date d'affichage des Voiture
function genererURLsVoiture(NbJour = 1) {
    const urlSet = new Set();
    for (let i = 1; i <= NbJour; i++) {
        const date = Aujourdhui(-i);
        urlSet.add(`https://twilhem.github.io/Api-Parking/Donnee/SAE-Car-${date}.json`);
    }
    return Array.from(urlSet); 
}

function getFilteredDataVoiture(urls) {
    return Promise.all(urls.map(url => fetch(url).then(response => response.json())))
        .then(allData => {
            // Combine toutes les données en une seule liste
            const donneesCombinees = allData.flat();

            // Extraire les dates uniques et les trier correctement
            const dates = [...new Set(donneesCombinees.map(entry => entry.Date))].sort((a, b) => {
                const [dayA, monthA, yearA] = a.split('/').map(Number);
                const [dayB, monthB, yearB] = b.split('/').map(Number);
                return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
            });

            // Récupérer les dernières dates complètes en fonction de la fonction Temps()
            const lastNCompleteDates = dates.slice(-Temps() - 1, -1);
            console.log("Dernières dates complètes :", lastNCompleteDates);

            // Filtrer les données pour ne garder que celles correspondant aux dernières dates
            const filteredData = donneesCombinees.filter(entry => lastNCompleteDates.includes(entry.Date));
            
            // Grouper les données par parking
            const parkingData = [...new Set(filteredData.map(entry => entry.name))].map(name => {
                const parkingEntries = filteredData.filter(entry => entry.name === name);
                
                const moyenneOccupation = moyenne(
                    parkingEntries.map(entry => entry.availableSpotNumber)
                );
                const VarianceOccupation = variance(
                    parkingEntries.map(entry => entry.availableSpotNumber)
                );
                const ecartTypeOccupation = ecartType(
                    parkingEntries.map(entry => entry.availableSpotNumber)
                );

                const { longitude, latitude, status } = parkingEntries[0];

                return {
                    parkingName: name,
                    data: parkingEntries.map(entry => ({
                        date: entry.Date,
                        hour: entry.Hour,
                        nombreSpotavailable: entry.availableSpotNumber,
                        nombreTotalSpot: entry.totalSpotNumber,
                    })),
                    MoyenneOccupation: moyenneOccupation,
                    VarianceOccupation: VarianceOccupation,
                    ecartTypeOccupation: ecartTypeOccupation,
                    longitude: latitude,
                    latitude: longitude,
                    status: status,
                    Who: "Voiture",
                };
            });

            // Retourner les données groupées
            return parkingData;
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
            throw error;
        });
}

// Donne toutes les Urls nécessaires a la date d'affichage des Velo
function genererURLsVelo(NbJour = 1) {
    const urlSet = new Set();
    for (let i = 1; i <= NbJour; i++) {
        const date = Aujourdhui(-i);
        urlSet.add(`https://twilhem.github.io/Api-Parking/Donnee/SAE-Bike-${date}.json`);
    }
    return Array.from(urlSet); 
}

function getFilteredDataVelo(urls) {
    return Promise.all(urls.map(url => fetch(url).then(response => response.json())))
        .then(allData => {
            // Combine toutes les données en une seule liste
            const donneesCombinees = allData.flat();

            // Extraire les dates uniques et les trier correctement
            const dates = [...new Set(donneesCombinees.map(entry => entry.Date))].sort((a, b) => {
                const [dayA, monthA, yearA] = a.split('/').map(Number);
                const [dayB, monthB, yearB] = b.split('/').map(Number);
                return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
            });

            // Récupérer les dernières dates complètes en fonction de la fonction Temps()
            const lastNCompleteDates = dates.slice(-Temps());
            console.log("Dernières dates complètes :", lastNCompleteDates);

            // Filtrer les données pour ne garder que celles correspondant aux dernières dates
            const filteredData = donneesCombinees.filter(entry => lastNCompleteDates.includes(entry.Date));
            
            // Grouper les données par parking
            const parkingData = [...new Set(filteredData.map(entry => entry.id))].map(id => {
                const parkingEntries = filteredData.filter(entry => entry.id === id);
                
                const moyenneOccupation = moyenne(
                    parkingEntries.map(entry => entry.availableBikeNumber)
                );
                const VarianceOccupation = variance(
                    parkingEntries.map(entry => entry.availableBikeNumber)
                );
                const ecartTypeOccupation = ecartType(
                    parkingEntries.map(entry => entry.availableBikeNumber)
                );

                const { longitude, latitude, status } = parkingEntries[0];

                return {
                    parkingName: `Station: ${id.match(/\d{3}$/)[0]}`,
                    data: parkingEntries.map(entry => ({
                        date: entry.Date,
                        hour: entry.Hour,
                        nombreSpotavailable: entry.availableBikeNumber,
                        nombreTotalSpot: entry.totalSlotNumber,
                    })),
                    MoyenneOccupation: moyenneOccupation,
                    VarianceOccupation: VarianceOccupation,
                    ecartTypeOccupation: ecartTypeOccupation,
                    longitude: latitude,
                    latitude: longitude,
                    status: status,
                    Who: "Velo",
                };
            });

            // Retourner les données groupées
            return parkingData;
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
            throw error;
        });
}


