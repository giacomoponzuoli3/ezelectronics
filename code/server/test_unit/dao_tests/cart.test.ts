import CartDAO from "../../src/dao/cartDAO"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { Product, Category } from "../../src/components/product"
import { Cart, ProductInCart, } from '../../src/components/cart';
import { CartNotFoundError, EmptyCartError,  ProductNotInCartError } from "../../src/errors/cartError";
import {  EmptyProductStockError, LowProductStockError, ProductNotFoundError, } from "../../src/errors/productError"; // Importa i tuoi errori personalizzati
import {describe, expect, test, jest, beforeEach,afterEach} from '@jest/globals';

describe("checkoutCart", () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });
    const cartDAO=new CartDAO();
    const checkoutCart = cartDAO.checkoutCart;
    const username = "testuser";

   

    test("should resolve true on successful checkout", async () => {
        jest.spyOn(db, "get")
            .mockImplementationOnce((query, params, callback) => {
                callback(null, { id: 1 });
                return {} as Database
            })
            .mockImplementationOnce((query, params, callback) => {
                callback(null, { quantity: 10 });
                return {} as Database
            });

        jest.spyOn(db, "all").mockImplementation((query, params, callback) => {
            callback(null, [{ model: "model1", quantity: 2 }]);
            return {} as Database
        });

        jest.spyOn(db, "run").mockImplementation((query, params, callback) => {
            callback(null);
            return {} as Database
        });

        const result = await checkoutCart(username);
        expect(result).toBe(true);
    });

    test("should reject with CartNotFoundError if no unpaid cart is found", async () => {
        jest.spyOn(db, "get").mockImplementation((query, params, callback) => {
            callback(null, undefined);
            return {} as Database
        });

        await expect(checkoutCart(username)).rejects.toThrow(CartNotFoundError);
    });

    test("should reject with EmptyCartError if the cart is empty", async () => {
        jest.spyOn(db, "get").mockImplementation((query, params, callback) => {
            callback(null, { id: 1 });
            return {} as Database
        });

        jest.spyOn(db, "all").mockImplementation((query, params, callback) => {
            callback(null, {length:0});
            return {} as Database
        });

        await expect(checkoutCart(username)).rejects.toThrow(EmptyCartError);
    });

    test("should reject with EmptyProductStockError if a product is out of stock", async () => {
        jest.spyOn(db, "get")
            .mockImplementationOnce((query, params, callback) => {
                callback(null, { id: 1 });
                return {} as Database
            })
            .mockImplementationOnce((query, params, callback) => {
                callback(null, { quantity: 0 });
                return {} as Database
            });

        jest.spyOn(db, "all").mockImplementation((query, params, callback) => {
            callback(null, [{ model: "model1", quantity: 2 }]);
            return {} as Database
        });

        await expect(checkoutCart(username)).rejects.toThrow(EmptyProductStockError);
    });

    test("should reject with LowProductStockError if a product has insufficient stock", async () => {
        jest.spyOn(db, "get")
            .mockImplementationOnce((query, params, callback) => {
                callback(null, { id: 1 });
                return {} as Database
            })
            .mockImplementationOnce((query, params, callback) => {
                callback(null, { quantity: 1 });
                return {} as Database
            });

        jest.spyOn(db, "all").mockImplementation((query, params, callback) => {
            callback(null, [{ model: "model1", quantity: 2 }]);
            return {} as Database
        });

        await expect(checkoutCart(username)).rejects.toThrow(LowProductStockError);
    });

    test("should handle db run error during quantity update", async () => {
        jest.spyOn(db, "get")
            .mockImplementationOnce((query, params, callback) => {
                callback(null, { id: 1 });
                return {} as Database;
            })
            .mockImplementationOnce((query, params, callback) => {
                callback(null, { quantity: 10 });
                return {} as Database;
            });

        jest.spyOn(db, "all").mockImplementation((query, params, callback) => {
            callback(null, [{ model: "model1", quantity: 2 }]);
            return {} as Database;
            
        });

        jest.spyOn(db, "run").mockImplementationOnce((query, params, callback) => {
            callback(new Error("DB error"));
            return {} as Database;
        });

        await expect(checkoutCart(username)).rejects.toThrow("DB error");

   
    });

    test("should handle db run error during quantity update", async () => {
        jest.spyOn(db, "get")
            .mockImplementationOnce((query, params, callback) => {
                callback(null, { id: 1 });
                return {} as Database;
            })
            .mockImplementationOnce((query, params, callback) => {
                callback(null, { quantity: 10 });
                return {} as Database;
            });

        jest.spyOn(db, "all").mockImplementation((query, params, callback) => {
            callback(null, [{ model: "model1", quantity: 2 }]);
            return {} as Database;
        });

        jest.spyOn(db, "run").mockImplementationOnce((query, params, callback) => {
            callback(new Error("DB error"));
            return {} as Database;
        });

        await expect(checkoutCart(username)).rejects.toThrow("DB error");
    });


    test("should handle get error", async () => {
        jest.spyOn(db, "get")
            .mockImplementationOnce((query, params, callback) => {
                throw new Error("DB error");
            })
        

        await expect(checkoutCart(username)).rejects.toThrow("DB error");
    });

    test("should handle db run error during quantity update", async () => {
        jest.spyOn(db, "get")
            .mockImplementationOnce((query, params, callback) => {
                callback(null, { id: 1 });
                return {} as Database;
            })
           

        jest.spyOn(db, "all").mockImplementation((query, params, callback) => {
           throw new Error("DB error");
        });

       
        await expect(checkoutCart(username)).rejects.toThrow("DB error");
    });

    test("should handle db run error during quantity update", async () => {
        jest.spyOn(db, "get")
            .mockImplementationOnce((query, params, callback) => {
                callback(null, { id: 1 });
                return {} as Database;
            })
            .mockImplementationOnce((query, params, callback) => {
                throw new Error("DB error");
            });

        jest.spyOn(db, "all").mockImplementation((query, params, callback) => {
            callback(null, [{ model: "model1", quantity: 2 }]);
            return {} as Database;
        });
       
        await expect(checkoutCart(username)).rejects.toThrow("DB error");
    });


    test("should handle db run error during quantity update", async () => {
        jest.spyOn(db, "get")
        .mockImplementationOnce((query, params, callback) => {
            callback(null, { id: 1 });
            return {} as Database
        })
        .mockImplementationOnce((query, params, callback) => {
            callback(null, { quantity: 10 });
            return {} as Database
        });

    jest.spyOn(db, "all").mockImplementation((query, params, callback) => {
        callback(null, [{ model: "model1", quantity: 2 }]);
        return {} as Database
    });

    jest.spyOn(db, "run").mockImplementationOnce((query, params, callback) => {
        callback(null);
        return {} as Database
    })
    .mockImplementationOnce((query, params, callback) => {
        throw new Error("DB error");
        
    });
       
        await expect(checkoutCart(username)).rejects.toThrow("DB error");
    });

});

describe("removeProductFromCart", () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });
    const username = "testuser";
    const product = "testproduct";

    const cartDAO=new CartDAO();
    const removeProductFromCart = cartDAO.removeProductFromCart;

    

    test("should resolve true on successful removal when quantity is reduced", async () => {
        jest.spyOn(db, "get")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { count: 1 });
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { model: product });
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { quantity: 2, price: 50, cart_total: 100 });
                return {} as Database
            });

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [{ model: product, quantity: 2, category: "Smartphone", price: 500 }]);
            return {} as Database
        });

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });

        const result = await removeProductFromCart(username, product);
        expect(result).toBe(true);
    });

    test("should resolve true on successful removal when quantity is 1 and product is deleted", async () => {
        jest.spyOn(db, "get")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { count: 1 });
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { model: product });
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { quantity: 1, price: 50, cart_total: 50 });
                return {} as Database
            });

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [{ model: product, quantity: 1, category: "Smartphone", price: 500 }]);
            return {} as Database
        });

        jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
            callback(null);
            return {} as Database;
        });

        const result = await removeProductFromCart(username, product);
        expect(result).toBe(true);
    });

    test("should reject with CartNotFoundError if no unpaid cart is found", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { count: 0 });
            return {} as Database
        });

        await expect(removeProductFromCart(username, product)).rejects.toThrow(CartNotFoundError);
    });

    test("should reject with EmptyCartError if the cart is empty", async () => {
        jest.spyOn(db, "get")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { count: 1 });
                return {} as Database
            });

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, undefined);
            return {} as Database
        });

        await expect(removeProductFromCart(username, product)).rejects.toThrow(EmptyCartError);
    });

    test("should reject with ProductNotFoundError if the product does not exist", async () => {
        jest.spyOn(db, "get")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { count: 1 });
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, undefined);
                return {} as Database
            });

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [{ model: product, quantity: 1, category: "Smartphone", price: 500 }]);
            return {} as Database
        });

        await expect(removeProductFromCart(username, product)).rejects.toThrow(ProductNotFoundError);
    });

    test("should reject with ProductNotInCartError if the product is not in the cart", async () => {
        jest.spyOn(db, "get")
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { count: 1 });
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, { model: product });
                return {} as Database
            })
            .mockImplementationOnce((sql, params, callback) => {
                callback(null, undefined);
                return {} as Database
            });

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, [{ model: product, quantity: 1, category: "Smartphone", price: 500 }]);
            return {} as Database
        });

        await expect(removeProductFromCart(username, product)).rejects.toThrow(ProductNotInCartError);
    });


    test("should handle db errors ", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(new Error("DB error"), null);
            return {} as Database
        });

        await expect(removeProductFromCart(username, product)).rejects.toThrow("DB error");
    });

    test("should handle all DB error", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { count: 1 });
            return {} as Database
        });
        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            throw new Error("DB error");
        });

        await expect(removeProductFromCart(username, product)).rejects.toThrow("DB error");
    });

    test("should handle all DB error", async () => {
        jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
            callback(null, { count: 1 });
            return {} as Database
        })
        .mockImplementationOnce((sql, params, callback) => {
            throw new Error("DB error");

        });

        jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
            callback(null, { model: product });
            return {} as Database
        });

        await expect(removeProductFromCart(username, product)).rejects.toThrow("DB error");
    });
});

describe("clearCart", () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });

    const username = "testuser";
    const cartDAO=new CartDAO();
    const clearCart = cartDAO.clearCart;

   

    test("should resolve true on successful cart clearance", async () => {
        jest.spyOn(db, "get").mockImplementation((query, params, callback) => {
            callback(null, { count: 1 });
            return {} as Database
        });

        jest.spyOn(db, "run").mockImplementation((query, params, callback) => {
            callback(null);
            return {} as Database;
        });

        const result = await clearCart(username);
        expect(result).toBe(true);
    });

    test("should reject with CartNotFoundError if no unpaid cart is found", async () => {
        jest.spyOn(db, "get").mockImplementation((query, params, callback) => {
            callback(null, { count: 0 });
            return {} as Database
        });

        await expect(clearCart(username)).rejects.toThrow(CartNotFoundError);
    });

    test("should handle db errors ", async () => {
        jest.spyOn(db, "get").mockImplementation((query, params, callback) => {
            callback(new Error("DB error"), null);
            return {} as Database
        });

        await expect(clearCart(username)).rejects.toThrow("DB error");
    });

    test("should handle db errors ", async () => {
        jest.spyOn(db, "get").mockImplementation((query, params, callback) => {
            callback(null, { count: 1 });
            return {} as Database
        });

        jest.spyOn(db, "run").mockImplementationOnce((query, params, callback) => {
            callback(null);
            return {} as Database;
        }).mockImplementationOnce((query, params, callback) => {
            throw new Error("DB error");
        });

        await expect(clearCart(username)).rejects.toThrow("DB error");
    });

    test("should handle db errors ", async () => {
        jest.spyOn(db, "get").mockImplementation((query, params, callback) => {
            callback(null, { count: 1 });
            return {} as Database
        });

        jest.spyOn(db, "run").mockImplementationOnce((query, params, callback) => {
            throw new Error("DB error");
        })

        await expect(clearCart(username)).rejects.toThrow("DB error");
    });
});

describe("deleteAllCarts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const cartDAO=new CartDAO();
    const deleteAllCarts = cartDAO.deleteAllCarts;

    test("should resolve true on successful deletion of all carts", async () => {
        jest.spyOn(db, "run").mockImplementation((query, callback) => {
            callback(null);
            return {} as Database;
        });

        const result = await deleteAllCarts();
        expect(result).toBe(true);
    });

    test("should handle db errors", async () => {
        jest.spyOn(db, "run").mockImplementation((query, callback) => {
            callback(null);
            return {} as Database;
        });
        jest.spyOn(db, "run").mockImplementation((query, callback) => {
            callback(new Error("DB error"), null);
            return {} as Database;
        });

        await expect(deleteAllCarts()).rejects.toThrow("DB error");
    });

    test("should handle db errors", async () => {
        
        jest.spyOn(db, "run").mockImplementation((query, callback) => {
            callback(new Error("DB error"), null);
            return {} as Database;
        });

        await expect(deleteAllCarts()).rejects.toThrow("DB error");
    });

    test("should handle db errors", async () => {
        jest.spyOn(db, "run").mockImplementationOnce((query, callback) => {
            callback(null);
            return {} as Database;
        });
        jest.spyOn(db, "run").mockImplementationOnce((query, callback) => {
            callback(new Error("DB error"), null);
            return {} as Database;
        });

        await expect(deleteAllCarts()).rejects.toThrow("DB error");
    });

});

describe("getAllCarts", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const cartDAO=new CartDAO();
    const getAllCarts = cartDAO.getAllCarts;

    test("should resolve with an array of carts on successful retrieval", async () => {
        const mockRows = [
            { cart_id: 1, user_username: "user1", cart_paid: 1, cart_paymentDate: "2024-05-30", cart_total: 100, product_model: "model1", product_quantity: 2, product_category: "Smartphone", product_price: 500 },
            { cart_id: 1, user_username: "user1", cart_paid: 1, cart_paymentDate: "2024-05-30", cart_total: 100, product_model: "model2", product_quantity: 1, product_category: "Laptop", product_price: 800 }
        ];

        jest.spyOn(db, "all").mockImplementation((query, callback) => {
            callback(null, mockRows);
            return {} as Database;
        });

        const result = await getAllCarts();

        expect(result).toEqual([
            new Cart(
                "user1",
                true,
                "2024-05-30",
                100,
                [
                    new ProductInCart("model1", 2, Category.SMARTPHONE, 500),
                    new ProductInCart("model2", 1, Category.LAPTOP, 800)
                ]
            )
        ]);
    });

    test("should resolve with an empty array if no carts are found", async () => {
        jest.spyOn(db, "all").mockImplementation((query, callback) => {
            callback(null, []);
            return {} as Database;
        });

        const result = await getAllCarts();

        expect(result).toEqual([]);
    });

    test("should handle db errors gracefully", async () => {
        jest.spyOn(db, "all").mockImplementation((query, callback) => {
            callback(new Error("DB error"), null);
            return {} as Database;
        });

        await expect(getAllCarts()).rejects.toThrow("DB error");
    });
});


describe("getCustomerCarts", () => {
   

    beforeEach(() => {
        jest.clearAllMocks();
       
    });

    const cartDAO=new CartDAO();
    const getCustomerCarts = cartDAO.getCustomerCarts;

    const username = "testuser";
    
    test("should resolve with an array of carts on successful retrieval", async () => {
        const mockRows = [
            { cart_id: 1, user_username: "testuser", cart_paid: 1, cart_paymentDate: "2024-01-01", cart_total: 200, product_model: "model1", product_quantity: 2, product_category: Category.SMARTPHONE, product_price: 100 },
            { cart_id: 1, user_username: "testuser", cart_paid: 1, cart_paymentDate: "2024-01-01", cart_total: 200, product_model: "model2", product_quantity: 1, product_category: Category.LAPTOP, product_price: 800 }
        ];

        jest.spyOn(db, "all").mockImplementation((query: string, params: any[], callback: Function) => {
            callback(null, mockRows);
            return {} as Database;
        });

        const result = await getCustomerCarts(username);

        expect(result).toEqual([
            new Cart(
                "testuser",
                true,
                "2024-01-01",
                200,
                [
                    new ProductInCart("model1", 2, Category.SMARTPHONE, 100),
                    new ProductInCart("model2", 1, Category.LAPTOP, 800)
                ]
            )
        ]);
    });

    test("should resolve with an empty array if no carts are found ", async () => {
        jest.spyOn(db, "all").mockImplementation((query: string, params: any[], callback: Function) => {
            callback(null, []);
            return {} as Database;
        });

        const result = await getCustomerCarts(username);

        expect(result).toEqual([]);
    });

    test("should handle db errors gracefully", async () => {
        jest.spyOn(db, "all").mockImplementation((query: string, params: any[], callback: Function) => {
            callback(new Error("DB error"), null);
            return {} as Database;
        });

        await expect(getCustomerCarts(username)).rejects.toThrow("DB error");
    });
});



describe('addToCart', () => {


    beforeEach(() => {
        jest.clearAllMocks();
       
    });
  
    const cartDAO = new CartDAO();
    const addToCart = cartDAO.addToCart;
  
    const username = "testuser";
    const product = "testproduct";
    const priceProduct = 100;
  
  
  
  
    test('should create a new cart if no unpaid cart exists', async () => {
        const productRow = { model: product, sellingPrice: priceProduct, quantity: 10 };
  
        jest.spyOn(db, "get")
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, productRow); // Mock del controllo del prodotto
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, { count: 0 }); // Mock del controllo del carrello esistente
                return {} as Database;
            });
  
            jest.spyOn(db, "run")
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null); // Mock dell'inserimento del nuovo carrello
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null); // Mock dell'inserimento del prodotto nel carrello
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null); // Mock dell'aggiornamento del totale del carrello
                return {} as Database;
            });
  
            jest.spyOn(db, "get")
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, { id: 1 }); // Mock dell'ottenimento dell'ID del nuovo carrello
                return {} as Database;
            });
            jest.spyOn(db, "get")
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, {productRow}); // Mock dell'ottenimento dell'ID del nuovo carrello
                return {} as Database;
            });
  
        const result = await addToCart(username, product);
  
        expect(result).toBe(true);
        expect(db.get).toHaveBeenCalledTimes(4);
        expect(db.run).toHaveBeenCalledTimes(3);
    });
  
    test('should create a product istance in the current cart ', async () => {
      const productRow = { model: product, sellingPrice: priceProduct, quantity: 10 };
  
      jest.spyOn(db, "get")
          .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
              callback(null, productRow); // Mock del controllo del prodotto
              return {} as Database;
          })
          .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
              callback(null, { count: 1 }); // Mock del controllo del carrello esistente
              return {} as Database;
          });
  
          jest.spyOn(db, "run")
          .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
              callback(null); // Mock dell'inserimento del prodotto nel carrello
              return {} as Database;
          })
          .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
              callback(null); // Mock dell'aggiornamento del totale del carrello
              return {} as Database;
          });
  
          jest.spyOn(db, "get")
          .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
              callback(null, { id: 1 }); // Mock dell'ottenimento dell'ID del nuovo carrello
              return {} as Database;
          });
          jest.spyOn(db, "get")
          .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
              callback(null, undefined); // Mock dell'ottenimento dell'ID del nuovo carrello
              return {} as Database;
          });
  
      const result = await addToCart(username, product);
  
      expect(result).toBe(true);
      expect(db.get).toHaveBeenCalledTimes(4);
      expect(db.run).toHaveBeenCalledTimes(2);
  });
  
    test('should add a product to the cart if it exists and is in stock', async () => {
        const productRow = { model: product, sellingPrice: priceProduct, quantity: 10 };
        const cartRow = { id: 1 };
  
        jest.spyOn(db, "get")
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, productRow); // Mock del controllo del prodotto
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, { count: 1 }); // Mock del controllo del carrello esistente
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, cartRow); // Mock dell'ottenimento dell'ID del carrello
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, undefined); // Mock del controllo dell'inserimento del prodotto
                return {} as Database;
            });
  
            jest.spyOn(db, "run")
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null); // Mock dell'inserimento del prodotto nel carrello
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null); // Mock dell'aggiornamento del totale del carrello
                return {} as Database;
            });
  
        const result = await addToCart(username, product);
  
        expect(result).toBe(true);
        expect(db.get).toHaveBeenCalledTimes(4);
        expect(db.run).toHaveBeenCalledTimes(2);
    });

    test('should handle get DB error', async () => {
        const productRow = { model: product, sellingPrice: priceProduct, quantity: 10 };
        const cartRow = { id: 1 };
  
        jest.spyOn(db, "get")
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, productRow); // Mock del controllo del prodotto
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
              throw new Error("DB error");
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, cartRow); // Mock dell'ottenimento dell'ID del carrello
                return {} as Database;
            })
          await expect(addToCart(username, product)).rejects.toThrow("DB error");
    });

    test('should handle run DB error', async () => {
        const productRow = { model: product, sellingPrice: priceProduct, quantity: 10 };
        const cartRow = { id: 1 };
  
        jest.spyOn(db, "get")
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, productRow); // Mock del controllo del prodotto
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
              callback(null, { count: 0 });
              return {} as Database;
            })
            
            jest.spyOn(db, "run").mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                throw new Error("DB error");
            });
          await expect(addToCart(username, product)).rejects.toThrow("DB error");
    });

    test('should handle get DB error', async () => {
        const productRow = { model: product, sellingPrice: priceProduct, quantity: 10 };
        const cartRow = { id: 1 };
  
        jest.spyOn(db, "get")
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, productRow); // Mock del controllo del prodotto
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, { count: 1 }); // Mock del controllo del carrello esistente
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
               throw new Error("DB error");
            })
          
        
        expect(addToCart(username, product)).rejects.toThrow("DB error");
    });

    test('should handle get DB error', async () => {
        const productRow = { model: product, sellingPrice: priceProduct, quantity: 10 };
        const cartRow = { id: 1 };
  
        jest.spyOn(db, "get")
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, productRow); // Mock del controllo del prodotto
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, { count: 1 }); // Mock del controllo del carrello esistente
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, cartRow); // Mock dell'ottenimento dell'ID del carrello
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                throw new Error("DB error"); //Mock del controllo instanza prodotto già presente
            });
  
          
        
        expect(addToCart(username, product)).rejects.toThrow("DB error");
    });

    test('should handle run DB error', async () => {
        const productRow = { model: product, sellingPrice: priceProduct, quantity: 10 };
        const cartRow = { id: 1 };
  
        jest.spyOn(db, "get")
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, productRow); // Mock del controllo del prodotto
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, { count: 1 }); // Mock del controllo del carrello esistente
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, {id :1}); // Mock dell'ottenimento dell'ID del carrello
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, cartRow); // Mock controlo instanza prodotto già presente
                return {} as Database; 
            });

        jest.spyOn(db, "run").mockImplementationOnce((sql: string, params: any[], callback: Function) => {
            throw new Error("DB error");
        });
  
          
        
        expect(addToCart(username, product)).rejects.toThrow("DB error");
    });
  
    test('should handle run DB error', async () => {
        const productRow = { model: product, sellingPrice: priceProduct, quantity: 10 };
        const cartRow = { id: 1 };
  
        jest.spyOn(db, "get")
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, productRow); // Mock del controllo del prodotto
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, { count: 1 }); // Mock del controllo del carrello esistente
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, {id :1}); // Mock dell'ottenimento dell'ID del carrello
                return {} as Database;
            })
            .mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                callback(null, cartRow); // Mock controlo instanza prodotto già presente
                return {} as Database; 
            });

        jest.spyOn(db, "run").mockImplementationOnce((sql: string, params: any[], callback: Function) => {
                     callback(null);  // aggiornamento quantità
                return {} as Database;
        });

        jest.spyOn(db, "run").mockImplementationOnce((sql: string, params: any[], callback: Function) => {
            throw new Error("DB error"); //errore aggiornamento totale
        });
  
          
        
        expect(addToCart(username, product)).rejects.toThrow("DB error");
    });
    test('should reject if the product does not exist', async () => {
      jest.spyOn(db, "get").mockImplementationOnce((sql: string, params: any[], callback: Function) => {
            callback(null, undefined); // Mock del prodotto non trovato
            return {} as Database;
        });
  
        await expect(addToCart(username, product)).rejects.toThrow(ProductNotFoundError);
    });
  
    test('should reject if the product is out of stock', async () => {
        const productRow = { model: product, sellingPrice: priceProduct, quantity: 0 };
  
        jest.spyOn(db, "get").mockImplementationOnce((sql: string, params: any[], callback: Function) => {
            callback(null, productRow); // Mock del prodotto esaurito
            return {} as Database;
        });
  
        await expect(addToCart(username, product)).rejects.toThrow(EmptyProductStockError);
    });
  
    test('should handle database errors ', async () => {
        const errorMessage = "DB error";
  
        jest.spyOn(db, "get").mockImplementationOnce((sql: string, params: any[], callback: Function) => {
            callback(new Error(errorMessage), null); // Mock dell'errore del database
            return {} as Database;
        });
  
        await expect(addToCart(username, product)).rejects.toThrow(errorMessage);
    });
  });
    
    describe("getCart", () => {
  
      beforeEach(() => {
          jest.clearAllMocks();
      });
  
      const username = "testuser";
      const cartDAO = new CartDAO();
      const getCart = cartDAO.getCart;
  
     
  
      test("should resolve with an empty cart if no unpaid cart exists for the user or no products in cart", async () => {
          jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
              callback(null, [{ count: 0 }]);
              return {} as Database;
          });
  
          const result = await getCart(username);
          expect(result.customer).toBe(username);
          expect(result.paid).toBe(false);
          expect(result.paymentDate).toBeNull();
          expect(result.total).toBe(0);
          expect(result.products).toHaveLength(0);
      });
  
      test("should resolve with the user's cart containing products if an unpaid cart exists", async () => {
          const expectedProducts = [
              new ProductInCart("testModel1", 2, Category.SMARTPHONE, 500),
              new ProductInCart("testModel2", 1, Category.LAPTOP, 1000)
          ];
  
          jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
              callback(null, [{ count: 1 }]);
              return {} as Database;
          });
  
          jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
              callback(null, expectedProducts.map(p => ({ model: p.model, quantity: p.quantity, category: p.category, price: p.price })));
              return {} as Database;
          });
  
          jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
              callback(null, { total: 2500 }); // Total price for the cart  , sembra non arrivare al row.total del codice
              return {} as Database;
          });
  
          const result = await getCart(username);
          expect(result.customer).toBe(username);
          expect(result.paid).toBe(false);
          expect(result.paymentDate).toBeNull();
          expect(result.total).toBe(2500);
          expect(result.products).toEqual(expectedProducts);
      });
  
      test("should reject with an error if an error occurs during the process", async () => {
          jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
              callback(new Error("Simulated error during query execution"), null);
              return {} as Database;
          });
  
          await expect(getCart(username)).rejects.toThrowError("Simulated error during query execution");
      });


      test("should handle get db error ", async () => {
        const expectedProducts = [
            new ProductInCart("testModel1", 2, Category.SMARTPHONE, 500),
            new ProductInCart("testModel2", 1, Category.LAPTOP, 1000)
        ];

        jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null, [{ count: 1 }]);
            return {} as Database;
        });

        jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null, expectedProducts.map(p => ({ model: p.model, quantity: p.quantity, category: p.category, price: p.price })));
            return {} as Database;
        });

        jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
           throw new Error("DB error");
        });

        expect(getCart(username)).rejects.toThrow("DB error");
    });

    test("should handle all db error ", async () => {
        const expectedProducts = [
            new ProductInCart("testModel1", 2, Category.SMARTPHONE, 500),
            new ProductInCart("testModel2", 1, Category.LAPTOP, 1000)
        ];

        jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
            callback(null, [{ count: 1 }]);
            return {} as Database;
        });

        jest.spyOn(db, "all").mockImplementationOnce((sql, params, callback) => {
            throw new Error("DB error");
        });

        jest.spyOn(db, "get").mockImplementationOnce((sql, params, callback) => {
            callback(null, { total: 2500 });
            return {} as Database;
        });

        expect(getCart(username)).rejects.toThrow("DB error");
    });


  });