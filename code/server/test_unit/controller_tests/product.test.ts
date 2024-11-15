import { describe, test, expect, jest, afterEach, it } from "@jest/globals";

import ProductDao from "../../src/dao/productDAO";
import ProductController from "../../src/controllers/productController";
import { Role, User } from "../../src/components/user";
import { Category, Product } from "../../src/components/product";
import { InvalidCategoryError } from "../../src/errors/productError";

jest.mock("crypto");
jest.mock("../../src/db/db.ts");

describe("Product Controller Tests", () => {
  //-registerProducts---//
  describe("registerProducts", () => {
    afterEach(() => {
      jest.clearAllMocks(); // Ripristina tutti i mock dopo ogni test
    });

    test("should register products correctly", async () => {
      //definisco un user test
      const testUser = new User("test", "test", "test", Role.MANAGER, "", "");

      const testProduct = {
        //definisco un oggetto di product di test
        model: "modelTest",
        category: "modelCategory",
        quantity: 3,
        details: "modelDetails",
        sellingPrice: 3,
        arrivalDate: "2021-10-10",
      };

      //Mock il metodo registerProducts del DAO per restituire true
      jest
        .spyOn(ProductDao.prototype, "registerProducts")
        .mockResolvedValueOnce(true);

      const controller = new ProductController();

      //chiamare il metodo registerProducts del controller
      const response = await controller.registerProducts(
        testProduct.model,
        testProduct.category,
        testProduct.quantity,
        testProduct.details,
        testProduct.sellingPrice,
        testProduct.arrivalDate
      );

      // Aspettarsi che il metodo registerProducts del DAO sia stato chiamato una volta con i parametri corretti
      expect(ProductDao.prototype.registerProducts).toHaveBeenCalledTimes(1);
      expect(ProductDao.prototype.registerProducts).toHaveBeenCalledWith(
        testProduct.model,
        testProduct.category,
        testProduct.arrivalDate,
        testProduct.sellingPrice,
        testProduct.quantity,
        testProduct.details
      );

      //Aspettarsi che la risposta sia void, cioè undefined
      expect(response).toBeTruthy();
    });

    test("It should reject with an error", async () => {
      // Definisco un user test
      const testUser = new User("test", "test", "test", Role.MANAGER, "", "");

      const testProduct = {
        //definisco un oggetto di product di test
        model: "modelTest",
        category: "modelCategory",
        quantity: 3,
        details: "modelDetails",
        sellingPrice: 3,
        arrivalDate: "2021-10-10",
      };

      // Mock il metodo registerProducts del DAO per restituire una Promise rifiutata
      jest
        .spyOn(ProductDao.prototype, "registerProducts")
        .mockRejectedValueOnce(new Error("Product is not inserted"));

      const controller = new ProductController();

      // Aspettarsi che la chiamata a registerProducts del controller rigetti con l'errore "Product is not inserted"
      await expect(
        controller.registerProducts(
          testProduct.model,
          testProduct.category,
          testProduct.quantity,
          testProduct.details,
          testProduct.sellingPrice,
          testProduct.arrivalDate
        )
      ).rejects.toThrow("Product is not inserted");

      // Aspettarsi che il metodo registerProducts del DAO sia stato chiamato una volta con i parametri corretti
      expect(ProductDao.prototype.registerProducts).toHaveBeenCalledTimes(1);
      expect(ProductDao.prototype.registerProducts).toHaveBeenCalledWith(
        testProduct.model,
        testProduct.category,
        testProduct.arrivalDate,
        testProduct.sellingPrice,
        testProduct.quantity,
        testProduct.details
      );
    });
  });

  describe("changeProductQuantity", () => {
    afterEach(() => {
      jest.clearAllMocks(); // Ripristina tutti i mock dopo ogni test
    });

    test("It should resolve with the new quantity on success", async () => {
      const testProduct = {
        model: "modelTest",
        newQuantity: 5,
        changeDate: "2021-10-10",
      };

      // Mock il metodo changeProductQuantity del DAO per restituire la nuova quantità
      jest
        .spyOn(ProductDao.prototype, "changeProductQuantity")
        .mockResolvedValueOnce(testProduct.newQuantity);

      const controller = new ProductController();

      // Chiamare il metodo changeProductQuantity del controller
      const response = await controller.changeProductQuantity(
        testProduct.model,
        testProduct.newQuantity,
        testProduct.changeDate
      );

      // Aspettarsi che il metodo changeProductQuantity del DAO sia stato chiamato una volta con i parametri corretti
      expect(ProductDao.prototype.changeProductQuantity).toHaveBeenCalledTimes(
        1
      );
      expect(ProductDao.prototype.changeProductQuantity).toHaveBeenCalledWith(
        testProduct.model,
        testProduct.newQuantity,
        testProduct.changeDate
      );

      // Aspettarsi che la risposta sia la nuova quantità
      expect(response).toBe(testProduct.newQuantity);
    });

    test("It should reject with an error on failure", async () => {
      const testProduct = {
        model: "modelTest",
        newQuantity: 5,
        changeDate: "2021-10-10",
      };

      // Mock il metodo changeProductQuantity del DAO per restituire una Promise rifiutata
      jest
        .spyOn(ProductDao.prototype, "changeProductQuantity")
        .mockRejectedValueOnce(new Error("Database error"));

      const controller = new ProductController();

      // Aspettarsi che la chiamata a changeProductQuantity del controller rigetti con l'errore "Database error"
      await expect(
        controller.changeProductQuantity(
          testProduct.model,
          testProduct.newQuantity,
          testProduct.changeDate
        )
      ).rejects.toThrow("Database error");

      // Aspettarsi che il metodo changeProductQuantity del DAO sia stato chiamato una volta con i parametri corretti
      expect(ProductDao.prototype.changeProductQuantity).toHaveBeenCalledTimes(
        1
      );
      expect(ProductDao.prototype.changeProductQuantity).toHaveBeenCalledWith(
        testProduct.model,
        testProduct.newQuantity,
        testProduct.changeDate
      );
    });
  });

  describe("sellProduct", () => {
    afterEach(() => {
      jest.clearAllMocks(); // Ripristina tutti i mock dopo ogni test
    });

    test("It should resolve with the new quantity on success", async () => {
      const testProduct = {
        model: "modelTest",
        quantity: 3,
        sellingDate: "2021-10-10",
      };

      // Mock il metodo sellProduct del DAO per restituire la nuova quantità
      jest
        .spyOn(ProductDao.prototype, "sellProduct")
        .mockResolvedValueOnce(testProduct.quantity);

      const controller = new ProductController();

      // Chiamare il metodo sellProduct del controller
      const response = await controller.sellProduct(
        testProduct.model,
        testProduct.quantity,
        testProduct.sellingDate
      );

      // Aspettarsi che il metodo sellProduct del DAO sia stato chiamato una volta con i parametri corretti
      expect(ProductDao.prototype.sellProduct).toHaveBeenCalledTimes(1);
      expect(ProductDao.prototype.sellProduct).toHaveBeenCalledWith(
        testProduct.model,
        testProduct.quantity,
        testProduct.sellingDate
      );

      // Aspettarsi che la risposta sia la nuova quantità
      expect(response).toBe(testProduct.quantity);
    });

    test("It should reject with an error on failure", async () => {
      const testProduct = {
        model: "modelTest",
        quantity: 3,
        sellingDate: "2021-10-10",
      };

      // Mock il metodo sellProduct del DAO per restituire una Promise rifiutata
      jest
        .spyOn(ProductDao.prototype, "sellProduct")
        .mockRejectedValueOnce(new Error("Database error"));

      const controller = new ProductController();

      // Aspettarsi che la chiamata a sellProduct del controller rigetti con l'errore "Database error"
      await expect(
        controller.sellProduct(
          testProduct.model,
          testProduct.quantity,
          testProduct.sellingDate
        )
      ).rejects.toThrow("Database error");

      // Aspettarsi che il metodo sellProduct del DAO sia stato chiamato una volta con i parametri corretti
      expect(ProductDao.prototype.sellProduct).toHaveBeenCalledTimes(1);
      expect(ProductDao.prototype.sellProduct).toHaveBeenCalledWith(
        testProduct.model,
        testProduct.quantity,
        testProduct.sellingDate
      );
    });
  });

  describe("getProducts", () => {
    afterEach(() => {
      jest.clearAllMocks(); // Ripristina tutti i mock dopo ogni test
    });

    test("It should resolve with an array of products on success", async () => {
      const testProducts = [
        new Product(
          1000,
          "modelTest1",
          Category.LAPTOP,
          "2022-01-01",
          "Some details",
          10
        ),
        new Product(
          2000,
          "modelTest2",
          Category.LAPTOP,
          "2022-01-01",
          "Some details",
          20
        ),
      ];

      // Mock il metodo getProducts del DAO per restituire un array di prodotti
      jest
        .spyOn(ProductDao.prototype, "getProducts")
        .mockResolvedValueOnce(testProducts);

      const controller = new ProductController();

      // Chiamare il metodo getProducts del controller
      const response = await controller.getProducts(null, null, null);

      // Aspettarsi che il metodo getProducts del DAO sia stato chiamato una volta con i parametri corretti
      expect(ProductDao.prototype.getProducts).toHaveBeenCalledTimes(1);
      expect(ProductDao.prototype.getProducts).toHaveBeenCalledWith(
        null,
        null,
        null
      );

      // Aspettarsi che la risposta sia un array di prodotti
      expect(response).toEqual(testProducts);
    });

    test("It should reject with an error on failure", async () => {
      // Mock il metodo getProducts del DAO per restituire una Promise rifiutata
      jest
        .spyOn(ProductDao.prototype, "getProducts")
        .mockRejectedValueOnce(new Error("Database error"));

      const controller = new ProductController();

      // Aspettarsi che la chiamata a getProducts del controller rigetti con l'errore "Database error"
      await expect(controller.getProducts(null, null, null)).rejects.toThrow(
        "Database error"
      );

      // Aspettarsi che il metodo getProducts del DAO sia stato chiamato una volta con i parametri corretti
      expect(ProductDao.prototype.getProducts).toHaveBeenCalledTimes(1);
      expect(ProductDao.prototype.getProducts).toHaveBeenCalledWith(
        null,
        null,
        null
      );
    });
    test("It should resolve with an array of products of the same category on success", async () => {
      const testProducts = [
        new Product(
          1000,
          "modelTest1",
          Category.LAPTOP,
          "2022-01-01",
          "Some details",
          10
        ),
        new Product(
          2000,
          "modelTest2",
          Category.LAPTOP,
          "2022-01-01",
          "Some details",
          20
        ),
      ];
    
      // Mock the getProducts method of the DAO to return an array of products
      jest
        .spyOn(ProductDao.prototype, "getProducts")
        .mockResolvedValueOnce(testProducts);
    
      const controller = new ProductController();
    
      // Call the getProducts method of the controller
      const response = await controller.getProducts("category", Category.LAPTOP, null);
    
      // Expect the getProducts method of the DAO to have been called once with the correct parameters
      expect(ProductDao.prototype.getProducts).toHaveBeenCalledTimes(1);
      expect(ProductDao.prototype.getProducts).toHaveBeenCalledWith(
        "category",
        Category.LAPTOP,
        null
      );
    
      // Expect the response to be an array of products
      expect(response).toEqual(testProducts);
    });

    test("It should resolve with an array of products of the same model on success", async () => {
      const testProducts = [
        new Product(
          1000,
          "modelTest1",
          Category.LAPTOP,
          "2022-01-01",
          "Some details",
          10
        ),
        new Product(
          2000,
          "modelTest2",
          Category.LAPTOP,
          "2022-01-01",
          "Some details",
          20
        ),
      ];
    
      // Mock the getProducts method of the DAO to return an array of products
      jest
        .spyOn(ProductDao.prototype, "getProducts")
        .mockResolvedValueOnce([testProducts[0]]);
    
      const controller = new ProductController();
    
      // Call the getProducts method of the controller
      const response = await controller.getProducts("model", null, "modelTest1");
    
      // Expect the getProducts method of the DAO to have been called once with the correct parameters
      expect(ProductDao.prototype.getProducts).toHaveBeenCalledTimes(1);
      expect(ProductDao.prototype.getProducts).toHaveBeenCalledWith(
        "model",
        null,
        "modelTest1"
      );
    
      // Expect the response to be an array of products
      expect(response).toEqual([testProducts[0]]);
    });
    
    
    test("It should reject with an error on failure", async () => {
      // Mock the getProducts method of the DAO to return a rejected Promise
      jest
        .spyOn(ProductDao.prototype, "getProducts")
        .mockRejectedValueOnce(new Error("Database error"));
    
      const controller = new ProductController();
    
      // Expect the call to getProducts of the controller to reject with the error "Database error"
      await expect(controller.getProducts("category", Category.LAPTOP, null)).rejects.toThrow(
        "Database error"
      );
    
      // Expect the getProducts method of the DAO to have been called once with the correct parameters
      expect(ProductDao.prototype.getProducts).toHaveBeenCalledTimes(1);
      expect(ProductDao.prototype.getProducts).toHaveBeenCalledWith(
        "category",
        Category.LAPTOP,
        null
      );
    });
    test("It should reject with an error on invalid category request", async () => {
      // Mock the getProducts method of the DAO to return a rejected Promise
      jest
        .spyOn(ProductDao.prototype, "getProducts")
        .mockRejectedValueOnce(new InvalidCategoryError());
    
      const controller = new ProductController();
    
      // Expect the call to getProducts of the controller to reject with the error "InvalidCategoryError"
      await expect(controller.getProducts("category", "InvalidCategory", null)).rejects.toThrow(
        new InvalidCategoryError()
      );
    
      // Expect the getProducts method of the DAO to have been called once with the correct parameters
      expect(ProductDao.prototype.getProducts).toHaveBeenCalledTimes(1);
      expect(ProductDao.prototype.getProducts).toHaveBeenCalledWith(
        "category",
        "InvalidCategory",
        null
      );
    });
  });

  describe ("getAvailableProducts", () =>{

  test("It should resolve with an array of available products on success", async () => {
    const testProducts = [
      new Product(
        1000,
        "modelTest1",
        Category.LAPTOP,
        "2022-01-01",
        "Some details",
        10
      ),
      new Product(
        2000,
        "modelTest2",
        Category.LAPTOP,
        "2022-01-01",
        "Some details",
        20
      ),
    ];

    // Mock il metodo getAvailableProducts del DAO per restituire un array di prodotti
    jest
      .spyOn(ProductDao.prototype, "getAvailableProducts")
      .mockResolvedValueOnce(testProducts);

    const controller = new ProductController();

    // Chiamare il metodo getAvailableProducts del controller
    const response = await controller.getAvailableProducts(null, null, null);

    // Aspettarsi che il metodo getAvailableProducts del DAO sia stato chiamato una volta con i parametri corretti
    expect(ProductDao.prototype.getAvailableProducts).toHaveBeenCalledTimes(1);
    expect(ProductDao.prototype.getAvailableProducts).toHaveBeenCalledWith(
      null,
      null,
      null
    );

    // Aspettarsi che la risposta sia un array di prodotti
    expect(response).toEqual(testProducts);
  });
  test("It should resolve with an array of available products of the same model on success", async () => {
    const testProducts = [
      new Product(
        1000,
        "modelTest1",
        Category.LAPTOP,
        "2022-01-01",
        "Some details",
        10
      ),
      new Product(
        2000,
        "modelTest2",
        Category.LAPTOP,
        "2022-01-01",
        "Some details",
        20
      ),
    ];
  
    // Mock the getProducts method of the DAO to return an array of products
    jest
      .spyOn(ProductDao.prototype, "getAvailableProducts")
      .mockResolvedValueOnce([testProducts[0]]);
  
    const controller = new ProductController();
  
    // Call the getProducts method of the controller
    const response = await controller.getAvailableProducts("model", null, "modelTest1");
  
    // Expect the getProducts method of the DAO to have been called once with the correct parameters
    expect(ProductDao.prototype.getAvailableProducts).toHaveBeenCalledTimes(1);
    expect(ProductDao.prototype.getAvailableProducts).toHaveBeenCalledWith(
      "model",
      null,
      "modelTest1"
    );
  
    // Expect the response to be an array of products
    expect(response).toEqual([testProducts[0]]);
  });
  
  test("It should resolve with an array of available products of the same category on success", async () => {
    const testProducts = [
      new Product(
        1000,
        "modelTest1",
        Category.LAPTOP,
        "2022-01-01",
        "Some details",
        10
      ),
      new Product(
        2000,
        "modelTest2",
        Category.LAPTOP,
        "2022-01-01",
        "Some details",
        20
      ),
    ];
  
    // Mock the getProducts method of the DAO to return an array of products
    jest
      .spyOn(ProductDao.prototype, "getAvailableProducts")
      .mockResolvedValueOnce(testProducts);
  
    const controller = new ProductController();
  
    // Call the getProducts method of the controller
    const response = await controller.getAvailableProducts("category", Category.LAPTOP, null);
  
    // Expect the getProducts method of the DAO to have been called once with the correct parameters
    expect(ProductDao.prototype.getAvailableProducts).toHaveBeenCalledTimes(1);
    expect(ProductDao.prototype.getAvailableProducts).toHaveBeenCalledWith(
      "category",
      Category.LAPTOP,
      null
    );
  
    // Expect the response to be an array of products
    expect(response).toEqual(testProducts);
  });


  test("It should reject with an error on failure", async () => {
    const testError = new Error("Test error");

    // Mock il metodo getAvailableProducts del DAO per rifiutare con un errore
    jest
      .spyOn(ProductDao.prototype, "getAvailableProducts")
      .mockRejectedValueOnce(testError);

    const controller = new ProductController();

    // Aspettarsi che la chiamata al metodo getAvailableProducts del controller sia rifiutata con l'errore di test
    await expect(
      controller.getAvailableProducts(null, null, null)
    ).rejects.toEqual(testError);

    // Aspettarsi che il metodo getAvailableProducts del DAO sia stato chiamato una volta con i parametri corretti
    expect(ProductDao.prototype.getAvailableProducts).toHaveBeenCalledTimes(1);
    expect(ProductDao.prototype.getAvailableProducts).toHaveBeenCalledWith(
      null,
      null,
      null
    );
  });
});

  describe("deleteAllProducts", () => {
    test("It should resolve with true when all products are successfully deleted", async () => {
      // Mock il metodo deleteAllProducts del DAO per restituire true
      jest
        .spyOn(ProductDao.prototype, "deleteAllProducts")
        .mockResolvedValueOnce(true);

      const controller = new ProductController();

      // Chiamare il metodo deleteAllProducts del controller
      const response = await controller.deleteAllProducts();

      // Aspettarsi che il metodo deleteAllProducts del DAO sia stato chiamato una volta
      expect(ProductDao.prototype.deleteAllProducts).toHaveBeenCalledTimes(1);

      // Aspettarsi che la risposta sia true
      expect(response).toEqual(true);
    });

    test("It should reject with an error when the deletion fails", async () => {
      const testError = new Error("Test error");

      // Mock il metodo deleteAllProducts del DAO per rifiutare con un errore
      jest
        .spyOn(ProductDao.prototype, "deleteAllProducts")
        .mockRejectedValueOnce(testError);

      const controller = new ProductController();

      // Aspettarsi che la chiamata al metodo deleteAllProducts del controller sia rifiutata con l'errore di test
      await expect(controller.deleteAllProducts()).rejects.toEqual(testError);

      // Aspettarsi che il metodo deleteAllProducts del DAO sia stato chiamato una volta
      expect(ProductDao.prototype.deleteAllProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteProduct", () => {
    test("It should resolve with true when the product is successfully deleted", async () => {
      const testModel = "modelTest1";

      // Mock il metodo deleteProduct del DAO per restituire true
      jest
        .spyOn(ProductDao.prototype, "deleteProduct")
        .mockResolvedValueOnce(true);

      const controller = new ProductController();

      // Chiamare il metodo deleteProduct del controller
      const response = await controller.deleteProduct(testModel);

      // Aspettarsi che il metodo deleteProduct del DAO sia stato chiamato una volta con il modello corretto
      expect(ProductDao.prototype.deleteProduct).toHaveBeenCalledTimes(1);
      expect(ProductDao.prototype.deleteProduct).toHaveBeenCalledWith(
        testModel
      );

      // Aspettarsi che la risposta sia true
      expect(response).toEqual(true);
    });

    test("It should reject with an error when the deletion fails", async () => {
      const testModel = "modelTest1";
      const testError = new Error("Test error");

      // Mock il metodo deleteProduct del DAO per rifiutare con un errore
      jest
        .spyOn(ProductDao.prototype, "deleteProduct")
        .mockRejectedValueOnce(testError);

      const controller = new ProductController();

      // Aspettarsi che la chiamata al metodo deleteProduct del controller sia rifiutata con l'errore di test
      await expect(controller.deleteProduct(testModel)).rejects.toEqual(
        testError
      );

      // Aspettarsi che il metodo deleteProduct del DAO sia stato chiamato una volta con il modello corretto
      expect(ProductDao.prototype.deleteProduct).toHaveBeenCalledTimes(1);
      expect(ProductDao.prototype.deleteProduct).toHaveBeenCalledWith(
        testModel
      );
    });
  });
});

afterEach(() => {
  jest.clearAllMocks(); // Ripristina tutti i mock dopo ogni test
});
