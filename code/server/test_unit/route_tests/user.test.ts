import { test, expect, jest } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import UserController from "../../src/controllers/userController"
import { Role, User } from "../../src/components/user"
import Authenticator from "../../src/routers/auth"
import ErrorHandler from "../../src/helper"
import { cleanup } from "../../src/db/cleanup"
import { InvalidBirhdateError, UnauthorizedUserError, UserAlreadyExistsError, UserIsAdminError, UserNotFoundError } from "../../src/errors/userError"

jest.mock("../../src/controllers/userController")
jest.mock("../../src/routers/auth")

const baseURL = "/ezelectronics"

//Example of a unit test for the POST ezelectronics/users route
//The test checks if the route returns a 200 success code
//The test also expects the createUser method of the controller to be called once with the correct parameters

let testAdmin = new User("admin_username", "admin_name", "admin_surname", Role.ADMIN, "admin_address", "")
let testAdmin2 = new User("admin_username_2", "admin_name_2", "admin_surname_2", Role.ADMIN,"admin_address_2","")
let testCustomer = new User("customer_username", "customer_name", "customer_surname", Role.CUSTOMER, "customer_address", "")
let testCustomer2 = new User("customer_username_2","customer_name_2","customer_surname_2",Role.CUSTOMER,"","")
let testManager = new User("manager_username","manager_name","manager_surname_",Role.MANAGER,"","")
let emptyUsername = new User("", "name","surname",Role.ADMIN,"","")

test("It should return a 200 success code", async () => {
    const testUser = { //Define a test user object sent to the route
        username: "test",
        name: "test",
        surname: "test",
        password: "test",
        role: "Manager"
    }
    jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true) //Mock the createUser method of the controller
    const response = await request(app).post(baseURL + "/users").send(testUser) //Send a POST request to the route
    expect(response.status).toBe(200) //Check if the response status is 200
    expect(UserController.prototype.createUser).toHaveBeenCalledTimes(1) //Check if the createUser method has been called once
    //Check if the createUser method has been called with the correct parameters
    expect(UserController.prototype.createUser).toHaveBeenCalledWith(testUser.username,
        testUser.name,
        testUser.surname,
        testUser.password,
        testUser.role)
})

describe("Route unit tests", () => {

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetModules();
    });

    beforeEach( () => {
        cleanup();
    } )

    describe("POST /users", () => {
        
        test("It should return a 200 success code", async () => {
            const inputUser = { username: "test", name: "test", surname: "test", password: "test", role: "Manager" }

            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation(() => ({
                    isString: () => ({ isLength: () => ({}) }),
                    isIn: () => ({ isLength: () => ({}) }),
                })),
            }))
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })
            jest.spyOn(UserController.prototype, "createUser").mockResolvedValueOnce(true)

            const response = await request(app).post(baseURL + "/users").send(inputUser)
            expect(response.status).toBe(200)
            expect(UserController.prototype.createUser).toHaveBeenCalled()
            expect(UserController.prototype.createUser).toHaveBeenCalledWith(inputUser.username, inputUser.name, inputUser.surname, inputUser.password, inputUser.role)
        })

        // It should return a 409 error when username represents a user that is already in the database
        test("It should return a 409 error code when username is already in use", async () => {
            const inputUser = { username: "existingUser", name: "test", surname: "test", password: "test", role: "Manager" };
    
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();
            });
            jest.spyOn(UserController.prototype, "createUser").mockRejectedValueOnce(new UserAlreadyExistsError());
    
            const response = await request(app).post(baseURL + "/users").send(inputUser);
            expect(response.status).toBe(409);
        });

        //Errori di validazione sui parametri
        test("It should return a 422 error code when required fields are missing", async () => {
            const inputUser = { username: "", name: "", surname: "", password: "", role: "" };
    
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                req.errors = [{ msg: 'Username is required' }, { msg: 'Name is required' }, { msg: 'Surname is required' }, { msg: 'Password is required' }, { msg: 'Role must be one of Manager, Customer, Admin' }];
                res.status(422).json({ errors: req.errors });
            });
    
            const response = await request(app).post(baseURL + "/users").send(inputUser);
            expect(response.status).toBe(422);
            expect(response.body.errors.length).toBe(5);
        });
    })

    describe("GET /users", () => {

        //viene ritornata la lista utenti => 200
        test("It should return 200 success code", async () => {
            jest.spyOn(UserController.prototype, "getUsers").mockResolvedValueOnce([testAdmin, testCustomer])
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            })
            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => {
                return next();
            })
            const response = await request(app).get(baseURL + "/users")
            expect(response.status).toBe(200)
            expect(UserController.prototype.getUsers).toHaveBeenCalled()
            expect(response.body).toEqual([testAdmin, testCustomer])
        })

        
        test("It should return 401 if user is not admin", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            })
            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => {
                return res.status(401).json();
            })
            //By calling the route with this mocked dependency, we expect the route to return a 401 error code
            const response = await request(app).get(baseURL + "/users")
            expect(response.status).toBe(401)

            
        })

        test("It should return 401 if user is not logged in", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return res.status(401).json();
            })
            jest.spyOn(Authenticator.prototype, "isCustomer" || "isAdmin").mockImplementation((req, res, next) => {
                return res.status(401).json();
            })
            const response = await request(app).get(baseURL + "/users")
            expect(response.status).toBe(401)
        })
    }) 

    describe("GET /users/roles/:role", () => {

        test("It should return 200 success code", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            })
            jest.spyOn(UserController.prototype, "getUsersByRole").mockResolvedValueOnce([testAdmin])

            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => {
                return next();
            })
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation(() => ({
                    isString: () => ({ isLength: () => ({}) }),
                    isIn: () => ({ isLength: () => ({}) }),
                })),
            }))
            const response = await request(app).get(baseURL + "/users/roles/Admin")
            expect(response.status).toBe(200)
            expect(UserController.prototype.getUsersByRole).toHaveBeenCalled()
            expect(UserController.prototype.getUsersByRole).toHaveBeenCalledWith("Admin")
            expect(response.body).toEqual([testAdmin])
        })

        test("It should return 422 if role is invalid", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            })
            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => {
                return next();
            })
            jest.mock('express-validator', () => ({
                param: jest.fn().mockImplementation(() => {
                    throw new Error("Invalid value");
                }),
            }));
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return res.status(422).json({ error: "The parameters are not formatted properly\n\n" });
            })
            const response = await request(app).get(baseURL + "/users/roles/Invalid")
            expect(response.status).toBe(422)
        })

        test("It should return 401 if logged user is not admin", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            })
            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "User is not an admin", status: 401 })
            })         

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next();;
            })
            const response = await request(app).get(baseURL + "/users/roles/Customer")
            expect(response.status).toBe(401)
        })

    })
    
    describe("GET /users/:username", () => {
        
        describe("GET /users/:username", () => {
            // Se logga un admin e richiede i dati di un customer => 200
            test("It returns 200 if an admin requests the data of a customer", async () => {
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                    req.user = testAdmin; // L'autenticato è un admin
                    return next();
                });
                jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(testCustomer);
                const response = await request(app).get(baseURL + "/users/customer_username_2");
                expect(response.status).toBe(200);
                expect(response.body).toEqual(testCustomer);
                expect(UserController.prototype.getUserByUsername).toHaveBeenCalled();
                expect(UserController.prototype.getUserByUsername).toHaveBeenCalledWith(testAdmin, "customer_username_2");
            });
        
            // Se logga un customer e richiede i propri dati => 200
            test("It returns 200 if a customer requests their own data", async () => {
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                    req.user = testCustomer; // L'autenticato è un customer
                    return next();
                });
                jest.spyOn(UserController.prototype, "getUserByUsername").mockResolvedValueOnce(testCustomer);
                const response = await request(app).get(baseURL + "/users/customer_username");
                expect(response.status).toBe(200);
                expect(response.body).toEqual(testCustomer);
                expect(UserController.prototype.getUserByUsername).toHaveBeenCalled();
                expect(UserController.prototype.getUserByUsername).toHaveBeenCalledWith(testCustomer, "customer_username");
            });
        
            // Se logga un customer e richiede i dati di un altro utente => 401
            test("It returns 401 if a customer requests the data of another user", async () => {
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                    req.user = testCustomer; // L'autenticato è un customer
                    return next();
                });
                const response = await request(app).get(baseURL + "/users/another_username");
                expect(response.status).toBe(401);
            });
        
            // Se l'utente non esiste => 404
            test("It returns 404 if the user does not exist", async () => {
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                    req.user = testAdmin; // L'autenticato è un admin
                    return next();
                });
                jest.spyOn(UserController.prototype, "getUserByUsername").mockRejectedValueOnce(new UserNotFoundError());
                const response = await request(app).get(baseURL + "/users/non_existent_user");
                expect(response.status).toBe(404);
                expect(UserController.prototype.getUserByUsername).toHaveBeenCalled();
                expect(UserController.prototype.getUserByUsername).toHaveBeenCalledWith(testAdmin, "non_existent_user");
            });
        
            // username è una stringa vuota
           test("It returns 422 if the username is empty", async () => {
             jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
                 });

                jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                    return res.status(422).json({ error: "The parameters are not formatted properly\n\n" })
                });
                const response = await request(app).get(baseURL + "/users/empty");
                expect(response.status).toBe(422);
            });
        });
    }) 

   describe("DELETE /users/:username", () => {
        
        //Se logga un admin e cancella un customer => 200
        test("It returns 200 if the delete operation is successful", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testAdmin; //L'autenticato è un admin
                return next();
            })
            jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true)
            const response = await request(app).delete(baseURL + "/users/customer_username_2")
            expect(response.status).toBe(200)
            expect(UserController.prototype.deleteUser).toHaveBeenCalled()
            expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(testAdmin,testCustomer2.username)
        })

        //Se logga un admin e prova a cancellare un altro admin (non se stesso) => 401
        test("It returns 401 if admin tries to delete an other admin", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testAdmin; //L'autenticato è un admin
                return next();
            })
            jest.spyOn(UserController.prototype, "deleteUser").mockRejectedValueOnce(new UserIsAdminError())
            const response = await request(app).delete(baseURL + "/users/admin_username_2")
            expect(response.status).toBe(401)
            expect(UserController.prototype.deleteUser).toHaveBeenCalled()
            expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(testAdmin,testAdmin2.username)
        })

        //Se logga un customer e prova a cancellare non se stesso => 401
        test("It returns 401 if customer tries to delete an other user", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testCustomer; //L'autenticato è un customer
                return next();
            })
            jest.spyOn(UserController.prototype, "deleteUser").mockRejectedValueOnce(new UnauthorizedUserError())
            const response = await request(app).delete(baseURL + "/users/customer_username_2")
            expect(response.status).toBe(401)
            expect(UserController.prototype.deleteUser).toHaveBeenCalled()
            expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(testCustomer,testCustomer2.username)
        })

        //Se logga un customer e prova a cancellare se stesso => 200
        test("It returns 200 if customer tries to delete his account", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testCustomer; //L'autenticato è un customer
                return next();
            })
            jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true)
            const response = await request(app).delete(baseURL + "/users/customer_username")
            expect(response.status).toBe(200)
            expect(UserController.prototype.deleteUser).toHaveBeenCalled()
            expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(testCustomer,testCustomer.username)
        })

        //Se logga un admin e prova a cancellare se stesso => 200
        test("It returns 200 if admin try to delete his account", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testAdmin; //L'autenticato è un Admin
                return next();
            })
            jest.spyOn(UserController.prototype, "deleteUser").mockResolvedValueOnce(true)
            const response = await request(app).delete(baseURL + "/users/admin_username")
            expect(response.status).toBe(200)
            expect(UserController.prototype.deleteUser).toHaveBeenCalled()
            expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(testAdmin,testAdmin.username)
        })

        test("It returns 404 if admin tries to delete notExist user", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testAdmin; //L'autenticato è un admin
                return next();
            })
            jest.spyOn(UserController.prototype, "deleteUser").mockRejectedValueOnce(new UserNotFoundError())
            const response = await request(app).delete(baseURL + "/users/notExist")
            expect(response.status).toBe(404)
            expect(UserController.prototype.deleteUser).toHaveBeenCalled()
            expect(UserController.prototype.deleteUser).toHaveBeenCalledWith(testAdmin,"notExist")
        })

    })  

    describe("DELETE /users", () => {
        
        //Se logga un admin e cancella tutti gli utenti non admin => 200
        test("It returns 200 if the delete operation is successful", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            })
            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => {
                return next();
            })
            jest.spyOn(UserController.prototype, "deleteAll").mockResolvedValueOnce(true)
            const response = await request(app).delete(baseURL + "/users")
            expect(response.status).toBe(200)
            expect(UserController.prototype.deleteAll).toHaveBeenCalled()
            expect(UserController.prototype.deleteAll).toHaveBeenCalledWith()
        })

        //Se logga un non admin => 401
        test("It returns 401 if the user is not admin", async () => {
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                return next();
            })
            jest.spyOn(Authenticator.prototype, "isAdmin").mockImplementation((req, res, next) => {
                return res.status(401).json()
            })
            jest.spyOn(UserController.prototype, "deleteAll").mockResolvedValueOnce(true)
            const response = await request(app).delete(baseURL + "/users")
            expect(response.status).toBe(401)
        })
        
  });

  describe("PATCH /users/:username", () => {

    const newInfo = {name: "newName" , surname: "newSurname", address: "newAddress", birthdate: "1990-01-01"}

    const updatedUser = {username: testCustomer.username, name: "newName" , surname: "newSurname", role: Role.CUSTOMER, address: "newAddress", birthdate: "1990-01-01"}

    // Admins can update the information of customer user => 200
    test("It returns 200 if admin tries to update the details of customer user", async () => {

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            req.user = testAdmin; // L'autenticato è un admin
            return next();
        });

        jest.mock('express-validator', () => ({
            body: jest.fn().mockImplementation(() => ({
                notEmpty: jest.fn().mockReturnThis(),
                withMessage: jest.fn().mockReturnThis(),
                isIn: jest.fn().mockReturnThis(),
            })),
            validationResult: jest.fn((req) => ({
                isEmpty: jest.fn().mockReturnValue(true), 
                array: jest.fn().mockReturnValue([]), 
            }))
        })); 

        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        }); 

        jest.spyOn(UserController.prototype, "updateUserInfo").mockResolvedValueOnce(updatedUser);

        const response = await request(app).patch(baseURL + "/users/customer_username")
            .send({
                name: newInfo.name,
                surname: newInfo.surname,
                address: newInfo.address,
                birthdate: newInfo.birthdate,
            });
            expect(response.status).toBe(200)
            expect(UserController.prototype.updateUserInfo).toHaveBeenCalled()
            expect(UserController.prototype.updateUserInfo).toHaveBeenCalledWith(testAdmin, newInfo.name, newInfo.surname, newInfo.address, newInfo.birthdate, testCustomer.username)
            expect(response.body).toEqual({
                username: testCustomer.username,
                name: newInfo.name,
                surname: newInfo.surname,
                role: testCustomer.role,
                address: newInfo.address,
                birthdate: newInfo.birthdate,
            });
    });

    //Customer can update his account's details => 200
    test("It returns 200 if customer user tries to update his account's details", async () => {

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            req.user = testCustomer; // L'autenticato è customer
            return next();
        });

        jest.spyOn(UserController.prototype, "updateUserInfo").mockResolvedValueOnce(updatedUser);

        const response = await request(app).patch(baseURL + "/users/customer_username")
            .send({
                name: newInfo.name,
                surname: newInfo.surname,
                address: newInfo.address,
                birthdate: newInfo.birthdate,
            });
            expect(response.status).toBe(200)
            expect(UserController.prototype.updateUserInfo).toHaveBeenCalled()
            expect(UserController.prototype.updateUserInfo).toHaveBeenCalledWith(testCustomer, newInfo.name, newInfo.surname, newInfo.address, newInfo.birthdate, testCustomer.username)
            expect(response.body).toEqual({
                username: testCustomer.username,
                name: newInfo.name,
                surname: newInfo.surname,
                role: testCustomer.role,
                address: newInfo.address,
                birthdate: newInfo.birthdate,
            });
    })

    //customer cannot update other customer account => 401
    test("It returns 401 if customer tries to update details of others customers", async () => {

        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            req.user = testCustomer; // L'autenticato è customer
            return next();
        });

        jest.spyOn(UserController.prototype, "updateUserInfo").mockRejectedValueOnce(new UnauthorizedUserError);

        const response = await request(app).patch(baseURL + "/users/customer_username_2")
        .send({
            name: newInfo.name,
            surname: newInfo.surname,
            address: newInfo.address,
            birthdate: newInfo.birthdate,
        });
        expect(response.status).toBe(401)
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalled()
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalledWith(testCustomer, newInfo.name, newInfo.surname, newInfo.address, newInfo.birthdate, testCustomer2.username)

    })

    //Admin cannot update other admin account => 401
    test("It returns 401 if admin user tries to update details of others admin usersl", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            req.user = testAdmin; // L'autenticato è Admin
            return next();
        });
        jest.spyOn(UserController.prototype, "updateUserInfo").mockRejectedValueOnce(new UnauthorizedUserError);
        const response = await request(app).patch(baseURL + "/users/admin_username_2")
        .send({
            name: newInfo.name,
            surname: newInfo.surname,
            address: newInfo.address,
            birthdate: newInfo.birthdate,
        });
        expect(response.status).toBe(401)
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalled()
        expect(UserController.prototype.updateUserInfo).toHaveBeenCalledWith(testAdmin, newInfo.name, newInfo.surname, newInfo.address, newInfo.birthdate, testAdmin2.username)
    });

    //Errori di validazione
    test("It returns 422 for hanlder Error", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            req.user = { }; 
            return next();
        });
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return res.status(422).json({error: "The parameters are not formatted properly\n\n" })
        });
        const response = await request(app).patch(baseURL + "/users/admin_username_2")
        .send({
            name: newInfo.name,
            surname: newInfo.surname,
            address: newInfo.address,
            birthdate: newInfo.birthdate,
        });
        expect(response.status).toBe(422)
    });

    //Data invalida
    test("It returns 400 if date is invalid", async () => {
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            req.user = { }; 
            return next();
        });

        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next();
        });

        jest.spyOn(UserController.prototype, "updateUserInfo").mockRejectedValueOnce(new InvalidBirhdateError);
        const response = await request(app).patch(baseURL + "/users/customer_username")
        .send({
            name: newInfo.name,
            surname: newInfo.surname,
            address: newInfo.address,
            birthdate: newInfo.birthdate,
        });
        expect(response.status).toBe(400)
    });

   });

   //-------------AUTH ROUTE TEST-------------------//

   describe("POST /session", () => {

    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    const validCredentials = { username: "testuser", password: "testpassword" };

    jest.mock('express-validator', () => ({
        body: jest.fn().mockImplementation((field) => {
            if (field === 'username') {
                return {
                    notEmpty: jest.fn().mockReturnThis(),
                    withMessage: jest.fn().mockReturnThis()
                };
            }
            if (field === 'password') {
                return {
                    notEmpty: jest.fn().mockReturnThis(),
                    withMessage: jest.fn().mockReturnThis()
                };
            }
            return {};
        }),
        validationResult: jest.fn((req: any) => ({
            isEmpty: jest.fn().mockReturnValue(!req.errors || req.errors.length === 0),
            array: jest.fn().mockReturnValue(req.errors || [])
        }))
    }));

    //In login va a buon fine => 200
    test('It should returns 200 if user logged in with correct password', async () => {
        
        const loggedUser = {username: "loggedUsername", name: "loggedName", surname: "loggedSurname", role: Role.ADMIN};

        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            req.user = { };
            return next();
        });

        jest.spyOn(Authenticator.prototype, "login").mockResolvedValueOnce(loggedUser);
        const response = await request(app).post(baseURL + "/sessions/").send({ 
            username: validCredentials.username,
            password: validCredentials.password 
        });
        expect(response.status).toBe(200),
        expect(response.body).toEqual(loggedUser);
    });

    //username è vuoto
    test('It should returns 422 if username is empty', async () => {

        const loggedUser = {username: "loggedUsername", name: "loggedName", surname: "loggedSurname", role: Role.ADMIN, address: "buuh", birthdate:  "2020-01-01"};

        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return res.status(422).json()
        });

        jest.spyOn(Authenticator.prototype, "login").mockResolvedValueOnce(loggedUser);
        const response = await request(app).post(baseURL + "/sessions/").send({ 
            username: "",
            password: validCredentials.password 
        });
        expect(response.status).toBe(422)
    });

      //password è vuoto
      test('It should returns 422 if password is empty', async () => {

        const loggedUser = {username: "loggedUsername", name: "loggedName", surname: "loggedSurname", role: Role.ADMIN};

        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            
            return res.status(422).json()
        });

        jest.spyOn(Authenticator.prototype, "login").mockResolvedValueOnce(loggedUser);
        const response = await request(app).post(baseURL + "/sessions/").send({ 
            username: validCredentials.username,
            password: ""
        });
        expect(response.status).toBe(422)
    });

});

describe("DELETE /sessions/current", () => {

    // Se l'utente non è autenticato => 401
    test('It should return 401 if the user is not authenticated', async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
            return res.status(401).json();
        });
    
        const response = await request(app).delete(baseURL + '/sessions/current');
        expect(response.status).toBe(401);
    });

    // logout effettuato correttamente => 200
    test('It should returns 200 if user is authenticated', async () => {
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
            req.user = { };
            next();
        });
    
        jest.spyOn(Authenticator.prototype, 'logout').mockResolvedValueOnce(null);
    
        const response = await request(app).delete(baseURL + '/sessions/current');
        expect(response.status).toBe(200);
        expect(Authenticator.prototype.logout).toHaveBeenCalledTimes(1);
    });

}) 

describe("GET /sessions/current", () => {

    // se non è loggato 
    test('It should return 401 if user is not logged in', async () => {
        const mockUser = { username: 'testuser', name: 'Test', surname: 'User', role: 'Customer' };
     
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
            return res.status(401).json({ error: "Unauthenticated user", status: 401 })
        });

        const response = await request(app).get( baseURL + '/sessions/current')

        expect(response.status).toBe(401);
       
    });

      // è loggato ed accede alle informazioni => 200
      test('It should returns 200 if user is logged in', async () => {
        const loggedUser = { username: 'testuser', name: 'Test', surname: 'User', role: 'Customer' };
     
        jest.spyOn(Authenticator.prototype, 'isLoggedIn').mockImplementation((req, res, next) => {
            req.user = loggedUser;
            return next();
        });

        const response = await request(app).get( baseURL + '/sessions/current')

        expect(response.status).toBe(200);
        expect(response.body).toEqual(loggedUser);
    });

 });

});


    
      


