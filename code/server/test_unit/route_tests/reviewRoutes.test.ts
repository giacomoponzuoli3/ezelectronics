import { test, expect, jest, afterEach, beforeEach, describe } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import { validationResult } from 'express-validator'

import ReviewController from "../../src/controllers/reviewController"
import { Role } from "../../src/components/user"
import Authenticator from "../../src/routers/auth"
import { cleanup } from "../../src/db/cleanup"
import ErrorHandler from "../../src/helper"

//path di base
const routePath = "/ezelectronics"

//esempi di utenti sia Customer che Manager di test
const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: Role.CUSTOMER }
const manager = { username: "manager", name: "manager", surname: "manager", password: "manager", role: Role.MANAGER }

let customerCookie: string
let managerCookie: string

//creazione nuovo utente
const postUser = async (userInfo: any) => {
    await request(app)
        .post(`${routePath}/users`)
        .send(userInfo)
        .expect(200)
}

//login utente
const login = async (userInfo: any) => {
    return new Promise<string>((resolve, reject) => {
        request(app)
            .post(`${routePath}/sessions`)
            .send({username: userInfo.username, password: userInfo.password})
            .expect(200)
            .end((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res.header["set-cookie"][0])
            })
    })
}

//prima di ogni test viene creato ed inserito un Customer e Manager di test
beforeEach(async () => {
    //creazione customer
    await postUser(customer)
    customerCookie = await login(customer)

    //creazione manager
    await postUser(manager)
    managerCookie = await login(manager);
})

//dopo ogni test vado ad eliminare tutte le righe inserite nel db
afterEach(async () => {
    cleanup();
    jest.restoreAllMocks();
})

describe("Review Route", () => {
    //--------------- POST ezelectronics/reviews/:model -------------------//
    describe("POST ezelectronics/reviews/:model", () => {
        test('It should return 200 when review is successfully added', async () => {

            //definisco una review di test
            const reviewTest = {score: 5, comment: "A very cool smartphone!"};

            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            });

            // Mock di isCustomer
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });

            //Effettuo il mock del body e parametri
            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation((field) => {
                    if (field === 'score') {
                        return {
                            isInt: jest.fn().mockReturnValue({
                                withMessage: jest.fn().mockReturnValue({
                                    isLength: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    if (field === 'comment') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                }),
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            //We mock the 'addReview' method to return an undefined Promise, because we are not testing the ReviewController logic here (we assume it works correctly)
            jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValueOnce(undefined);
            
            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .post(routePath + "/reviews/modeltest")
                            .send(reviewTest)
                            .set("Cookie", customerCookie)
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(200);

            // Verifichiamo che il metodo 'addReview' sia stato chiamato con i parametri attesi
            expect(ReviewController.prototype.addReview).toHaveBeenCalledTimes(1);
            expect(ReviewController.prototype.addReview).toHaveBeenCalledWith(
                "modeltest",
                expect.objectContaining({
                    username: "customer",
                    role: customer.role,
                    name: customer.name,
                    surname: customer.surname,
                    address: null,
                    birthdate: null
                }),
                reviewTest.score,
                reviewTest.comment
            );
        });

        test('It should return 401 when the user is not logged',async () => {

            // Definisco una review di test valida
            const reviewTest = {score: 5, comment: "A very cool smartphone!"};

            // Effettuo i mock della validazione
            // Mock di isLoggedIn per simulare l'utente non autenticato
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { };
                return next();
            });

            // Mock di isCustomer per simulare il fallimento dell'autenticazione
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return res.status(401).send({ error: 'Unauthorized' });
            });

            // Mock per express-validator
            //Effettuo il mock del body e parametri
            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation((field) => {
                    if (field === 'score') {
                        return {
                            isInt: jest.fn().mockReturnValue({
                                withMessage: jest.fn().mockReturnValue({
                                    isLength: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    if (field === 'comment') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                }),
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))


            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .post(routePath + "/reviews/modeltest")
                            .send(reviewTest)

            // Verifichiamo che la risposta sia stata restituita con errore 401
            expect(response.status).toBe(401);
            
        });

        test('It should return 401 when the user is not customer',async () => {

            // Definisco una review di test valida
            const reviewTest = {score: 5, comment: "A very cool smartphone!"};

            // Effettuo i mock della validazione
            // Mock di isLoggedIn per simulare l'utente autenticato
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { role: manager.role, username: manager.username, name: manager.name, surname: manager.surname };
                return next();
            });

            // Mock di isCustomer per simulare il fallimento dell'autenticazione
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return res.status(401).send({ error: 'Unauthorized' });
            });

            // Mock per express-validator
            //Effettuo il mock del body e parametri
            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation((field) => {
                    if (field === 'score') {
                        return {
                            isInt: jest.fn().mockReturnValue({
                                withMessage: jest.fn().mockReturnValue({
                                    isLength: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    if (field === 'comment') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                }),
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))


            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .post(routePath + "/reviews/modeltest")
                            .send(reviewTest)
                            .set("Cookie", managerCookie); 

            // Verifichiamo che la risposta sia stata restituita con errore 401
            expect(response.status).toBe(401);
            
        });

        test('It should return 422 when score is not valid', async () => {
            // Definisco una review di test con score non valido
            const reviewTest = {score: 'invalid_score', comment: "A very cool smartphone!"};

            // Effettuo i mock della validazione
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
            
            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation((field) => {
                    if (field === 'score') {
                        return {
                            isInt: jest.fn().mockReturnValue({
                                withMessage: jest.fn().mockReturnValue({
                                    isLength: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    if (field === 'comment') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                }),
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }));

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    let error = "The parameters are not formatted properly\n\n";
                    errors.array().forEach((e) => {
                        error += `- Parameter: **${e.param}** - Reason: *${e.msg}* - Location: *${e.location}*\n\n`;
                    });
                    return res.status(422).json({ error: error });
                }
                return next();
            });

            jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValueOnce(undefined);
            
            const response = await request(app)
                            .post(routePath + "/reviews/modeltest")
                            .send(reviewTest)
                            .set("Cookie", customerCookie);

            expect(response.status).toBe(422);
        });

        test('It should return 422 when comment is empty', async () => {
            // Definisco una review di test con comment vuoto
            const reviewTest = {score: 5, comment: ""};

            // Effettuo i mock della validazione
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
            
            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation((field) => {
                    if (field === 'score') {
                        return {
                            isInt: jest.fn().mockReturnValue({
                                withMessage: jest.fn().mockReturnValue({
                                    isLength: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    if (field === 'comment') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                }),
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }));

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
            jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValueOnce(undefined);
            
            const response = await request(app)
                            .post(routePath + "/reviews/modeltest")
                            .send(reviewTest)
                            .set("Cookie", customerCookie);

            expect(response.status).toBe(422);
        });

        test('It should return 422 when the param model is empty', async () => {
            // Definisco una review di test con comment vuoto
            const reviewTest = {score: 5, comment: "prova"};

            // Effettuo i mock della validazione
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());
            
            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation((field) => {
                    if (field === 'score') {
                        return {
                            isInt: jest.fn().mockReturnValue({
                                withMessage: jest.fn().mockReturnValue({
                                    isLength: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    if (field === 'comment') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                }),
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }));

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());
            jest.spyOn(ReviewController.prototype, "addReview").mockResolvedValueOnce(undefined);
            
            const response = await request(app)
                            .post(routePath + "/reviews/")
                            .send(reviewTest)
                            .set("Cookie", customerCookie);

            expect(response.status).toBe(422);
        });

        test('It should return error because the controller is failed 503', async () => {
            // Definisco una review di test valida
            const reviewTest = {score: 5, comment: "A very cool smartphone!"};

            // Effettuo i mock della validazione e dell'autenticazione
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => next());
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => next());

            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation((field) => {
                    if (field === 'score') {
                        return {
                            isInt: jest.fn().mockReturnValue({
                                withMessage: jest.fn().mockReturnValue({
                                    isLength: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    if (field === 'comment') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                }),
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }));

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => next());

            // Mock della funzione addReview che lancia un errore
            const errorMessage = 'Error adding review';
            jest.spyOn(ReviewController.prototype, "addReview").mockRejectedValueOnce(new Error("Error db"));

            // Effettuiamo la chiamata alla route
            const response = await request(app)
                .post(routePath + "/reviews/modeltest")
                .send(reviewTest)
                .set("Cookie", customerCookie);
            //Verifico che la route restituisca errore di database (codice di stato 503)
            expect(response.status).toBe(503);
            
        });

    });

    //--------------- GET ezelectronics/reviews/:model -------------------//
    describe("GET ezelectronics/reviews/:model", () => {
        test('It should return 200', async () => {
            // Definisco un vettore di recensioni di test
            const reviewsTest = [
                { model: "modeltest", user: "user1", score: 5, date: "2024-05-01", comment: "A very cool smartphone!" },
                { model: "modeltest", user: "user2", score: 5, date: "2024-05-20", comment: "Great phone, but battery life could be better." }
            ];
            
            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            });

            // Mock di isCustomer
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });

            //Effettuo il mock del parametro
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            //We mock the 'getProductReviews' method to return an undefined Promise, because we are not testing the ReviewController logic here (we assume it works correctly)
            jest.spyOn(ReviewController.prototype, "getProductReviews").mockResolvedValueOnce(reviewsTest);
            
            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .get(routePath + "/reviews/modeltest")
                            .set("Cookie", customerCookie)
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(200);

            // Verifichiamo che il metodo 'addReview' sia stato chiamato con i parametri attesi
            expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledTimes(1);
            expect(ReviewController.prototype.getProductReviews).toHaveBeenCalledWith("modeltest");
        });

        test('It should return 401 when the user is not logged', async () => {
            // Definisco un vettore di recensioni di test
            const reviewsTest = [
                { model: "modeltest", user: "user1", score: 5, date: "2024-05-01", comment: "A very cool smartphone!" },
                { model: "modeltest", user: "user2", score: 5, date: "2024-05-20", comment: "Great phone, but battery life could be better." }
            ];
            
            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { };
                return next();
            });

            //Effettuo il mock del parametro
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .get(routePath + "/reviews/modeltest")
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(401);

        });

        test('It should return error because the controller is failed - 503', async () => {

            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            });

            // Mock di isCustomer
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });

            //Effettuo il mock del parametro
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            //We mock the 'getProductReviews' method to return an undefined Promise, because we are not testing the ReviewController logic here (we assume it works correctly)
            jest.spyOn(ReviewController.prototype, "getProductReviews").mockRejectedValueOnce(new Error("Database error"));
            
            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .get(routePath + "/reviews/modeltest")
                            .set("Cookie", customerCookie)
            // Verifichiamo che la risposta sia stata restituita con errore di database (codice di stato 503)
            expect(response.status).toBe(503);

        });
    });

    //--------------- DELETE ezelectronics/reviews/:model -------------------//
    describe("DELETE ezelectronics/reviews/:model", () => {
        test("It should return 200 when the user has deleted the review for a specific product",async () => {
            //definisco il modello della review di test
            const model = "modeltest";

            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            });

            // Mock di isCustomer
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });

            //Effettuo il mock del body e parametri
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            //We mock the 'deleteReview' method to return an undefined Promise, because we are not testing the ReviewController logic here (we assume it works correctly)
            jest.spyOn(ReviewController.prototype, "deleteReview").mockResolvedValueOnce(undefined);
            
            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .delete(routePath + "/reviews/modeltest")
                            .set("Cookie", customerCookie)
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(200);

            // Verifichiamo che il metodo 'addReview' sia stato chiamato con i parametri attesi
            expect(ReviewController.prototype.deleteReview).toHaveBeenCalledTimes(1);
            expect(ReviewController.prototype.deleteReview).toHaveBeenCalledWith(
                model,
                expect.objectContaining({
                    username: "customer",
                    role: customer.role,
                    name: customer.name,
                    surname: customer.surname,
                    address: null,
                    birthdate: null
                })
            );
        });

        test('It should return 401 when the user is not logged', async () => {
            // Definisco un modello di test
            const model = "modeltest";
            
            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { };
                return next();
            });

            // Mock di isCustomer per simulare il fallimento dell'autenticazione
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return res.status(401).send({ error: 'Unauthorized' });
            });

            //Effettuo il mock del parametro
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .delete(routePath + "/reviews/modeltest")
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(401);

        });


        test('It should return 401 when the user is logged but it isn\'t a Customer', async () => {
            // Definisco un modello di test
            const model = "modeltest";
            
            //Effettuo i mock della validazione
            // Mock di isLoggedIn per simulare l'utente autenticato
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { role: manager.role, username: manager.username, name: manager.name, surname: manager.surname };
                return next();
            });

            // Mock di isCustomer per simulare il fallimento dell'autenticazione
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return res.status(401).send({ error: 'Unauthorized' });
            });

            //Effettuo il mock del parametro
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .delete(routePath + "/reviews/modeltest")
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(401);

        });


        test('It should return error because the controller is failed - Error 503', async () => {
            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            });

            // Mock di isCustomer
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });

            //Effettuo il mock del body e parametri
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            //We mock the 'deleteReview' method to return an undefined Promise, because we are not testing the ReviewController logic here (we assume it works correctly)
            jest.spyOn(ReviewController.prototype, "deleteReview").mockRejectedValueOnce(new Error("Error database"));
            
            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .delete(routePath + "/reviews/modeltest")
                            .set("Cookie", customerCookie)
            // Verifichiamo che la risposta sia stata restituita con errore (codice di stato 503)
            expect(response.status).toBe(503);

        });
    });

    //--------------- DELETE ezelectronics/reviews/:model/all -------------------//
    describe("DELETE ezelectronics/reviews/:model/all", () => {
        test("It should return 200 when the admin or Manager have deleted all reviews of a specific product",async () => {
            //definisco il modello della review di test
            const model = "modeltest";

            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            });

            // Mock di isAdminOrManager
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            });

            //Effettuo il mock del body e parametri
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            //We mock the 'deleteReviewsOfProduct' method to return an undefined Promise, because we are not testing the ReviewController logic here (we assume it works correctly)
            jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockResolvedValueOnce(undefined);
            
            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .delete(routePath + "/reviews/modeltest/all")
                            .set("Cookie", managerCookie)
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(200);

            // Verifichiamo che il metodo 'addReview' sia stato chiamato con i parametri attesi
            expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledTimes(1);
            expect(ReviewController.prototype.deleteReviewsOfProduct).toHaveBeenCalledWith( model );
        });

        test('It should return 401 when the user is not logged', async () => {
            // Definisco un modello di test
            const model = "modeltest";
            
            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { };
                return next();
            });

            // Mock di isAdminOrManager per simulare il fallimento dell'autenticazione
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).send({ error: 'Unauthorized' });
            });

            //Effettuo il mock del parametro
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .delete(routePath + "/reviews/modeltest/all")
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(401);

        });

        test('It should return 401 when the user is logged but he is a Customer', async () => {
            // Definisco un modello di test
            const model = "modeltest";
            
            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { role: customer.role, username: customer.username, name: customer.name, surname: customer.surname };
                return next();
            });

            // Mock di isAdminOrManager per simulare il fallimento dell'autenticazione
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).send({ error: 'Unauthorized' });
            });

            //Effettuo il mock del parametro
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .delete(routePath + "/reviews/modeltest/all")
                            .set("Cookie", customerCookie)
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(401);

        });

        test('It should return error because the controller is failed', async () => {
            //definisco il modello della review di test
            const model = "modeltest";

            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            });

            // Mock di isAdminOrManager
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            });

            //Effettuo il mock del body e parametri
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation((field) => {
                    if (field === 'model') {
                        return {
                            isString: jest.fn().mockReturnValue({
                                notEmpty: jest.fn().mockReturnValue({
                                    withMessage: jest.fn().mockReturnValue({})
                                })
                            })
                        };
                    }
                    return {};
                })
            }))

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            //We mock the 'deleteReviewsOfProduct' method to return an undefined Promise, because we are not testing the ReviewController logic here (we assume it works correctly)
            jest.spyOn(ReviewController.prototype, "deleteReviewsOfProduct").mockRejectedValueOnce(new Error("Error database"));
            
            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .delete(routePath + "/reviews/modeltest/all")
                            .set("Cookie", managerCookie)
            // Verifichiamo che la risposta sia stata restituita con errore di database (codice di stato 503)
            expect(response.status).toBe(503);
        });

    });

    //--------------- DELETE ezelectronics/reviews -------------------//
    describe("DELETE ezelectronics/reviews", () => {
        test("It should return 200 when the admin or Manager have deleted all reviews from database",async () => {
            //definisco il modello della review di test
            const model = "modeltest";

            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { role: manager.role, username: manager.username, name: manager.name, surname: manager.surname };
                return next();
            });

            // Mock di isAdminOrManager
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            });

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            //We mock the 'deleteAllReviews' method to return an undefined Promise, because we are not testing the ReviewController logic here (we assume it works correctly)
            jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValueOnce(undefined);
            
            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .delete(routePath + "/reviews")
                            .set("Cookie", managerCookie)
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(200);

            // Verifichiamo che il metodo 'addReview' sia stato chiamato con i parametri attesi
            expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalledTimes(1);
            expect(ReviewController.prototype.deleteAllReviews).toHaveBeenCalledWith();
        });

        test("It should return 401 when the user is not logged",async () => {
            //definisco il modello della review di test
            const model = "modeltest";

            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { };
                return next();
            });

            // Mock di isAdminOrManager per simulare il fallimento dell'autenticazione
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).send({ error: 'Unauthorized' });
            });


            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            //We mock the 'deleteAllReviews' method to return an undefined Promise, because we are not testing the ReviewController logic here (we assume it works correctly)
            jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValueOnce(undefined);
            
            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .delete(routePath + "/reviews")
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(401);
        });

        test("It should return 401 when the user is logged but he is a Customer",async () => {
            //definisco il modello della review di test
            const model = "modeltest";

            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { role: customer.role, username: customer.username, name: customer.name, surname: customer.surname };
                return next();
            });

            // Mock di isAdminOrManager per simulare il fallimento dell'autenticazione
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return res.status(401).send({ error: 'Unauthorized' });
            });

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            //We mock the 'deleteAllReviews' method to return an undefined Promise, because we are not testing the ReviewController logic here (we assume it works correctly)
            jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockResolvedValueOnce(undefined);
            
            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .delete(routePath + "/reviews")
                            .set("Cookie", customerCookie)
            // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
            expect(response.status).toBe(401);
        });

        test('It should return error because the controller is failed', async () => {
            //Effettuo i mock della validazione
            // Mock di isLoggedIn
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = { role: manager.role, username: manager.username, name: manager.name, surname: manager.surname };
                return next();
            });

            // Mock di isAdminOrManager
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            });

            //Effettuo il mock dell'ErrorHandler
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            });

            //We mock the 'deleteAllReviews' method to return an undefined Promise, because we are not testing the ReviewController logic here (we assume it works correctly)
            jest.spyOn(ReviewController.prototype, "deleteAllReviews").mockRejectedValueOnce(new Error("Error database"));
            
            // Effettuiamo la chiamata alla route
            const response = await request(app)
                            .delete(routePath + "/reviews")
                            .set("Cookie", managerCookie)
            // Verifichiamo che la risposta sia stata restituita con errore di database (codice di stato 503)
            expect(response.status).toBe(503);
        });
    });
});