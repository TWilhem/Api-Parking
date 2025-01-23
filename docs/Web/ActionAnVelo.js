let chart;
let urls;
let allHidden = false;
let MaxInit = 0;
let FormatageDate = {};

// Permet l'affichage du mobileMeni
function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Initie les fonctions
function ChanUrl(){
    let Time = Temps()
    if (Time === 1) {
        FormatageDate = {
            parser: 'dd/MM/yyyy HH:mm:ss',
            unit: 'hour', 
            displayFormats: {
                hour: 'HH:mm'
            }
        }
    } else if (Time > 1) {
        FormatageDate = {
            parser: 'dd/MM/yyyy HH:mm:ss',
            unit: 'day',
            displayFormats: {
                day: 'dd/MM'
            }
        }
    }
    urls = genererURLsVelo(Time);
    console.log("URLs mises à jour:", urls);
    updateChart();
}

let num = 0
let Max = 0;
function ChanAnalyse() {
    num += 1
    let TypeE = document.getElementById("TypeAnalyse");
    let TypeS = parseInt(TypeE.value);
    console.log(TypeS)
    if (TypeS === 1) {
        calculateTypeV = (entry) => `${Math.round((entry.availableSpotNumber / entry.totalSpotNumber) * 100)}`;
        Max = 100
    } else if (TypeS === 2) {
        calculateTypeV = (entry) => `${Math.round(entry.availableSpotNumber)}`;
        Max = MaxInit
    }
    window.currentCalculateTypeV = calculateTypeV;
    window.Max = Max;
    updateChart()
}

function initializeMaxInit(parkingData) {
    MaxInit = Math.max(
        ...parkingData.map(parking => 
            parking.data.map(entry => entry.nombreTotalSpot)
        ).flat()
    );
    console.log("MaxInit calculé une seule fois:", MaxInit);
    window.MaxInit = MaxInit;
}


ChanUrl()
ChanAnalyse()

// Affiche le Graph en fonction des valeurs prise dans les fichiers SAE-Car
function updateChart() {
    getFilteredDataVelo(urls)
        .then(parkingData => {
            if (MaxInit === 0) {
                initializeMaxInit(parkingData);
            }
            // Construire les datasets pour le graphe
            const datasets = parkingData.map(parking => ({
                label: parking.parkingName,
                data: parking.data.map(entry => ({
                    x: `${entry.date} ${entry.hour}`,
                    y: window.currentCalculateTypeV({ 
                        availableSpotNumber: entry.nombreSpotavailable, 
                        totalSpotNumber: entry.nombreTotalSpot,
                    }),
                })),
                Moyenne: parking.MoyenneOccupation,
                Variance: parking.VarianceOccupation,
                ecartType: parking.ecartTypeOccupation,
                borderColor: getRandomColor(),
                fill: false,
                hidden: false,
                tension: 0.4
            }));

            // Remplit les éléments de liste pour parkingInfo et mobileParkingInfo
            populateInfoHTML('parkingInfo', datasets);
            populateInfoHTML('mobileParkingInfo', datasets);

            // Detruire ancien graphique si il existe
            if (chart) {
                chart.destroy();
            }
            console.log(window.Max)

            // Configuration du graphique
            const config = {
                type: 'line',
                data: { datasets },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            type: 'time',
                            time: FormatageDate,
                            title: {
                                display: true,
                                text: `Données des ${Temps()} derniers jours`
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Places disponibles (%)'
                            },
                            beginAtZero: true,
                            max: window.Max
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: `Disponibilité des places pour les ${Temps()} derniers jours`
                        },
                        legend: {
                            display: false
                        }
                    }
                }
            };
            
            // Specifie ou crée le Graph
            const ctx = document.getElementById('myChart').getContext('2d');
            chart = new Chart(ctx, config);
        })

    // Regarde si il y a des erreurs sur la formation des fichiers JSON
    .catch(error => {
        console.error('Erreur lors du chargement ou du traitement du fichier JSON:', error);
        if (error instanceof SyntaxError) {
            console.error('Le fichier JSON est mal formaté');
        }
    });
}

// Fonction pour créer la liste cliquable dans les zones parkingInfo et mobileParkingInfo
function populateInfoHTML(elementId, datasets) {
    const container = document.getElementById(elementId);
    let infoHTML = `<button id="${elementId === 'parkingInfo' ? 'toggleAllButton' : 'mobileToggleAllButton'}" onclick="toggleAllDatasets()">Tout afficher/masquer</button><ul>`;
    datasets.forEach((dataset, index) => {
        // Récupération des statistiques depuis les datasets
        const moyenne = dataset.Moyenne || 0;
        const variance = dataset.Variance || 0;
        const ecartType = dataset.ecartType || 0;

        infoHTML += `
        <li onclick="toggleDataset(${index})">
            <div class="Name">
                <span class="color-indicator" style="background-color: ${dataset.borderColor};"></span>
                <span class="parking-name ${dataset.hidden ? 'hidden' : ''}">${dataset.label}</span>
            </div>
            <div class="stats">
                <p>Moyenne : ${moyenne.toFixed(2)}</p>
                <p>Variance : ${variance.toFixed(2)}</p>
                <p>Écart-type : ${ecartType.toFixed(2)}</p>
            </div>
        </li>`;
    });
    infoHTML += '</ul>';
    container.innerHTML = infoHTML;
}

// Fonction pour activer/désactiver la courbe correspondante
function toggleDataset(index) {
    const dataset = chart.data.datasets[index];
    dataset.hidden = !dataset.hidden;
    chart.update();
    document.querySelectorAll(`#parkingInfo li:nth-child(${index + 1}) .parking-name, 
                               #mobileParkingInfo li:nth-child(${index + 1}) .parking-name`)
            .forEach(el => {
                el.classList.toggle('hidden', dataset.hidden);
            });
}

// Fonction pour ajouter bouton affiche/masque tout
function toggleAllDatasets() {
    allHidden = !allHidden;
    chart.data.datasets.forEach(dataset => {
        dataset.hidden = allHidden;
    });
    chart.update();
    
    document.querySelectorAll('#parkingInfo .parking-name, #mobileParkingInfo .parking-name').forEach(el => {
        el.classList.toggle('hidden', allHidden);
    });
    
    const buttonText = allHidden ? "Tout afficher" : "Tout masquer";
    document.getElementById('toggleAllButton').textContent = buttonText;
    document.getElementById('mobileToggleAllButton').textContent = buttonText;
}

// Fonction pour générer une couleur aléatoire
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}