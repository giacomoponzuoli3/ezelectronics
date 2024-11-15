import {
  test,
  expect,
  jest,
  afterEach,
  beforeEach,
  describe,
} from "@jest/globals";
import request from "supertest";
import { app } from "../../index";
import { validationResult } from "express-validator";

import ProductController from "../../src/controllers/productController";
import { Role } from "../../src/components/user";
import Authenticator from "../../src/routers/auth";
import { cleanup } from "../../src/db/cleanup";
import ErrorHandler from "../../src/helper";
import { Category } from "../../src/components/product";
import { InvalidCategoryError, InvalidDateError } from "../../src/errors/productError";

//base path
const routePath = "/ezelectronics";

//example users

const customer = {
  username: "customer",
  name: "customer",
  surname: "customer",
  password: "customer",
  role: Role.CUSTOMER,
};

const manager = {
  username: "manager",
  name: "manager",
  surname: "manager",
  password: "manager",
  role: Role.MANAGER,
};

const admin = {
  username: "admin",
  name: "admin",
  surname: "adimin",
  password: "admin",
  role: Role.ADMIN,
};

let customerCookie: string;
let managerCookie: string;
let adminCookie: string;

// new users creation
const postUser = async (userInfo: any) => {
  await request(app).post(`${routePath}/users`).send(userInfo).expect(200);
};

//login 
const login = async (userInfo: any) => {
  return new Promise<string>((resolve, reject) => {
    request(app)
      .post(`${routePath}/sessions`)
      .send({ username: userInfo.username, password: userInfo.password })
      .expect(200)
      .end((err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.header["set-cookie"][0]);
      });
  });
};

beforeEach(async () => {
  
  await postUser(customer);
  customerCookie = await login(customer);

  
  await postUser(manager);
  managerCookie = await login(manager);

  
  await postUser(admin);
  adminCookie = await login(admin);

});


afterEach(async () => {
  cleanup();
  jest.restoreAllMocks();
});

describe("Product route tests", () => {

  //----POST ezelectronics/products/-------//
  describe("POST /ezelectronics/products/", () => {
    test("Should return 200 if model is valid -manager", async () => {
      const testProduct = {
        //define a test product object
        model: "modelTest",
        category: Category.SMARTPHONE,
        quantity: 3,
        details: "modelDetails",
        sellingPrice: 3,
        arrivalDate: "2021-10-10",
      };

      
      //isLoggedIn Mock
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // isAdminOrManager mock
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          return next();
        });

      jest.mock("express-validator", () => ({
        body: jest.fn().mockImplementation((field) => {
          switch (field) {
            case "model":
              return {
                isString: jest.fn().mockReturnValue({
                  notEmpty: jest.fn().mockReturnValue({}),
                }),
              };
            case "category":
              return {
                isString: jest.fn().mockReturnValue({
                  isIn: jest.fn().mockImplementation((value) => {
                    if (
                      ["Smartphone", "Laptop", "Appliance"].includes(
                        value as string
                      )
                    ) {
                      return {
                        withMessage: jest.fn().mockReturnValue({}),
                      };
                    } else {
                      throw new Error("Invalid value");
                    }
                  }),
                }),
              };
            case "quantity":
              return {
                isInt: jest.fn().mockReturnValue({}),
              };
            case "details":
              return {
                isString: jest.fn().mockReturnValue({
                  optional: jest.fn().mockReturnValue({}),
                }),
              };
            case "sellingPrice":
              return {
                isFloat: jest.fn().mockReturnValue({}),
              };
            case "arrivalDate":
              return {
                optional: jest.fn().mockReturnValue({
                  isISO8601: jest.fn().mockReturnValue({
                    custom: jest.fn().mockReturnValue({}),
                  }),
                }),
              };
            default:
              return {};
          }
        }),
      }));

      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });

      jest
        .spyOn(ProductController.prototype, "registerProducts")
        .mockResolvedValueOnce(true);

      // Call the route
      const response = await request(app)
        .post(routePath + "/products/")
        .send(testProduct)
        .set("Cookie", managerCookie);

      
      expect(response.status).toBe(200);

      
      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(1);
      expect(ProductController.prototype.registerProducts).toHaveBeenCalledWith(
        testProduct.model,
        testProduct.category,
        testProduct.quantity,
        testProduct.details,
        testProduct.sellingPrice,
        testProduct.arrivalDate
      );
    });

    //----test admin---//
    test("Should return 200 if model is valid -admin", async () => {
      const testProduct = {
        
        model: "modelTest",
        category: Category.SMARTPHONE,
        quantity: 3,
        details: "modelDetails",
        sellingPrice: 3,
        arrivalDate: "2021-10-10",
      };

      
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });

      
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          return next();
        });

      jest.mock("express-validator", () => ({
        body: jest.fn().mockImplementation((field) => {
          switch (field) {
            case "model":
              return {
                isString: jest.fn().mockReturnValue({
                  notEmpty: jest.fn().mockReturnValue({}),
                }),
              };
            case "category":
              return {
                isString: jest.fn().mockReturnValue({
                  isIn: jest.fn().mockImplementation((value) => {
                    if (
                      ["Smartphone", "Laptop", "Appliance"].includes(
                        value as string
                      )
                    ) {
                      return {
                        withMessage: jest.fn().mockReturnValue({}),
                      };
                    } else {
                      throw new Error("Invalid value");
                    }
                  }),
                }),
              };
            case "quantity":
              return {
                isInt: jest.fn().mockReturnValue({}),
              };
            case "details":
              return {
                isString: jest.fn().mockReturnValue({
                  optional: jest.fn().mockReturnValue({}),
                }),
              };
            case "sellingPrice":
              return {
                isFloat: jest.fn().mockReturnValue({}),
              };
            case "arrivalDate":
              return {
                optional: jest.fn().mockReturnValue({
                  isISO8601: jest.fn().mockReturnValue({
                    custom: jest.fn().mockReturnValue({}),
                  }),
                }),
              };
            default:
              return {};
          }
        }),
      }));

      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });

      jest
        .spyOn(ProductController.prototype, "registerProducts")
        .mockResolvedValueOnce(true);

      // Call the route
      const response = await request(app)
        .post(routePath + "/products/")
        .send(testProduct)
        .set("Cookie", adminCookie);

      
      expect(response.status).toBe(200);

      
      expect(
        ProductController.prototype.registerProducts
      ).toHaveBeenCalledTimes(1);
      expect(ProductController.prototype.registerProducts).toHaveBeenCalledWith(
        testProduct.model,
        testProduct.category,
        testProduct.quantity,
        testProduct.details,
        testProduct.sellingPrice,
        testProduct.arrivalDate
      );
    });

    test("Should return 401 if user is not logged", async () => {
      const testProduct = {
        //definisco un oggetto di product di test
        model: "modelTest",
        category: Category.SMARTPHONE,
        quantity: 3,
        details: "modelDetails",
        sellingPrice: 3,
        arrivalDate: "2021-10-10",
      };

      // Effettuo i mock della validazione
      // Mock di isLoggedIn per simulare l'utente non autenticato
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          req.user = null;
          return res.status(401).send({ error: "Unauthenticated user" });
        });

      // Mock di isManager per simulare il fallimento dell'autenticazione
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = null;
          return next();
        });

      //Mock per express-validator

      jest.mock("express-validator", () => ({
        body: jest.fn().mockImplementation((field) => {
          switch (field) {
            case "model":
              return {
                isString: jest.fn().mockReturnValue({
                  notEmpty: jest.fn().mockReturnValue({}),
                }),
              };
            case "category":
              return {
                isString: jest.fn().mockReturnValue({
                  isIn: jest.fn().mockImplementation((value) => {
                    if (
                      ["Smartphone", "Laptop", "Appliance"].includes(
                        value as string
                      )
                    ) {
                      return {
                        withMessage: jest.fn().mockReturnValue({}),
                      };
                    } else {
                      throw new Error("Invalid value");
                    }
                  }),
                }),
              };
            case "quantity":
              return {
                isInt: jest.fn().mockReturnValue({}),
              };
            case "details":
              return {
                isString: jest.fn().mockReturnValue({
                  optional: jest.fn().mockReturnValue({}),
                }),
              };
            case "sellingPrice":
              return {
                isFloat: jest.fn().mockReturnValue({}),
              };
            case "arrivalDate":
              return {
                optional: jest.fn().mockReturnValue({
                  isISO8601: jest.fn().mockReturnValue({
                    custom: jest.fn().mockReturnValue({}),
                  }),
                }),
              };
            default:
              return {};
          }
        }),
      }));

      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });

      jest
        .spyOn(ProductController.prototype, "registerProducts")
        .mockResolvedValueOnce(true);

      // Effettuiamo la chiamata alla route
      const response = await request(app)
        .post(routePath + "/products/")
        .send(testProduct);

      // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
      expect(response.status).toBe(401);
    });

    test("Should return 401 if user is not logged", async () => {
      const testProduct = {
        //definisco un oggetto di product di test
        model: "modelTest",
        category: Category.SMARTPHONE,
        quantity: 3,
        details: "modelDetails",
        sellingPrice: 3,
        arrivalDate: "2021-10-10",
      };

      // Effettuo i mock della validazione
      // Mock di isLoggedIn per simulare l'utente non autenticato
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          req.user = null;
          return res.status(401).send({ error: "Unauthenticated user" });
        });

      // Mock di isManager per simulare il fallimento dell'autenticazione
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = null;
          return next();
        });

      //Mock per express-validator

      jest.mock("express-validator", () => ({
        body: jest.fn().mockImplementation((field) => {
          switch (field) {
            case "model":
              return {
                isString: jest.fn().mockReturnValue({
                  notEmpty: jest.fn().mockReturnValue({}),
                }),
              };
            case "category":
              return {
                isString: jest.fn().mockReturnValue({
                  isIn: jest.fn().mockImplementation((value) => {
                    if (
                      ["Smartphone", "Laptop", "Appliance"].includes(
                        value as string
                      )
                    ) {
                      return {
                        withMessage: jest.fn().mockReturnValue({}),
                      };
                    } else {
                      throw new Error("Invalid value");
                    }
                  }),
                }),
              };
            case "quantity":
              return {
                isInt: jest.fn().mockReturnValue({}),
              };
            case "details":
              return {
                isString: jest.fn().mockReturnValue({
                  optional: jest.fn().mockReturnValue({}),
                }),
              };
            case "sellingPrice":
              return {
                isFloat: jest.fn().mockReturnValue({}),
              };
            case "arrivalDate":
              return {
                optional: jest.fn().mockReturnValue({
                  isISO8601: jest.fn().mockReturnValue({
                    custom: jest.fn().mockReturnValue({}),
                  }),
                }),
              };
            default:
              return {};
          }
        }),
      }));

      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });

      jest
        .spyOn(ProductController.prototype, "registerProducts")
        .mockResolvedValueOnce(true);

      // Effettuiamo la chiamata alla route
      const response = await request(app)
        .post(routePath + "/products/")
        .send(testProduct);

      // Verifichiamo che la risposta sia stata restituita con successo (codice di stato 200)
      expect(response.status).toBe(401);
    });

    test("It handles errors from registerProducts - 503", async () => {
      const testProduct = {
        //definisco un oggetto di product di test
        model: "modelTest",
        category: Category.SMARTPHONE,
        quantity: 3,
        details: "modelDetails",
        sellingPrice: 3,
        arrivalDate: "2026-10-10",
      };

      //Effettuo i mock della validazione
      // Mock di isLoggedIn
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di isAdminorManager
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = { role: "manager" };
          return next();
        });

      //Mock per express-validator

      jest.mock("express-validator", () => ({
        body: jest.fn().mockImplementation((field) => {
          switch (field) {
            case "model":
              return {
                isString: jest.fn().mockReturnValue({
                  notEmpty: jest.fn().mockReturnValue({}),
                }),
              };
            case "category":
              return {
                isString: jest.fn().mockReturnValue({
                  isIn: jest.fn().mockImplementation((value) => {
                    if (
                      ["Smartphone", "Laptop", "Appliance"].includes(
                        value as string
                      )
                    ) {
                      return {
                        withMessage: jest.fn().mockReturnValue({}),
                      };
                    } else {
                      throw new Error("Invalid value");
                    }
                  }),
                }),
              };
            case "quantity":
              return {
                isInt: jest.fn().mockReturnValue({}),
              };
            case "details":
              return {
                isString: jest.fn().mockReturnValue({
                  optional: jest.fn().mockReturnValue({}),
                }),
              };
            case "sellingPrice":
              return {
                isFloat: jest.fn().mockReturnValue({}),
              };
            case "arrivalDate":
              return {
                optional: jest.fn().mockReturnValue({
                  isISO8601: jest.fn().mockReturnValue({
                    custom: jest.fn().mockImplementation((value) => {
                      const currentDate = new Date()
                        .toISOString()
                        .split("T")[0];
                      if (typeof value === "string" && value > currentDate) {
                        throw new InvalidDateError();
                      }
                      return {};
                    }),
                  }),
                }),
              };
            default:
              return {};
          }
        }),
      }));

      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock registerProducts to reject a promise
      jest
        .spyOn(ProductController.prototype, "registerProducts")
        .mockRejectedValueOnce(new Error("Test error"));
      const response = await request(app)
        .post(routePath + "/products/")
        .send(testProduct)
        .set("Cookie", managerCookie);

      // Verifichiamo che la risposta non sia stata restituita con successo (codice di stato 200)
      expect(response.statusCode).not.toEqual(200);
    });
  });

  describe("PATCH /:model", () => {
    test("should return 200 and the new quantity if the model is valid", async () => {
      // Simula un prodotto nel database
      const testProduct = {
        model: "modelTest",
        quantity: 3,
      };
      //Effettuo i mock della validazione
      // Mock di isLoggedIn
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di isAdmin
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = { role: "admin" };
          return next();
        });

      // Mock di validateRequest
      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di changeProductQuantity
      jest
        .spyOn(ProductController.prototype, "changeProductQuantity")
        .mockResolvedValueOnce(5);

      const response = await request(app)
        .patch(routePath + "/products/modelTest")
        .send({
          model: testProduct.model,
          quantity: testProduct.quantity,
        })
        .set("Cookie", managerCookie); 

      expect(response.status).toBe(200);
      //expect(response.body.quantity).toBe(5);
      expect(
        ProductController.prototype.changeProductQuantity
      ).toHaveBeenCalledWith(
        testProduct.model,
        testProduct.quantity,
        undefined
      );
    });

    test("should return error if changeProductQuantity fails -503 ", async () => {
      // Simula un prodotto nel database
      const testProduct = {
        model: "modelTest",
        quantity: 3,
      };

      // Mock di isLoggedIn
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di isAdmin
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = { role: "admin" };
          return next();
        });

      // Mock di validateRequest
      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di changeProductQuantity to throw an error
      const mockError = new Error("changeProductQuantity error");
      jest
        .spyOn(ProductController.prototype, "changeProductQuantity")
        .mockRejectedValueOnce(mockError);

      const response = await request(app)
        .patch(routePath + "/products/modelTest")
        .send({
          model: testProduct.model,
          quantity: testProduct.quantity,
        })
        .set("Cookie", managerCookie);

      expect(response.status).toBe(503);
    });
  });

  describe("PATCH /:model/sell", () => {
    test("should return error if sellProduct fails - 503", async () => {
      // Simula un prodotto nel database
      const testProduct = {
        model: "modelTest",
        quantity: 3,
      };

      // Mock di isLoggedIn
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di isAdmin
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = { role: "admin" };
          return next();
        });

      // Mock di validateRequest
      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di sellProduct to throw an error
      const mockError = new Error("sellProduct error");
      jest
        .spyOn(ProductController.prototype, "sellProduct")
        .mockRejectedValueOnce(mockError);

      const response = await request(app)
        .patch(routePath + "/products/modelTest/sell")
        .send({
          model: testProduct.model,
          quantity: testProduct.quantity,
        })
        .set("Cookie", managerCookie); 

      expect(response.status).toBe(503);
    });

    test("should return 200 and the new quantity if the model is valid", async () => {
      // Simula un prodotto nel database
      const testProduct = {
        model: "modelTest",
        quantity: 3,
      };

      // Mock di isLoggedIn
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di isAdmin
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = { role: "admin" };
          return next();
        });

      // Mock di validateRequest
      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di sellProduct
      jest
        .spyOn(ProductController.prototype, "sellProduct")
        .mockResolvedValueOnce(5);

      const response = await request(app)
        .patch(routePath + "/products/modelTest/sell")
        .send({
          model: testProduct.model,
          quantity: testProduct.quantity,
        })
        .set("Cookie", managerCookie); 

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(5);
      expect(ProductController.prototype.sellProduct).toHaveBeenCalledWith(
        testProduct.model,
        testProduct.quantity,
        undefined
      );
    });
  });

  describe("GET /", () => {
    test("should return all products if no query parameters are provided - 200", async () => {
      // Mock di isLoggedIn
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di isAdmin
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = { role: "admin" };
          return next();
        });

      // Mock di validateRequest
      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di getProducts
      const mockProducts = [
        {
          model: "modelTest",
          quantity: 3,
          sellingPrice: 1000,
          category: Category.SMARTPHONE,
          arrivalDate: "2022-01-01",
          details: "Some details about the product",
        },
      ];
      jest
        .spyOn(ProductController.prototype, "getProducts")
        .mockResolvedValueOnce(mockProducts);

      const response = await request(app)
        .get(routePath + "/products")
        .set("Cookie", managerCookie); 
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });
    test("should return all products of the same category if category query parameter is provided - 200", async () => {
      // Mock di isLoggedIn
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di isAdmin
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = { role: "admin" };
          return next();
        });

      // Mock di validateRequest
      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di getProducts
      const mockProducts = [
        {
          model: "modelTest",
          quantity: 3,
          sellingPrice: 1000,
          category: Category.SMARTPHONE,
          arrivalDate: "2022-01-01",
          details: "Some details about the product",
        },
      ];
      jest
        .spyOn(ProductController.prototype, "getProducts")
        .mockResolvedValueOnce(mockProducts);

      const response = await request(app)
        .get(routePath + "/products?category=" + Category.SMARTPHONE)
        .set("Cookie", managerCookie); // replace with the manager or admin cookie

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });
    test("should return all products of the same model if model query parameter is provided - 200", async () => {
      // Mock di isLoggedIn
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });
    
      // Mock di isAdmin
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = { role: "manager" };
          return next();
        });
    
      // Mock di validateRequest
      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });
    
      // Mock di getProducts
      const mockProducts = [
        {
          model: "modelTest",
          quantity: 3,
          sellingPrice: 1000,
          category: Category.SMARTPHONE,
          arrivalDate: "2022-01-01",
          details: "Some details about the product",
        },
      ];
      jest
        .spyOn(ProductController.prototype, "getProducts")
        .mockResolvedValueOnce(mockProducts);
    
      const response = await request(app)
        .get(routePath + "/products?model=" + "modelTest")
        .set("Cookie", managerCookie); // replace with the manager or admin cookie
    
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });
 test('should return error if grouping is "category" but no category is provided', async () => {
      // Imposta i parametri di query
      const queryParams = { grouping: "category" };

      const response = await request(app)
        .get(routePath + "/products")
        .query(queryParams)
        .set("Cookie", managerCookie); 
      expect(response.status).toBe(422); 
    });

    test('should return error if grouping is "model" but no model is provided - 422', async () => {
      // Imposta i parametri di query
      const queryParams = { grouping: "model" };

      const response = await request(app)
        .get(routePath + "/products")
        .query(queryParams)
        .set("Cookie", managerCookie); 

      expect(response.status).toBe(422); 
    });

    test('should return error if grouping is not "model" or "category" - 422', async () => {
      // Imposta i parametri di query
      const queryParams = { grouping: "modl" };

      const response = await request(app)
        .get(routePath + "/products")
        .query(queryParams)
        .set("Cookie", managerCookie); 

      expect(response.status).toBe(422); 
    });
  });

  describe("GET /available", () => {
    test("should return all available products if no query parameters are provided - 200", async () => {
      // Mock di isLoggedIn
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di isAdminorManager
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = { role: "manager" };
          return next();
        });

      // Mock di validateRequest
      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di getProducts
      const mockProducts = [
        {
          model: "modelTest",
          quantity: 3,
          sellingPrice: 1000,
          category: Category.SMARTPHONE,
          arrivalDate: "2022-01-01",
          details: "Some details about the product",
        },
      ];
      jest
        .spyOn(ProductController.prototype, "getAvailableProducts")
        .mockResolvedValueOnce(mockProducts);

      const response = await request(app)
        .get(routePath + "/products/available")
        .set("Cookie", managerCookie); 

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });
    
    test("should return all available products of the same category if category query parameter is provided - 200", async () => {
      // Mock di isLoggedIn
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di isAdminorManager
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = { role: "admin" };
          return next();
        });

      // Mock di validateRequest
      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });

      // Mock di getProducts
      const mockProducts = [
        {
          model: "modelTest",
          quantity: 3,
          sellingPrice: 1000,
          category: Category.SMARTPHONE,
          arrivalDate: "2022-01-01",
          details: "Some details about the product",
        },
      ];
      jest
        .spyOn(ProductController.prototype, "getAvailableProducts")
        .mockResolvedValueOnce(mockProducts);

      const response = await request(app)
        .get(routePath + "/products/available?category=" + Category.SMARTPHONE)
        .set("Cookie", managerCookie); 

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });
    test("should return error if invalid category is provided", async () => {
      // Mock isLoggedIn
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });
    
      // Mock isAdminOrManager
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = { role: "admin" };
          return next();
        });
    
      // Mock validateRequest
      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });
    
      // Mock getAvailableProducts to throw an error
      jest
        .spyOn(ProductController.prototype, "getAvailableProducts")
        .mockImplementation(() => {
          throw new InvalidCategoryError();
        });
    
      const response = await request(app)
        .get(routePath + "/products/available?category=" + "InvalidCategory")
        .set("Cookie", managerCookie); 
    
      expect(response.status).toBe(422); 
      
    });
    
    test("should return all products of the same model if model query parameter is provided - 200", async () => {
      // Mock di isLoggedIn
      jest
        .spyOn(Authenticator.prototype, "isLoggedIn")
        .mockImplementation((req, res, next) => {
          return next();
        });
    
      // Mock di isAdmin
      jest
        .spyOn(Authenticator.prototype, "isAdminOrManager")
        .mockImplementation((req, res, next) => {
          req.user = { role: "manager" };
          return next();
        });
    
      // Mock di validateRequest
      jest
        .spyOn(ErrorHandler.prototype, "validateRequest")
        .mockImplementation((req, res, next) => {
          return next();
        });
    
      // Mock di getProducts
      const mockProducts = [
        {
          model: "modelTest",
          quantity: 3,
          sellingPrice: 1000,
          category: Category.SMARTPHONE,
          arrivalDate: "2022-01-01",
          details: "Some details about the product",
        },
      ];
      jest
        .spyOn(ProductController.prototype, "getAvailableProducts")
        .mockResolvedValueOnce(mockProducts);
    
      const response = await request(app)
        .get(routePath + "/products/available?model=" + "modelTest")
        .set("Cookie", managerCookie); 
    
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });


    test("should handle errors thrown by getAvailableProducts - 503", async () => {
      // Mock di getAvailableProducts per rilanciare un errore
      const mockError = new Error("Something went wrong");
      jest
        .spyOn(ProductController.prototype, "getAvailableProducts")
        .mockRejectedValueOnce(mockError);

      const response = await request(app)
        .get(routePath + "/products/available")
        .set("Cookie", managerCookie); 

      expect(response.status).toBe(503); 
    });
  });

  describe("DELETE /", () => {
    test("should delete all products if user is logged in and is an admin or manager - 200", async () => {
      // Mock di deleteAllProducts per risolvere senza errori
      jest
        .spyOn(ProductController.prototype, "deleteAllProducts")
        .mockResolvedValueOnce(true);

      const response = await request(app)
        .delete(routePath + "/products")
        .set("Cookie", managerCookie); 

      expect(response.status).toBe(200);
    });

    test("should handle errors thrown by deleteAllProducts - 503", async () => {
      // Mock di deleteAllProducts per rilanciare un errore
      const mockError = new Error("Something went wrong");
      jest
        .spyOn(ProductController.prototype, "deleteAllProducts")
        .mockRejectedValueOnce(mockError);

      const response = await request(app)
        .delete(routePath + "/products")
        .set("Cookie", managerCookie); 

      expect(response.status).toBe(503); 
    });
  });

  describe("DELETE /:model", () => {
    test("should delete a product if user is logged in and is an admin or manager - 200", async () => {
      // Mock di deleteProduct per risolvere senza errori
      jest
        .spyOn(ProductController.prototype, "deleteProduct")
        .mockResolvedValueOnce(true);

      const response = await request(app)
        .delete(routePath + "/products/model1")
        .set("Cookie", managerCookie); 

      expect(response.status).toBe(200);
    });


    test("should handle errors thrown by deleteProduct - 503", async () => {
      // Mock di deleteProduct per rilanciare un errore
      const mockError = new Error("Something went wrong");
      jest
        .spyOn(ProductController.prototype, "deleteProduct")
        .mockRejectedValueOnce(mockError);

      const response = await request(app)
        .delete(routePath + "/products/model1")
        .set("Cookie", managerCookie); 

      expect(response.status).toBe(503); 
    });
  });
});
