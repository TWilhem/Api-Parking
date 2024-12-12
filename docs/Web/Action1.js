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
}


let selectedCarIndex = null;
let selectedBikeIndex = null;

function fetchAndPopulate(url, elementId, icon) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const uniqueDataMap = new Map();
            data.forEach(item => {
                const key = item.name || item.id;
                if (!uniqueDataMap.has(key) || uniqueDataMap.get(key).date < item.date) {
                    uniqueDataMap.set(key, item);
                }
            });
            const uniqueData = Array.from(uniqueDataMap.values());
            populateInfoHTML(elementId, uniqueData, icon);
        })
        .catch(error => console.error('Erreur lors du chargement des données:', error));
}

fetchAndPopulate('https://twilhem.github.io/Api-Parking/Donnee/SAE-Car-09-2024.json', 'ParkingDataVoiture', CarIcon);
fetchAndPopulate('https://twilhem.github.io/Api-Parking/Donnee/SAE-Bike-09-2024.json', 'ParkingDataVelo', BikeIcon);

let markers = {};
function populateInfoHTML(elementId, datasets) {
    let infoHTML = '';
    const container = document.getElementById(elementId);
    infoHTML += "<ul>"
    datasets.forEach(function(dataset, index) {
        var Icon = elementId === 'ParkingDataVoiture' ? CarIcon : BikeIcon;
        var marker = L.marker([dataset.longitude, dataset.latitude], {icon: Icon}).addTo(map);

        let className = dataset.hasOwnProperty('id') ? 'parking-id' : 'parking-name';
        let content = dataset.hasOwnProperty('id') ? dataset.id : dataset.name;
        let VorV = dataset.hasOwnProperty('id') ? 'Velo' : 'Voiture';

        let markerId;
        let DivMetre = "";
        if (VorV === 'Velo') {
            let match = content.match(/\d{3}$/);
            markerId = match ? match[0] : index;
            content = `Station:${match[0]}`
            DivMetre = `
                <div id="MetreInt">
                    <div id="Metre-${match}"></div>
                </div>
                `
        } else {
            markerId = index;
        }

        let onclick = "";
        if (VorV === 'Voiture') {
            onclick = `onclick="toggleDataset('${VorV}', ${index}, this)"`
        }

        markers[`${VorV}-${markerId}`] = marker;
        marker.bindPopup("<b>" + content + "</b>");
        infoHTML += `
            <li ${onclick} id="${VorV}-${VorV === "Velo" ? content.match(/\d{3}$/) : index}">
                <span class="${className}">${content}</span>
                ${DivMetre}
            </li>`;
    });
    infoHTML += "</ul>"
    container.innerHTML = infoHTML;
}

let circles = [];
let latLng = null;

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
        
        const Bid = event.target.id;
        const texte = element.innerText;
        const NomP = document.querySelector('.NomP');
        const ExiParking = NomP.querySelector('#ParkingS');
        if (ExiParking) {
            if (currentColor === 'rgb(255, 0, 0)') {
                ExiParking.remove(); 
            } else {
                ExiParking.innerText = texte;
            }
        } else if (currentColor !== 'rgb(255, 0, 0)') {
            NomP.innerHTML += `<p id="ParkingS">${texte}</p>`;
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
    const PSlide = document.getElementById('PSlide');
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
    const bikesInCircle = [];

    Object.entries(markers).forEach(([key, marker]) => {
        if (key.startsWith('Velo-')) {
            const distance = TDistance(latLng.lat, latLng.lng, marker.getLatLng().lat, marker.getLatLng().lng);
            let match = key.match(/\d{3}$/);
            const Metre = document.getElementById(`Metre-${match}`);
            if (distance <= radius) {
                Metre.textContent = `${distance.toFixed(2)} m`;
            } else if (distance >= radius) {
                Metre.textContent = '';
            }
        }
    });
    
    const ul = document.querySelector('#ParkingDataVelo ul');
    let lis = Array.from(ul.querySelectorAll('li'));

    // Trier les éléments li en fonction des valeurs
    lis.sort((a, b) => {
        const valueA = a.querySelector('#MetreInt > div')?.textContent.trim() || '50000';
        const valueB = b.querySelector('#MetreInt > div')?.textContent.trim() || '50000';
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
            const value = nestedDiv.textContent.trim();
            console.log(value);
        }
    });
}