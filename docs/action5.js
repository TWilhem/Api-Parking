// Fonction pour activer/désactiver la courbe correspondante
function toggleDataset(index) {
    const dataset = chart.data.datasets[index];
    dataset.hidden = !dataset.hidden;
    chart.update();

    // Mettre à jour l'apparence de l'élément dans la liste
    const parkingInfoItems = document.querySelectorAll('#parkingInfo li');
    if (dataset.hidden) {
        parkingInfoItems[index].classList.add('hidden');
    } else {
        parkingInfoItems[index].classList.remove('hidden');
    }
}
