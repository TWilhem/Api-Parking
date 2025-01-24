# Api-Parking  
## Createur: Tom Wilhem

---

Ce repository permet l'analyse détaillée des parkings pour vélos et voitures à Montpellier. Le système automatise la récupération de données relatives à ces parkings et les enregistre sous forme de fichiers JSON. Voici les principales fonctionnalités et étapes du processus :  
- **Collecte de données** : Un script Python récupère toutes les 15 minutes les données concernant les parkings disponibles à Montpellier.  
- **Automatisation avec GitHub Actions** : Un fichier GitHub Actions initialise un environnement Python et exécute le script à intervalles réguliers pour assurer une collecte continue des données.  
- **Stockage des données** : Les données récupérées sont sauvegardées dans des fichiers JSON pour une utilisation ultérieure.  
- **Analyse des parkings** : Quatre fichiers HTML utilisent ces données JSON pour offrir une analyse détaillée des parkings sur une période d'un mois, ou selon la durée définie par l'utilisateur.  

Les utilisateurs peuvent consulter ces analyses et obtenir une vue précise sur la disponibilité et l'occupation des parkings à Montpellier sur différentes périodes.  
 
--- 

Les codes et bases de données:
- [README](https://twilhem.github.io/Api-Parking/)

Ce projet est conçu pour être entierement automatiser sur sa gestion des données parkings à Montpellier.