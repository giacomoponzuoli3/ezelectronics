# Project Estimation - FUTURE
Date: 4/05/2024

Version: 2.0.0


# Estimation approach
Consider the EZElectronics  project in FUTURE version (as proposed by your team in requirements V2), assume that you are going to develop the project INDEPENDENT of the deadlines of the course, and from scratch (not from V1)
# Estimate by size
### 
|             | Estimate                        |             
| ----------- | ------------------------------- |  
| NC =  Estimated number of classes to be developed   |       9                      |             
|  A = Estimated average size per class, in LOC       |              120              | 
| S = Estimated size of project, in LOC (= NC * A) | 1080 |
| E = Estimated effort, in person hours (here use productivity 10 LOC per person hour)  |    108                                  |   
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro) | 3240 | 
| Estimated calendar time, in calendar weeks (Assume team of 4 people, 8 hours per day, 5 days per week ) |      0.675              |               

# Estimate by product decomposition
### 
|         component name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
|requirement document    |  40 |
| GUI prototype | 15 |
|design document |8 |
|code | 90 |
| unit tests | 20 |
| api tests | 100 |
| management documents  | 6 |



# Estimate by activity decomposition
### 
|         Activity name    | Estimated effort (person hours)   |             
| ----------- | ------------------------------- | 
|Creazione modello utente | 8 |
|Creazione modello carrello  | 8 |
|Creazione modello prodotto  | 6 |
|Creazione modello descrizione prodotto | 4 |
|Creazione modello recensione| 3 |
|Creazione modello lista preferiti| 3 |
|Implementazione controllers e route per autenticazione| 15|
|Implementazione controllers e route per utente| 8 |
|Implementazione controllers e route per carrello| 12|
|Implementazione controllers e route per prodotto| 6|
|Implementazione controllers e route per descrizione prodotto| 4|
|Implementazione controllers and route per recensioni| 5 |
|Implementazione controllers and route per lista preferiti| 5 |
|Implementazione api test per autenticazione | 15 |
|Implementazione api test per utente| 10 |
|Implementazione api test per carrello| 15 |
|Implementazione api test per prodotto| 8 |
|Implementazione api test per descrizione prodotto | 4 |
|Implementazione api test per recensioni| 5 |
|Implementazione api test per lista preferiti| 5 |
|Requirement Document| 40 |
|GUI Prototype | 15 |
|Design document| 6 |
|Management document| 6 |
|Implementazione frontend| 60 |
|Implementazione test frontend| 50 |
###
![gantt_v2](/estimation_images/gantt_v2.jpeg)

# Summary

|             | Estimated effort                        |   Estimated duration (in calendar weeks)|          
| ----------- | ------------------------------- | ---------------|
| estimate by size |108 | 0.675
| estimate by product decomposition | 279 |  1.74 |
| estimate by activity decomposition | 326 | 2.04 |


La stima in base alle dimensioni potrebbe non essere precisa perchè si basa solo sul numero di righe (che è un metro di valutazione soggettivo) e non tiene conto della complessità che si cela dietro. 
La stima attraverso la decomposizione delle attività potrebbe essere più vicina alla realtà in quanto si basa sul tempo stimato per le varie attività assegnata agli sviluppatori.


