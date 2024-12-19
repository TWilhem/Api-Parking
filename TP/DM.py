# moyenne()
# variance()
# ecart type()
# covariance()
# correlation()
# matrice de correlation()
# plot distrib()

# import random

# M = []
# for i in range(0, 10000):
#     X = random.randrange(0, 100)
#     M.append(X)

# with open("./TP/Data5.txt", 'w', encoding='utf8') as file:
#     for eachM in M:
#         file.write(f"{eachM}, ")

import math

Donnee1 = []
Donnee2 = []
Donnee3 = []
Donnee4 = []
Donnee5 = []

def OuvertureFile(NomFile, Donnee):
    with open(NomFile, 'r', encoding='utf8') as file:
        M = file.read()
        for eachM in M.split(", "):
            if eachM != '':
                Donnee.append(float(eachM))

def Moyenne(BaseDonnee):
    return round(sum(BaseDonnee)/len(BaseDonnee),2)
    
def Variance(D1, D2):
    Don = 0
    Data = []
    Moy1 = Moyenne(D1)
    Moy2 = Moyenne(D2)
    for each in D1:
        Data.append((each - Moy1)*(each - Moy2))
    for each in Data:
        taille = len(Data)
        Don += each
    Variance = Don/taille
    return round(Variance,2)

def EcartType(D1, D2):
    EcartType = math.sqrt(Variance(D1, D2))
    return round(EcartType,2)


def Covariance(D1, D2):
    Covariance = 0
    Moy1 = Moyenne(D1)
    Moy2 = Moyenne(D2)
    for each in range(len(Donnee1)):
        Covariance += (round((D1[each] - Moy1)*(D2[each] - Moy2), 2))
    return round(Covariance,2)

def Correlation(D1, D2):
    Cov = Covariance(D1, D2)
    Ecart1 = EcartType(D1, D2)
    Ecart2 = EcartType(D2, D1)
    CoeffCorrelation = round(math.sqrt((Cov/(Ecart1 * Ecart2))**2),2)
    return round(CoeffCorrelation,2)


OuvertureFile("./TP/Data1.txt", Donnee1)
OuvertureFile("./TP/Data2.txt", Donnee2)
OuvertureFile("./TP/Data3.txt", Donnee3)
OuvertureFile("./TP/Data4.txt", Donnee4)
OuvertureFile("./TP/Data5.txt", Donnee5)

print(f"Moyenne1: {Moyenne(Donnee1)}")
print(f"Variance1: {Variance(Donnee1, Donnee2)}")
print(f"EcartType1: {EcartType(Donnee1, Donnee2)}")

print(f"Moyenne2: {Moyenne(Donnee2)}")
print(f"Variance2: {Variance(Donnee2, Donnee1)}")
print(f"EcartType2: {EcartType(Donnee2, Donnee1)}")

print(f"Covariance: {Covariance(Donnee1, Donnee2)}")
print(f"Coefficient de Correlation Absolue: {Correlation(Donnee1, Donnee2)}")

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

employees_df = pd.DataFrame(
    {
        "Donnee1": Donnee1,
        "Donnee2": Donnee2,
        "Donnee3": Donnee3,
        "Donnee4": Donnee4,
        "Donnee5": Donnee5
    }
)

corr_df = employees_df.corr(method="pearson")

plt.figure(figsize=(8, 6))
sns.heatmap(corr_df, annot=True)
plt.show()