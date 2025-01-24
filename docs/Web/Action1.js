var map = L.map('map').setView([43.6109200, 3.8772300], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
}).addTo(map);

var CarIcon = L.icon({
    iconUrl: '../Image/Bleu.jpg',
    iconSize: [50, 32],
    iconAnchor: [25, 32],
    popupAnchor: [0, -32]
});

var BikeIcon = L.icon({
    iconUrl: '../Image/Vert.jpg',
    iconSize: [50, 32],
    iconAnchor: [25, 32],
    popupAnchor: [0, -32],
});

var RedIcon = L.icon({
    iconUrl: '../Image/Rouge.jpg',
    iconSize: [50, 32],
    iconAnchor: [25, 32],
    popupAnchor: [0, -32],
});

var circleOptions = {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0
};

let selectedCarIndex = null;
let selectedBikeIndex = null;
let markers = {};
let circles = [];
let latLng = null;

function populateInfoHTML(elementId, datasets) {
    let infoHTML = '';
    const container = document.getElementById(elementId);
    const erreurContainer = document.querySelector('.Erreur ul');
    infoHTML += "<ul>";
    datasets.forEach((dataset, index) => {
        var Icon = elementId === 'ParkingDataVoiture' ? CarIcon : BikeIcon;
        var marker = L.marker([dataset.latitude, dataset.longitude], {icon: Icon}).addTo(map);

        let className = dataset.Who === 'Velo' ? 'parking-id' : 'parking-name';
        let content = dataset.parkingName;
        let VorV = dataset.Who;

        const Status = dataset.status
        const totalSpotNumber = dataset.data[0]?.nombreTotalSpot || 0;
        const moyenne = dataset.MoyenneOccupation || 0;
        const variance = dataset.VarianceOccupation || 0;
        const ecartType = dataset.ecartTypeOccupation || 0;

        let markerId;
        let DivMetre = "";
        if (VorV === 'Velo') {
            let match = content.match(/\d{3}$/);
            markerId = match ? match[0] : index;
            content = `Station:${match[0]}`;
            DivMetre = `
                <div id=\"MetreInt\">
                    <div id=\"Metre-${match}\"></div>
                </div>
                `;
        } else {
            markerId = index;
        }

        let MathsAnalyse = "";
        MathsAnalyse = `
            <div class=\"Maths\">
                <p>Capacité : ${totalSpotNumber}</p>
                <p>Moyenne : ${moyenne.toFixed(2)}</p>
                <p>Variance : ${variance.toFixed(2)}</p>
                <p>Écart-type : ${ecartType.toFixed(2)}</p>
            </div>
        `;

        if ((variance === 0 && ecartType === 0) || (moyenne === 0 || moyenne < (totalSpotNumber/100)*10)) {
            const erreurItem = `
                <li>
                    <p>Erreur Parking ${content} :<br> 
                        ${(variance === 0 && ecartType === 0) ? '- Variance et Écart-type sont nuls <br>' : ''}
                        ${(moyenne === 0 || moyenne < (totalSpotNumber / 100) * 10) ? '- il y a moins de 10% de place en moyenne <br>' : ''}
                        ${(Status === "Open" || Status === "working" ? "" : "color: red;") ? '- il y a moins de 10% de place en moyenne <br>' : ''}
                    </p>
                </li>
            `;
            erreurContainer.innerHTML += erreurItem;
        }

        let onclick = "";
        if (VorV === 'Voiture') {
            onclick = `onclick=\"toggleDataset('${VorV}', ${index}, this)\"`;
        }

        markers[`${VorV}-${markerId}`] = marker;
        marker.bindPopup("<b>" + content + "</b>");
        infoHTML += `
            <li ${onclick} id=\"${VorV}-${VorV === "Velo" ? content.match(/\d{3}$/) : index}\">\n
                <span class=\"${className}\" style="${Status === "Open" || Status === "working" ? "" : "color: red;"}">${content}<br></span>
                ${MathsAnalyse}
                ${DivMetre}
            </li>`;
    });
    infoHTML += "</ul>";
    container.innerHTML = infoHTML;
}

function fetchAndPopulateVoitures() {
    const urls = genererURLsVoiture(2); // Génère les URLs des données des voitures
    getFilteredDataVoiture(urls).then(parkingData => {
        populateInfoHTML('ParkingDataVoiture', parkingData);
    }).catch(error => console.error('Erreur lors du chargement:', error));
}

function fetchAndPopulateVelos() {
    const urls = genererURLsVelo(2); // Génère les URLs des données des vélos
    getFilteredDataVelo(urls).then(parkingData => {
        populateInfoHTML('ParkingDataVelo', parkingData);
    }).catch(error => console.error('Erreur lors du chargement:', error));
}

fetchAndPopulateVoitures();
fetchAndPopulateVelos();

function toggleDataset(VorV, index, element) {
    if (VorV === 'Voiture') {
        const listItems = document.querySelectorAll('li');
        listItems.forEach(function(item) {
            item.style.backgroundColor = '';
            const markerId = item.id;

            if (markerId.startsWith('Voiture-') && markers[markerId]) {
                markers[markerId].setIcon(CarIcon);
            }
        });
        const currentColor = window.getComputedStyle(element).backgroundColor;
        element.style.background = (currentColor === 'rgb(110, 151, 246)' || currentColor === 'rgb(44, 129, 248)') ? 'red' : '';
        
        const markerId = element.id;
        if (markers[markerId]) {
            markers[markerId].setIcon(currentColor === 'rgb(255, 0, 0)' ? CarIcon : RedIcon);
            circles.forEach(circle => map.removeLayer(circle));
            circles = [];
            if (currentColor !== 'rgb(255, 0, 0)') {
                latLng = markers[markerId].getLatLng();
                map.flyTo([latLng.lat, latLng.lng], 14);
            }
        }

        const parkingNameElement = element.querySelector('.parking-name');
        const parkingNameText = parkingNameElement ? parkingNameElement.textContent.trim() : '';
        const NomP = document.querySelector('.NomP');
        const ExiParking = NomP.querySelector('#ParkingS');
        if (ExiParking) {
            if (currentColor === 'rgb(255, 0, 0)') {
                ExiParking.remove(); 
            } else {
                ExiParking.innerText = parkingNameText;
            }
        } else if (currentColor !== 'rgb(255, 0, 0)') {
            NomP.innerHTML += `<p id=\"ParkingS\">${parkingNameText}</p>`;
        }
    const RdispVelo = document.querySelectorAll('[style*="display: block"]');
    RdispVelo.forEach(RdispVelo => {
        RdispVelo.style.removeProperty('display');
    });
    }
}

const slider = document.getElementById('slider');
const PSlide = document.getElementById('PSlide');

slider.addEventListener('input', function() {
    const value = slider.value;
    PSlide.textContent = value + " m";
    AjoutCercle()
});

function AjoutCercle() {
    const slider = document.getElementById('slider');
    const value = slider.value;

    if (latLng === null) {
        console.error("latLng n'est pas défini");
        return;
    }

    circles.forEach(circle => map.removeLayer(circle));
    circles = [];

    let newCircle = L.circle([latLng.lat, latLng.lng], value*1, circleOptions);
    newCircle.addTo(map);
    circles.push(newCircle);

    highlightBikesInCircle();
}

function TDistance (lat1, lon1, lat2, lon2) {
    const RTerre = 6371e3;
    const Phi1 = lat1 * Math.PI / 180;
    const Phi2 = lat2 * Math.PI / 180;
    const DeltaPhi = (lat2 - lat1) * Math.PI / 180;
    const DeltaLamda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(DeltaPhi/2) * Math.sin(DeltaPhi/2) +
                Math.cos(Phi1) * Math.cos(Phi2) *
                Math.sin(DeltaLamda/2) * Math.sin(DeltaLamda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return RTerre * c;
}

function highlightBikesInCircle() {
    const radius = parseInt(slider.value);

    Object.entries(markers).forEach(([key, marker]) => {
        if (key.startsWith('Velo-')) {
            const distance = TDistance(latLng.lat, latLng.lng, marker.getLatLng().lat, marker.getLatLng().lng);
            let match = key.match(/\d{3}$/);
            const Metre = document.getElementById(`Metre-${match}`);
            if (distance <= radius) {
                Metre.textContent = `Distance: ${distance.toFixed(2)} m`;
            } else if (distance >= radius) {
                Metre.textContent = '';
            }
        }
    });
    
    const ul = document.querySelector('#ParkingDataVelo ul');
    let lis = Array.from(ul.querySelectorAll('li'));

    // Trier les éléments li en fonction des valeurs
    lis.sort((a, b) => {
        const valueA = a.querySelector('#MetreInt > div')?.textContent.replace('Distance:', '').trim() || '50000';
        const valueB = b.querySelector('#MetreInt > div')?.textContent.replace('Distance:', '').trim() || '50000';
        return parseInt(valueA) - parseInt(valueB);
    });
    ul.innerHTML = '';

    lis.forEach(li => {
        ul.appendChild(li);
        const nestedDiv = li.querySelector('#MetreInt > div');
        const HideAndSeek = li.querySelector('#MetreInt');
        if (nestedDiv) {
            if (nestedDiv.textContent) {
                HideAndSeek.style.display = "block";
            } else {
                HideAndSeek.style.display = "none";
            }
        }
    });
}


document.addEventListener("DOMContentLoaded", () => {
    const leftSection = document.querySelector(".Left");
    const rightSection = document.querySelector(".Right");
    const toggleLeftButton = document.getElementById("toggleLeft");
    const toggleRightButton = document.getElementById("toggleRight");

    toggleLeftButton.addEventListener("click", () => {
        leftSection.classList.toggle("visible");
        rightSection.classList.remove("visible");
    });

    toggleRightButton.addEventListener("click", () => {
        rightSection.classList.toggle("visible");
        leftSection.classList.remove("visible");
    });
});

