
#Ce DM est renommé DM3 car il est ma troisième tentative de création, 
#non pas parce que je me suis trompé de DM.


import math
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

#Calcule de la Moyenne
def Moyenne(liste):
    return round(sum(liste)/len(liste),2)

#Calcule de la Variance
def Variance(liste):
    Moy = Moyenne(liste)
    SommeCaree = 0
    for Nombre in liste:
        Elevation = (Nombre - Moy) ** 2
        SommeCaree += Elevation
    return round(SommeCaree/len(liste), 2)

#Calcule de l'écart-type
def EcartType(liste):
    variance = Variance(liste)
    return round(math.sqrt(variance), 2)

#Calcule la Covarience
def Covarience(lis1, lis2):
    if len(lis1) != len(lis2):
        return "Erreur Taille de liste"
    Moy1 = Moyenne(lis1)
    Moy2 = Moyenne(lis2)
    lis1Avg = []
    lis2Avg = []
    lisPro = []
    for Nombre in lis1:
        lis1Avg.append(Nombre - Moy1)
    for Nombre in lis2:
        lis2Avg.append(Nombre - Moy2)
    for i, Nombre in enumerate(lis1Avg, 1):
        lisPro.append(lis1Avg[i-1] * lis2Avg[i-1])
    return round(sum(lisPro)/len(lis1), 2)

#Calcule le coefficient de corellation
def CoefficientCorrel(lis1, lis2):
    Ecart1 = EcartType(lis1)
    Ecart2 = EcartType(lis2)
    return Covarience(lis1, lis2) / (Ecart1 * Ecart2)

#Calcule la martice de correlation
def matrice_correlation(listes):
    n = len(listes)
    matrice = [[0 for _ in range(n)] for _ in range(n)]
    for i in range(n):
        for j in range(n):
            matrice[i][j] = CoefficientCorrel(listes[i], listes[j])
    return matrice

#Crée un graphe de deux source de donnée sur une source de temps donnée
def Graphe(Liste):
    plt.plot(Liste[0], Liste[1], "o-", label="Temperature 1")
    plt.plot(Liste[0], Liste[2], "o-", label="Temperature 2")
    plt.legend()
    plt.show()

#Crée une heatmap du tableau de correlation
def HeatmapCorrel(Liste):
    employees_df = pd.DataFrame(
        {
            "Temps": Liste[0],
            "Temperature 1": Liste[1],
            "Temperature 2": Liste[2]
        }
    )

    corr_df = employees_df.corr(method="pearson")
    plt.figure(figsize=(8, 6))
    sns.heatmap(corr_df, annot=True)
    plt.show()







if __name__ == "__main__":
    liste1 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]
    liste2 = [3,3,4,3,2,5,8,9,13,16,18,18,19,21,22,22,21,17,17,12,10,8,7,4]
    liste3 = [103,203,4,3,2,5,8,9,13,16,18,18,19,21,22,22,21,17,17,12,10,-92,-93,-96]

    Liste = [liste1, liste2, liste3]
    
    for i, liste in enumerate(Liste, 1):
        if len(liste) < 2:
            print(f"Erreur liste {i}")
        else:
            print(f"Moyenne de la liste {i}: {Moyenne(liste)}")
            print(f"Variance de la liste {i}: {Variance(liste)}")
            print(f"Ecart-Type de la liste {i}: {EcartType(liste)}")
    
    for i, liste in enumerate(Liste, 1):
        print(f"Covarience des listes: liste {i}, liste {i+1 if i<len(Liste) else 0}: {Covarience(Liste[i-1], Liste[i if i<len(Liste) else 0])}")
    
    for i, liste in enumerate(Liste, 1):
        print(f"Coefficient de correlation des listes: liste {i}, liste {i+1 if i<len(Liste) else 0}: {CoefficientCorrel(Liste[i-1], Liste[i if i<len(Liste) else 0])}")
    
    print("Matrice de corrélation:")
    for ligne in matrice_correlation(Liste):
        print(ligne)

    Graphe(Liste)

    HeatmapCorrel(Liste)



