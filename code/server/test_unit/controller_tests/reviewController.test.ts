import { describe, test, expect, jest, afterEach, afterAll } from "@jest/globals"

import ReviewDAO from "../../src/dao/reviewDAO"
import ReviewController from "../../src/controllers/reviewController";
import { Role, User } from "../../src/components/user";
import { ProductReview } from "../../src/components/review";

jest.mock("crypto")
jest.mock("../../src/db/db.ts")

describe("Controller Review", () => {
    //----------------addReview----------------------//

    describe("addReview", () => {
        test("It should resolve void",async () => {
            //definisco un user test
            const testUser = new User("test", "test", "test", Role.CUSTOMER, "", "");

            const testReview = { //definisco un oggetto di review di test
                username: testUser.username,
                model: "modelTest", 
                score: 3,
                comment: "comment test"
            }

            //Mock il metodo addReview del DAO per restituire void, cioè undefined
            jest.spyOn(ReviewDAO.prototype, "addReview").mockResolvedValueOnce(undefined);

            const controller = new ReviewController();

            //chiamare il metodo addReview del controller
            const response = await controller.addReview(testReview.model, testUser, testReview.score, testReview.comment);

            // Aspettarsi che il metodo addReview del DAO sia stato chiamato una volta con i parametri corretti
            expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.addReview).toHaveBeenCalledWith(testUser.username, testReview.model, testReview.score, testReview.comment);

            //Aspettarsi che la risposta sia void, cioè undefined
            expect(response).toBeUndefined();

        });

        test("It should reject with an error", async () => {
            // Definisco un user test
            const testUser = new User("test", "test", "test", Role.CUSTOMER, "", "");

            const testReview = { // Definisco un oggetto di review di test
                username: testUser.username,
                model: "modelTest", 
                score: 3,
                comment: "comment test"
            }

            // Mock il metodo addReview del DAO per restituire una Promise rifiutata
            jest.spyOn(ReviewDAO.prototype, "addReview").mockRejectedValueOnce(new Error("Review is not inserted"));
            
            const controller = new ReviewController();

            // Aspettarsi che la chiamata a addReview del controller rigetti con l'errore "Review is not inserted"
            await expect(controller.addReview(testReview.model, testUser, testReview.score, testReview.comment))
                .rejects.toThrow("Review is not inserted");

            // Aspettarsi che il metodo addReview del DAO sia stato chiamato una volta con i parametri corretti
            expect(ReviewDAO.prototype.addReview).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.addReview).toHaveBeenCalledWith(testUser.username, testReview.model, testReview.score, testReview.comment);
        });
    });

    //----------------getProductReviews----------------------//
    describe("getProductReviews", () => {
        test("It should resolve with array of ProductReveiw[]",async () => {
            //definisco un user test
            const modelProduct = "model";

            // Definire un array di recensioni di test
            const testReviews = [
                new ProductReview(modelProduct, "user1", 4, "2024-05-25", "Great product!"),
                new ProductReview(modelProduct, "user2", 5, "2024-04-22", "Excellent!"),
                new ProductReview(modelProduct, "user3", 3, "2024-05-01", "It's okay.")
            ];


            //Mock il metodo getProductReviews del DAO per restituire ProductReview[]
            jest.spyOn(ReviewDAO.prototype, "getProductReviews").mockResolvedValueOnce(testReviews);

            const controller = new ReviewController();

            //chiamare il metodo addReview del controller
            const response = await controller.getProductReviews(modelProduct);

            // Aspettarsi che il metodo addReview del DAO sia stato chiamato una volta con i parametri corretti
            expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledWith(modelProduct);

            //Aspettarsi che la risposta sia void, cioè undefined
            expect(response).toEqual(testReviews);
        });

        test("It should be reject with an error", async () => {
            // Definire un modello di test
            const testModel = "modelTest";

            // Mock il metodo getProductReviews del DAO per restituire una promessa rifiutata
            jest.spyOn(ReviewDAO.prototype, "getProductReviews").mockRejectedValueOnce(new Error("Failed to get product reviews"));

            // Creare un'istanza del ReviewController
            const controller = new ReviewController();

            // Aspettarsi che la chiamata a getProductReviews del controller rigetti con l'errore atteso
            await expect(controller.getProductReviews(testModel))
                .rejects.toThrow("Failed to get product reviews");

            // Aspettarsi che il metodo getProductReviews del DAO sia stato chiamato una volta con il parametro corretto
            expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.getProductReviews).toHaveBeenCalledWith(testModel);
        });
    });


    //----------------deleteReview----------------------//
    describe("deleteReview", () => {
        test("It should be resolve void",async () => {
            //Definisco uno User di test
            const testUser = new User("test", "test", "test", Role.CUSTOMER, "", "");

            const testModel = "testModel";

            //Mock il metodo deleteReview del DAO per restituire una Promise void, cioè undefined
            jest.spyOn(ReviewDAO.prototype, "deleteReview").mockResolvedValueOnce(undefined);

            //creo controller di Review
            const controller = new ReviewController();

            //chiamo il metodo deleteReview del controller
            const response = await controller.deleteReview(testModel, testUser);

            // Aspettarsi che il metodo deleteReview del DAO sia stato chiamato una volta con i parametri corretti
            expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledWith(testUser.username, testModel);

            expect(response).toBe(undefined);
        });


        test("It should be reject with an error",async () => {
            //Definisco uno User di test
            const testUser = new User("test", "test", "test", Role.CUSTOMER, "", "");

            const testModel = "testModel";

            //Mock il metodo deleteReview del DAO per restituire una Promise rejected
            jest.spyOn(ReviewDAO.prototype, "deleteReview").mockRejectedValueOnce(new Error("Delete is not successful"));

            //creo controller di Review
            const controller = new ReviewController();

            //chiamo il metodo deleteReview del controller
            await expect(controller.deleteReview(testModel, testUser))
                .rejects.toThrow("Delete is not successful");

            // Aspettarsi che il metodo getProductReviews del DAO sia stato chiamato una volta con il parametro corretto
            expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.deleteReview).toHaveBeenCalledWith(testUser.username, testModel);

        });
    });

    //----------------deleteReviewsOfProduct----------------------//
    describe("deleteReviewsOfProduct", () => {
        test("It should be resolve void",async () => {
            //creo un modello di test
            const testModel = "testModel";

            // Mock il metodo deleteReviewsOfProduct del DAO per restituire una Promise void, cioè undefined
            jest.spyOn(ReviewDAO.prototype, "deleteReviewsOfProduct").mockResolvedValueOnce(undefined);
        
            //creo il controller
            const controller = new ReviewController();

            // Aspettarsi che la chiamata a deleteReviewsOfProduct del controller venga eseguita correttamente
            const response = await controller.deleteReviewsOfProduct(testModel);

            // Aspettarsi che il metodo deleteReviewsOfProduct del DAO sia stato chiamato una volta con i parametri corretti
            expect(ReviewDAO.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.deleteReviewsOfProduct).toHaveBeenCalledWith(testModel);

            expect(response).toBe(undefined);
        });


        test("It should be reject with an error",async () => {
            //creo un modello di test
            const testModel = "testModel";

            // Mock il metodo deleteReviewsOfProduct del DAO per restituire un errore
            jest.spyOn(ReviewDAO.prototype, "deleteReviewsOfProduct").mockRejectedValueOnce(new Error("Delete is not successful"));
        
            //creo il controller
            const controller = new ReviewController();

            // Aspettarsi che la chiamata a deleteReviewsOfProduct del controller resituisca un errore
            await expect(controller.deleteReviewsOfProduct(testModel))
                .rejects.toThrow("Delete is not successful");

            // Aspettarsi che il metodo deleteReviewsOfProduct del DAO sia stato chiamato una volta con i parametri corretti
            expect(ReviewDAO.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.deleteReviewsOfProduct).toHaveBeenCalledWith(testModel);
        });
    });



    //----------------deleteAllReviews----------------------//
    describe("deleteAllReviews", () => {
        test("It should be resolve with undefined",async () => {
            
            //Mock per aspettarsi che il metodo della reviewDAO deleteAllReviews() venga eseguita correttamente
            jest.spyOn(ReviewDAO.prototype, "deleteAllReviews").mockResolvedValueOnce(undefined);

            //creo il controller
            const controller = new ReviewController();

            // Aspettarsi che la chiamata a deleteAllReviews del controller venga eseguita correttamente
            const response = await controller.deleteAllReviews();

            // Aspettarsi che il metodo deleteAllReviews del DAO sia stato chiamato una volta
            expect(ReviewDAO.prototype.deleteAllReviews).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.deleteAllReviews).toHaveBeenCalledWith();

            expect(response).toBe(undefined);
        });

        test("It should be reject with an error",async () => {
            //creo errore di test
            const errorTest = "Delete is not successful";
            
            //Mock per aspettarsi che il metodo della reviewDAO deleteAllReviews() restituisce un errore
            jest.spyOn(ReviewDAO.prototype, "deleteAllReviews").mockRejectedValueOnce(new Error(errorTest));

            //creo il controller
            const controller = new ReviewController();

            // Aspettarsi che la chiamata a deleteAllReviews del controller restituisce l'errore
            await expect(controller.deleteAllReviews())
                .rejects.toThrow(errorTest);

            // Aspettarsi che il metodo deleteAllReviews del DAO sia stato chiamato una volta
            expect(ReviewDAO.prototype.deleteAllReviews).toHaveBeenCalledTimes(1);
            expect(ReviewDAO.prototype.deleteAllReviews).toHaveBeenCalledWith();
        });
    });
});



afterEach(() => {
    jest.clearAllMocks(); // Ripristina tutti i mock dopo ogni test
});

afterAll(() => {
    jest.clearAllMocks();

})