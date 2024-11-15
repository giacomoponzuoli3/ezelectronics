

import  CartController  from '../../src/controllers/cartController';
import { test, expect, jest, afterEach,describe } from "@jest/globals"
import CartDAO from '../../src/dao/cartDAO';
import { Role,User } from '../../src/components/user';
import {Cart,ProductInCart} from '../../src/components/cart';
import { Category,Product } from '../../src/components/product';
import { EmptyProductStockError, LowProductStockError, ProductNotFoundError } from '../../src/errors/productError';
import { CartNotFoundError, EmptyCartError } from '../../src/errors/cartError';
jest.mock("../../src/db/db.ts");

describe('Cart Controller', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('get cart', () => {
        test('It should get the empty cart of a user', async () => {

        const  productInCart = [new ProductInCart("model",1,Category.SMARTPHONE,100),new ProductInCart("model2",1,Category.LAPTOP,100),  new ProductInCart("model3",1,Category.APPLIANCE,100)];
            
            const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
        
            const cartController = new CartController();

            jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(new Cart(customer.username,false,"",0,[]));
            

            const result = await cartController.getCart(customer);
            
            expect(result).toEqual(new Cart(customer.username,false,"",0,[]));
            expect(CartDAO.prototype.getCart).toHaveBeenCalled();
           
        })


        test('It should get the cart of a user', async () => {

            const  productInCart = [new ProductInCart("model",1,Category.SMARTPHONE,100),new ProductInCart("model2",1,Category.LAPTOP,100),  new ProductInCart("model3",1,Category.APPLIANCE,100)];
            
            const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
        
            const cartController = new CartController();
    
            jest.spyOn(CartDAO.prototype, "getCart").mockResolvedValueOnce(new Cart(customer.username,false,"",0,productInCart));
            
    
            const result = await cartController.getCart(customer);
            
            expect(result).toEqual(new Cart(customer.username,false,"",0,productInCart));
            expect(CartDAO.prototype.getCart).toHaveBeenCalled();
        })

    })


    describe('Add to cart', () => {

        test('It should add a product ', async () => {

                const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
                
                const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
            
                const cartController = new CartController();
    
                jest.spyOn(CartDAO.prototype, "addToCart").mockResolvedValueOnce(true);
                
    
                const result = await cartController.addToCart(customer,product.model);
                
                expect(result).toEqual(true);
                expect(CartDAO.prototype.addToCart).toHaveBeenCalled();
         })

        

     test('It should return 404 productNotFoundError', async () => {

        const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
        
        const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
    
        const cartController = new CartController();

        jest.spyOn(CartDAO.prototype, "addToCart").mockRejectedValueOnce(new ProductNotFoundError());
        

        await expect(cartController.addToCart(customer,product.model))
        .rejects.toThrow(new ProductNotFoundError().message);

        
       
        expect(CartDAO.prototype.addToCart).toHaveBeenCalled();
 })

 test('It should return 409 EmptyProductStockError', async () => {

    const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
    
    const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");

    const cartController = new CartController();

    jest.spyOn(CartDAO.prototype, "addToCart").mockRejectedValueOnce(new EmptyProductStockError());
    

    await expect(cartController.addToCart(customer,product.model))
    .rejects.toThrow(new EmptyProductStockError().message);

    
   
    expect(CartDAO.prototype.addToCart).toHaveBeenCalled();
})




    })


    describe('checkoutCart', () => {

        test('It should checkoutCart ', async () => {

                const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
                
                const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
            
                const cartController = new CartController();
    
                jest.spyOn(CartDAO.prototype, "checkoutCart").mockResolvedValueOnce(true);
                
    
                const result = await cartController.checkoutCart(customer);
                
                expect(result).toEqual(true);
                expect(CartDAO.prototype.checkoutCart).toHaveBeenCalled();
         })

        

         test('It should return 404 CartNotFound Error', async () => {

            const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
            
            const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
        
            const cartController = new CartController();
    
            jest.spyOn(CartDAO.prototype, "checkoutCart").mockRejectedValueOnce(new CartNotFoundError());
            
    
            await expect(cartController.checkoutCart(customer))
            .rejects.toThrow(new CartNotFoundError().message);
    
            
           
            expect(CartDAO.prototype.checkoutCart).toHaveBeenCalled();
     })

     test('It should return 400 EmptyCart Error', async () => {

        const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
        
        const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
    
        const cartController = new CartController();

        jest.spyOn(CartDAO.prototype, "checkoutCart").mockRejectedValueOnce(new EmptyCartError());
        

        await expect(cartController.checkoutCart(customer))
        .rejects.toThrow(new EmptyCartError().message);

        
       
        expect(CartDAO.prototype.checkoutCart).toHaveBeenCalled();
 })
 test('It should return 409 EmptyProductStock Error', async () => {

    const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
    
    const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");

    const cartController = new CartController();

    jest.spyOn(CartDAO.prototype, "checkoutCart").mockRejectedValueOnce(new EmptyProductStockError());
    

    await expect(cartController.checkoutCart(customer))
    .rejects.toThrow(new EmptyProductStockError().message);

    
   
    expect(CartDAO.prototype.checkoutCart).toHaveBeenCalled();
})

test('It should return 409 LowProductStock Error', async () => {

    const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
    
    const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");

    const cartController = new CartController();

    jest.spyOn(CartDAO.prototype, "checkoutCart").mockRejectedValueOnce(new LowProductStockError());
    

    await expect(cartController.checkoutCart(customer))
    .rejects.toThrow(new LowProductStockError().message);

    
   
    expect(CartDAO.prototype.checkoutCart).toHaveBeenCalled();
})




    })



    describe('getCustomerCarts', () => {

        test('It should gestCustomerCarts ', async () => {

                const  productInCart = [new ProductInCart("model",1,Category.SMARTPHONE,100),new ProductInCart("model2",1,Category.LAPTOP,100),  new ProductInCart("model3",1,Category.APPLIANCE,100)];
                
                const Carts = [new Cart("customer",false,"YYYY-MM-DD",1,productInCart),new Cart("customer",false,"YYYY-MM-DD",1,productInCart),new Cart("customer",false,"YYYY-MM-DD",1,productInCart)];
                    
                const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
            
                const cartController = new CartController();
    
                jest.spyOn(CartDAO.prototype, "getCustomerCarts").mockResolvedValueOnce(Carts);
                
    
                const result = await cartController.getCustomerCarts(customer);
                
                expect(result).toEqual(Carts);
                expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledTimes(1);
                expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledWith(customer.username);
                
         })

        

         test('It should getsCustomerCarts empty ', async () => {

                
            const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
        
            const cartController = new CartController();

            jest.spyOn(CartDAO.prototype, "getCustomerCarts").mockResolvedValueOnce([]);
            

            const result = await cartController.getCustomerCarts(customer);
            
            expect(result).toEqual([]);
            expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledTimes(1);
            expect(CartDAO.prototype.getCustomerCarts).toHaveBeenCalledWith(customer.username);
     })
    


    })


    describe('removeProductFromCart', () => {

        test('It should removeProductFromCart ', async () => {

                const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
                
                const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
            
                const cartController = new CartController();
    
                jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockResolvedValueOnce(true);
                
    
                const result = await cartController.removeProductFromCart(customer,product.model);
                
                expect(result).toEqual(true);
                expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalled();
         })

        

         test('It should return Error', async () => {

            const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
            
            const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
        
            const cartController = new CartController();
    
            jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockRejectedValueOnce(new Error("Error"));
            
    
            await expect(cartController.removeProductFromCart(customer,product.model))
            .rejects.toThrow("Error");
    
            
           
            expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalled();
     })

     test('It should return 404 productNotFound Error', async () => {

        const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
        
        const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
    
        const cartController = new CartController();

        jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockRejectedValueOnce(new ProductNotFoundError());
        

        await expect(cartController.removeProductFromCart(customer,product.model))
        .rejects.toThrow(new ProductNotFoundError().message);

        
       
        expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalled();
 })

 test('It should return 404 CartNotFoundError Error', async () => {

    const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
    
    const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");

    const cartController = new CartController();

    jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockRejectedValueOnce(new CartNotFoundError());
    

    await expect(cartController.removeProductFromCart(customer,product.model))
    .rejects.toThrow(new CartNotFoundError().message);

    
   
    expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalled();
})


test('It should return 404 EmptyCart Error', async () => {

    const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
    
    const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");

    const cartController = new CartController();

    jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockRejectedValueOnce(new EmptyCartError());
    

    await expect(cartController.removeProductFromCart(customer,product.model))
    .rejects.toThrow(new EmptyCartError().message);

    
   
    expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalled();
})

test('It should return 404 ProductNotFound Error', async () => {

    const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
    
    const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");

    const cartController = new CartController();

    jest.spyOn(CartDAO.prototype, "removeProductFromCart").mockRejectedValueOnce(new ProductNotFoundError());
    

    await expect(cartController.removeProductFromCart(customer,product.model))
    .rejects.toThrow(new ProductNotFoundError().message);

    
   
    expect(CartDAO.prototype.removeProductFromCart).toHaveBeenCalled();
})
    




    })



    describe('clearCart', () => {

        test('It should clearCart ', async () => {

                const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
                
                const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
            
                const cartController = new CartController();
    
                jest.spyOn(CartDAO.prototype, "clearCart").mockResolvedValueOnce(true);
                
    
                const result = await cartController.clearCart(customer);
                
                expect(result).toEqual(true);
                expect(CartDAO.prototype.clearCart).toHaveBeenCalled();
         })

        

         test('It should return 404 CartNotFound Error', async () => {

            const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
            
            const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
        
            const cartController = new CartController();
    
            jest.spyOn(CartDAO.prototype, "clearCart").mockRejectedValueOnce(new CartNotFoundError());
            
    
            await expect(cartController.clearCart(customer))
            .rejects.toThrow(new CartNotFoundError().message);
    
            
           
            expect(CartDAO.prototype.clearCart).toHaveBeenCalled();
     })
    




    })



    describe('deleteAllCarts', () => {

        test('It should deleteAllCarts ', async () => {

                const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
                
                const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
            
                const cartController = new CartController();
    
                jest.spyOn(CartDAO.prototype, "deleteAllCarts").mockResolvedValueOnce(true);
                
    
                const result = await cartController.deleteAllCarts();
                
                expect(result).toEqual(true);
                expect(CartDAO.prototype.deleteAllCarts).toHaveBeenCalled();
         })

        

         test('It should return Error', async () => {

            const product = new Product(100,"model",Category.SMARTPHONE,"",null,1);
            
            const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
        
            const cartController = new CartController();
    
            jest.spyOn(CartDAO.prototype, "deleteAllCarts").mockRejectedValueOnce(new Error("Db error"));
            
    
            await expect(cartController.deleteAllCarts())
            .rejects.toThrow("Db error");
    
            
           
            expect(CartDAO.prototype.deleteAllCarts).toHaveBeenCalled();
     })
    




    })


    describe('getAllCarts', () => {

        test('It should getAllCarts ', async () => {

                const  productInCart = [new ProductInCart("model",1,Category.SMARTPHONE,100),new ProductInCart("model2",1,Category.LAPTOP,100),  new ProductInCart("model3",1,Category.APPLIANCE,100)];
                
                const Carts = [new Cart("customer",false,"YYYY-MM-DD",1,productInCart),new Cart("customer",false,"YYYY-MM-DD",1,productInCart),new Cart("customer",false,"YYYY-MM-DD",1,productInCart)];
                    
                const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
            
                const cartController = new CartController();
    
                jest.spyOn(CartDAO.prototype, "getAllCarts").mockResolvedValueOnce(Carts);
                
    
                const result = await cartController.getAllCarts();
                
                expect(result).toEqual(Carts);
                expect(CartDAO.prototype.getAllCarts).toHaveBeenCalledTimes(1);
                
                
         })

        

         test('It should getAllCarts empty ', async () => {

                
            const customer = new User("customer", "customer", "customer", Role.CUSTOMER,"","");
        
            const cartController = new CartController();

            jest.spyOn(CartDAO.prototype, "getAllCarts").mockResolvedValueOnce([]);
            

            const result = await cartController.getAllCarts();
            
            expect(result).toEqual([]);
            expect(CartDAO.prototype.getAllCarts).toHaveBeenCalledTimes(1);
            
     })
    


    })


})

