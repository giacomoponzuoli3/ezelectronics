import { describe, test, expect, jest, afterEach, afterAll } from "@jest/globals"

import ReviewDAO from "../../src/dao/reviewDAO"
import db from "../../src/db/db"
import { Database, RunResult } from "sqlite3"
import { ExistingReviewError, NoReviewProductError, NoReviewsForProducts } from "../../src/errors/reviewError"
import { ProductNotFoundError } from "../../src/errors/productError"

jest.mock("crypto")
jest.mock("../../src/db/db.ts")

describe("Review DAO", () => { 
    //-------------- addReview -----------------//
    describe("addReview", () => { 

        test("It should resolve void",async () => {
            const reviewDAO = new ReviewDAO();

            jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
                if (sql.includes('productDescriptor')) {
                    callback(null, { model: params[0] });  // Product found
                } else {
                    callback(null, undefined);  // No existing review
                }
                return {} as Database;
            });

            jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
                callback.call({ lastID: 1 }, null);  // Successful insert
                return {} as Database;
            });

            await expect(reviewDAO.addReview('username', 'model', 5, 'comment')).resolves.toBeUndefined();
        })

        test("It should reject with error in db", async () => {
            const reviewDAO = new ReviewDAO();

            // Mock di db.get per simulare il ritrovamento del prodotto
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                callback(null, { model: params[0] }); // Simula il ritrovamento del prodotto
                return {} as Database;
            });

            // Mock di db.run per simulare un errore di inserimento della recensione
            const mockDBRun = jest.spyOn(db, "run").mockImplementation(function (sql: string, params: any[], callback) {
                callback.call({ lastID: 0 }, null); // Simula un errore (lastID 0)
                return {} as Database;
            });

            await expect(reviewDAO.addReview("username", "model", 2, "comment")).rejects.toThrow(ExistingReviewError);

            mockDBGet.mockRestore();
            mockDBRun.mockRestore();
        });

        test("It should reject with error on db.get error", async () => {
            const reviewDAO = new ReviewDAO();
                const testError = new Error("Database error");

                // Mock di db.get per simulare un errore
                const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                    callback(testError, null); // Simula un errore nella chiamata a db.get
                    return {} as Database;
                });

                await expect(reviewDAO.getProductByModel("model")).rejects.toThrow(testError);

                mockDBGet.mockRestore();
        });

        test('It should reject with error on db.get error in getProductReviewByUserModel', async () => {
            const reviewDAO = new ReviewDAO();
            const testError = new Error('Database error');
    
            jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
                if (sql.includes('productDescriptor')) {
                    callback(null, { model: params[0] });  // Product found
                } else {
                    callback(testError, null);  // Error when checking for existing review
                }
                return {} as Database;
            });
    
            await expect(reviewDAO.addReview('username', 'model', 5, 'comment')).rejects.toThrow(testError);
        });

        test('It should reject with error on db.run error', async () => {
            const reviewDAO = new ReviewDAO();
            const testError = new Error('Database error');
    
            jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
                if (sql.includes('productDescriptor')) {
                    callback(null, { model: params[0] });  // Product found
                } else {
                    callback(null, undefined);  // No existing review
                }
                return {} as Database;
            });
    
            jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
                callback(testError, null);  // Error on insert
                return {} as Database;
            });
    
            await expect(reviewDAO.addReview('username', 'model', 5, 'comment')).rejects.toThrow(testError);
        });

        test('It should reject with ExistingReviewError if review already exists', async () => {
            const reviewDAO = new ReviewDAO();
    
            jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
                if (sql.includes('productDescriptor')) {
                    callback(null, { model: params[0] });  // Product found
                } else {
                    callback(null, { username: 'username', model: 'model' });  // Existing review found
                }
                return {} as Database;
            });
    
            await expect(reviewDAO.addReview('username', 'model', 5, 'comment')).rejects.toThrow(ExistingReviewError);
        });
    
        test("It should reject with ProductNotFoundError if no product is found", async () => {
            const reviewDAO = new ReviewDAO();

            // Mock di db.get per simulare il caso in cui la query non restituisce risultati
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                // Simula il caso in cui la query non restituisce risultati
                if (params[0] === 'nonexistent_model') {
                    callback(null, undefined);
                } else {
                    callback(null, { model: params[0] });
                }
                return {} as Database;
            });

            await expect(reviewDAO.deleteReview("username", "nonexistent_model")).rejects.toThrow(ProductNotFoundError);

            mockDBGet.mockRestore();
        });
    });

    //-------------- getProductReviews -----------------//
    describe("getProductReviews", () => { 
        // Test per il caso in cui la query restituisce risultati corretti
        test("It should return product reviews", async () => {
            const reviewDAO = new ReviewDAO();

            // Mock di db.get per simulare il ritrovamento del prodotto
            jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                callback(null, { model: params[0] }); // Simula il ritrovamento del prodotto
                return {} as Database;
            });

            // Mock della funzione db.all per simulare il recupero dei dati dal database
            jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
                // Simulazione di dati di recensione dal database
                const rows = [
                    //ogni attributo deve corrispondere alla colonna nel db
                    { model: "Model1", username: "User1", score: 5, dateReview: "2024-05-29", comment: "Great product" },
                    { model: "Model1", username: "User2", score: 4, dateReview: "2024-05-30", comment: "Good product" }
                ];
                // Chiamata alla callback con i dati simulati
                callback(null, rows);

                return {} as Database
            });

            const model = "Model1";
        
            // Chiamata al metodo getProductReviews
            const reviews = await reviewDAO.getProductReviews(model);

            // Verifica che il metodo db.all sia stato chiamato correttamente
            expect(db.all).toHaveBeenCalledTimes(1);
            expect(db.all).toHaveBeenCalledWith(
                "SELECT * FROM review WHERE model = ?",
                [model],
                expect.any(Function) // Aspettati una funzione di callback
            );

            // Verifica che il risultato del metodo sia corretto
            expect(reviews).toEqual([
                //ogni attributo deve corrispondere all'attributo di ProductReview
                { model: "Model1", user: "User1", score: 5, date: "2024-05-29", comment: "Great product" },
                { model: "Model1", user: "User2", score: 4, date: "2024-05-30", comment: "Good product" }
            ]);
        });

        // Test per il caso in cui la query restituisce un errore
        test("It should reject with an error", async () => {
            const reviewDAO = new ReviewDAO();

            // Mock di db.get per simulare il ritrovamento del prodotto
            jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                callback(null, { model: params[0] }); // Simula il ritrovamento del prodotto
                return {} as Database;
            });

            // Mock della funzione db.all per simulare un errore nel recupero dei dati dal database
            jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
                // Chiamata alla callback con un errore simulato
                callback(new Error("Database error"), null);

                return {} as Database;
            });

            const model = "Model1";

            // Chiamata al metodo getProductReviews
            await expect(reviewDAO.getProductReviews(model)).rejects.toThrow("Database error");

            // Verifica che il metodo db.all sia stato chiamato correttamente
            expect(db.all).toHaveBeenCalledTimes(1);
            expect(db.all).toHaveBeenCalledWith(
                "SELECT * FROM review WHERE model = ?",
                [model],
                expect.any(Function) // Aspettati una funzione di callback
            );
        });
    });

    //-------------- deleteReview -----------------//
    describe("deleteReview", () => {
        test("It should delete review and resolve promise", async () => {
            const reviewDAO = new ReviewDAO();
            
            const username = "testUser";
            const model = "testModel";

            // Mock di db.get
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                // Passa un oggetto row con il modello trovato
                callback(null, { model: params[0] });
                return {} as Database;
            });

            // Simula il successo dell'operazione di eliminazione
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {

                // Chiama la callback con null per indicare che non ci sono errori
                callback.call({ chenges: 1 }, null);

                return {} as Database;
            });

            await expect(reviewDAO.deleteReview(username, model)).resolves.toBeUndefined();

            // Assicurati che la query sia stata chiamata con i parametri corretti
            expect(db.run).toHaveBeenCalledWith(
                "DELETE FROM review WHERE model = ? AND username = ?", 
                [model, username],
                expect.any(Function) // Aspettati una funzione di callback
            );

            mockDBGet.mockRestore();
            mockDBRun.mockRestore();
        });

        test("Delete Review should reject with error on db.run error", async () => {
            const reviewDAO = new ReviewDAO();
            
            const username = "testUser";
            const model = "testModel";

            // Mock di db.get
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                // Passa un oggetto row con il modello trovato
                callback(null, { model: params[0] });
                return {} as Database;
            });

            // Simula il successo dell'operazione di eliminazione
            const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {

                // Chiama la callback con null per indicare che non ci sono errori
                callback.call(null, new Error("DB error"));

                return {} as Database;
            });

            await expect(reviewDAO.deleteReview(username, model)).rejects.toThrow("DB error");

            mockDBGet.mockRestore();
            mockDBRun.mockRestore();
        });

        test("It should reject with NoReviewProductError if no reviews are found for the product", async () => {
            const reviewDAO = new ReviewDAO();

            // Mock di db.get per simulare il caso in cui il prodotto esiste ma non ha recensioni
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                callback(null, { model: params[0] }); // Simula il ritrovamento del prodotto
                return {} as Database;
            });

            // Mock di db.run per simulare il caso in cui non vengono eliminate recensioni
            const mockDBRun = jest.spyOn(db, "run").mockImplementation(function (sql: string, params: any[], callback) {
                callback.call({ changes: 0 }, null); // Simula il caso in cui non vengono eliminate recensioni
                return {} as Database;
            });

            await expect(reviewDAO.deleteReview("username", "model")).rejects.toThrow(NoReviewProductError);

            mockDBGet.mockRestore();
            mockDBRun.mockRestore();
        });
    });

    //-------------- deleteReviewsOfProduct -----------------//
    describe("deleteReviewsOfProduct", () => {
        // Testa il caso in cui la cancellazione delle recensioni vada a buon fine
        test("It should resolve void when reviews are deleted successfully", async () => {
            const reviewDAO = new ReviewDAO();

            // Mock di db.get
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                // Passa un oggetto row con il modello trovato
                callback(null, { model: params[0] });
                return {} as Database;
            });

            // Mock della funzione db.run per simulare la cancellazione delle recensioni con successo
            jest.spyOn(db, "run").mockImplementationOnce((sql, params, callback) => {

                callback.call({changes : 1}, null); // Simula la cancellazione delle recensioni con successo
                return {} as Database;
            });

            await expect(reviewDAO.deleteReviewsOfProduct("test_model")).resolves.toBeUndefined();
        });

        // Testa il caso in cui non vengano trovate recensioni per il modello specificato
        test("It should reject with NoReviewProductError when no reviews are found", async () => {
            const reviewDAO = new ReviewDAO();
            
            // Mock di db.get
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                // Passa un oggetto row con il modello trovato
                callback(null, { model: params[0] });
                return {} as Database;
            });

            // Mock della funzione db.run per simulare che non vengano trovate recensioni
            const mockDBRun = jest.spyOn(db, "run").mockImplementationOnce((sql, params, callback) => {
                callback.call({ changes: 0 }, null); // Simula che non vengano trovate recensioni
                return {} as Database;
            });

            await expect(reviewDAO.deleteReviewsOfProduct("non_existing_model")).rejects.toThrow(NoReviewProductError);

            mockDBGet.mockRestore();
            mockDBRun.mockRestore();
        });

        // Testa il caso in cui si verifica un errore generico durante l'esecuzione del metodo
        test("It should reject with an error when an error occurs during execution", async () => {
            const reviewDAO = new ReviewDAO();
            
            // Mock di db.get
            const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql: string, params: any[], callback) => {
                // Passa un oggetto row con il modello trovato
                callback(null, { model: params[0] });
                return {} as Database;
            });
            // Mock della funzione db.run per simulare un errore durante l'esecuzione della query SQL
            const mockDBRun = jest.spyOn(db, "run").mockImplementationOnce((sql, params, callback) => {
                callback(new Error("Database error")); // Simula un errore durante l'esecuzione della query SQL
                return {} as Database;
            });

            await expect(reviewDAO.deleteReviewsOfProduct("test_model")).rejects.toThrow(Error);

            mockDBGet.mockRestore();
            mockDBRun.mockRestore();
        });
    });

    //----------------deleteAllReviews--------------//
    describe("deleteAllReviews", () => {
        test("It should delete all reviews successfully", async () => {
            const reviewDAO = new ReviewDAO();
            // Mock della query SQL che restituisce successo
            jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback.call({ changes: 1}, null);

                return {} as Database
            });

            
            await expect(reviewDAO.deleteAllReviews()).resolves.toBeUndefined();

            // Controlla che la query SQL sia stata chiamata con i parametri corretti
            expect(db.run).toHaveBeenCalledWith("DELETE FROM review", [], expect.any(Function));
        });

        test("It should handle SQL error", async () => {
            const reviewDAO = new ReviewDAO();

            // Mock della query SQL che restituisce un errore
            jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback(new Error("SQL error"));
            
                return {} as Database;
            });

            await expect(reviewDAO.deleteAllReviews()).rejects.toThrowError("SQL error");

            // Controlla che la query SQL sia stata chiamata con i parametri corretti
            expect(db.run).toHaveBeenCalledWith("DELETE FROM review", [], expect.any(Function));
        });

        test("It should handle no reviews found", async () => {
            const reviewDAO = new ReviewDAO();
            
            // Mock della query SQL che restituisce successo, ma nessuna recensione trovata
            jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
                callback.call({ changes: 0 },null);

                return {} as Database;
            });

            await expect(reviewDAO.deleteAllReviews()).resolves.toBeUndefined();

            // Controlla che la query SQL sia stata chiamata con i parametri corretti
            expect(db.run).toHaveBeenCalledWith("DELETE FROM review", [], expect.any(Function));
        });

    });
});


afterEach(() => {
    jest.clearAllMocks(); // Ripristina tutti i mock dopo ogni test
});

afterAll(() => {
    jest.clearAllMocks();
})