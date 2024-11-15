# Documento dei requisiti -  EZElectronics futura

Date: 4/05/2024

Version: V2 - descrizione di EZElectronics nella forma FUTURA (come proposta dal team)

| Version number | Change |
| :------------: | :----: |
|           1.0.1     | Inizio dell'inserimento di nuove funzionalità       |
|           1.0.2     | Fix documento dei requisiti      |
|           1.1.0     | Inserimento nuove funzionalità     |
|           1.2.0     | Aggiornamento Use Case     |
|           1.3.0     | Introduzione tabella dei diritti di accesso     |
|           1.3.1     | Introduzione nuovi use case     |
|           1.4.0    | Fine stesura documento dei requisiti    |

# Contenuti

- [Documento dei requisiti - EZElectronics futura](#requirements-document---ezelectronics-futura)
- [Contenuti](#contenuti)
- [Descrizione informale](#descrizione-informale)
- [Stakeholders](#stakeholders)
- [Context Diagram ed interfacce](#context-diagram-ed-interfacce)
  - [Context Diagram](#context-diagram)
  - [Interfacce](#interfacce)
- [Storie and persone](#storie-e-persone)
- [Requisiti funzionali e non funzionali](#requisiti-funzionali-e-non-funzionali)
  - [Requisiti funzionali](#requisiti-funzionali)
  - [Diritti di Accessi](#diritti-di-accessi)
  - [Requisiti non funzionali](#requisiti-non-funzionali)
- [Use case diagram e use cases](#use-case-diagram-e-use-cases)
  - [Use case diagram](#use-case-diagram)
  - [Use cases](#use-cases)
    - [Use Case F1.1 Login](#use-case-f11-login)
      - [Scenario S1.1](#scenario-s11)
      - [Scenario S1.2](#scenario-s12)
    - [Use Case F1.2 Logout ](#use-case-f12-logout)
      - [Scenario S1.3]()
    - [Use Case F1.3 Registrazione customer](#use-case-f13-registrazione-nuovo-customer)
      - [Scenario S1.4](#scenario-s14)
      - [Scenario S1.5](#scenario-s15)
    - [Use Case F1.4 Visualizzazione informazioni utente loggato](#use-case-f14-visualizzazione-informazioni-utente-loggato)
      - [Scenario S1.6](#scenario-s16)
    - [Use Case F1.5 Modifica password](#use-case-f15-modifica-password)
      - [Scenario S1.7](#scenario-s17)
      - [Scenario S1.8](#scenario-s18)
    - [Use Case F1.6 Elimina Account](#use-case-f16-elimina-account)
      - [Scenario S1.9](#scenario-s19)
      - [Scenario S1.10](#scenario-s110)
    - [Use Case F2.1 Visualizzazione prodotti di una data categoria](#use-case-f21-visualizzazione-prodotti-di-una-data-categoria)
      - [Scenario S2.1](#scenario-s21)
    - [Use Case F2.1.1 Visualizzazione prodotti di una data categoria già venduti](#use-case-f211-visualizzazione-prodotti-di-una-data-categoria-già-venduti)
      - [Scenario S2.2](#scenario-s22)
    - [Use Case F2.1.2 Visualizzazione prodotti di una data categoria non venduti](#use-case-f212-visualizzazione-prodotti-di-una-data-categoria-non-venduti)
      - [Scenario S2.3](#scenario-s23)
    - [Use Case F2.2 Visualizzazione prodotto tramite il codice](#use-case-f22-visualizzazione-prodotto-tramite-il-codice)
      - [Scenario S2.4](#scenario-s24)
      - [Scenario S2.5](#scenario-s25)
    - [Use Case F2.2.1 Visualizzazione recensioni del prodotto](#use-case-f221-visualizzazione-recensioni-del-prodotto)
      - [Scenario S2.6](#scenario-s26)
    - [Use Case F2.2.2 Filtra recensioni del prodotto con lo score](#use-case-f222-filtra-recensioni-del-prodotto-con-lo-score)
      - [Scenario S2.7](#scenario-s27)
    - [Use Case F2.3 Visualizzazione prodotti dato il modello]()
      - [Scenario S2.8](#scenario-s28)
    - [Use Case F2.3.1 Visualizzazione prodotti dato il modello venduti](#use-case-f231-visualizzazione-prodotti-dato-il-modello-venduti)
      - [Scenario S2.9](#scenario-s29)
    - [Use Case F2.3.2 Visualizzazione di prodotti dato il modello non venduti](#use-case-f232-visualizzazione-di-prodotti-dato-il-modello-non-venduti)
      - [Scenario S2.10](#scenario-s210)
    - [Use Case F2.4 Lista i prodotti](#use-case-f24-lista-i-prodotti)
      - [Scenario S2.11](#scenario-s211)
    - [Use Case F3.1 Inserimento nuovo prodotto](#use-case-f31-inserimento-nuovo-prodotto)
      - [Scenario S3.2](#scenario-s32)
      - [Scenario S3.3](#scenario-s33)
      - [Scenario S3.4](#scenario-s34)
    - [Use Case F3.2 Registrazione più prodotti](#use-case-f32-registrazione-più-prodotti)
      - [Scenario S3.5](#scenario-s35)
      - [Scenario S3.6](#scenario-s36)
    - [Use Case F3.3 Registrazione della vendita del prodotto](#use-case-f33-registrazione-della-vendita-del-prodotto)
      - [Scenario S3.7](#scenario-s37)
    - [Use Case F3.4 Elimina prodotto](#use-case-f34-elimina-prodotto)
      - [Scenario S3.8](#scenario-s38)
      - [Scenario S3.9](#scenario-s39)
    - [Use Case F3.5 Inserimento sconto prodotto](#use-case-f35-inserimento-sconto-prodotto)
      - [Scenario S3.10](#scenario-s310)
      - [Scenario S3.11](#scenario-s311)
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
    - [Use Case F5.1  Ricevi AD da google ADS](#use-case-f51-ricevi-ad-da-google-ads)
      - [Scenario S5.1](#scenario-s51)
    - [Use Case F6.1 Inserimento recensione](#use-case-f61-inserimento-recensione)
      - [Scenario S6.1](#scenario-s61)
      - [Scenario S6.2](#scenario-s62)
    - [Use Case F6.2 Visualizzazione proprie recensioni](#use-case-f62-visualizzazione-proprie-recensioni)
      - [Scenario S6.3](#scenario-s63)
    - [Use Case F6.2.1 Cancellazione recensione](#use-case-f621-cancellazione-recensione)
      - [Scenario S6.4](#scenario-s64)
    - [Use Case F7.1 Inserimento dati di pagamento](#use-case-f71-inserimento-dati-di-pagamento)
      - [Scenario S7.1](#scenario-s71)
      - [Scenario S7.2](#scenario-s72)
    - [Use Case F7.1.1 Annulla pagamento](#use-case-f711-annulla-pagamento)
      - [Scenario S7.3](#scenario-s73)
    - [Use Case F7.2 Utilizzo credito accumulato](#use-case-f72-utilizzo-credito-accumulato)
      - [Scenario S7.4](#scenario-s74)
    - [Use Case F7.3 Conferma pagamento](#use-case-f73-conferma-pagamento)
      - [Scenario S7.5](#scenario-s75)
      - [Scenario S7.6](#scenario-s76)
      - [Scenario S7.7](#scenario-s77)
    - [Use Case F8.1 Aggiornamento punti fedeltà](#use-case-f81-aggiornamento-punti-fedeltà)
      - [Scenario S8.1](#scenario-s81)
    - [Use Case F8.2 Conversione punti fedeltà in credito](#use-case-f82-conversione-punti-fedeltà-in-credito)
      - [Scenario S8.2](#scenario-s82)
    - [Use Case F8.3 Aggiornamento credito residuo](#use-case-f83-aggiornamento-credito-residuo)
      - [Scenario S8.3](#scenario-s82)
    - [Use Case F9.1 Blocca utente](#use-case-f91-blocca-utente)
      - [Scenario S9.1](#scenario-s91)
      - [Scenario S9.2](#scenario-s92)
    - [Use Case F9.2 Sblocca utente]()
      - [Scenario S9.3](#scenario-s93)
      - [Scenario S9.4](#scenario-s94)
    - [Use Case F9.3 Visualizza lista utenti](#use-case-f93-visualizza-lista-utenti)
      - [Scenario S9.5](#scenario-s95)
    - [Use Case F9.4 Registrazione account nuovo manager](#use-case-f94-registrazione-nuovo-account-manager)
      - [Scenario S9.6](#scenario-s96)
      - [Scenario S9.7](#scenario-s97)
    - [Use Case F10.1 Visualizzazione prodotti preferiti](#use-case-f101-visualizzazione-prodotti-preferiti)
      - [Scenario S10.1](#scenario-s101)
    - [Use Case F10.2 Aggiunta prodotto ai preferiti](#use-case-f102-aggiunta-prodotto-ai-preferiti)
      - [Scenario S10.2](#scenario-s102)
      - [Scenario S10.3](#scenario-s103)
    - [Use Case F10.3 Rimozione prodotto dai preferiti](#use-case-f103-rimozione-prodotto-dai-preferiti)
      - [Scenario S10.4](#scenario-s104)
      - [Scenario S10.5](#scenario-s105)




- [Glossario](#glossario)
- [System Design](#system-design)
- [Deployment Diagram](#deployment-diagram)


# Descrizione informale

***EZElectronics*** (letto EaSy Electronics) è un'applicazione software pensata per aiutare i gestori di negozi di elettronica (appartenenti alla stessa catena) a gestire i propri prodotti e proporli ai clienti attraverso un sito web dedicato.

I *manager* dei vari negozi possono consultare i prodotti disponibili o registrarne di nuovi.

I *clienti* che possiedono un account hanno molte funzionalità come vedere i vari prodotti disponibili, aggiungerli al carrello o vedere la cronologia dei loro acquisti passati. Possono inoltre accedere ad informazioni quali il loro saldo di punti fedeltà.

Lo sviluppo della piattaforma viene pagata sostanzialmente dai servizi di pubblicità presenti all'interno dell'applicazione web, dove aziende terze pagano per avere una determinata visibilità sul sito.

I vari prodotti all'interno dell'applicativo possono essere consultati da chiunque visiti il sito web.

Sarà presente anche la figura dell'*admin*, il quale avrà il compito di gestire l'infrastruttura software, avendo accesso alla lista degli utenti, hanno il potere di limitare uno di essi per determinati motivi  

Inoltre, l'applicativo farà riferimento ad un servizio esterno per consentire i pagamenti dei carrelli dei vari clienti.

[Torna ai contenuti](#contenuti)
# Stakeholders

| Nome stakeholder | Descrizione |
| :--------------: | :---------: |
| Utente non loggato | Persona che visita il sito web per effettuare la consultazione dei vari prodotti e le varie recensioni |
| Utente           |  Consumatore che visita il sito web per effettuare acquisti online o semplicemente per consultare i vari prodotti dispoinibili e le varie recensioni        |
| Manager   |    Persona che utilizza il software per monitorare le vendite, gestire l'inventario, controllare gli arrivi dei vari prodotti         |
| Software factory |    Insieme degli sviluppatori che hanno creato il sistema   |     
| Servizio ADS | Compagnie che decidono di pagare per essere visualizzate come banner/video pubblicitari nelle versioni utenti |
|  Servizio di pagamento |  Compagnie utilizzate per effettuare i pagamenti dei vari carrelli dei clienti |

[Torna ai contenuti](#contenuti)

# Context Diagram ed interfacce

## Context Diagram

![ContextDiagram](https://i.ibb.co/d6VH4zk/Screenshot-2024-04-29-alle-23-40-16.png)

[Torna ai contenuti](#contenuti)

## Interfacce

| Attore              | Interfaccia fisica | Interfaccia logica |
|---------------------|--------------------|--------------------|
| Utente  non loggato           | Computer/Smartphone  | GUI (Graphic User Interface) - per mostrare i vari prodotti disponibili e le varie recensioni |   
| Utente              | Computer/Smartphone  | GUI (Graphic User Interface) - per mostrare i vari prodotti disponibili e le loro recensioni ed inoltre gestire i loro acquisiti e ricerche |
| Manager | Computer/Smartphone | GUI - per inserire i prezzi dei prodotti, gestire gli arrivi dei prodotti e le loro vendite |                |                    |
| Servizio ADS | Internet | https://developers.google.com/google-ads/api/docs/start |
| Servizio di pagamento | Internet | https://satispay.com |                |                    |
| Admin | Computer | GUI - per gestire i vari utenti |

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
| F1.1             | Login                                                                 |
| F1.2             | Logout                                                                   |
| F1.3             | Registrazione customer |
| F1.4             | Visualizzazione informazioni utente loggato      |
|F1.5              | Modifica password|
|F1.6              | Elimina account|
| F2               | Ricerca prodotto                                                       |     
| F2.1           | Visualizzazione prodotti di una data categoria     |
| F2.1.1           | Visualizzazione prodotti di una data categoria già venduti     |
| F2.1.2           |Visualizzazione prodotti di una data categoria non venduti    |
| F2.2           | Visualizzazione prodotti tramite il codice        |
| F2.2.1  |    Visualizzazione recensioni del prodotto |
| F2.2.2   |  Filtra recensioni del prodotto con lo score
| F2.3             | Visualizzazione prodotti dato il modello                  |
| F2.3.1           | Visualizzazione prodotti dato il modello venduti     |
| F2.3.2           | Visualizzazione di prodotti dato il modello non venduti    |
| F2.4             | Lista prodotti                                   |
| F3               | Gestione prodotti                               |
| F3.1             | Inserimento nuovo prodotto                     |
| F3.2             | Registrazione più prodotti      |
| F3.3             | Registrazione della vendita del prodotto      |
| F3.4             | Elimina prodotto      |
| F3.5            | Inserimento sconto prodotto     |
| F4               | Gestione carrello                                                       |
| F4.1             | Visualizzazione carrello                                               |
| F4.2             | Inserimento prodotto nel carrello                                         |
| F4.3             | Visualizzazione storia carrelli pagati                                       |
| F4.4             | Pagamento carrello                -> inizio F7                       |
| F4.5             | Rimozione prodotto dal carrello                                        |
| F4.6             | Rimozione carrello                                        |
| F5  |  Gestione ADS   |
| F5.1  |  Ricevi AD da google ADS   |
|  F6 | Gestione recensione    |
| F6.1 | Inserimento recensione |
| F6.2 | Visualizzazione proprie recensioni |
| F6.2.1| Cancellazione recensione|
| F7 | Gestione pagamenti |
| F7.1 | Inserimento dati di pagamento |
| F7.1.1 | Annulla pagamento |
| F7.2 | Utilizzo credito accumulato |
| F7.3 | Conferma pagamento |
| F8 | Gestione punti fedeltà |
| F8.1 | Aggiornamento punti fedeltà |
| F8.2 | Conversione punti fedeltà in credito |
|F8.3 |Aggiornamento credito residuo |
|F9| Gestione utenti|
|F9.1|Blocca utente|
|F9.2|Visualizza lista utenti|
|F9.3| Sblocca utente |
| F9.4 | Registrazione nuovo account manager |
| F10            | Gestione preferiti                                       |
| F10.1             | Visualizza prodotti preferiti                                        |
| F10.2             | Aggiunta prodotto ai preferiti                                        |
| F10.3             | Rimozione prodotto dai preferiti                                        |

[Torna ai contenuti](#contenuti)

## Diritti di Accessi

| Funzione |Utente non loggato |  Customer       |             Manager  | Admin                                         |
|---------|---------|------|-------------|--------------------------------------------------------|
|  Login in        |  X  | X   | X | X |
|  Log out |   | X   | X | X |
| Registrazione customer  | X  |    |  | |
|  Visualizzazione informazioni utente loggato |   | X   | X | X|
|  Modifica password |   |   X | X | X|
| Elimina acount  |   | X   | X | X|
|  Visualizzazione prodotti di una data categoria | X  | X   | X | |
| Visualizzazione prodotti di una data categoria già venduti  | X  |  X  | X | |
|  Visualizzazione prodotti di una data categoria non venduti  |  X |  X  | X | |
|  Visualizzazione prodotti tramite il codice  | X  |  X  | X | |
|  Visualizzazione recensioni del prodotto | X  | X   | X | |
| Visualizzazione prodotti dato il modello  |  X |  X  | X | |
| Visualizzazione prodotti dato il modello venduti  | X  |  X  | X | |
| Visualizzazione prodotti dato il modello non venduti  |  X | X   | X | |
|  Lista prodotti | X  |  X  | X | |
| Inserimento nuovo prodotto  |   |    | X | |
|  Registrazione più prodotti |   |    | X | |
| Registrazione della vendita del prodotto  |   |    |  | |
|  Elimina prodotto |   |    | X | |
| Inserimento sconto prodotto  |   |    | X | |
| Visualizzazione carrello  |   |  X  |  | |
|  Inserimento prodotto nel carrello  |   | X   |  | |
|  Visualizzazione storia carrelli pagati |   | X   |  | |
| Pagamento carrello  |   | X   |  | |
|  Rimozione prodotto dal carrello |   |  X  |  | |
| Rimozione carrello  |   |  X  |  | |
| Ricevi AD da google ADS  |   |    |  | |
|  Inserimento recensione |   |  X  |  | |
|  Visualizzazione recensioni |   | X   |  | |
|  Cancellazione recensione |   |   X |  | |
| Inserimento dati di pagamento  |   | X   |  | |
| Annulla pagamento  |   | X   |  | |
|  Aggiornamento punti fedeltà |   |  X  |  | |
|  Conversione punti fedeltà in credito |   | X   |  | |
|Aggiornamento credito residuo ||X||
| Blocca utente  |   |    |  | X |
| Visualizza lista utenti  |   |    | |X |
| Sblocca utente  |   |    |  |X |
|  Visualizza prodotti preferiti  |   |  X  |  | |
|  Aggiunta prodotto ai preferiti |   | X   |  | |
| Elimina prodotto dai preferiti          |   | X   |  | |
| Filtra recensioni del prodotto con lo score | X | X |  |  |
| Utilizzo credito accumulato | | X | | |
| Conferma pagamento | | X | | |

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
| NFR3             | Sicurezza     | Crittografare i dati sensibili durante la memorizzazione e la trasmissione per proteggerli da accessi non autorizzati, come la password e dati di pagamento. Il processo di crittografia non deve superare gli 80 millisecondi. |     F1.1, F1.5 F7.1 F7.3      |
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

![UseCaseDiagramSummary](https://i.ibb.co/3yxKHVb/Screenshot-2024-04-30-alle-22-16-53.png)

![UseCaseDiagram](https://i.ibb.co/3FmFZzM/Screenshot-2024-05-04-alle-23-24-03.png)

[Torna ai contenuti](#contenuti)

## Use cases

### Use Case F1.1 Login

| Actors involved  |     Customer, Manager, Admin                                                                |
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

| Actors involved  | Customer, Manager, Admin                                                                     |
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

### Use Case F1.3 Registrazione nuovo customer

| Actors involved  |          Customer                                                           |
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

| Actors involved  | Customer, Manager, Admin                                                                 |
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

### Use Case F1.5 Modifica password

| Actors involved  | Customer, Manager, Admin                                                                     |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente modifica la password del proprio account |
| Nominal Scenario |  S1.7      |
|     Variants     |                 NONE                    |
|    Exceptions    |    S1.8   |

[Torna ai contenuti](#contenuti)

##### Scenario S1.7

|  Scenario S1.7  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |   L'utente modifica la password del proprio account con successo |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: invia la richiesta di modificare la password del proprio account                                                 |
|       2        | Sistema: riceve la richiesta e chiede all'utente di reinserire la password corrente dell'account e di inserirne una nuova                                                       |
|      3      |    Utente: inserisce ed invia le credenziali                                               |
|      4     |  Sistema: verifica le credenziali e aggiorna la password  notificando il successo                     |

[Torna ai contenuti](#contenuti)

##### Scenario S1.8

|  Scenario S1.8  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |   L'utente non modifica con successo la password del proprio account  |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: invia la richiesta di modificare la password del proprio account                                                 |
|       2        | Sistema: riceve la richiesta e chiede all'utente di reinserire la password corrente dell'account e di inserirne una nuova                                                       |
|      3      |    Utente: inserisce ed invia le credenziali                                               |
|      4     |  Sistema: verifica le credenziali                     |
|      5     |  Sistema: verifica che i dati non sono validi ed invia un messaggio di errore                        |

[Torna ai contenuti](#contenuti)

### Use Case F1.6 Elimina Account

| Actors involved  | Customer, Manager, Admin                                                                     |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |  L'utente elimina proprio account |
| Nominal Scenario |  S1.9      |
|     Variants     |                 NONE                    |
|    Exceptions    |    S1.10   |

[Torna ai contenuti](#contenuti)

##### Scenario S1.9

|  Scenario S.9  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |   L'utente elimina il  proprio account  |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: invia la richiesta di eliminare il proprio account                                                 |
|       2        | Sistema: riceve la richiesta e chiede all'utente di reinserire la password dell'account                                                                    |
|      3      |    Utente: inserisce le credenziali e conferma di voler eliminare il proprio account                                               |
|      4     |  Sistema: verifica le credenziali ed elimina l'account notificando il successo                      |

[Torna ai contenuti](#contenuti)

##### Scenario S1.10

|  Scenario S 1.10  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema |
|                  |  L'utente deve avere una connessione internet attiva      |
|                  |  L'utente deve avere una sessione attiva nel sistema |
|  Post condition  |   L'utente non modifica con successo la password del proprio account  |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: invia la richiesta di eliminare il proprio account                                                 |
|       2        | Sistema: riceve la richiesta e chiede all'utente di reinserire la password dell'account                                                                    |
|      3      |    Utente: inserisce le credenziali e conferma di voler eliminare il proprio account                                               |
|      4     |  Sistema: rileva un errore nelle credenziali e notifica il fallimento dell'operazione                      |

[Torna ai contenuti](#contenuti)

### Use Case F2.1 Visualizzazione prodotti di una data categoria

| Actors involved  | User                                                                    |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   | L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti per categoria   |
| Nominal Scenario |  S2.1      |
|     Variants     |                 NONE                    |
|    Exceptions    |    NONE    |

[Torna ai contenuti](#contenuti)

##### Scenario S2.1

|  Scenario S2.1  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti per categoria   |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: inserisce una specifica categoria di prodotti                                                      |
|       2        | Sistema: riceve la richiesta di visualizzazione dei prodotti della categoria                                                           |
|      3      |     Sistema: recupera i prodotti della categoria                                                          |
|      4     |  Sistema: mostra i prodotti all'utente                                                                  |
|       5   |      Utente: visualizza i prodotti richiesti  |

[Torna ai contenuti](#contenuti)


### Use Case F2.1.1 Visualizzazione prodotti di una data categoria già venduti

| Actors involved |      User                                                 |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition    |  L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti venduti di una categoria   |
| Nominal Scenario |                       S2.2                                             |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        NONE                                              |

[Torna ai contenuti](#contenuti)

##### Scenario S2.2
|  Scenario S2.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve avere una connessione internet attiva      |
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
| Actors involved |             User                         |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti non venduti di una categoria   |
| Nominal Scenario |                       S2.3                                             |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        NONE                                              |

[Torna ai contenuti](#contenuti)

##### Scenario S2.3
|  Scenario S2.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   | L'utente deve avere una connessione internet attiva      |
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

| Actors involved |              User                       |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente ha ottenuto il prodotto tramite codice   |
| Nominal Scenario |                       S2.4                                             |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        S2.5                                             |

[Torna ai contenuti](#contenuti)

##### Scenario S2.4
|  Scenario S2.4  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve avere una connessione internet attiva      |
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
|   Precondition   |   L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente non ha ottenuto il prodotto dato il codice   |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: inserisce il codice del prodotto nell'opzione appropriata                                                                                          |
|       2        | Sistema: riceve la richiesta di cercare il  prodotto dato il codice                                                     |
|      3     |     Sistema verifica il codice del prodotto                                                         |
|      4     |  Sistema: Codice errato, mostra errore      all'utente                                                         |

[Torna ai contenuti](#contenuti)

### Use Case F2.2.1 Visualizzazione recensioni del prodotto

| Actors involved |              User                       |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente visualizza le recensioni di un dato prodotto  |
| Nominal Scenario |                       S2.6                                             |
|     Variants     |                        NONE                                             |
|    Exceptions    |      NONE                                            |

[Torna ai contenuti](#contenuti)

##### Scenario S2.6
|  Scenario S2.6  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente visualizza le recensioni di un prodotto   |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: inserisce seleziona l'opzione di visualizzare le recensioni di un prodotto                                                                                        |
|       2        | Sistema: riceve la richiesta di visualizzazione delle recensioni di un prodotto                                              |
|      3     |     Sistema: restituisce le recensioni del prodotto selezionato                                                   |

[Torna ai contenuti](#contenuti)


### Use Case F2.2.2 Filtra recensioni del prodotto con lo score

| Actors involved |              User                       |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente visualizza le recensioni di un dato prodotto in base allo score |
| Nominal Scenario |                       S2.7                                             |
|     Variants     |                        NONE                                             |
|    Exceptions    |      NONE                                            |

[Torna ai contenuti](#contenuti)

##### Scenario S2.7
|  Scenario S2.7  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente visualizza le recensioni di un prodotto dato lo score  |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: inserisce seleziona lo score delle rencesioni che vuole visualizzare di un prodotto                                                                                        |
|       2        | Sistema: riceve la richiesta con i dati forniti dall'utente                                             |
|      3     |     Sistema: restituisce le recensioni del prodotto  con lo score selezionato

[Torna ai contenuti](#contenuti)

### Use Case F2.3 Visualizzazione prodotti dato il modello

| Actors involved  | User                                                         |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti dato il modello   |
| Nominal Scenario |  S2.8      |
|     Variants     |                 NONE                    |
|    Exceptions    |    NONE    |

[Torna ai contenuti](#contenuti)

##### Scenario S2.8

|  Scenario S2.8  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti per modello   |
|     Step#      |                                Descrizione                                 |
|       1        |    Utente: inserisce uno specifico modello di prodotti nell'apposita casella di testo                                                  |
|       2        | Sistema: riceve la richiesta di visualizzazione dei prodotti di un modello                                                           |
|      3      |     Sistema: recupera i prodotti dato un modello                                                          |
|      4     |  Sistema: mostra i prodotti all'utente                                                                  |
|       5   |      Utente: visualizza i prodotti richiesti  |

[Torna ai contenuti](#contenuti)


### Use Case F2.3.1 Visualizzazione prodotti dato il modello venduti

| Actors involved |     User                                          |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti venduti di un dato modello   |
| Nominal Scenario |                       S2.9                                             |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        NONE                                              |

[Torna ai contenuti](#contenuti)

##### Scenario S2.9
|  Scenario S2.9  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve avere una connessione internet attiva      |
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

| Actors involved |     User                                                |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere una connessione internet attiva      |
|  Post condition  |  L'utente ha ottenuto la lista dei prodotti non venduti di un dato modello   |
| Nominal Scenario |                       S2.10                                             |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        NONE                                              |

[Torna ai contenuti](#contenuti)

##### Scenario S2.10
|  Scenario S2.10  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve avere una connessione internet attiva      |
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


| Actors involved |      User                                      |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve avere una connesione internet attiva         |
|  Post condition  |  L'utente visualizza tutti i prodotti con successo              |
| Nominal Scenario |                       S2.11                                               |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        NONE                                              |

[Torna ai contenuti](#contenuti)

##### Scenario S2.11
|  Scenario S2.11  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente deve avere una connesione internet attiva    |
| Post condition |  L'utente visualizza il proprio carrello con successo  |
|     Step#      |                                Descrizione                                 |
|       1        |                      Utente:  richiede di visualizzaretutti i prodotti     |
|       2        |                        Sistema: ritorna tutti i prodotti                     |

[Torna ai contenuti](#contenuti)

### Use Case F3.1 Inserimento nuovo prodotto

| Actors involved        |            Manager          |
| :--------------: | :------------------------------------------------------------------:|
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema           |
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
| |   L'utente non deve essere bloccato     |
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
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente non registra i prodotti e viene visualizzato un messaggio di errore  |
|     Step#      |                                Descrizione                                 |
|       1        |            Utente:  inserisce i campi per l'inserimento del prodotto  |
|       2        |             Sistema: controlla che i campi siano corretti  |
|       3        |             Sistema: rileva che il campo  `ArrivalDate` corrisponde ad una data successiva alla data corrente |
|       4         |       Sistema: non registra i prodotti e ritorna un messaggio di errore |

[Torna ai contenuti](#contenuti)

### Use Case F3.3 Registrazione della vendita del prodotto

| Actors involved|        Sistema di Pagamento, Customer                                                                      |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |    Ricezione di corretta transazione da parte del sistema di pagamento |
| | Customer ha effettuato richiesta di pagamento |
|  Post condition  |  Registrazione della data di vendita del prodotto è avvenuta correttamente  |
| Nominal Scenario |              S3.7                                                  |
|     Variants     |                      NONE                                          |
|    Exceptions    |              S3.8     S3.9       S3.10                                     |

[Torna ai contenuti](#contenuti)

##### Scenario S3.7
|  Scenario S3.7  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | Customer ha effettuato richiesta di pagamento |
| |    Ricezione di corretta transazione da parte del sistema di pagamento |
| Post condition |   Registrazione della data di vendita del prodotto avvenuta con successo |
|     Step#      |                                Descrizione                                 |
|       1        |             Sistema:  manda una richiesta di pagamento al sistema di pagamento con i dati inseriti dall'utente|
|       2        |               Sistema di pagamento: controlla che i campi siano corretti |
|       3        |               Sistema di pagamento: restituisce transazione corretta al sistema    |
|       4        |               Sistema: registra come venduto il prodotto comprato dall'utente    |

[Torna ai contenuti](#contenuti)


### Use Case F3.4 Elimina prodotto

| Actors involved |         Manager                                                                     |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema          |
| |   L'utente deve avere una connessione internet attiva     |
|                   | L'utente deve avere il ruolo di Manager                      |
|  Post condition  |  L'utente elimina/non elimina il prodotto dal database |
| Nominal Scenario |              S3.8                                                  |
|     Variants     |                      NONE                                          |
|    Exceptions    |              S3.9                                               |

[Torna ai contenuti](#contenuti)

##### Scenario S3.8
|  Scenario S3.8 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente è attualmente autenticato nel sistema |
|                 |  L'utente ha il ruolo di Manager        |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente elimina il prodotto con successo dal database |
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  manda un richiesta con il campo `code` del prodotto da eliminare corrispondente a un prodotto presente nel database|
|       2        |               Sistema: controlla che i campi siano corretti |
|       3        |               Sistema: elimina il prodotto dal database    |

[Torna ai contenuti](#contenuti)

##### Scenario S3.9
|  Scenario S3.9 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente è attualmente autenticato nel sistema |
|                 |  L'utente ha il ruolo di Manager        |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente non elimina il prodotto dal database |
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  manda un richiesta con il campo `code` del prodotto da eliminare corrispondente a un prodotto non presente nel database|
|       2        |               Sistema: controlla che i campi siano corretti |
|       3        |               Sistema: rileva che il campo  `code` non corrisponde ad un  prodotto presente nel database    |
|       4        |               Sistema: non elimina nessun prodotto dal database e ritorna un codice di errore   |

[Torna ai contenuti](#contenuti)

### Use Case F3.5 Inserimento sconto prodotto

| Actors involved |         Manager                                                                     |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema          |
| |   L'utente deve avere una connessione internet attiva     |
|                   | L'utente deve avere il ruolo di Manager                      |
|  Post condition  |  L'utente inserisce lo sconto per tutti i prodotti di un dato modello|
| Nominal Scenario |              S3.10                                                 |
|     Variants     |                      NONE                                          |
|    Exceptions    |              S3.11                                             |

[Torna ai contenuti](#contenuti)

##### Scenario S3.10
|  Scenario S3.10 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente è attualmente autenticato nel sistema |
|                 |  L'utente ha il ruolo di Manager        |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente inserisce con successo lo sconto per il prdotto|
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  manda un richiesta con i campi  `categoria`,`modello` e `sconto` del prodotto da scontare corrispondente a un descrittore prodotto presente nel database|
|       2        |               Sistema: controlla che i campi siano corretti |
|       3        |               Sistema: Aggiorna lo `sconto` del descrittore deri prodotti del modello richiesto nel database   |

[Torna ai contenuti](#contenuti)

##### Scenario S3.11
|  Scenario S3.11 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente è attualmente autenticato nel sistema |
|                 |  L'utente ha il ruolo di Manager        |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente non inserisce con successo lo sconto per il prdotto|
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  manda un richiesta con i campi  `categoria`,`modello` e `sconto attuale` del prodotto da scontare corrispondente a un descrittore prodotto presente nel database|
|       2        |               Sistema: controlla che i campi siano corretti |
|       3        |               Sistema: rileva che il campo  `modello` non corrisponde ad alcun  prodotto presente nel database    |
|       4        |               Sistema: non inserisce lo sconto in alcun modello di prodotti nel  database e ritorna un codice di errore   |

[Torna ai contenuti](#contenuti)

### Use Case F4.1 Visualizzazione carrello

| Actors involved  |     Customer                                                                 |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
|                   |  L'utente deve avere il ruolo di Customer                        |
|  Post condition  |  L'utente inizia /non inizia il processo di pagamento dei prodotti inseriti nel carrello  |
| Nominal Scenario |  S4.5                                        |
|     Variants     |                      NONE                    |
|    Exceptions    |  S4.6                                        |

[Torna ai contenuti](#contenuti)

##### Scenario S4.5
|  Scenario S4.5  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
| |   L'utente deve avere una connessione internet attiva     |
|                  |  L'utente deve avere dei prodotti nel proprio carrello    |
|                  |  L'utente deve avere un carrello  |
| Post condition |  L'utente inizia la richiesta di pagamento con successo                            |
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  fa richiesta di effettuare il pagamento       |
|       2        |               Sistema: controlla che l'utente abbia un carrello e che il carrello non sia vuoto|
|       3        |               Sistema: reindirizza l'utente alla pagina di pagamento                       |

[Torna ai contenuti](#contenuti)

##### Scenario S4.6
|  Scenario S4.6  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
| |   L'utente deve avere una connessione internet attiva     |
|                  |  Almeno una delle seguenti due condizioni non sono soddisfatte:  |
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
| |   L'utente deve avere una connessione internet attiva     |
|                |  Il prodotto deve essere nel carrello                                       |
|                |    Il prodotto deve esistere                     |
|                |    Il prodotto non deve essere già stato venduto                   |
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
| |   L'utente deve avere una connessione internet attiva     |
|                |  Il prodotto è nel carrello                                       |
|                |    Il prodotto esiste                   |
|                |    Il prodotto non è già stato venduto                   |
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
| |   L'utente deve avere una connessione internet attiva     |
|                |  Almeno una delle seguenti condizioni non è verificata:          |
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
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
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
| |   L'utente deve avere una connessione internet attiva     |
|                  |  L'utente non deve avere un carrello|
| Post condition |  Viene mostrato un messaggio di errore                         |
|     Step#      |                                Descrizione                                |
|       1        |            Utente:  fa richiesta di rimuovere il carrello         |
|       2        |         Sistema: controlla che l'utente abbia un carrello|
|       3        |               Sistema: rileva che l'utente non ha un carrello                 |
|        4       |        Sistema: annulla la richiesta e mostra un messaggio  di errore|

[Torna ai contenuti](#contenuti)

### Use Case F5.1  Ricevi AD da google ADS

| Actors involved |           User, Servizio di ADS                                       |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente può essere non loggato o deve avere il ruolo di Customer     |
| Post condition |   L'utente visualizza gli AD ricevuti da Google ADS  |
| Nominal Scenario |  S5.1|
|     Variants     |                      NONE                     |
|    Exceptions    |  NONE |

[Torna ai contenuti](#contenuti)

##### Scenario S5.1


| Scenario S5.1 |                                                 |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente può essere non loggato o deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente visualizza gli AD ricevuti da Google ADS  |
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  accede al sito    |
|       2        |               Sistema: individua accesso utente  |
|       3        |               Sistema: invia le AD da mostrare all'utente|

[Torna ai contenuti](#contenuti)

### Use Case F6.1 Inserimento recensione
| Actors involved |           Customer                                       |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente inserisce una recensione  |
| Nominal Scenario |  S6.1|
|     Variants     |                      NONE                     |
|    Exceptions    |  S6.2 |

[Torna ai contenuti](#contenuti)

##### Scenario S6.1
|  Scenario S6.1|                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente inserisce una recensione  |                    
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  inserisce i dati all'interno del modulo       |
|       2        |        Utente: invia i dati inseriti |
|       3        |               Sistema: verifica i dati ricevuti     |
|       4        |               Sistema: verifica andata correttamente, memorizza i dati all'interno del database     |

[Torna ai contenuti](#contenuti)

##### Scenario S6.2
|  Scenario S6.2|                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente non inserisce una recensione  |                    
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  inserisce i dati all'interno del modulo       |
|       2        |        Utente: invia i dati inseriti |
|       3        |               Sistema: verifica i dati ricevuti     |
|       4        |               Sistema: i dati non sono inseriti correttamente, resitutisce un errore     |

[Torna ai contenuti](#contenuti)

### Use Case F6.2 Visualizzazione proprie recensioni

| Actors involved |           Customer                                       |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente visualizza le sue recensioni  |
| Nominal Scenario |  S6.3|
|     Variants     |                      NONE                     |
|    Exceptions    |  NONE |

[Torna ai contenuti](#contenuti)

##### Scenario S6.3
|  Scenario S6.3|                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente visualizza le sue recensioni  |                    
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  seleziona l'opzione di visualizzare le recensioni da lui effetttuate      |
|       2        |               Sistema: riceve la richiesta di visualizzazione delle recensioni di un utente    |
|       3        |               Sistema: recupera e resituisce le varie recensioni richieste     |

[Torna ai contenuti](#contenuti)

### Use Case F6.2.1 Cancellazione recensione

| Actors involved |           Customer                                       |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente cancella una recensione  |
| Nominal Scenario |  S6.4|
|     Variants     |                      NONE                     |
|    Exceptions    |  NONE |

[Torna ai contenuti](#contenuti)

##### Scenario S6.4

|  Scenario S6.4|                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente elimina una recensione  |                    
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  seleziona l'opzione di eliminare una determinata recensione da lui effetttuata      |
|       2        |               Sistema: riceve la richiesta di eliminazione di una recensione   |
|       3        |               Sistema: effettua l'eliminazione correttamente   |

[Torna ai contenuti](#contenuti)

### Use Case F7.1 Inserimento dati di pagamento
| Actors involved |           Customer                                       |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente prosegue con il pagamento  |
| Nominal Scenario |  S7.1|
|     Variants     |                      NONE                     |
|    Exceptions    | S7.2|

[Torna ai contenuti](#contenuti)

##### Scenario S7.1

|  Scenario S7.1|                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente procede con il pagamento  |                    
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  inserisce i dati richiesti per il pagamento      |
|       2        |               Utente: invia i dati richiesti  |
|       3        |               Sistema: effettua la verifica dei dati richiesti   |
|       4        |               Sistema: dati inseriti correttamente, effettua una richiesta al servizio di pagamento e aggiorna il campo `sellingDate` del prodotto utilizzando la data corrente  |

[Torna ai contenuti](#contenuti)

##### Scenario S7.2

|  Scenario S7.2|                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente non procede con il pagamento  |                    
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  inserisce i dati richiesti per il pagamento      |
|       2        |               Utente: invia i dati richiesti  |
|       3        |               Sistema: effettua la verifica dei dati richiesti e verifica che il campo sellingDate del prodotto è nullo   |
|       4        |               Sistema: dati non inseriti correttamente, restituisce un messaggio   |

[Torna ai contenuti](#contenuti)

### Use Case F7.1.1 Annulla pagamento
| Actors involved |           Customer                                       |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente annulla il pagamento  |
| Nominal Scenario |  S7.3|
|     Variants     |                      NONE                     |
|    Exceptions    | NONE |

[Torna ai contenuti](#contenuti)

##### Scenario S7.3

|  Scenario S7.3|                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente annulla il pagamento  |                    
|     Step#      |                                Descrizione                                |
|       1        |             Utente: seleziona l'opzione di annullamento del pagamento      |
|       2        | Sistema: riceve la richiesta di annullamento del pagamento |
|       3        | Sistema: reindirizza l'utente al suo carrello |

[Torna ai contenuti](#contenuti)

### Use Case F7.2 Utilizzo credito accumulato
| Actors involved |           Customer                                       |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente utilizza i crediti accumulati in fase di pagamento  |
| Nominal Scenario |  S7.4|
|     Variants     |                      NONE                     |
|    Exceptions    | NONE |

[Torna ai contenuti](#contenuti)

##### Scenario S7.4

|  Scenario S7.4|                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente utilizza i propri crediti accumulati  |                    
|     Step#      |                                Descrizione                                |
|       1        |             Utente: seleziona l'opzione di utilizzare i propri crediti accumulati      |
|       2        | Sistema: riceve la richiesta di adoperare i crediti  |
|       3        | Sistema: calcola il nuovo prezzo che deve pagare l'utente |
|       4        | Utente: visualizza il nuovo prezzo da pagare |

[Torna ai contenuti](#contenuti)

### Use Case F7.3 Conferma pagamento
| Actors involved |           Customer, Sistema di pagamento                                       |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |  L'utente conferma il pagamento  |
| Nominal Scenario |  S7.5|
|     Variants     |                      NONE                     |
|    Exceptions    | S7.6 S7.7 |

[Torna ai contenuti](#contenuti)

##### Scenario S7.5

|  Scenario S7.5|                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente effettua pagamento  |                    
|     Step#      |                                Descrizione                                |
|       1        |             Utente: seleziona l'opzione di conferma pagamento     |
|       2        |               Sistema: effettua i controlli sul campo `sellingDate` del prodotto  |
|       3        |               Sistema: il campo è nullo, invia correttamente la richiesta al sistema di pagamento  |
| 4 | Sistema: riceve transazione corretta da parte del sistema di pagamento |

[Torna ai contenuti](#contenuti)

##### Scenario S7.6

|  Scenario S7.6|                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente non procede con il pagamento  |                    
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  conferma il pagamento     |
|       2        |               Sistema: effettua la verifica che il campo `sellingDate` del prodotto è nullo   |
|       4        |               Sistema: il campo `sellingDate` del prodotto è non nullo, restituisce un errore  |

[Torna ai contenuti](#contenuti)

##### Scenario S7.7

|  Scenario S7.7|                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |   L'utente deve avere il ruolo di Customer     |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente non effettua il pagamento  |                    
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  conferma il pagamento      |
|       2        |               Sistema: effettua la verifica che il campo `sellingDate` del prodotto è nullo   |
|       3        |               Sistema: il campo `sellingDate` del prodotto è nullo, invia la richiesta al sistema di pagamento  |
|       4        |               Sistema: riceve pagamento negato da parte del sistema di pagamento, resituisce un errore  |

[Torna ai contenuti](#contenuti)

### Use Case F8.1 Aggiornamento punti fedeltà

| Actors involved |     Customer                                                                    |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
| |  L'utente ha effettuato un acquisto                        |
|  Post condition  |  I punti fedeltà dell'utente vengono aggiornati con successo  |
| Nominal Scenario |  S8.1|
|     Variants     |                      NONE                     |
|    Exceptions    |  NONE |

[Torna ai contenuti](#contenuti)

##### Scenario S8.1

|  Scenario S8.1|                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|                  |  L'utente ha effettuato un acquisto|
| Post condition |  I punti fedeltà dell'utente vengono aggiornati con successo  |                      |
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  effettua un pagamento       |
|       2        |        Sistema: calcola quanti `punti fedeltà` ha guadagnato l'utente con il pagamento |
|       3        |               Sistema: aggiorna il livello `punti fedeltà` dell'utente customer che ha eseguito il pagamento                   |

[Torna ai contenuti](#contenuti)

### Use Case F8.2 Conversione punti fedeltà in credito

| Actors involved |     Customer                                                                    
| :--------------:| :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
||L'utente ha raggiunto la soglia di punti fedeltà richiesta per la conversione|
|  Post condition  |  Il livello punti fedeltà dell'utente è aggiornato e il suo credito incrementato|
| Nominal Scenario |  S8.2 |
|     Variants     |                      NONE                     |
|    Exceptions    |  NONE|

[Torna ai contenuti](#contenuti)

##### Scenario S8.2

|  Scenari S8.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|                  |  L'utente ha raggiunto la soglia di punti fedeltà richiesta per la conversione da punti fedeltà in credito|
| Post condition | l livello punti fedeltà dell'utente è aggiornato e il suo credito incrementato         |
|     Step#      |                                Descrizione                                |
|       1        |             Sistema:  toglie la soglia di `punti fedeltà` dell'utente raggiunta        |
|       2        |        Sistema: aumenta il livello di `credito` dell'utente |

[Torna ai contenuti](#contenuti)

### Use Case F8.3 Aggiornamento credito residuo

| Actors involved |   Customer, sistema di pagamento|                                                                    
| :--------------:| :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
||L'utente ha effettuato un pagamento utilizzando del credito a sua disposizione|
|  Post condition  |  Il credito residuo dell'utente che ha effettuato l'acquisto è aggiornato |
| Nominal Scenario |  S8.3 |
|     Variants     |                      NONE                     |
|    Exceptions    |  NONE|

[Torna ai contenuti](#contenuti)

##### Scenario S8.3

|  Scenari S8.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
|                  |  L'utente ha effettuato un pagamento utilizzando del credito a sua disposizione|
| Post condition |  Il credito residuo dell'utente che ha effettuato l'acquisto è aggiornato         |
|     Step#      |                                Descrizione                                |
|       1        |             Sistema:  Scala la quantità di `credito` dell'utente usata nell'acquisto        |

[Torna ai contenuti](#contenuti)

### Use Case F9.1 Blocca utente

| Actors involved |     Admin                                                                    
| :--------------:| :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Admin                        |
|  Post condition  |  L'utente ha bloccato un account con successo|
| Nominal Scenario |  S9.1 |
|     Variants     |                      NONE                     |
|    Exceptions    |  S9.2|

[Torna ai contenuti](#contenuti)

##### Scenario S9.1

|  Scenario S9.1 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Admin                        |
|  Post condition  |  L'utente ha bloccato un account con successo|
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  invia la richiesta di bloccare un account         |
|       2        |        Sistema: cambia lo stato dell'account desiderato in `bloccato` ed effetta il logout dell'account bloccato|

[Torna ai contenuti](#contenuti)

##### Scenario S9.2

|  Scenario S9.2 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Admin                        |
|  Post condition  |  L'utente non ha bloccato un account con successo|
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  invia la richiesta di bloccare un account         |
|       2        |        Sistema: non trova l'account richiesto nel database |
|       3        |        Sistema: manda un messaggio di errore e nessun account viene bloccato  |

[Torna ai contenuti](#contenuti)

### Use Case F9.2 Sblocca utente

| Actors involved |     Admin                                                                    
| :--------------:| :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Admin                        |
||L'utente vuole sbloccare un account bloccato in precedenza|
|  Post condition  |  L'utente ha sbloccato un account con successo|
| Nominal Scenario |  S9.3 |
|     Variants     |                      NONE                     |
|    Exceptions    |  S9.4|

[Torna ai contenuti](#contenuti)

##### Scenario S9.3

|  Scenario S9.3 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Admin                        |
||L'utente vuole sbloccare un account bloccato in precedenza|
|  Post condition  |  L'utente ha sbloccato un account con successo|
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  invia la richiesta di sbloccare un account         |
|       2        |        Sistema: cambia lo stato dell'account desiderato in `attivo` |

[Torna ai contenuti](#contenuti)

##### Scenario S9.4

|  Scenario S9.4 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Admin                        |
|  Post condition  |  L'utente non ha bloccato un account con successo|
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  invia la richiesta di bloccare un account         |
|       2        |        Sistema: non trova l'account richiesto nel database |
|       3        |        Sistema: manda un messaggio di errore e nessun account viene sbloccato  |

[Torna ai contenuti](#contenuti)


### Use Case F9.3 Visualizza lista utenti

| Actors involved |     Admin                                                                    
| :--------------:| :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Admin                        |
|  Post condition  |  L'utente visualizza la lista di tutti gli utenti presenti nel sistema|
| Nominal Scenario |  S9.5|
|     Variants     |                      NONE                     |
|    Exceptions    |  NONE|

[Torna ai contenuti](#contenuti)

##### Scenario S9.5

|  Scenario S9.5  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Admin                        |
|  Post condition  |   L'utente visualizza la lista di tutti gli utenti presenti nel sistema|
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  invia la richiesta di visualizzare tutti gli utenti presenti nel sistema        |
|       2        |        Sistema: mostra all'utente admin tutti gli utenti presenti nel sistema e le rispettive informazioni|

[Torna ai contenuti](#contenuti)

### Use Case F9.4 Registrazione nuovo account manager

| Actors involved |     Admin                                                                    
| :--------------:| :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Admin                        |
|  Post condition  |  Admin ha registrato un nuovo account Manager|
| Nominal Scenario |  S9.6|
|     Variants     |                      NONE                     |
|    Exceptions    |  S9.7|

[Torna ai contenuti](#contenuti)

##### Scanrio S9.6
|  Scenario S9.6  |                                                                            |
| :--------------:| :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Admin                        |
|  Post condition  |  Admin ha registrato un nuovo account Manager|
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  seleziona l'opzione di registrazione account Manager        |
|       2        |        Utente: inserisce i dati richiesti|
|       3        |        Utente: invia i dati inseriti al sistema|
|       4        |        Sistema: verifica le credenziali inserite|
|       5        |        Sistema: memorizza le informazioni del nuovo account|

[Torna ai contenuti](#contenuti)

##### Scanrio S9.7
|  Scenario S9.7  |                                                                            |
| :--------------:| :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Admin                        |
|  Post condition  |  Admin non ha registrato un nuovo account Manager|
|     Step#      |                                Descrizione                                |
|       1        |             Utente:  seleziona l'opzione di registrazione account Manager        |
|       2        |        Utente: inserisce i dati richiesti|
|       3        |        Utente: invia i dati inseriti al sistema|
|       4        |        Sistema: verifica le credenziali inserite|
|       5        |        Sistema: le credenziali inserite sono errate, restituisce un errore|

[Torna ai contenuti](#contenuti)

### Use Case F10.1 Visualizzazione prodotti preferiti


| Actors involved |              Customer                                                       |
| :--------------: | :------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
| |   L'utente deve avere una connessione internet attiva     |
|  Post condition  |  L'utente visualizza tutti i suoi prodotti con successo              |
| Nominal Scenario |                       S10.1                                             |
|     Variants     |                        NONE                                             |
|    Exceptions    |                        NONE                                              |

[Torna ai contenuti](#contenuti)

##### Scenario S10.1
|  Scenario S10.1 |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|  Precondition  | L'utente deve essere attualmente autenticato nel sistema |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |  L'utente visualizza tutti i suoi prodotti preferiti con successo  |
|     Step#      |                                Descrizione                                 |
|       1        |                      Utente:  richiede di visualizzare i suoi prodotti preferiti    |
|       2        |                        Sistema: ritorna tutti i prodotti   preferiti dell'utente                  |

[Torna ai contenuti](#contenuti)

### Use Case F10.2 Aggiunta prodotto ai preferiti

| Actors involved          |          Customer                                                           |
| :--------------: | :------------------------------------------------------------------:|
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
| |   L'utente deve avere una connessione internet attiva     |
|  Post condition  |  L'utente aggiunge/non aggiunge con successo un prodotto ai propri preferiti     |
| Nominal Scenario |      S10.2                                                               |
|     Variants     |                     NONE                                              |
|    Exceptions    |                     S10.3                                             |

[Torna ai contenuti](#contenuti)

##### Scenario S10.2
|  Scenario S10.2  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente aggiunge con successo un prodotto ai propri preferiti   |
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  richiede di inserire un prodotto nei preferiti    |
|       2        |               Sistema: controlla che il prodotto esista  |
|       3        |               Sistema: aggiorna lo stato del prodotto a prodotto preferito e notifica il successo dell'operazione |

[Torna ai contenuti](#contenuti)

##### Scenario S10.3
|  Scenario S10.3  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                  |  L'utente deve avere il ruolo di Customer                        |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente non aggiunge il prodotto ai propri preferiti  |
|     Step#      |                                Descrizione                                 |
|       1        |            Utente:  richiede di inserire un prodotto nei preferiti    |
|       2        |             Sistema: non trova il prodotto nel database |
|    3        |       Sistema : non aggiunge alcun prodotto ai preferiti e ritorna un messaggio di errore |  

[Torna ai contenuti](#contenuti)

### Use Case F10.3 Rimozione prodotto dai preferiti

| Actors involved          |          Customer                                                           |
| :--------------: | :------------------------------------------------------------------:|
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
| |   L'utente deve avere una connessione internet attiva     |
|  Post condition  |  L'utente rimuove/non rimuove con successo un prodotto dai propri preferiti     |
| Nominal Scenario |      S10.4                                                               |
|     Variants     |                     NONE                                              |
|    Exceptions    |                     S10.5                                            |

[Torna ai contenuti](#contenuti)

##### Scenario S10.4
|  Scenario S10.4  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                   |  L'utente deve avere il ruolo di Customer                        |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente rimuove con successo un prodotto dai propri preferiti   |
|     Step#      |                                Descrizione                                 |
|       1        |             Utente:  richiede di rimuovere un prodotto dai preferiti      |
|       2        |               Sistema: controlla che il prodotto esista nel database |
|       3        |               Sistema: aggiorna lo stato del prodotto a prodotto non preferito e notifica all'utente il successo dell'operazione|

[Torna ai contenuti](#contenuti)

##### Scenario S10.5
|  Scenario S10.5  |                                                                            |
| :------------: | :------------------------------------------------------------------------: |
|   Precondition   |  L'utente deve essere attualmente autenticato nel sistema              |
|                  |  L'utente deve avere il ruolo di Customer                        |
| |   L'utente deve avere una connessione internet attiva     |
| Post condition |   L'utente non rimuove con successo  il prodotto dai propri preferiti  |
|     Step#      |                                Descrizione                                 |
|       1        |            Utente: richiede di rimuovere un prodotto dai preferiti   |
|       2        |             Sistema: non trova il prodotto nel database |
|    3        |       Sistema : non rimuove il prodotto nei preferiti e ritorna un messaggio di errore |  

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

8. **ADMIN**:
  Rappresenta il responsabile della gestione complessiva della piattaforma online. Abilitato a bloccare i vari utenti che non rispettano criteri stabiliti.

9. **LISTA PREFERITI**:
   Funzionalità che consente ai clienti di salvare i prodotti che trovano interessanti o che desiderano acquistare in futuro. Rappresenta un promemoria personalizzato dei prodotti che hanno catturato particolare attenzione del cliente.

10. **RECENSIONE**:
  Entità che rappresenta le opinioni e le valutazioni lasciate dai clienti sui prodotti acquistati.

11. **PUNTI FEDELTÀ**
  Punti che ottiene il cliente a seguito di ogni acquisto effettuato. Una volta raggiunta una soglia di punti fedeltà prestabilita, questi vengono convertiti in credito spendibile negli acquisti successivi.

![Glossario](https://i.ibb.co/HH8VXf1/Screenshot-2024-05-05-alle-12-56-17.png)

[Torna ai contenuti](#contenuti)

# System Design

Il ***System Design*** è il processo di progettazione e sviluppo di un sistema complesso, che può includere hardware, software, reti, database, al fine di soddisfare specifiche esigenze funzionali e non funzionali.

Questo processo coinvolge la creazione di una struttura architetturale solida e coerente che supporti le funzionalità richieste dal sistema, assicuri la scalabilità, l'affidabilità e la sicurezza, e ottimizzi le prestazioni complessive.

![SystemDesign](https://i.ibb.co/pvVxDVz/Screenshot-2024-04-30-alle-22-15-32.png)

[Torna ai contenuti](#contenuti)
# Deployment Diagram

Un ***Deployment Diagram*** è un diagramma UML che mostra la disposizione fisica dei componenti software sui nodi hardware, rimanendo coerenti con quanto definito nelle interfacce nei capitoli precedenti.

In sostanza, il Deployment Diagram fornisce una visione ad alto livello dell'architettura di distribuzione di un sistema software.

![DeploymentDiagram](https://i.ibb.co/Zcw5wwf/Screenshot-2024-04-30-alle-21-19-05.png)

[Torna ai contenuti](#contenuti)