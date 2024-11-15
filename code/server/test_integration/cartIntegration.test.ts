import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from "@jest/globals";
import request from "supertest";
import { app } from "../index";
import db from "../src/db/db";
import { Product, Category } from "../src/components/product";
import { Cart } from "../src/components/cart";

import UserDAO from "../src/dao/userDAO";
import CartDAO from "../src/dao/cartDAO";
import ProductDAO from "../src/dao/productDAO";
import { cleanup } from "../src/db/cleanup";

const currentDate: Date = new Date();
const formattedDate: string = currentDate.toISOString().split("T")[0];

const productDao = new ProductDAO();
const cartDao = new CartDAO();
const userDao = new UserDAO();
const baseURL = "/ezelectronics";

async function cleanupCart() {
  db.run("DELETE FROM cart");
}

async function cleanUpCartProduct() {
  db.run("DELETE FROM cartProduct");
}

async function cleanupProducts() {
  db.run("DELETE FROM productDescriptor");
}

async function cleanupUsers() {
  db.run("DELETE FROM users");
}

const customer = {
  username: "customer",
  name: "customer",
  surname: "customer",
  password: "customer",
  role: "Customer",
};
const admin = {
  username: "admin",
  name: "admin",
  surname: "admin",
  password: "admin",
  role: "Admin",
};

const manager = {
  username: "manager",
  name: "manager",
  surname: "manager",
  password: "manager",
  role: "Manager",
};

const testProduct1 = {
  //definisco un oggetto di product di test
  model: "modelTest",
  category: Category.SMARTPHONE,
  quantity: 3,
  details: "modelDetails",
  sellingPrice: 3,
  arrivalDate: "2021-10-10",
};

const testProduct2 = {
  //definisco un oggetto di product di test
  model: "modelTest2",
  category: Category.SMARTPHONE,
  quantity: 3,
  details: "modelDetails",
  sellingPrice: 3,
  arrivalDate: "2021-10-10",
};

const testProduct3 = {
  //definisco un oggetto di product di test
  model: "modelTest3",
  category: Category.SMARTPHONE,
  quantity: 1,
  details: "modelDetails",
  sellingPrice: 3,
  arrivalDate: "2021-10-10",
};

let customerCookie: string;
let adminCookie: string;
let managerCookie: string;

const postUser = async (userInfo: any) => {
  await request(app).post(`${baseURL}/users`).send(userInfo).expect(200);
};

const postProduct = async (productInfo: any, sessionID: string) => {
  await request(app)
    .post(`${baseURL}/products`)
    .set("Cookie", sessionID)
    .send(productInfo)
    .expect(200);
};

const login = async (userInfo: any) => {
  return new Promise<string>((resolve, reject) => {
    request(app)
      .post(`${baseURL}/sessions`)
      .send(userInfo)
      .expect(200)
      .end((err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.header["set-cookie"][0]);
      });
  });
};

beforeAll(async () => {
  cleanup();

  await postUser(admin);
  adminCookie = await login(admin);

  await postUser(customer);
  customerCookie = await login(customer);

  await postUser(manager);
  managerCookie = await login(manager);
});

afterAll(() => {
  cleanup();
});

describe("Cart Integration Tests", () => {

  describe("AddtoCart integration tests", () => {
    beforeEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    });

    afterEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    });
    test("Add a product to the cart", async () => {
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      const addProductToCart = await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest" })
        .expect(200);
    }, 10000);

    test("Add a product to the cart that does not exist", async () => {
      const addProductToCart = await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "model111", quantity: 1 })
        .expect(404);
    }, 10000);

    test("Add a product with quantity 0 to the cart ", async () => {
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct3);

      const testzero = { quantity: 1, sellingDate: formattedDate };

      await request(app)
        .patch(`${baseURL}/products/modelTest3/sell`)
        .send(testzero)
        .set("Cookie", managerCookie);

      const addProductToCart = await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest3", quantity: 1 })
        .expect(409);
    }, 10000);
  });
  describe("GetCart integration tests", () => {

    beforeEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    });

    afterEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    });
    test("Get the cart of a customer", async () => {
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest3", quantity: 1 });

      const getCart = await request(app)
        .get(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .expect(200);

      
    }, 10000);

    test("It should return an empty Cart object if there is no information about an unpaid cart in the database, or if there is an unpaid cart with no products", async () => {
      // Try to get the cart of a customer without creating a cart or adding products to it
      const getCart = await request(app)
        .get(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .expect(200);

      // Check that the returned cart is empty
      expect(getCart.body).toEqual({
        customer: "customer",
        paid: false,
        paymentDate: null,
        total: 0,
        products: [],
      });
    }, 10000);

    test("It should return a Cart object with no products if there is an unpaid cart with no products", async () => {
      // Create a cart for the customer without adding any products to it
      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send();

      // Try to get the cart of the customer
      const getCart = await request(app)
        .get(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .expect(200);

      // Check that the returned cart has no products
      expect(getCart.body).toEqual({
        customer: "customer",
        paid: false,
        paymentDate: null,
        total: 0,
        products: [],
      });
    }, 10000);

    test("It should return an error when called by a user who is not logged in", async () => {
      // Try to get the cart without setting a cookie
      const getCart = await request(app).get(`${baseURL}/carts`).expect(401); // Expecting an Unauthorized error
    }, 10000);

    test("It should return an error when called by a user who is not a customer", async () => {
      // Try to get the cart with a cookie of a user who is not a customer
      const getCart = await request(app)
        .get(`${baseURL}/carts`)
        .set("Cookie", adminCookie)
        .expect(401); // Expecting a Forbidden error
    }, 10000);
  });
  describe("CheckoutCart integration tests", () => {
    beforeEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    });

    afterEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    });

    test("Checkout the cart of a customer", async () => {
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest", quantity: 1 });

      const checkoutCart = await request(app)
        .patch(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .expect(200);

      cleanUpCartProduct();
      cleanupCart();
    });

    test("Checkout the cart of a not logged user", async () => {
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest", quantity: 1 });

      const checkoutCart = await request(app)
        .patch(`${baseURL}/carts`)
        .expect(401);

      cleanUpCartProduct();
      cleanupCart();
    });

    test("Checkout the cart - not called by a customer", async () => {
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest", quantity: 1 });

      const checkoutCart = await request(app)
        .patch(`${baseURL}/carts`)
        .set("Cookie", managerCookie)
        .expect(401);

      cleanUpCartProduct();
      cleanupCart();
    });

    test("Checkout the cart - no unpaid cart in the database", async () => {
      // Create a product
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      // Do not create a cart

      // Try to checkout the cart
      const checkoutCart = await request(app)
        .patch(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .expect(404); // Expecting a Not Found error

    
    });

    test("Checkout the cart - unpaid cart with no products", async () => {
      //create a test product
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      // Create a cart for the customer

      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send(testProduct1);

      //delete the product from the cart

      await request(app)
        .delete(`${baseURL}/carts/products/modelTest`)
        .set("Cookie", customerCookie);

      // Try to checkout the cart
      const checkoutCart = await request(app)
        .patch(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .expect(400); // Expecting a Bad Request error

     
    });

    test("Checkout the cart - at least one product in the cart whose available quantity in the stock is 0 ", async () => {
      // Create a product
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      // Create a cart for the customer
      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest" });

      await request(app)
        .patch(`${baseURL}/products/modelTest/sell`)
        .set("Cookie", managerCookie)
        .send({ quantity: 3, sellingDate: formattedDate });

      // Try to checkout the cart
      const checkoutCart = await request(app)
        .patch(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .expect(409); // Expecting a Conflict error

      // Cleanup
      cleanUpCartProduct();
      cleanupCart();
    });

    test("Checkout the cart - product quantity in cart is greater than available stock", async () => {
      // Create a product with limited stock
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send({ ...testProduct1, quantity: 1 });

      // Create a cart and add more quantity of the product than available in stock
      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: testProduct1.model });

      // Sell the only available product
      await request(app)
        .patch(`${baseURL}/products/${testProduct1.model}/sell`)
        .set("Cookie", managerCookie)
        .send({ quantity: 1, sellingDate: formattedDate });

      // Try to checkout the cart
      const checkoutCart = await request(app)
        .patch(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .expect(409); // Expecting a Conflict error

     
    });
  });

  describe("GetCartHistory integration tests", () => {
    beforeEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    });

    afterEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    });

    test("Get the history of the carts of a customer", async () => {
      // Create a product
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      // Create a cart for the customer
      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest" });

      // Checkout the cart
      await request(app)
        .patch(`${baseURL}/carts`)
        .set("Cookie", customerCookie);

      // Get the history of the carts of the customer
      const getCartHistory = await request(app)
        .get(`${baseURL}/carts/history`)
        .set("Cookie", customerCookie)
        .expect(200);

      // Check that the history of the carts of the customer is correct
      expect(getCartHistory.body).toEqual([
        {
          customer: "customer",
          paid: true,
          paymentDate: formattedDate,
          total: 3,
          products: [
            {
              model: "modelTest",
              category: Category.SMARTPHONE,
              quantity: 1,
              price: 3,
            },
          ],
        },
      ]);
    });

    test("Get the history of the carts of a customer - no carts in the database", async () => {
      // Get the history of the carts of the customer
      const getCartHistory = await request(app)
        .get(`${baseURL}/carts/history`)
        .set("Cookie", customerCookie)
        .expect(200);

      // Check that the history of the carts of the customer is empty
      expect(getCartHistory.body).toEqual([]);
    });

    test("Get the history of the carts of a customer - not called by a customer", async () => {
      // Get the history of the carts of the customer with a cookie of a user who is not a customer
      const getCartHistory = await request(app)
        .get(`${baseURL}/carts/history`)
        .set("Cookie", adminCookie)
        .expect(401); // Expecting a Forbidden error
    });
  });

  describe("DeleteProductFromCart integration tests", () => {
    
    beforeEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    });

    afterEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    });

    test("Delete a product from the cart of a customer", async () => {
      // Create a product
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      // Create a cart for the customer
      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest" });

      // Delete the product from the cart
      const deleteProductFromCart = await request(app)
        .delete(`${baseURL}/carts/products/modelTest`)
        .set("Cookie", customerCookie)
        .expect(200);

      // Check that the product was deleted from the cart
      const getCart = await request(app)
        .get(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .expect(200);

      expect(getCart.body).toEqual({
        customer: "customer",
        paid: false,
        paymentDate: null,
        total: 0,
        products: [],
      });
    },1000000);

    test("Delete a product from the cart of a customer - product not in the cart", async () => {
      // Create a product
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      // Create a cart for the customer
      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest" });

      // Delete a product that is not in the cart
      const deleteProductFromCart = await request(app)
        .delete(`${baseURL}/carts/products/modelTest2`)
        .set("Cookie", customerCookie)
        .expect(404); // Expecting a Not Found error
    });

    test("Delete a product from the cart of a customer - not existing product ", async () => {
      

      // Create a cart for the customer
      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest" });

      // Delete a product that is not in the cart
      const deleteProductFromCart = await request(app)
        .delete(`${baseURL}/carts/products/modelTest`)
        .set("Cookie", customerCookie)
        .expect(404); // Expecting a Not Found error
    });

    test("Delete a product from the cart of a customer - not existing unpaid cart for the user ", async () => {
  
     
      // Delete a product that is not in the cart
      const deleteProductFromCart = await request(app)
        .delete(`${baseURL}/carts/products/modelTest`)
        .set("Cookie", customerCookie)
        .expect(404); // Expecting a Not Found error
    });

    test("Delete a product from the cart of a customer - not called by a customer", async () => {
      // Delete a product from the cart with a cookie of a user who is not a customer
      const deleteProductFromCart = await request(app)
        .delete(`${baseURL}/carts/products/modelTest`)
        .set("Cookie", adminCookie)
        .expect(401); // Expecting a Forbidden error
    });

    test("Delete a product from an empty cart", async () => {
      // Create a product
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      // Create a cart for the customer
      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest" });

      // Delete a product that is in the cart
      const deleteProductFromCart = await request(app)
        .delete(`${baseURL}/carts/products/modelTest`)
        .set("Cookie", customerCookie)
        .expect(200); // Expecting a Not Found error

      // Delete a product that is not in the cart
      const deleteProductFromCart2 = await request(app)
      .delete(`${baseURL}/carts/products/modelTest`)
      .set("Cookie", customerCookie)
      .expect(404); // Expecting a Not Found error

    });




  });

  describe("clearCart integration tests", () => {



    beforeEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    });

    afterEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    });

    test("Clear the cart of a customer - total set to 0 ", async () => {
      // Create a product
      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      // Create a cart for the customer
      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest" });

      // Clear the cart
      const clearCart = await request(app)
        .delete(`${baseURL}/carts/current`)
        .set("Cookie", customerCookie)
        .expect(200);

      // Check that the cart is empty
      const getCart = await request(app)
        .get(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .expect(200);

      expect(getCart.body).toEqual({
        customer: "customer",
        paid: false,
        paymentDate: null,
        total: 0,
        products: [],
      });
    });

    test("Clear the cart of a customer - not called by a customer", async () => {
      // Clear the cart with a cookie of a user who is not a customer
      const clearCart = await request(app)
        .delete(`${baseURL}/carts/current`)
        .set("Cookie", adminCookie)
        .expect(401); // Expecting a Forbidden error
    });

    test("Clear the cart of a customer - no unpaid cart in the database", async () => {
      // Clear the cart of the customer without creating a cart
      const clearCart = await request(app)
        .delete(`${baseURL}/carts/current`)
        .set("Cookie", customerCookie)
        .expect(404); // Expecting a Not Found error
    });






   
  });

  describe("deleteAllCarts integration tests", () => {

    beforeEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    } );  

    afterEach(async () => {
      cleanUpCartProduct();
      cleanupCart();
      cleanupProducts();
    });

    test("Delete all the carts - no carts in the database", async () => {
      // Delete all the carts
      const deleteAllCarts = await request(app)
        .delete(`${baseURL}/carts`)
        .set("Cookie", adminCookie)
        .expect(200); 
    });

    test("Delete all the carts - called by a customer", async () => {
      // Delete all the carts
      const deleteAllCarts = await request(app)
        .delete(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .expect(401); 
    });

    test("Delete all the carts ", async () => {

      // Create a product

      await request(app)
        .post(`${baseURL}/products`)
        .set("Cookie", managerCookie)
        .send(testProduct1);

      // Create a cart for the customer
      await request(app)
        .post(`${baseURL}/carts`)
        .set("Cookie", customerCookie)
        .send({ model: "modelTest" });

      // Delete all the carts
      const deleteAllCarts = await request(app)
      .delete(`${baseURL}/carts`)
      .set("Cookie", adminCookie)
      .expect(200); 
    
      // Check that there are no carts left
      const getCarts = await request(app)
        .get(`${baseURL}/carts/all`)
        .set("Cookie", adminCookie);
    
      expect(getCarts.body.length).toBe(0);
    });



    


  });
});
