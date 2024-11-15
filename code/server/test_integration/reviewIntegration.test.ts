import { describe, test, expect, jest, afterAll, beforeAll} from "@jest/globals"
import request from 'supertest'
import { app } from "../index"
import db from "../src/db/db"
import { Role } from "../src/components/user"

import UserDAO from "../src/dao/userDAO"
import CartDAO from "../src/dao/cartDAO"
import ProductDAO from "../src/dao/productDAO"
import { cleanup } from '../src/db/cleanup'; // Import the cleanup function
import ReviewDAO from "../src/dao/reviewDAO"
import exp from "constants"

const productDao = new ProductDAO
const cartDao = new CartDAO
const userDao = new UserDAO
const reviewDAO = new ReviewDAO

const baseURL = "/ezelectronics"


async function createUsers() {
    await userDao.createUser("customer1", "test", "test", "test", "Customer")
    await userDao.createUser("admin", "test", "test", "test", "Admin")
    await userDao.createUser("manager", "test", "test", "test", "Manager")
    await userDao.createUser("customer2", "test", "test", "test", "Customer")
}

//creazione prodotti
async function createProducts() {
    await productDao.registerProducts("model1", "Smartphone", "2024-06-04", 100, 1000, "It is a test details ");
    await productDao.registerProducts("model2", "Laptop", "2024-06-04", 300, 1000, "It is a test details ");
    await productDao.registerProducts("model3", "Laptop", "2024-06-04", 250, 1000, "It is a test details ");
    await productDao.registerProducts("model4", "Smartphone", "2024-06-04", 200, 1000, "It is a test details ");
    await productDao.registerProducts("model5", "Appliance", "2024-06-04", 40, 1000, "It is a test details ");
    await productDao.registerProducts("model6", "Smartphone", "2024-06-04", 200, 1000, "It is a test details ");
    await productDao.registerProducts("model7", "Smartphone", "2024-06-04", 30, 1000, "It is a test details ");
}

//pago il carrello del customer1
async function payCart(){
    await cartDao.checkoutCart("customer1");
}


describe("Integration test of review", () => {

    beforeAll(async () => {
        await cleanup()
    });

    describe("Integration of POST ezelectronics/reviews/:model", () =>{
        test("add Review - OK", async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            //customerCookie = await login(customer)
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            
            //creo prodotti di test
            await createProducts();

            const sessionID = userResponse.headers['set-cookie'];
        
            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model1"});

            //pago il carrello
            await payCart();

            //definisco una review di test
            const reviewTest = {score: 5, comment: "A very cool smartphone!"};
        
            //insert a review of model1
            const response = await request(app)
                                    .post(baseURL + "/reviews/model1")
                                    .send(reviewTest)
                                    .set("Cookie", sessionID)
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(200);

        }, 100000);

        test("add review - already existing review (409)",async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            //customerCookie = await login(customer)
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            
            //creo prodotti di test
            await createProducts();

            const sessionID = userResponse.headers['set-cookie'];
            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model1"});
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model2"});

            //pago il carrello
            await payCart();
            
            //aggiungo una review al prodotto model1
            await reviewDAO.addReview("customer1", "model1", 4, "Comment test");
            
            //definisco una review di test
            const reviewTest = {score: 5, comment: "A very cool smartphone!"};

            //insert a review of model1
            const response = await request(app)
                                    .post(baseURL + "/reviews/model1")
                                    .set("Cookie", sessionID)
                                    .send(reviewTest)
            // Verifichiamo che la risposta sia stata restituita con errore (codice di stato 409)
            expect(response.status).toBe(409);

        }, 100000);

        test("add review - insert an error of score (422)",async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            //customerCookie = await login(customer)
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            
            
            //creo prodotti di test
            await createProducts();

            const sessionID = userResponse.headers['set-cookie'];

            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model1"});
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model2"});
            //pago il carrello
            await payCart();

            //definisco una review di test
            const reviewTest = {score: "a", comment: "A very cool smartphone!"};
        
            //insert a review of model1
            const response = await request(app)
                                    .post(baseURL + "/reviews/model1")
                                    .send(reviewTest)
                                    .set("Cookie", sessionID)
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(422);

        }, 100000);

        test("add review - insert an empty string of comment (422)",async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            //customerCookie = await login(customer)
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            
            
            //creo prodotti di test
            await createProducts();
            
            const sessionID = userResponse.headers['set-cookie'];

            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model1"});
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model2"});

            //pago il carrello
            await payCart();

            //definisco una review di test
            const reviewTest = {score: 5, comment: ""};
        
            //insert a review of model1
            const response = await request(app)
                                    .post(baseURL + "/reviews/model1")
                                    .send(reviewTest)
                                    .set("Cookie", sessionID)
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(422);

        }, 10000);

        test("add review - error of Unexisting product (404)",async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            //customerCookie = await login(customer)
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            const sessionID = userResponse.headers['set-cookie'];

            //creo prodotti di test
            await createProducts();
            
            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`).send({model: "model1"}).set("Cookie", sessionID);
            await request(app).post(`${baseURL}/carts`).send({model: "model2"}).set("Cookie", sessionID);

            //pago il carrello
            await payCart();

            //definisco una review di test
            const reviewTest = {score: 3, comment: "A very cool smartphone!"};
        
            //insert a review of model1
            const response = await request(app)
                                    .post(baseURL + "/reviews/unexistingModel")
                                    .send(reviewTest)
                                    .set("Cookie", sessionID)
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(404);

        }, 100000);
    });
    

    describe("Integration of GET ezelectronics/reviews/:model", () => {
        test("get reviews of a product - OK",async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            
            //creo prodotti di test
            await createProducts();

            const sessionID = userResponse.headers['set-cookie'];

            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model1"});
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model2"});

            //pago il carrello
            await payCart();
            
            //aggiungo una review al prodotto model1
            await reviewDAO.addReview("customer1", "model1", 4, "Comment test");
            
            const response = await request(app).get(`${baseURL}/reviews/model1`)
                                                .set("Cookie", sessionID);
            expect(response.status).toBe(200);
        });

        test("get reviews of a product without reviews - OK",async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            
            //creo prodotti di test
            await createProducts();

            const sessionID = userResponse.headers['set-cookie'];

            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model1"});
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model2"});

            //pago il carrello
            await payCart();
            
            //aggiungo una review al prodotto model1
            await reviewDAO.addReview("customer1", "model1", 4, "Comment test");
            
            const response = await request(app).get(`${baseURL}/reviews/model6`)
                                                .set("Cookie", sessionID);
            expect(response.status).toBe(200);
        });

    });


    describe("Integration of DELETE ezelectronics/reviews/:model", () => {
        test("Delete reviews of a product by the current user - OK",async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            
            //creo prodotti di test
            await createProducts();

            const sessionID = userResponse.headers['set-cookie'];

            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model1"});
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model2"});

            //pago il carrello
            await payCart();
            
            //aggiungo una review al prodotto model1
            await reviewDAO.addReview("customer1", "model1", 4, "Comment test");
            
            //elimino la review
            const response = await request(app).delete(`${baseURL}/reviews/model1`)
                                    .set("Cookie", sessionID);
            expect(response.status).toBe(200);

        });

        test("Delete a review of a product that doesn't exist - 404",async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            
            //creo prodotti di test
            await createProducts();

            const sessionID = userResponse.headers['set-cookie'];

            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model1"});
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model2"});

            //pago il carrello
            await payCart();
            
            //elimino la review
            const response = await request(app).delete(`${baseURL}/reviews/model11`)
                                    .set("Cookie", sessionID);
            expect(response.status).toBe(404);
        });

        test("Delete a review of a product that the user hasn't review - 404",async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            
            //creo prodotti di test
            await createProducts();

            const sessionID = userResponse.headers['set-cookie'];

            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model1"});
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model2"});

            //pago il carrello
            await payCart();
            
            //elimino la review
            const response = await request(app).delete(`${baseURL}/reviews/model1`)
                                    .set("Cookie", sessionID);
            expect(response.status).toBe(404);
        });
    });

    describe("Integration of DELETE ezelectronics/reviews/:model/all", () => {
        test("Delete all reviews of a specific product from database - OK",async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            
            //creo prodotti di test
            await createProducts();

            const sessionID = userResponse.headers['set-cookie'];

            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model1"});
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model2"});

            //pago il carrello
            await payCart();
            
            //aggiungo una review al prodotto model1
            await reviewDAO.addReview("customer1", "model1", 4, "Comment test");
            
            //entro come manager
            const managerResponse = await request(app).post(`${baseURL}/sessions`).send({username: "manager", password: "test"});
            const managerSessionID = managerResponse.headers['set-cookie'];

            const response = await request(app).delete(`${baseURL}/reviews/model1/all`)
                                                .set("Cookie", managerSessionID);
            expect(response.status).toBe(200);

        });

        test("Delete nothing reviews of a specific product because the db is empty - 404 ",async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            
            //creo prodotti di test
            await createProducts();

            const sessionID = userResponse.headers['set-cookie'];

            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model1"});
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model2"});

            //pago il carrello
            await payCart();
            
            //entro come manager
            const managerResponse = await request(app).post(`${baseURL}/sessions`).send({username: "manager", password: "test"});
            const managerSessionID = managerResponse.headers['set-cookie'];

            const response = await request(app).delete(`${baseURL}/reviews/model1/all`)
                                                .set("Cookie", managerSessionID);
            expect(response.status).toBe(404);
        });
    });

    describe("Integration of DELETE ezelectronics/reviews", () => {
        test("Delete all reviews from database - OK",async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            
            //creo prodotti di test
            await createProducts();

            const sessionID = userResponse.headers['set-cookie'];

            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model1"});
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model2"});

            //pago il carrello
            await payCart();
            
            //aggiungo una review al prodotto model1
            await reviewDAO.addReview("customer1", "model1", 4, "Comment test");
            
            //entro come manager
            const managerResponse = await request(app).post(`${baseURL}/sessions`).send({username: "manager", password: "test"});
            const managerSessionID = managerResponse.headers['set-cookie'];

            const response = await request(app).delete(`${baseURL}/reviews`)
                                                .set("Cookie", managerSessionID);
            expect(response.status).toBe(200);

        });

        test("Delete nothing review because the db is empty - 404 ",async () => {
            //cancello tutto ciò che è dentro al db
            await cleanup();

            //creazione customers
            await createUsers();
            
            const userResponse = await request(app).post(`${baseURL}/sessions`).send({username: "customer1", password: "test"});
            
            //creo prodotti di test
            await createProducts();

            const sessionID = userResponse.headers['set-cookie'];

            //aggiungo prodotti nel carrello del customer1
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model1"});
            await request(app).post(`${baseURL}/carts`)
                                .set("Cookie", sessionID)
                                .send({model: "model2"});

            //pago il carrello
            await payCart();
            
            //entro come manager
            const managerResponse = await request(app).post(`${baseURL}/sessions`).send({username: "manager", password: "test"});
            const managerSessionID = managerResponse.headers['set-cookie'];

            const response = await request(app).delete(`${baseURL}/reviews`)
                                                .set("Cookie", managerSessionID);
            expect(response.status).toBe(200);
        });
    });
    
});


afterAll(() => {
    jest.clearAllMocks();
    cleanup();
})