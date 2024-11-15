# Project Estimation - CURRENT
Date: 4/05/2024

Version: 1.0.0


# Estimation approach
Consider the EZElectronics  project in CURRENT version (as given by the teachers), assume that you are going to develop the project INDEPENDENT of the deadlines of the course, and from scratch
# Estimate by size
### 
|             | Estimate                        |             
| ----------- | ------------------------------- |  
| NC =  Estimated number of classes to be developed   |       6                      |             
|  A = Estimated average size per class, in LOC       |             100               | 
| S = Estimated size of project, in LOC (= NC * A) | 600 |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)  |                60                      |   
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro) | 1800 | 
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) |          0.375          |               

# Estimate by product decomposition
### 
|         component name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
|requirement document    | 30 |
| GUI prototype | 10 |
|design document | 5 |
|code | 70 |
| unit tests | 10 |
| api tests | 80 |
| management documents  | 5 |



# Estimate by activity decomposition
### 
|         Activity name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
|Creazione modello utente  | 5 |
|Creazione modello carrello  | 8 |
|Creazione modello prodotto  | 6 |
|Creazione modello descrizione prodotto  | 4 |
|Implementazione controllers e route per autenticazione| 12|
|Implementazione controllers e route per utente| 6|
|Implementazione controllers e route per carrello| 12|
|Implementazione controllers e route per prodotto| 6|
|Implementazione controllers e routes per descrizione prodotto| 4|
|Implementazione api test per autenticazione| 12 |
|Implementazione api test utente| 8 |
|Implementazione api test per carrello| 15 |
|Implementazione api test per prodotto| 8 |
|Implementazione api test per descrizione prodotto| 4 |
|Requirement Document| 30 |
|GUI Prototype | 10 |
|Design document| 5 |
|Management document| 5 |
|Implementazione frontend | 40 |
|Implementazione test frontend| 24 |

###
![gantt_v1](/estimation_images/gantt_v1.jpeg)

# Summary

|             | Estimated effort                        |   Estimated duration (in calendar weeks) |          
| ----------- | ------------------------------- | ---------------|
| estimate by size | 60 | 0.375  |
| estimate by product decomposition | 210 | 1.31 |
| estimate by activity decomposition |  224 |  1.40 |


La stima in base alle dimensioni potrebbe non essere precisa perchè si basa solo sul numero di righe (che è un metro di valutazione soggettivo) e non tiene conto della complessità che si cela dietro. 
La stima attraverso la decomposizione delle attività potrebbe essere più vicina alla realtà in quanto si basa sul tempo stimato per le varie attività assegnate agli sviluppatori.


