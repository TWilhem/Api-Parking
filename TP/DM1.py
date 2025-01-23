import math

# 1. Fonction pour calculer la moyenne
def moyenne(liste):
    return sum(liste) / len(liste)

# 2. Fonction pour calculer l'écart type
def ecart_type(liste):
    moy = moyenne(liste)
    variance = sum((x - moy) ** 2 for x in liste) / len(liste)
    return round(math.sqrt(variance),2)

# 3. Fonction pour calculer la variance
def variance(liste):
    moy = moyenne(liste)
    return sum((x - moy) ** 2 for x in liste) / len(liste)

# 4. Fonction pour calculer la covariance
def covariance(liste1, liste2):
    if len(liste1) != len(liste2):
        raise ValueError("Les listes doivent avoir la même longueur")
    moy1, moy2 = moyenne(liste1), moyenne(liste2)
    return sum((x - moy1) * (y - moy2) for x, y in zip(liste1, liste2)) / len(liste1)

# 5. Fonction pour calculer le coefficient de corrélation
def correlation(liste1, liste2):
    return covariance(liste1, liste2) / (ecart_type(liste1) * ecart_type(liste2))

# 6. Fonction pour calculer la matrice de corrélation
def matrice_correlation(listes):
    n = len(listes)
    matrice = [[0 for _ in range(n)] for _ in range(n)]
    for i in range(n):
        for j in range(n):
            matrice[i][j] = correlation(listes[i], listes[j])
    return matrice

# Exemple d'utilisation
if __name__ == "__main__":
    liste1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
    liste2 = [3,3,4,3,2,5,8,9,13,16,18,18,19,21,22,22,21,17,17,12,10,8,7,4]
    liste3 = [103,203,4,3,2,5,8,9,13,16,18,18,19,21,22,22,21,17,17,12,10,-92,-93,-96]
    
    print(f"Moyenne de liste1: {moyenne(liste1)}")
    print(f"Écart type de liste1: {ecart_type(liste1)}")
    print(f"Variance de liste1: {variance(liste1)}")
    print(f"Moyenne de liste2: {moyenne(liste2)}")
    print(f"Écart type de liste2: {ecart_type(liste2)}")
    print(f"Variance de liste2: {variance(liste2)}")
    print(f"Moyenne de liste3: {moyenne(liste3)}")
    print(f"Écart type de liste3: {ecart_type(liste3)}")
    print(f"Variance de liste3: {variance(liste3)}")
    print(f"Covariance entre liste1 et liste2: {covariance(liste1, liste2)}")
    print(f"Corrélation entre liste1 et liste2: {correlation(liste1, liste2)}")
    
    listes = [liste1, liste2, liste3]
    print("Matrice de corrélation:")
    for ligne in matrice_correlation(listes):
        print(ligne)
