import { describe, test, expect, beforeAll, afterAll, jest,beforeEach,afterEach } from "@jest/globals"
import request from 'supertest'
import { app } from "../../index"
import { validationResult } from 'express-validator'



import Authenticator from "../../src/routers/auth"
import { Role, User } from "../../src/components/user"
import { Category,Product } from "../../src/components/product"

import ErrorHandler from "../../src/helper"
import CartController from "../../src/controllers/cartController"
import { ProductNotFoundError,EmptyProductStockError, LowProductStockError } from "../../src/errors/productError"
import { cleanup } from "../../src/db/cleanup"
import {Cart,ProductInCart} from "../../src/components/cart"
import { EmptyCartError,CartNotFoundError, ProductNotInCartError } from "../../src/errors/cartError"
const baseURL = "/ezelectronics"



//For unit tests, we need to validate the internal logic of a single component, without the need to test the interaction with other components
//For this purpose, we mock (simulate) the dependencies of the component we are testing

jest.mock("../../src/routers/auth")
jest.mock("../../src/controllers/cartController")

let testAdmin = new User("admin", "admin", "admin", Role.ADMIN, "", "")
let testCustomer = new User("customer", "customer", "customer", Role.CUSTOMER, "", "")







describe("Cart route unit tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    describe("AddToCart POST /carts", () => {
     
        test("It should return a 200 success code", async () => {
            
            const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
           
       
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testCustomer
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });


            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation(() => ({
                    isString: () => ({ isLength: () => ({}) }),
                    notEmpty: () => ({ isLength: () => ({}) }),
                })),
            }))

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })
           
            jest.spyOn(CartController.prototype, "addToCart").mockResolvedValueOnce(true)

          
            const response = await request(app).post(baseURL + "/carts").send(inputProduct)//.set("Cookie", customerCookie)
            expect(response.status).toBe(200)
            expect(CartController.prototype.addToCart).toHaveBeenCalled()
            expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testCustomer,inputProduct.model)
        })

        test("It should return a 404 error code", async () => {
            
        const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
        
    
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            req.user = testCustomer
            return next();
        });
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return next();
        });


        jest.mock('express-validator', () => ({
            body: jest.fn().mockImplementation(() => ({
                isString: () => ({ isLength: () => ({}) }),
                notEmpty: () => ({ isLength: () => ({}) }),
            })),
        }))

        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return next()
        })
        jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new ProductNotFoundError() )
        

        
        const response = await request(app).post(baseURL + "/carts").send(inputProduct)
        expect(response.status).toBe(new ProductNotFoundError().customCode);
        expect(CartController.prototype.addToCart).toHaveBeenCalled()
        expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testCustomer,inputProduct.model)
        })


        test("It should return a 409 error code", async () => {
        
            const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
            
        
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testCustomer
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });


            jest.mock('express-validator', () => ({
                body: jest.fn().mockImplementation(() => ({
                    isString: () => ({ isLength: () => ({}) }),
                    notEmpty: () => ({ isLength: () => ({}) }),
                })),
            }))

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })
            jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new EmptyProductStockError() )
        

            
            const response = await request(app).post(baseURL + "/carts").send(inputProduct)
            expect(response.status).toBe(new EmptyProductStockError().customCode);
            expect(CartController.prototype.addToCart).toHaveBeenCalled()
            expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testCustomer,inputProduct.model)
        })

        test("It should return a 401 error code", async () => {
            
            const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
            
        
            
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })

            const response = await request(app).post(baseURL + "/carts").send(inputProduct)
            expect(response.status).toBe(401);
        
        })

        test("It should return a 422 error code", async () => {

        
       
        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
            req.user = testCustomer;
            return next();
        });
        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
            return next();
        });

        jest.mock('express-validator', () => ({
            body: jest.fn().mockImplementation((field) => {
                
                    throw new Error("Invalid value");
                
            }),
        }));
       
        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
            return res.status(422).json({ error: "The parameters are not formatted properly\n\n" });
        })
        

        const response = await request(app).post(baseURL + "/carts").send({model:" "})
        expect(response.status).toBe(422)
        })

        test("It should return a 503 error code", async () => {
            const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
                
                
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testCustomer
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });
    
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })

            jest.spyOn(CartController.prototype, "addToCart").mockRejectedValueOnce(new Error("Database error")) 
            
    
            
            const response = await request(app).post(baseURL + "/carts").send(inputProduct)
            expect(response.status).toBe(503);
            expect(CartController.prototype.addToCart).toHaveBeenCalled()
            expect(CartController.prototype.addToCart).toHaveBeenCalledWith(testCustomer,inputProduct.model)
            
            })

     })


     describe("GetCart GET /carts", () => {
       
        test("It should return a 200 success code", async () => {

           const  testCart = new Cart(testCustomer.username,false,"",0,[])

            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testCustomer
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });

            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })

            jest.spyOn(CartController.prototype, "getCart").mockResolvedValueOnce(testCart) 
           
        

            
            const response = await request(app).get(baseURL + "/carts")
            expect(response.status).toBe(200);
            expect(CartController.prototype.getCart).toHaveBeenCalled()
            expect(CartController.prototype.getCart).toHaveBeenCalledWith(testCustomer)
        })

        test("It should return a 401 error code", async () => {
                
            const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
            
        
            
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return res.status(401).json({ error: "Unauthorized" });
            })

            const response = await request(app).get(baseURL + "/carts")
            expect(response.status).toBe(401);
        
        })

        test("It should return a 503 error code", async () => {

                
                
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testCustomer
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });
    
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })

            jest.spyOn(CartController.prototype, "getCart").mockRejectedValueOnce(new Error("Database error")) 
            
    
            
            const response = await request(app).get(baseURL + "/carts")
            expect(response.status).toBe(503);
            expect(CartController.prototype.getCart).toHaveBeenCalled()
            
            })

     })


     describe ("CheckoutCart Patch /carts", () => {

        test("It should return a 200 success code", async () => {

            const  testCart = new Cart(testCustomer.username,false,"",0,[])
 
             jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                 req.user = testCustomer
                 return next();
             });
             jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                 return next();
             });
 
             jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                 return next()
             })
 
             jest.spyOn(CartController.prototype, "checkoutCart").mockResolvedValueOnce(true) 
            
         
 
             
             const response = await request(app).patch(baseURL + "/carts")
             expect(response.status).toBe(200);
             expect(CartController.prototype.checkoutCart).toHaveBeenCalled()
             expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testCustomer)
         })

         test("It should return a 404 cart not found error code", async () => {
            
           
            
        
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testCustomer
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });
    
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })

            jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new CartNotFoundError() )
            
    
            
            const response = await request(app).patch(baseURL + "/carts")
            expect(response.status).toBe(new ProductNotFoundError().customCode);
            expect(CartController.prototype.checkoutCart).toHaveBeenCalled()
            expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testCustomer)
            })

            test("It should return a 400 empty cart error code", async () => {
            
           
            
        
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                    req.user = testCustomer
                    return next();
                });
                jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                    return next();
                });
        
                jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                    return next()
                })
    
                jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new EmptyCartError() )
                
        
                
                const response = await request(app).patch(baseURL + "/carts")
                expect(response.status).toBe(new EmptyCartError().customCode);
                expect(CartController.prototype.checkoutCart).toHaveBeenCalled()
                expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testCustomer)
                })

                test("It should return a 409 EmptyProductStock error code", async () => {
            
           
            
        
                    jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                        req.user = testCustomer
                        return next();
                    });
                    jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                        return next();
                    });
            
                    jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                        return next()
                    })
        
                    jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new EmptyProductStockError() )
                    
            
                    
                    const response = await request(app).patch(baseURL + "/carts")
                    expect(response.status).toBe(new EmptyProductStockError().customCode);
                    expect(CartController.prototype.checkoutCart).toHaveBeenCalled()
                    expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testCustomer)
                    })


                    test("It should return a 409 LowProductStock error code", async () => {
            
           
            
        
                        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                            req.user = testCustomer
                            return next();
                        });
                        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                            return next();
                        });
                
                        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                            return next()
                        })
            
                        jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new LowProductStockError() )
                        
                
                        
                        const response = await request(app).patch(baseURL + "/carts")
                        expect(response.status).toBe(new LowProductStockError().customCode);
                        expect(CartController.prototype.checkoutCart).toHaveBeenCalled()
                        expect(CartController.prototype.checkoutCart).toHaveBeenCalledWith(testCustomer)
                        })
                        test("It should return a 503 error code", async () => {

                
                
                            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                                req.user = testCustomer
                                return next();
                            });
                            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                                return next();
                            });
                    
                            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                                return next()
                            })
                
                            jest.spyOn(CartController.prototype, "checkoutCart").mockRejectedValueOnce(new Error("Database error")) 
                            
                    
                            
                            const response = await request(app).patch(baseURL + "/carts")
                            expect(response.status).toBe(503);
                            expect(CartController.prototype.checkoutCart).toHaveBeenCalled()
                            
                            })
        
     })




     describe("getCustomerCarts GET /carts/history", () => {


        test("It should return a 200 success code", async () => {
            
           

           
           const productsInCart: ProductInCart[] = [
            new ProductInCart('model1', 1, Category.SMARTPHONE, 100),
            new ProductInCart('model2', 2, Category.LAPTOP, 200),
            // ... altri prodotti ...
        ];
        
        
        const carts: Cart[] = [
            new Cart('customer1', true, '2022-01-02', 300, productsInCart),
            new Cart('customer2', true, '2022-01-01', 300, productsInCart),
            // ... altri carrelli ...
        ];
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testCustomer
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                return next();
            });
    
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })

            jest.spyOn(CartController.prototype, "getCustomerCarts").mockResolvedValueOnce(carts)
            
    
            
            const response = await request(app).get(baseURL + "/carts/history")
            expect(response.status).toBe(200);
            expect(CartController.prototype.getCustomerCarts).toHaveBeenCalled()
            expect(CartController.prototype.getCustomerCarts).toHaveBeenCalledWith(testCustomer)
            })

            test("It should return a 401 Not Authorized error code", async () => {
            
                const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
                
            
                
                jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                    return res.status(401).json({ error: "Unauthorized" });
                })
    
                const response = await request(app).get(baseURL + "/carts/history").send(inputProduct)
                expect(response.status).toBe(401);
            
            })

            test("It should return a 503 error code", async () => {

                
                
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                    req.user = testCustomer
                    return next();
                });
                jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                    return next();
                });
        
                jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                    return next()
                })
    
                jest.spyOn(CartController.prototype, "getCustomerCarts").mockRejectedValueOnce(new Error("Database error")) 
                
        
                
                const response = await request(app).get(baseURL + "/carts/history")
                expect(response.status).toBe(503);
                expect(CartController.prototype.getCustomerCarts).toHaveBeenCalled()
                
                })


     })


     describe("removeProductFromCart DELETE /carts/products/:model", () => {

        test("It should return a 200 success code", async () => {
            
           

           
            const productsInCart: ProductInCart[] = [
             new ProductInCart('model1', 1, Category.SMARTPHONE, 100),
             new ProductInCart('model2', 2, Category.LAPTOP, 200),
             // ... altri prodotti ...
         ];
         
         
         const carts: Cart[] = [
             new Cart('customer1', true, '2022-01-02', 300, productsInCart),
             new Cart('customer2', true, '2022-01-01', 300, productsInCart),
             // ... altri carrelli ...
         ];
             jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                 req.user = testCustomer
                 return next();
             });
             jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                 return next();
             });
     
             jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                 return next()
             })
 
             jest.spyOn(CartController.prototype, "removeProductFromCart").mockResolvedValueOnce(true)
             
     
             
             const response = await request(app).delete(baseURL + "/carts/products/model1")
             expect(response.status).toBe(200);
             expect(CartController.prototype.removeProductFromCart).toHaveBeenCalled()
             expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testCustomer,"model1")
             })


             test("It should return a 404 ProductNotInCart error code", async () => {
            
           

           
                const productsInCart: ProductInCart[] = [
                 new ProductInCart('model1', 1, Category.SMARTPHONE, 100),
                 new ProductInCart('model2', 2, Category.LAPTOP, 200),
                 // ... altri prodotti ...
             ];
             
             
             const carts: Cart[] = [
                 new Cart('customer1', true, '2022-01-02', 300, productsInCart),
                 new Cart('customer2', true, '2022-01-01', 300, productsInCart),
                 // ... altri carrelli ...
             ];
                 jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                     req.user = testCustomer
                     return next();
                 });
                 jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                     return next();
                 });
         
                 jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                     return next()
                 })
     
                 jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new ProductNotInCartError()) 
                 
         
                 
                 const response = await request(app).delete(baseURL + "/carts/products/model1")
                 expect(response.status).toBe(new ProductNotInCartError().customCode);
                 expect(CartController.prototype.removeProductFromCart).toHaveBeenCalled()
                 expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testCustomer,"model1")
                 })


                 test("It should return a 404 CartNotFound error code", async () => {
            
           

           
                    const productsInCart: ProductInCart[] = [
                     new ProductInCart('model1', 1, Category.SMARTPHONE, 100),
                     new ProductInCart('model2', 2, Category.LAPTOP, 200),
                     // ... altri prodotti ...
                 ];
                 
                 
                 const carts: Cart[] = [
                     new Cart('customer1', true, '2022-01-02', 300, productsInCart),
                     new Cart('customer2', true, '2022-01-01', 300, productsInCart),
                     // ... altri carrelli ...
                 ];
                     jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                         req.user = testCustomer
                         return next();
                     });
                     jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                         return next();
                     });
             
                     jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                         return next()
                     })
         
                     jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new CartNotFoundError()) 
                     
             
                     
                     const response = await request(app).delete(baseURL + "/carts/products/model1")
                     expect(response.status).toBe(new CartNotFoundError().customCode);
                     expect(CartController.prototype.removeProductFromCart).toHaveBeenCalled()
                     expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testCustomer,"model1")
                     })

                 test("It should return a 404 EmptyCartError error code", async () => {
            
           

           
                    const productsInCart: ProductInCart[] = [
                     new ProductInCart('model1', 1, Category.SMARTPHONE, 100),
                     new ProductInCart('model2', 2, Category.LAPTOP, 200),
                     // ... altri prodotti ...
                 ];
                 
                 
                 const carts: Cart[] = [
                     new Cart('customer1', true, '2022-01-02', 300, productsInCart),
                     new Cart('customer2', true, '2022-01-01', 300, productsInCart),
                     // ... altri carrelli ...
                 ];
                     jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                         req.user = testCustomer
                         return next();
                     });
                     jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                         return next();
                     });
             
                     jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                         return next()
                     })
         
                     jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new EmptyCartError()) 
                     
             
                     
                     const response = await request(app).delete(baseURL + "/carts/products/model1")
                     expect(response.status).toBe(new EmptyCartError().customCode);
                     expect(CartController.prototype.removeProductFromCart).toHaveBeenCalled()
                     expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testCustomer,"model1")
                     })

                     test("It should return a 404 ProductNotFound error code", async () => {
            
           

           
                        const productsInCart: ProductInCart[] = [
                         new ProductInCart('model1', 1, Category.SMARTPHONE, 100),
                         new ProductInCart('model2', 2, Category.LAPTOP, 200),
                         // ... altri prodotti ...
                     ];
                     
                     
                     const carts: Cart[] = [
                         new Cart('customer1', true, '2022-01-02', 300, productsInCart),
                         new Cart('customer2', true, '2022-01-01', 300, productsInCart),
                         // ... altri carrelli ...
                     ];
                         jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                             req.user = testCustomer
                             return next();
                         });
                         jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                             return next();
                         });
                 
                         jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                             return next()
                         })
             
                         jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new ProductNotFoundError()) 
                         
                 
                         
                         const response = await request(app).delete(baseURL + "/carts/products/model1")
                         expect(response.status).toBe(new ProductNotFoundError().customCode);
                         expect(CartController.prototype.removeProductFromCart).toHaveBeenCalled()
                         expect(CartController.prototype.removeProductFromCart).toHaveBeenCalledWith(testCustomer,"model1")
                         })

                     test("It should return a 401 error code", async () => {
            
                        const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
                        
                    
                        
                        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                            return res.status(401).json({ error: "Not logged in" });
                        })
            
                        const response = await request(app).delete(baseURL + "/carts/products/model1")
                        expect(response.status).toBe(401);
                    
                    })

                    test("It should return a 401 error code", async () => {
            
                        const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
                        
                    
                        
                        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                            return res.status(401).json({ error: "Unauthorized" });
                        })
            
                        const response = await request(app).delete(baseURL + "/carts/products/model1")
                        expect(response.status).toBe(401);
                    
                    })
                    test("It should return a 503 error code", async () => {

                
                
                        jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                            req.user = testCustomer
                            return next();
                        });
                        jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                            return next();
                        });
                
                        jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                            return next()
                        })
            
                        jest.spyOn(CartController.prototype, "removeProductFromCart").mockRejectedValueOnce(new Error("Database error")) 
                        
                
                        
                        const response = await request(app).delete(baseURL + "/carts/products/model1")
                        expect(response.status).toBe(503);
                        expect(CartController.prototype.removeProductFromCart).toHaveBeenCalled()
                        
                        })

     })

     describe("clearCart DELETE /carts/current", () => {

        test("It should return a 200 success code", async () => {
            
             jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                 req.user = testCustomer
                 return next();
             });
             jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                 return next();
             });
     
             jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                 return next()
             })
 
             jest.spyOn(CartController.prototype, "clearCart").mockResolvedValueOnce(true) 
             
     
             
             const response = await request(app).delete(baseURL + "/carts/current")
             expect(response.status).toBe(200);
             expect(CartController.prototype.clearCart).toHaveBeenCalled()
             expect(CartController.prototype.clearCart).toHaveBeenCalledWith(testCustomer)
             })

             test("It should return a 404 CartNotFound Error code", async () => {
            
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                    req.user = testCustomer
                    return next();
                });
                jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                    return next();
                });
        
                jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                    return next()
                })
    
                jest.spyOn(CartController.prototype, "clearCart").mockRejectedValueOnce(new CartNotFoundError()) 
                
        
                
                const response = await request(app).delete(baseURL + "/carts/current")
                expect(response.status).toBe(new CartNotFoundError().customCode);
                expect(CartController.prototype.clearCart).toHaveBeenCalled()
                expect(CartController.prototype.clearCart).toHaveBeenCalledWith(testCustomer)
                })

             test("It should return a 401 error code", async () => {
            
                const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
                
            
                
                jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                    return res.status(401).json({ error: "Unauthorized" });
                })
    
                const response = await request(app).delete(baseURL + "/carts/current")
                expect(response.status).toBe(401);
            
            })

            test("It should return a 401 error code", async () => {
            
                const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
                
            
                
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                    return res.status(401).json({ error: "Not Logged In" });
                })
    
                const response = await request(app).delete(baseURL + "/carts/current")
                expect(response.status).toBe(401);
            
            })

           
                 test("It should return a 503 error code", async () => {

                
                
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                    req.user = testCustomer
                    return next();
                });
                jest.spyOn(Authenticator.prototype, "isCustomer").mockImplementation((req, res, next) => {
                    return next();
                });
        
                jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                    return next()
                })
    
                jest.spyOn(CartController.prototype, "clearCart").mockRejectedValueOnce(new Error("Database error")) 
                
        
                
                const response = await request(app).delete(baseURL + "/carts/current")
                expect(response.status).toBe(503);
                expect(CartController.prototype.clearCart).toHaveBeenCalled()
                
                })
             
     })
     
     describe("deleteAllCarts DELETE /carts", () => {



        test("It should return a 200 success code", async () => {
            
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testCustomer
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            });
    
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })

            jest.spyOn(CartController.prototype, "deleteAllCarts").mockResolvedValueOnce(true) 
            
    
            
            const response = await request(app).delete(baseURL + "/carts")
            expect(response.status).toBe(200);
            expect(CartController.prototype.deleteAllCarts).toHaveBeenCalled()
            
            })

            test("It should return a 401 error code", async () => {
            
                const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
                
            
                
                jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                    return res.status(401).json({ error: "Unauthorized" });
                })
    
                const response = await request(app).delete(baseURL + "/carts")
                expect(response.status).toBe(401);
            
            })

            test("It should return a 401 error code", async () => {
            
                const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
                
            
                
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                    return res.status(401).json({ error: "Not Logged In" });
                })
    
                const response = await request(app).delete(baseURL + "/carts")
                expect(response.status).toBe(401);
            
            })

            test("It should return a 503 error code", async () => {

                
                
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                    req.user = testCustomer
                    return next();
                });
                jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                    return next();
                });
        
                jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                    return next()
                })
    
                jest.spyOn(CartController.prototype, "deleteAllCarts").mockRejectedValueOnce(new Error("Database error")) 
                
        
                
                const response = await request(app).delete(baseURL + "/carts")
                expect(response.status).toBe(503);
                expect(CartController.prototype.deleteAllCarts).toHaveBeenCalled()
                
                })


     })

     describe("getAllCarts GET /carts/all", () => {

        test("It should return a 200 success code", async () => {

            const productsInCart: ProductInCart[] = [
                new ProductInCart('model1', 1, Category.SMARTPHONE, 100),
                new ProductInCart('model2', 2, Category.LAPTOP, 200),
                // ... altri prodotti ...
            ];
            
            
            const carts: Cart[] = [
                new Cart('customer1', true, '2022-01-02', 300, productsInCart),
                new Cart('customer2', true, '2022-01-01', 300, productsInCart),
                // ... altri carrelli ...
            ];
            
            jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                req.user = testCustomer
                return next();
            });
            jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                return next();
            });
    
            jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                return next()
            })

            jest.spyOn(CartController.prototype, "getAllCarts").mockResolvedValueOnce(carts) 
            
    
            
            const response = await request(app).get(baseURL + "/carts/all")
            expect(response.status).toBe(200);
            expect(CartController.prototype.getAllCarts).toHaveBeenCalled()
            
            })

            test("It should return a 401 error code", async () => {
            
                const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
                
            
                
                jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                    return res.status(401).json({ error: "Unauthorized" });
                })
    
                const response = await request(app).get(baseURL + "/carts/all")
                expect(response.status).toBe(401);
            
            })

            test("It should return a 401 error code", async () => {
            
                const inputProduct = {sellingPrice: 1000, model: "test", category: "Smartphone", arrivalDate: "2021-01-01", details: "test", quantity: 10}
                
            
                
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                    return res.status(401).json({ error: "Not Logged In" });
                })
    
                const response = await request(app).get(baseURL + "/carts/all")
                expect(response.status).toBe(401);
            
            })



            test("It should return a 503 error code", async () => {

                
                
                jest.spyOn(Authenticator.prototype, "isLoggedIn").mockImplementation((req, res, next) => {
                    req.user = testCustomer
                    return next();
                });
                jest.spyOn(Authenticator.prototype, "isAdminOrManager").mockImplementation((req, res, next) => {
                    return next();
                });
        
                jest.spyOn(ErrorHandler.prototype, "validateRequest").mockImplementation((req, res, next) => {
                    return next()
                })
    
                jest.spyOn(CartController.prototype, "getAllCarts").mockRejectedValueOnce(new Error("Database error")) 
                
        
                
                const response = await request(app).get(baseURL + "/carts/all")
                expect(response.status).toBe(503);
                expect(CartController.prototype.getAllCarts).toHaveBeenCalled()
                
                })
    
     })


})