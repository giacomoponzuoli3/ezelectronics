# Documento dei Requisiti - EZElectronics

Date: 04/05/2024

Version: V1 - descrizione di EZElectronics nella forma CORRENTE (come ricevuta dai professori)

| Version number | Change |
| :------------: | :----: |
|       1        |    Situazione di default    |
|        1.1        | Inserimento bozza di informazioni         |
|      1.2           | Aggiunta e riorganizzazione delle varie informazioni      |
|     1.2.1       |   Inizio della stesura dei vari use case e i loro scenari |
|     1.2.2       |   Stesura degli ultimi use case e dei loro scenari |
|     1.2.3       |   Aggiornamento documento |
|     1.2.4       |   Fix glossario |
|     1.3       |   Finito Use Case |
|     1.3.1       |   Inserito System Design |
|     1.4.0      |   Fine stesura documento dei requisiti |


# Contenuti

- [Documento dei requisiti - EZElectronics corrente](#requirements-document---current-ezelectronics)
- [Contenuti](#contents)
- [Descrizione informale](#descrizione-informale)
- [Stakeholders](#stakeholders)
- [Context Diagram ed interfacce](#context-diagram-ed-interfacce)
  - [Context Diagram](#context-diagram)
  - [Interfacce](#interfacce)
- [Storie e Persone](#storie-e-persone)
- [Requisiti funzionali e non funzionali](#requisiti-funzionali-e-non-funzionali)
  - [Requisiti funzionali](#requisiti-funzionali)
  - [Diritti di Accesso](#diritti-di-accesso)
  - [Requisiti non funzionali](#requisiti-non-funzionali)
- [Use case diagram e use cases](#use-case-diagram-e-use-cases)
  - [Use case diagram](#use-case-diagram)
  - [Use cases](#use-cases)
    - [Use Case F1.1 Login](#use-case-f11-login)
      - [Scenario S1.1](#scenario-s11)
      - [Scenario S1.2](#scenario-s12)
    - [Use Case F1.2 Logout ](#use-case-f12-logout)
      - [Scenario S1.3](#scenario-s13)
    - [Use Case F1.3 Registrazione nuovo utente](#use-case-f13-registrazione-nuovo-utente)
      - [Scenario S1.4](#scenario-s14)
      - [Scenario S1.5](#scenario-s15)
    - [Use Case F1.4 Visualizzazione informazioni utente loggato](#use-case-f14-visualizzazione-informazioni-utente-loggato)
      - [Scenario S1.6](#scenario-s16)
    - [Use Case F2.1 Visualizzazione prodotti di una data categoria](#use-case-f21-visualizzazione-prodotti-di-una-data-categoria)
      - [Scenario S2.1](#scenario-s21)
    - [Use Case F2.1.1 Visualizzazione prodotti di una data categoria già venduti](#use-case-f211-visualizzazione-prodotti-di-una-data-categoria-già-venduti)
      - [Scenario S2.2](#scenario-s22)
    - [Use Case F2.1.2 Visualizzazione prodotti di una data categoria non venduti](#use-case-f212-visualizzazione-prodotti-di-una-data-categoria-non-venduti)
      - [Scenario S2.3](#scenario-s23)
    - [Use Case F2.2 Visualizzazione prodotto tramite il codice](#use-case-f22-visualizzazione-prodotto-tramite-il-codice)
      - [Scenario S2.4](#scenario-s24)
      - [Scenario S2.5](#scenario-s25)
    - [Use Case F2.3 Visualizzazione prodotti dato il modello](#use-case-f23-visualizzazione-prodotti-dato-il-modello)
      - [Scenario S2.6](#scenario-s26)
    - [Use Case F2.3.1 Visualizzazione prodotti dato il modello venduti](#use-case-f231-visualizzazione-prodotti-dato-il-modello-venduti)
      - [Scenario S2.7](#scenario-s27)
    - [Use Case F2.3.2 Visualizzazione di prodotti dato il modello non venduti](#use-case-f232-visualizzazione-di-prodotti-dato-il-modello-non-venduti)
      - [Scenario S2.8](#scenario-s28)
    - [Use Case F2.4 Lista i prodotti](#use-case-f24-lista-i-prodotti)
      - [Scenario S2.9](#scenario-s29)
    - [Use Case F3.1 Inserimento nuovo prodotto](#use-case-f31-inserimento-nuovo-prodotto)
      - [Scenario S3.2](#scenario-s32)
      - [Scenario S3.3](#scenario-s33)
      - [Scenario S3.4](#scenario-s34)
    - [Use Case F3.2 Registrazione più prodotti](#use-case-f32-registrazione-più-prodotti)
      - [Scenario S3.5](#scenario-s35)
      - [Scenario S3.6](#scenario-s36)
    - [Use Case F3.3 Registrazione della vendita del prodotto](#use-case-f33-registrazione-della-vendita-del-prodotto)
      - [Scenario S3.7](#scenario-s37)
      - [Scenario S3.8](#scenario-s38)
      - [Scenario S3.9](#scenario-s39)
      - [Scenario S3.10](#scenario-s310)
    - [Use Case F3.4 Elimina prodotto](#use-case-f34-elimina-prodotto)
      - [Scenario S3.11](#scenario-s311)
      - [Scenario S3.12](#scenario-s312)
    - [Use Case F4.1 Visualizzazione carrello](#use-case-f41-visualizzazione-carrello)
      - [Scenario S4.1](#scenario-s41)
    - [Use Case F4.2 Inserimento prodotto nel carrello](#use-case-f42-inserimento-prodotto-nel-carrello)
      - [Scenario S4.2](#scenario-s42)
      - [Scenario S4.3](#scenario-s43)
    - [Use Case F4.3 Visualizzazione storico carrelli pagati](#use-case-f43-visualizzazione-storico-carrelli-pagati)
      - [Scenario S4.4](#scenario-s44)
    - [Use Case F4.4 Pagamento carrello](#use-case-f44-pagamento-carrello)
      - [Scenario S4.5](#scenario-s45)
      - [Scenario S4.6](#scenario-s46)
    - [Use Case F4.5 Rimozione prodotto dal carrello](#use-case-f45-rimozione-prodotto-dal-carrello)
      - [Scenario S4.7](#scenario-s47)
      - [Scenario S4.8](#scenario-s48)
    - [Use Case F4.6 Rimozione carrello](#use-case-f46-rimozione-carrello)
      - [Scenario S4.9](#scenario-s49)
      - [Scenario S4.10](#scenario-s410)

- [Glossario](#glossario)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)

# Descrizione Informale

***EZElectronics*** (letto EaSy Electronics) è un'applicazione software pensata per aiutare i gestori di negozi di elettronica (appartenenti alla stessa catena) a gestire i propri prodotti e proporli ai clienti attraverso un sito web dedicato.

I *manager* dei vari negozi possono valutare i prodotti disponibili, registrarne di nuovi e confermare gli acquisti. 

I *clienti* possono vedere i prodotti disponibili, aggiungerli al carrello e vedere la cronologia dei loro acquisti passati.

[Torna ai contenuti](#contenuti)

# Stakeholders

| Nome stakeholder | Descrizione |
| :--------------: | :---------: |
| Utente           |  Consumatore che visita il sito web per effettuare acquisti online o semplicemente per consultare i vari prodotti disponibili.           |
| Manager   |    Persona che utilizza il software per monitorare le vendite, gestire l'inventario, controllare gli arrivi dei vari prodotti.         |
| Software factory |    Insieme degli sviluppatori che hanno creato il sistema         |

[Torna ai contenuti](#contenuti)

# Context Diagram ed interfacce



## Context Diagram

Il ***Context Diagram*** offre una panoramica ad alto livello delle relazioni tra un sistema e i suoi contesti esterni.
Mostra il sistema al centro, circondato da altre entità esterne con cui interagisce, cioè gli **attori**, i quali sono un sottoinsieme degli Stakeholder definiti in precedenza.

![Context Diagram](https://i.ibb.co/Lvgjtr9/Screenshot-2024-04-18-alle-18-23-10.png) 

[Torna ai contenuti](#contenuti)

## Interfacce

Le "**interfacce**" rappresentano i punti di contatto o le connessioni tra il sistema centrale e le entità esterne con cui interagisce.
Queste interfacce delineano come i dati, le informazioni o i comandi vengono scambiati tra il sistema e gli attori esterni. 

| Attore              | Interfaccia fisica | Interfaccia logica |
|---------------------|--------------------|--------------------|
| Utente              | Computer/Smartphone  | GUI (Graphic User Interface) - per mostrare i vari prodotti disponibili e gestire i loro acquisiti e ricerche |
| Manager | Computer/Smartphone | GUI - per inserire i prezzi dei prodotti, gestire gli arrivi dei prodotti e le loro vendite |

[Torna ai contenuti](#contenuti)

# Storie e Persone

Una "**Persona**" è un personaggio fittizio di un utente rappresentativo del sistema. Le Persone sono create per rappresentare i diversi tipi di utenti che interagiscono con il sistema.
In altre parole, una Persona è un'istanza di un attore.

Una "**Storia**" (Story) è una breve descrizione di una funzionalità o di un requisito del sistema scritto dal punto di vista dell'utente. Solitamente, è strutturata secondo il formato:
 "Come [**persona**], voglio [**azione/descrizione**], in modo che [**obiettivo**]". 
 Le storie sono utilizzate per definire i requisiti in modo chiaro e conciso, focalizzandosi sulle esigenze degli utenti e sui risultati desiderati.

Nel nostro caso possiamo individuare le seguenti Persone con le relative Storie:
* **Persona1**: Mezza età, maschio, sposato, con figli, lavoratore, amante della tecnologia
  - **Story**: Visita un sito di e-commerce di elettronica, cerca prodotti innovativi e di alta qualità, legge recensioni e confronta specifiche tecniche prima di effettuare un acquisto

* **Persona2**: Giovane, femmina, non sposata, studente non lavoratore, media conoscenza della tecnologia
  - **Story**: sta cercando dispositivi come laptop/tablet per utilizzarli durante i suoi studi universitari. Necessita, quindi, di consultare dettagli specifici, come potenza di elaborazione, durata della batteria e portabilità con un rapporto qualità/prezzo ottima.

* **Persona3**: Giovane, maschio, non sposato, senza figli, appassionato di gaming
  - **Story**: è uno streamer alla ricerca delle ultime console, videogiochi e accessori. Necessita di acquistare prodotti gaming di ultima generazione consultando le recensioni e le specifiche tecniche in maniera dettagliata

* **Persona4**: Mezza età, femmina, sposata, con figli, manager di un negozio di elettronica
  - **Story**: è una manager di un negozio di elettronica che vuole accedere ad un pannello di controllo intuitivo che le permette di poter gestire facilmente l'inventario dei prodotti disponibili nel negozio online, includendo la possibilità di aggiungere nuovi prodotti, modificare le quantità disponibili e rimuovere prodotti obsoleti

[Torna ai contenuti](#contenuti)

# Requisiti funzionali e non funzionali

## Requisiti funzionali

I "***requisiti funzionali***" delineano le azioni specifiche che il sistema deve essere in grado di eseguire, come le operazioni che gli utenti possono compiere o i servizi che il sistema deve fornire.

| Codice requisito | Descrizione                                                               |
|------------------|---------------------------------------------------------------------------|
| F1               | Autenticazione ed autorizzazione                                          |
| F1.1             | Login                                                                   |
| F1.2             | Logout                                                                   |
| F1.3             | Registrazione utente |
| F1.4             | Visualizzazione informazioni utente loggato      |
| F2               | Ricerca prodotto                                                       |     
| F2.1           | Visualizzazione prodotti di una data categoria     |
| F2.1.1           | Visualizzazione prodotti di una data categoria già venduti     |
| F2.1.2           |Visualizzazione prodotti di una data categoria non venduti    |
| F2.2           | Visualizzazione prodotti tramite il codice        |
| F2.3             | Visualizzazione prodotti dato il modello                  |
| F2.3.1           | Visualizzazione prodotti dato il modello venduti     |
| F2.3.2           | Visualizzazione di prodotti dato il modello non venduti    |
| F2.4             | Lista prodotti                                   |
| F3               | Gestione prodotti                               |
| F3.1             | Inserimento nuovo prodotto                     |
| F3.2             | Registrazione più prodotti      |
| F3.3             | Registrazione della vendita del prodotto      |
| F3.4             | Elimina prodotto      |
| F4               | Gestione carrello                                                         |
| F4.1             | Visualizzazione carrello                                               |
| F4.2             | Inserimento prodotto nel carrello                                         |
| F4.3             | Visualizzazione storia carrelli pagati                                       |
| F4.4             | Pagamento carrello                                       |
| F4.5             | Rimozione prodotto dal carrello                                        |
| F4.6             | Rimozione carrello                                        |

[Torna ai contenuti](#contenuti)

## Diritti di accesso


| Funzione | Customer       |             Manager                                           |
|------------------|-------------------|--------------------------------------------------------|
| Login in              | X  | X |
| Login out              | X  | X |
| Registrazione utente | X| X |
| Visualizzazione informazioni utente loggato | X| X |
| Visualizzazione prodotti di una data categoria | X| X |
| Visualizzazione prodotti di una data categoria già venduti | X| X |
| Visualizzazione prodotti di una data categoria non venduti | X| X |
| Visualizzazione prodotti tramite il codice | X| X |
| Visualizzazione prodotti dato il modello | X| X |
| Visualizzazione prodotti dato il modello venduti | X| X |
| Visualizzazione di prodotti dato il modello non venduti  | X| X |
| Lista prodotti    | X| X |
| Inserimento nuovo prodotto  | | X |
| Registrazione più prodotti | | X |
| Registrazione della vendita del prodotto | | X |
| Elimina prodotto | | X |
| Visualizzazione carrello | X |  |
| Inserimento prodotto nel carrello | X |  |
| Pagamento carrello | X |  |
| Rimozione prodotto dal carrello | X |  |
| Rimozione carrello | X |  |

[Torna ai contenuti](#contenuti)

## Requisiti non funzionali
I "***Requisiti Non Funzionali***" sono vincoli o criteri che definiscono la qualità del sistema, ma non descrivono specificamente le sue funzionalità.
Questi requisiti si concentrano su attributi come le prestazioni, l'affidabilità, la sicurezza, l'usabilità e altri aspetti che influenzano l'esperienza complessiva dell'utente e il funzionamento del sistema.

Solitamente possiamo distinguere le seguenti categorie:

1. **Prestazioni:** Questi requisiti riguardano la velocità, la scalabilità e l'efficienza del sistema.

2. **Affidabilità:** Questi requisiti riguardano la capacità del sistema di svolgere le sue funzioni in modo affidabile sotto condizioni specifiche.

3. **Sicurezza:** Questi requisiti riguardano la protezione del sistema, dei dati e degli utenti da accessi non autorizzati, attacchi informatici, perdite di dati e altro ancora.

4. **Usabilità:** Questi requisiti riguardano la facilità d'uso e l'esperienza utente del sistema.

5. **Manutenibilità:** Questi requisiti riguardano la facilità con cui il sistema può essere modificato, aggiornato, esteso o riparato.

6. **Portabilità:** Questi requisiti riguardano la capacità del sistema di essere eseguito su diversi ambienti hardware o software senza modifiche significative.

7. **Conformità:** Questi requisiti riguardano il rispetto di standard, normative o regolamenti specifici.

| Codice requisito | Tipo          | Descrizione                                                                                      | Riferito a |
|------------------|---------------|-------------------------------------------------------------------------------------------------|------------|
| NFR1             | Usabilità     | Gli utenti non devono avere training (interfaccia utente di immediata comprensione)            |    Tutti        |                             |            |
| NFR2             | Sicurezza     | Il sistema deve rilevare e rispondere a una minaccia entro 5 minuti dall'insorgere della stessa  |     Tutti       |
| NFR3             | Sicurezza     | Crittografare i dati sensibili durante la memorizzazione e la trasmissione per proteggerli da accessi non autorizzati, come la password. Il processo di crittografia non deve superare gli 80 millisecondi. |     F1.1, F1.3       |
| NFR4             | Sicurezza     | Protezione contro le vulnerabilità del web. L’applicativo non deve subire più di 2 attacchi all’anno. |       Tutti     |
| NFR5             | Sicurezza     | Mantenere il software aggiornato al rilascio delle ultime versioni. L’applicativo deve essere conforme al 99% con le norme applicabili |  Tutti |
| NFR6             | Affidabilità  | L’utente deve usufruire dell’applicativo il maggior tempo possibile, minimizzando errori/bug. L’utente non deve segnalare più di un bug all’anno. |    Tutti        |
| NFR7             | Affidabilità  | Il sistema deve funzionare senza guasti per almeno 1000 ore di utilizzo continuo                   |    Tutti        |
| NFR8            | Portabilità   | L’applicazione mobile deve essere supportata da piattaforme multiple (da iOS 11.1, Android 9)      |        Tutti    |
| NFR9            | Portabilità   | L’applicazione browser deve essere compatibile per i seguenti browser: Chrome, Firefox, Safari, Edge, Opera |      Tutti      |
| NFR10            | Efficienza    | L’applicazione deve completare/rispondere alle varie richieste dell’utente entro 0.6 secondi (escludendo problemi alla rete), garantendo risposte in tempi brevi. |    Tutti        |
| NFR11            | Efficienza    | I dati devono essere aggiornati almeno ogni 3 minuti per garantire la visualizzazione di nuove informazioni agli utenti |     Tutti       |
| NFR12            | Manutenibilità | Il codice deve essere versionato, consentendo di mantenere traccia delle modifiche apportate. Deve avere un minimo di 3 versioni |    Tutti        |


[Torna ai contenuti](#contenuti)

# Use Case Diagram e Use Cases

## Use Case Diagram

Lo "***Use Case Diagram***" (UCD) fornisce una visualizzazione ad alto livello delle funzionalità del sistema e delle interazioni tra gli attori esterni e il sistema stesso.

![UseCaseDiagramSummary](https://i.ibb.co/SBNdW3P/Screenshot-2024-04-29-alle-21-00-55.png)

![UseCaseDiagram](https://i.ibb.co/T8NFgHf/Screenshot-2024-04-29-alle-21-23-49.png)

[Torna ai contenuti](#contenuti)

## Use cases

### Use Case F1.1 Login 

| Actors involved  |     Customer, Manager                                                                |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere già registrato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente non deve essere già autenticato con un'altra sessione attiva |
|  Post condition  |  L'utente è autenticato con successo nel sistema   |
| Nominal Scenario |  S1.1     |
|     Variants     |                     NONE                     |
|    Exceptions    |     S1.2     |

[Torna ai contenuti](#contenuti)

##### Scenario S1.1

|  Scenario S1.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente deve essere già registrato nel sistema |
| Post condition |   L'utente è autenticato con successo nel sistema  |
|     Step#      |                                Descrizione                                 |
|       1        |      Utente: inserisce ed invia le credenziali                                                              |
|       2        |  Sistema: verifica le credenziali                                                                    |
|      3      |       Sistema: autenticazione riuscita                                                                   |
|      4     |  Utente: accede correttamente al suo account                                                                      |

[Torna ai contenuti](#contenuti)
##### Scenario S1.2

|  Scenario S1.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente deve essere già registrato nel sistema |
| Post condition |   L'utente non accede al sistema  |
|     Step#      |                                Descrizione                                 |
|       1        |      Utente: inserisce ed invia le credenziali                                                              |
|       2        |  Sistema: verifica le credenziali                                                                    |
|      3      |       Sistema: autenticazione errata, mostra un messaggio di errore                                                                   |
|      4     |  Utente: non accede correttamente al suo account  |


[Torna ai contenuti](#contenuti)

### Use Case F1.2 Logout 

| Actors involved  | Customer, Manager                                                                     |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente è stato disconnesso con successo/insuccesso dal sistema   |
| Nominal Scenario |  S1.3      |
|     Variants     |                 NONE                    |
|    Exceptions    |    NONE    |

[Torna ai contenuti](#contenuti)
##### Scenario S1.3

|  Scenario S1.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente deve essere attualmente autenticato nel sistema |
| Post condition |  L'utente è stato disconnesso con successo dal sistema  |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: clicca sull'opzione di logout presente nella navbar                                                            |
|       2        |  Sistema: riceve richiesta di logout                                                                       |
|      3      |   Sistema: invalida la sessione dell'utente                                                                |
|      4     |  Utente: reindirizzato alla pagina di homepage di EzElectronics                                                                   |

[Torna ai contenuti](#contenuti)

### Use Case F1.3 Registrazione nuovo utente 

| Actors involved  |          Customer, Manager                                                            |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente non deve essere registrato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente non deve essere attualmente autenticato nel sistema      |
|  Post condition  |  L'utente ha completato con successo/insuccesso il processo di registrazione  |
| Nominal Scenario |  S1.4     |
|     Variants     |             NONE                   |
|    Exceptions    |    S1.5     |

[Torna ai contenuti](#contenuti)

##### Scenario S1.4

|  Scenario S1.4  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente non deve essere registrato nel sistema |
| Post condition |  L'utente è stato registrato con successo nel sistema  |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: accede alla pagina di registrazione mediante il link                                                           |
|       2        | Utente: inserisce i dati richiesti                                                                   |
|      3      |     Utente: invia il modulo di registrazione                                                              |
|      4     |  Sistema: verifica i dati                                                                   |
|       5   |      Sistema: salva i dati e crea un account      |
|   6       |    Sistema: reindirizza l'utente alla sua homepage       |


[Torna ai contenuti](#contenuti)

##### Scenario S1.5

|  Scenario S1.5  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente non deve essere registrato nel sistema |
| Post condition |  L'utente non è stato registrato con successo nel sistema  |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: accede alla pagina di registrazione mediante il link                                                           |
|       2        | Utente: inserisce i dati richiesti                                                                   |
|      3      |     Utente: invia il modulo di registrazione                                                              |
|      4     |  Sistema: verifica i dati                                                                   |
|       5   |      Sistema: dati non validi, resitutisce l'errore   all'utente   |

[Torna ai contenuti](#contenuti)

### Use Case F1.4 Visualizzazione informazioni utente loggato

| Actors involved  | Customer, Manager                                                                     |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente visualizza le proprie  informazioni |
| Nominal Scenario |  S1.6      |
|     Variants     |                 NONE                    |
|    Exceptions    |    NONE    |

[Torna ai contenuti](#contenuti)

##### Scenario S1.6

|  Scenario S1.6  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente visualizza le proprie informazioni  |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: invia la richiesta di accedere alle proprie informazioni                                                |
|       2        | Sistema: riceve la richiesta e recupera le informazioni                                                                    |
|      3      |     Sistema: invia le informazioni all'utente                                                           |
|      4     |  Utente: visualizza le sue informazioni                                                 |

[Torna ai contenuti](#contenuti)

### Use Case F2.1 Visualizzazione prodotti di una data categoria

| Actors involved  | Customer, Manager                                                                     |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti per categoria   |
| Nominal Scenario |  S2.1      |
|     Variants     |                 NONE                    |
|    Exceptions    |    NONE    |

[Torna ai contenuti](#contenuti)

##### Scenario S2.1

|  Scenario S2.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti per categoria   |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: inserisce una specifica categoria di prodotti                                                      |
|       2        | Sistema: riceve la richiesta di visualizzazione dei prodotti della categoria                                                           |
|      3      |     Sistema: recupera i prodotti della categoria                                                          |
|      4     |  Sistema: mostra i prodotti all'utente                                                                  |
|       5   |      Utente: visualizza i prodotti richiesti  |

[Torna ai contenuti](#contenuti)

### Use Case F2.1.1 Visualizzazione prodotti di una data categoria già venduti

| Actors involved |              Customer, Manager                                                        |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti venduti di una categoria   |
| Nominal Scenario |                       S2.2                                             |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        NONE                                              |

[Torna ai contenuti](#contenuti)

##### Scenario S2.2
|  Scenario S2.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti venduti di una categoria   |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: inserisce una specifica categoria di prodotti di elettronica                                                    |
|       2       |    Utente: seleziona l'opzione "yes"  mediante il menù a tendina  riferito a Sold                                                |
|       3        | Sistema: riceve la richiesta di visualizzazione dei prodotti venduti della categoria inserita                                                         |
|      4      |     Sistema: recupera i prodotti venduti della categoria                                                          |
|      5     |  Sistema: mostra i prodotti all'utente                                                                  |
|       6   |      Utente: visualizza i prodotti richiesti  |

[Torna ai contenuti](#contenuti)


### Use Case F2.1.2 Visualizzazione prodotti di una data categoria non venduti
| Actors involved |              Customer, Manager                                                        |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti non venduti di una categoria   |
| Nominal Scenario |                       S2.3                                             |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        NONE                                              |

[Torna ai contenuti](#contenuti)

##### Scenario S2.3
|  Scenario S2.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti non venduti di una categoria   |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: inserisce una specifica categoria di prodotti di elettronica                                                    |
|       2       |    Utente: seleziona l'opzione "no"  mediante il menù a tendina  riferito a Sold                                                   |
|       3        | Sistema: riceve la richiesta di visualizzazione dei prodotti non venduti della categoria inserita                                                         |
|      4      |     Sistema: recupera i prodotti non venduti della categoria                                                          |
|      5     |  Sistema: mostra i prodotti all'utente                                                                  |
|       6   |      Utente: visualizza i prodotti richiesti  |

[Torna ai contenuti](#contenuti)

### Use Case F2.2 Visualizzazione prodotto tramite il codice

| Actors involved |              Customer, Manager                                                        |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto il prodotto tramite codice   |
| Nominal Scenario |                       S2.4                                             |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        S2.5                                             |

[Torna ai contenuti](#contenuti)

##### Scenario S2.4
|  Scenario S2.4  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto il prodotto dato il codice   |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: inserisce il codice del prodotto nell'opzione appropriata                                                                                          |
|       2        | Sistema: riceve la richiesta di cercare il  prodotto dato il codice                                                     |
|      3     |     Sistema verifica il codice del prodotto                                                         |
|      4     |  Sistema: Prodotto trovato, mostra i dettagli del prodotto corrispondente all'utente.                                                                |
|       5   |      Utente: visualizza il prodotto richiesto  |

[Torna ai contenuti](#contenuti)

##### Scenario S2.5
|  Scenario S2.5  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente non ha ottenuto il prodotto dato il codice   |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: inserisce il codice del prodotto nell'opzione appropriata                                                                                          |
|       2        | Sistema: riceve la richiesta di cercare il  prodotto dato il codice                                                     |
|      3     |     Sistema verifica il codice del prodotto                                                         |
|      4     |  Sistema: Codice errato, mostra errore      all'utente                                                         |

[Torna ai contenuti](#contenuti)

### Use Case F2.3 Visualizzazione prodotti dato il modello

| Actors involved  | Customer, Manager                                                                     |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti dato il modello   |
| Nominal Scenario |  S2.6      |
|     Variants     |                 NONE                    |
|    Exceptions    |    NONE    |

[Torna ai contenuti](#contenuti)

##### Scenario S2.6

|  Scenario S2.6  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti per modello   |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: inserisce uno specifico modello di prodotti nell'apposita casella di testo                                                  |
|       2        | Sistema: riceve la richiesta di visualizzazione dei prodotti di un modello                                                           |
|      3      |     Sistema: recupera i prodotti dato un modello                                                          |
|      4     |  Sistema: mostra i prodotti all'utente                                                                  |
|       5   |      Utente: visualizza i prodotti richiesti  |

[Torna ai contenuti](#contenuti)

### Use Case F2.3.1 Visualizzazione prodotti dato il modello venduti

| Actors involved |              Customer, Manager                                                        |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti venduti di un dato modello   |
| Nominal Scenario |                       S2.7                                             |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        NONE                                              |

[Torna ai contenuti](#contenuti)

##### Scenario S2.7
|  Scenario S2.7  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti venduti di un determinato modello  |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: inserisce uno specifico modello dei prodotti                                                    |
|       2       |    Utente: seleziona l'opzione "yes"  mediante il menù a tendina  riferito a Sold                                                |
|       3        | Sistema: riceve la richiesta di visualizzazione dei prodotti venduti del modello inserito                                                         |
|      4      |     Sistema: recupera i prodotti venduti di quello specifico modello                                                          |
|      5     |  Sistema: mostra i prodotti all'utente                                                                  |
|       6   |      Utente: visualizza i prodotti richiesti  |


[Torna ai contenuti](#contenuti)


### Use Case F2.3.2 Visualizzazione di prodotti dato il modello non venduti

| Actors involved |              Customer, Manager                                                        |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti non venduti di un dato modello   |
| Nominal Scenario |                       S2.8                                             |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        NONE                                              |

[Torna ai contenuti](#contenuti)

##### Scenario S2.8
|  Scenario S2.7  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti non venduti di un determinato modello  |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: inserisce uno specifico modello dei prodotti                                                    |
|       2       |    Utente: seleziona l'opzione "no"  mediante il menù a tendina  riferito a Sold                                                |
|       3        | Sistema: riceve la richiesta di visualizzazione dei prodotti venduti del modello inserito                                                         |
|      4      |     Sistema: recupera i prodotti venduti di quello specifico modello                                                          |
|      5     |  Sistema: mostra i prodotti all'utente                                                                  |
|       6   |      Utente: visualizza i prodotti richiesti  |

[Torna ai contenuti](#contenuti)

### Use Case F2.4 Lista i prodotti


| Actors involved |              Customer, Manager                                                        |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|  Post condition  |  L'utente visualizza tutti i prodotti con successo              |
| Nominal Scenario |                       S2.9                                               |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        NONE                                              |

[Torna ai contenuti](#contenuti)

##### Scenario S2.9
|  Scenario S2.9  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente deve essere attualmente autenticato nel sistema |
| Post condition |  L'utente visualizza il proprio carrello con successo  |
|     Step#      |                                Descrizione                                 |
|       1        |                      Utente:  richiede di visualizzare di tutti i prodotti     |
|       2        |                        Sistema: ritorna tutti i prodotti                     |

[Torna ai contenuti](#contenuti)

### Use Case F3.1 Inserimento nuovo prodotto

| Actors involved        |            Manager          |
| :--------------: | :------------------------------------------------------------------:|
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema           |
|                  |  L'utente deve avere il ruolo di Manager                            |
|  Post condition  |  L'utente aggiunge/non aggiunge con successo un prodotto al proprio carrello      |
| Nominal Scenario |                     S3.2                                                 |
|     Variants     |                     NONE                                              |
|    Exceptions    |                     S3.3  S3.4                                                 |

[Torna ai contenuti](#contenuti)

##### Scenario S3.2
|  Scenario S3.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente è attualmente autenticato nel sistema |
|                  |  L'utente ha il ruolo di Manager        |
| Post condition |   L'utente aggiunge con successo un prodotto nel database |
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  inserisce i campi per l'inserimento del prodotto   |
|       2        |               Sistema: controlla che i campi siano corretti |
|       3        |               Sistema: aggiunge prodotto al carrello     |

[Torna ai contenuti](#contenuti)

##### Scenario S3.3
|  Scenario S3.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition   | L'utente non è attualmente autenticato nel sistema |
|                 |  L'utente non ha il ruolo di Manager        |
| Post condition |   L'utente non aggiunge un prodotto nel database e viene visualizzato un messaggio di errore  |
|     Step#      |                                Descrizione                                 |
|       1        |            Utente:  inserisce i campi per l'inserimento del prodotto  |
|       2        |             Sistema: controlla che i campi siano corretti  |
|       3        |             Sistema: rileva che il `ProductId` corrisponde ad un prodotto già esistente |
|       4         |       Sistema : non aggiunge nulla e ritorna un messaggio di errore |    

[Torna ai contenuti](#contenuti)

##### Scenario S3.4
|  Scenario S3.4  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition   | L'utente  è attualmente autenticato nel sistema |
|                 |  L'utente  ha il ruolo di Manager        |
| Post condition |   L'utente non aggiunge un prodotto nel database e viene visualizzato un messaggio di errore  |
|     Step#      |                                Descrizione                                 |
|       1        |            Utente:  inserisce i campi per l'inserimento del prodotto  |
|       2        |             Sistema: controlla che i campi siano corretti  |
|       3        |             Sistema: rileva che il campo  `ArrivalDate` corrisponde ad una data successiva alla data corrente |
|       4         |       Sistema : non aggiunge nulla e ritorna un messaggio di errore | 

[Torna ai contenuti](#contenuti)

### Use Case F3.2 Registrazione più prodotti

| Actors involved|           Manager                                                                   |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema          |
|                   | L'utente deve avere il ruolo di Manager                      |
|  Post condition  |  L'utente registra/non registra al database con successo i prodotti in arrivo   |
| Nominal Scenario |              S3.5                                                  |
|     Variants     |                      NONE                                          |
|    Exceptions    |              S3.6                                                |

[Torna ai contenuti](#contenuti)

##### Scenario S3.5
|  Scenario S3.5  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente è attualmente autenticato nel sistema |
|                 |  L'utente ha il ruolo di Manager        |
| Post condition |   L'utente registra i prodotti in arrivo con successo |
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  inserisce i campi per l'inserimento dei prodotto   |
|       2        |               Sistema: controlla che i campi siano corretti |
|       3        |               Sistema: registra i prodotti in arrivo    |

[Torna ai contenuti](#contenuti)

##### Scenario S3.6
|  Scenario S3.6  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition   | L'utente  è attualmente autenticato nel sistema |
|                 |  L'utente  ha il ruolo di Manager        |
| Post condition |   L'utente non registra i prodotti e viene visualizzato un messaggio di errore  |
|     Step#      |                                Descrizione                                 |
|       1        |            Utente:  inserisce i campi per l'inserimento del prodotto  |
|       2        |             Sistema: controlla che i campi siano corretti  |
|       3        |             Sistema: rileva che il campo  `ArrivalDate` corrisponde ad una data successiva alla data corrente |
|       4         |       Sistema : non registra i prodotti e ritorna un messaggio di errore | 

[Torna ai contenuti](#contenuti)

### Use Case F3.3 Registrazione della vendita del prodotto

| Actors involved|        Manager                                                                      |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema          |
|                   | L'utente deve avere il ruolo di Manager                      |
|  Post condition  |  L'utente registra/non registra la data di vendita del prodotto  |
| Nominal Scenario |              S3.7                                                  |
|     Variants     |                      NONE                                          |
|    Exceptions    |              S3.8     S3.9       S3.10                                     |

[Torna ai contenuti](#contenuti)

##### Scenario S3.7
|  Scenario S3.7  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente è attualmente autenticato nel sistema |
|                 |  L'utente ha il ruolo di Manager        |
| Post condition |   L'utente registra la data di vendita del prodotto con successo |
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  manda una richiesta con il campo `sellingDate` rimpito correttamente o vuoto|
|       2        |               Sistema: controlla che i campi siano corretti |
|       3        |               Sistema: registra i prodotti in arrivo    |

[Torna ai contenuti](#contenuti)

##### Scenario S3.8
|  Scenario S3.8  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition   | L'utente  è attualmente autenticato nel sistema |
|                 |  L'utente  ha il ruolo di Manager        |
| Post condition |   L'utente non registra la data di vendita del  prodotto e viene visualizzato un messaggio di errore  |
|     Step#      |                                Descrizione                                 |
|       1        |            Utente:   manda una richiesta con il campo `sellingDate` con una data successiva alla data corrente  |
|       2        |             Sistema: controlla che i campi siano corretti  |
|       3        |             Sistema: rileva che il campo  `sellingDate` corrisponde ad una data successiva alla data corrente |
|       4         |       Sistema: non registra la data di vendita del prodotto e ritorna un messaggio di errore | 

[Torna ai contenuti](#contenuti)

##### Scenario S3.9
|  Scenario S3.9  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition   | L'utente  è attualmente autenticato nel sistema |
|                 |  L'utente  ha il ruolo di Manager        |
| Post condition |   L'utente non registra la data di vendita del  prodotto e viene visualizzato un messaggio di errore  |
|     Step#      |                                Descrizione                                 |
|       1        |            Utente:   manda una richiesta con il campo `sellingDate` che corrisponde a una data precedente alla data di arrivo del prodotto |
|       2        |             Sistema: controlla che i campi siano corretti  |
|       3        |             Sistema: rileva che il campo  `sellingDate` corrisponde ad una data precedente alla data di arrivo del prodotto |
|       4         |       Sistema: non registra la data di vendita del prodotto e ritorna un messaggio di errore | 

[Torna ai contenuti](#contenuti)


##### Scenario S3.10
|  Scenario S3.10  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition   | L'utente  è attualmente autenticato nel sistema |
|                 |  L'utente  ha il ruolo di Manager        |
| Post condition |   L'utente non registra la data di vendita del  prodotto e viene visualizzato un messaggio di errore  |
|     Step#      |                                Descrizione                                 |
|       1        |            Utente:   manda una richiesta di registrazione vendita prodotto |
|       2        |             Sistema: controlla che i campi siano corretti  |
|       3        |             Sistema: rileva che il campo  `sellingDate` di quel prodotto era non nullo |
|       4         |       Sistema: non registra la data di vendita del prodotto in quanto già venduto e ritorna un messaggio di errore | 

[Torna ai contenuti](#contenuti)

### Use Case F3.4 Elimina prodotto 

| Actors involved |         Manager                                                                     |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema          |
|                   | L'utente deve avere il ruolo di Manager                      |
|  Post condition  |  L'utente elimina/non elimina il prodotto dal database |
| Nominal Scenario |              S3.11                                                  |
|     Variants     |                      NONE                                          |
|    Exceptions    |              S3.12                                               |

[Torna ai contenuti](#contenuti)

##### Scenario S3.11
|  Scenario S3.11 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente è attualmente autenticato nel sistema |
|                 |  L'utente ha il ruolo di Manager        |
| Post condition |   L'utente elimina il prodotto con successo dal database |
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  manda un richiesta con il campo `code` del prodotto da eliminare corrispondente a un prodotto presente nel database|
|       2        |               Sistema: controlla che i campi siano corretti |
|       3        |               Sistema: elimina il prodotto dal database    |

[Torna ai contenuti](#contenuti)

##### Scenario S3.12
|  Scenario S3.12 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente è attualmente autenticato nel sistema |
|                 |  L'utente ha il ruolo di Manager        |
| Post condition |   L'utente non elimina il prodotto dal database |
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  manda un richiesta con il campo `code` del prodotto da eliminare corrispondente a un prodotto non presente nel database|
|       2        |               Sistema: controlla che i campi siano corretti |
|       3        |               Sistema: rileva che il campo  `code` non corrisponde ad un  prodotto presente nel database    |
|       4        |               Sistema: non elimina nessun prodotto dal database e ritorna un codice di errore   |

[Torna ai contenuti](#contenuti)

### Use Case F4.1 Visualizzazione carrello 

| Actors involved  |     Customer                                                                 |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|  Post condition  |  L'utente visualizza la pagina relativa al suo carrello                |
| Nominal Scenario |                       S4.1                                               |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        NONE                                              |

[Torna ai contenuti](#contenuti)

##### Scenario S4.1
|  Scenario S4.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
| Post condition |  L'utente visualizza il proprio carrello con successo  |
|     Step#      |                                Descrizione                                 |
|       1        |                      Utente:  richiede di visualizzare il carrello      |
|       2        |                        Sistema: ritorna il carrello                      |

[Torna ai contenuti](#contenuti)


### Use Case F4.2 Inserimento prodotto nel carrello

| Actors involved          |          Customer                                                           |
| :--------------: | :------------------------------------------------------------------:|
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|  Post condition  |  L'utente aggiunge/non aggiunge con successo un prodotto al proprio carrello      |
| Nominal Scenario |                     S4.2                                                 |
|     Variants     |                     NONE                                              |
|    Exceptions    |                     S4.3                                                   |

[Torna ai contenuti](#contenuti)

##### Scenario S4.2
|  Scenario S4.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
| Post condition |   L'utente aggiunge con successo un prodotto al proprio carrello   |
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  inserisce il codice del prodotto da ggiungere    |
|       2        |               Sistema: controlla che esiste, non sia in un altro carrello o sia già stato acquistato   |
|       3        |               Sistema: aggiunge prodotto al carrello|

[Torna ai contenuti](#contenuti)

##### Scenario S4.3
|  Scenario S4.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                  |  L'utente deve avere il ruolo di Customer                        |
| Post condition |   L'utente non aggiunge un prodotto al proprio carrello  |
|     Step#      |                                Descrizione                                 |
|       1        |            Utente:  inserisce il codice del prodotto da ggiungere    |
|       2        |             Sistema: controlla che esiste,non sia in un altro carrello o sia già stato acquistato   |
|       3        |             Sistema: rileva una delle 3 casistiche dello step 2 |
|       4         |       Sistema : non aggiunge nulla e ritorna un messaggio di errore |             

[Torna ai contenuti](#contenuti)

### Use Case F4.3 Visualizzazione storico carrelli pagati

| Actors involved |     Customer                                                                         |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|  Post condition  |  L'utente visualizza lo storico dei carrelli pagati con successo   |
| Nominal Scenario |              S4.4                                                  |
|     Variants     |                      NONE                                          |
|    Exceptions    |                                                                    |

[Torna ai contenuti](#contenuti)

##### Scenario S4.4
|  Scenario S4.4 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
| Post condition |  L'utente visualizza lo storico dei carrelli pagatti con successo   |
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  fa richiesta di visualizzare lo storico   |
|       2        |               Sistema: resituisce lo storico dei carrelli pagati   |


[Torna ai contenuti](#contenuti)

### Use Case F4.4 Pagamento carrello

| Actors involved  |     Customer                                                                 |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|  Post condition  |  L'utente completa /non completa il pagamento dei prodotti inseriti nel carrello  |
| Nominal Scenario |  S4.5                                        |
|     Variants     |                      NONE                    |
|    Exceptions    |  S4.6                                        |

[Torna ai contenuti](#contenuti)

##### Scenario S4.5
|  Scenario S4.5  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|                  |  L'utente deve avere dei prodotti nel proprio carrello    |
|                  |  L'utente deve avere un carrello  |
| Post condition |  L'utente completa il pagamento con successo                            |
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  fa richiesta di proseguire con il pagamento       |
|       2        |               Sistema: controlla che l'utente abbia un carrello e che il carrello non sia vuoto|
|       3        |               Sistema: pagamento avvenuto correttamente                |

[Torna ai contenuti](#contenuti)

##### Scenario S4.6
|  Scenario S4.6  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|                  |  almeno una delle seguenti due condizioni non sono soddisfatte:  |
|                  |  L'utente non ha prodotti nel proprio carrello    |
|                  |  L'utente non ha un carrello    |
| Post condition |  L'utente non procede con il pagamento            |
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  fa richiesta di proseguire con il pagamento       |
|       2        |               Sistema: controlla che l'utente abbia un carrello e che il carrello non sia vuoto|
|       3        |               Sistema: rileva una delle due casistiche dello step 2              |
|       4        |               Sistema: annulla la richiesta di pagamento da parte dell'utente e ritorna un messaggio di errore|


[Torna ai contenuti](#contenuti)

### Use Case F4.5 Rimozione prodotto dal carrello

| Actors involved |     Customer                                                                 |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|                |  Il prodotto deve essere nel carrello                                       |
|                |    il prodotto deve esistere                     |
|                |    il prodotto non deve essere già stato venduto                   |
| Post condition |  L'utente rimuove/non rimuove il prodotto dal carrello                                 |
| Nominal Scenario |  S4.7 |
|     Variants     |                      NONE                     |
|    Exceptions    |  S4.8|

[Torna ai contenuti](#contenuti)

##### Scenario S4.7

|  Scenario S4.7  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|                |  Il prodotto è nel carrello                                       |
|                |    il prodotto esiste                   |
|                |    il prodotto non è già stato venduto                   |
| Post condition |  L'utente rimuove il prodotto dal carrello                                 |
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  fa richiesta di rimuovere un prodotto tramite il `productId`        |
|       2        |        Sistema: controlla il prodotto sia nel carrello, che l'utente abbia un carrello, che il prodotto esista, che non sia ancora stato venduto|
|       3        |               Sistema: rimuove il prodotto dal carrello                    |

[Torna ai contenuti](#contenuti)

##### Scenario S4.8

|  Scenario S4.8  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|                |  almeno una delle seguenti condizioni non è verificata:          |
|                |  Il prodotto è nel carrello                                       |
|                |    il prodotto esiste                   |
|                |    il prodotto non è già stato venduto                   |
| Post condition |  Viene mostrato un messaggio di errore                         |
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  fa richiesta di rimuovere un prodotto tramite il `productId`        |
|       2        |        Sistema: controlla il prodotto sia nel carrello, che l'utente abbia un carrello, che il prodotto esista, che il carrello non sia stato pagato|
|       3        |               Sistema: rileva che una delle condizione del punto 2 non è rispettata                   |
|        4       | Sistema : anulla la richiesta e mostra un messaggio  di errore|

[Torna ai contenuti](#contenuti)

### Use Case F4.6 Rimozione carrello

| Actors involved |     Customer                                                                    |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|  Post condition  |  L'utente rimuove il carrello con successo / viene mostrato un messaggio di errore  |
| Nominal Scenario |  S4.9 |
|     Variants     |                      NONE                     |
|    Exceptions    |  S4.10|

[Torna ai contenuti](#contenuti)

##### Scenario S4.9

|  Scenario S4.9  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|                  |  L'utente deve avere un carrello|
| Post condition |  L'utente rimuove  il carrello   con successo                      |
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  fa richiesta di rimuovere il carrello       |
|       2        |        Sistema: controlla che l'utente abbia un carrello |
|       3        |               Sistema: rimuove il carrello                    |

[Torna ai contenuti](#contenuti)

##### Scenario S4.10

|  Scenario S4.10  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|                  |  L'utente non deve avere un carrello|
| Post condition |  Viene mostrato un messaggio di errore                         |
|     Step#      |                                Descrizione                                |
|       1        |            Utente:  fa richiesta di rimuovere il carrello         |
|       2        |         Sistema: controlla che l'utente abbia un carrello|
|       3        |               Sistema: rileva che l'utente non ha un carrello                 |
|        4       |        Sistema: annulla la richiesta e mostra un messaggio  di errore|

[Torna ai contenuti](#contenuti)






# Glossario
Il "***Glossario***" fornisce definizioni chiare e precise di ciascun termine per garantire una comprensione uniforme e condivisa tra tutti gli stakeholder coinvolti nel progetto.

1. **USER**:
Account di proprietà di una persona. Caratterizzato univocamente da uno username. 
Un account può avere due ruoli: Customer o Manager.

2. **MANAGER**:
Account dei gestori del negozio di elettronica. Abilitato per inserire/aggiornare/rimuovere prodotti venduti nel negozio.

3. **CUSTOMER**:
Account di un cliente del negozio. Abilitato ad introdurre prodotti nel carrello ed a consultare i vari prodotti.

4. **PRODOTTO**:  
Oggetto fisico venduto in un negozio di elettronica. Identificato univocamente da un codice di almeno 6 caratteri. 

5. **DESCRITTORE PRODOTTO**:
Insieme di informazioni che fornisce dettagli specifici su un particolare prodotto elettronico.

6. **CATEGORIA**:
Suddivisione dei prodotti venduti nel negozio di elettronica. E' una fra smartphone, tablet e appliance. 

7. **CARRELLO**:  
   Insieme di prodotti che l’utente intende acquistare. Può essere da pagare o già pagato.


![Glossario](https://i.ibb.co/CbgrSXQ/Screenshot-2024-04-26-alle-16-46-41.png)

[Torna ai contenuti](#contenuti)

# System Design

Il ***System Design*** è il processo di progettazione e sviluppo di un sistema complesso, che può includere hardware, software, reti, database, al fine di soddisfare specifiche esigenze funzionali e non funzionali.

Questo processo coinvolge la creazione di una struttura architetturale solida e coerente che supporti le funzionalità richieste dal sistema, assicuri la scalabilità, l'affidabilità e la sicurezza, e ottimizzi le prestazioni complessive.

![SystemDesign](https://i.ibb.co/nBKqCbQ/Screenshot-2024-04-26-alle-16-34-35.png)

[Torna ai contenuti](#contenuti)

# Deployment Diagram

Un ***Deployment Diagram*** è un diagramma UML che mostra la disposizione fisica dei componenti software sui nodi hardware, rimanendo coerenti con quanto definito nelle interfacce nei capitoli precedenti.

In sostanza, il Deployment Diagram fornisce una visione ad alto livello dell'architettura di distribuzione di un sistema software.

![DeploymentDiagram](https://i.ibb.co/gMpxHx6/2024-04-26-16-35-23.jpg)

[Torna ai contenuti](#contenuti)