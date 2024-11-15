import { describe, test, expect, jest, afterEach } from "@jest/globals";
import ProductDAO from "../../src/dao/productDAO";
import db from "../../src/db/db";
import { Database } from "sqlite3";
import { Product, Category } from "../../src/components/product";
import {
  ProductAlreadyExistsError,
  ProductNotFoundError,
  InvalidDateError,
  EmptyProductStockError,
  LowProductStockError,
  InvalidCategoryError,
  InvalidGroupingError,
} from "../../src/errors/productError";
import { SyntheticModule } from "vm";

jest.mock("../../src/db/db.ts");

const mockProduct = new Product(
  1000, // sellingPrice
  "Model123", // model
  Category.LAPTOP, // category
  "2022-01-01", // arrivalDate
  "This is a mock product", // details
  10 // quantity
);

describe("ProductDAO tests", () => {
  //Example of unit test for the registerProducts method
  //It mocks the database run method to simulate a successful insertion of some products
  //It then calls the registerProducts method and expects it to resolve true

  describe("ProductDAO registerProducts tests", () => {
    test("It should resolve true", async () => {
      const productDAO = new ProductDAO();
      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });

      const sellingPrice = 50; // Define sellingPrice
      const quantity = 10; // Define quantity

      const result = await productDAO.registerProducts(
        "model",
        Category.APPLIANCE,
        "2021-10-10",
        sellingPrice,
        quantity,
        "details"
      );

      expect(result).toBe(true);
      mockDBRun.mockRestore();
    });

    //example of unit test for the registerProducts method
    //it should return invaliddateerror when arrivaldate is after the current date

    test("It should reject with InvalidDateError when arrival date is after the current date", async () => {
      const productDAO = new ProductDAO();

      // Mock the getProduct method to return a product

      const mockProduct = new Product(
        1000, // sellingPrice
        "Model123", // model
        Category.LAPTOP, // category
        "2026-10-10", // arrivalDate that is after the current date
        "This is a mock product", // details
        10 // quantity
      );

      jest.spyOn(productDAO, "getProducts").mockResolvedValue([mockProduct]);

      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(null);
          return {} as Database;
        });

      // Try to register the existing product
      await expect(
        productDAO.registerProducts(
          mockProduct.model,
          mockProduct.category,
          mockProduct.arrivalDate,
          mockProduct.sellingPrice,
          mockProduct.quantity,
          mockProduct.details
        )
      ).rejects.toThrow(InvalidDateError);

      mockDBRun.mockRestore();
    });

    //Example of unit test for the registerProducts method
    //It mocks the database run method to simulate a failed insertion of some products due to a UNIQUE constraint failure
    //It then calls the registerProducts method and expects it to reject with a ProductAlreadyExistsError

    test("It should reject with ProductAlreadyExistsError when trying to insert an existing product", async () => {
      const productDAO = new ProductDAO();

      // Mock the getProduct method to return a product

      const mockProduct = new Product(
        1000, // sellingPrice
        "Model123", // model
        Category.LAPTOP, // category
        "2022-01-01", // arrivalDate
        "This is a mock product", // details
        10 // quantity
      );

      jest.spyOn(productDAO, "getProducts").mockResolvedValue([mockProduct]);

      // Mock the db.run method to simulate a UNIQUE constraint failure
      const mockDBRun = jest
        .spyOn(db, "run")
        .mockImplementation((sql, params, callback) => {
          callback(
            new Error("UNIQUE constraint failed: productDescriptor.model")
          );
          return {} as Database;
        });

      // Try to register the existing product
      await expect(
        productDAO.registerProducts(
          mockProduct.model,
          mockProduct.category,
          mockProduct.arrivalDate,
          mockProduct.sellingPrice,
          mockProduct.quantity,
          mockProduct.details
        )
      ).rejects.toThrow(ProductAlreadyExistsError);

      mockDBRun.mockRestore();
    });

    //Example of unit test for the registerProducts method
    //It mocks the database run method to simulate an error that is not a UNIQUE constraint failure
    //It then calls the registerProducts method and expects it to reject with the correct error
    //The DB encounters an error during the execution of the query and passes it to the callback function

    test("should reject with the correct error on db.run error", async () => {
      const mockError = new Error("Some db error");
      const productDAO = new ProductDAO();

      jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(mockError);
        return {} as Database;
      });

      // Try to register the existing product
      await expect(
        productDAO.registerProducts(
          mockProduct.model,
          mockProduct.category,
          mockProduct.arrivalDate,
          mockProduct.sellingPrice,
          mockProduct.quantity,
          mockProduct.details
        )
      ).rejects.toThrow(mockError);
    });

    //Example of unit test for the registerProducts method
    //It mocks the database run method to simulate an error that is thrown in the try block
    //It then calls the registerProducts method and expects it to reject with the correct error
    //The DB encounters an error during the execution of the query and passes it to the callback function

    test("should reject with the correct error on try block error", async () => {
      const productDAO = new ProductDAO();
      const mockError = new Error("Some try block error");
      jest.spyOn(db, "run").mockImplementation(() => {
        throw mockError;
      });

      await expect(
        productDAO.registerProducts(
          mockProduct.model,
          mockProduct.category,
          mockProduct.arrivalDate,
          mockProduct.sellingPrice,
          mockProduct.quantity,
          mockProduct.details
        )
      ).rejects.toThrow(mockError);
    });
  });

  describe("ProductDAO changeProductQuantity tests", () => {
    //Example of unit test for the changeProductQuantity method
    // Test when db.get returns an error

    test("should reject with the correct error on db.get error", async () => {
      const productDAO = new ProductDAO();
      const mockError = new Error("Some db.get error");
      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(mockError, null);
        return {} as Database;
      });

      await expect(
        productDAO.changeProductQuantity("model1", 10, "2022-01-01")
      ).rejects.toThrow(mockError);
    });

    // Test when the changedate is greater than the current date

    test("should reject with InvalidDateError when changeDate > currentDate", async () => {
      const productDAO = new ProductDAO();

      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { arrivalDate: "2024-02-01", quantity: 20 });
        return {} as Database;
      });

      await expect(
        productDAO.changeProductQuantity("model1", 10, "2026-01-01")
      ).rejects.toThrow(InvalidDateError);
    });

    // Test when db.get returns no row

    test("should reject with ProductNotFoundError when no product found", async () => {
      const productDAO = new ProductDAO();
      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, undefined);
        return {} as Database;
      });

      await expect(
        productDAO.changeProductQuantity("model1", 10, "2022-01-01")
      ).rejects.toThrow(ProductNotFoundError);
    });

    // Test when the arrivalDate is greater than the changeDate

    test("should reject with InvalidDateError when arrivalDate > changeDate", async () => {
      const productDAO = new ProductDAO();
      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { arrivalDate: "2022-01-02", quantity: 20 });
        return {} as Database;
      });

      await expect(
        productDAO.changeProductQuantity("model1", 10, "2022-01-01")
      ).rejects.toThrow(InvalidDateError);
    });

    // Test when db.run returns an error

    test("should reject with the correct error on db.run error", async () => {
      const productDAO = new ProductDAO();
      const mockError = new Error("Some db.run error");
      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { arrivalDate: "2022-01-01", quantity: 20 });
        return {} as Database;
      });
      jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(mockError);
        return {} as Database;
      });

      await expect(
        productDAO.changeProductQuantity("model1", 10, "2022-02-01")
      ).rejects.toThrow(mockError);
    });

    // Test when everything is successful

    test("should resolve with the updated quantity on success", async () => {
      const productDAO = new ProductDAO();
      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { arrivalDate: "2022-01-01", quantity: 20 });
        return {} as Database;
      });
      jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null);
        return {} as Database;
      });

      await expect(
        productDAO.changeProductQuantity("model1", 10, "2022-02-01")
      ).resolves.toBe(30);
    });

    // Test when an error is thrown in the try block

    test("should reject with the correct error on try block error", async () => {
      const productDAO = new ProductDAO();
      const mockError = new Error("Some try block error");
      jest.spyOn(db, "get").mockImplementation(() => {
        throw mockError;
      });

      await expect(
        productDAO.changeProductQuantity("model1", 10, "2022-01-01")
      ).rejects.toThrow(mockError);
    });
  });

  describe("ProductDAO sellProduct tests", () => {

    // Test when db.get returns an error

    test("should reject with the correct error on db.get error", async () => {
      const productDAO = new ProductDAO();
      const mockError = new Error("Some db.get error");
      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(mockError, null);
        return {} as Database;
      });

      await expect(
        productDAO.sellProduct("model1", 10, "2022-01-01")
      ).rejects.toThrow(mockError);
    });

    // Test when db.get returns no row

    test("should reject with ProductNotFoundError when no product found", async () => {
      const productDAO = new ProductDAO();
      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, undefined);
        return {} as Database;
      });

      await expect(
        productDAO.sellProduct("model1", 10, "2022-01-01")
      ).rejects.toThrow(ProductNotFoundError);
    });

    // Test when the arrivalDate is greater than the sellingDate

    test("should reject with InvalidDateError when arrivalDate > sellingDate", async () => {
      const productDAO = new ProductDAO();
      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { arrivalDate: "2022-01-02", quantity: 20 });
        return {} as Database;
      });

      await expect(
        productDAO.sellProduct("model1", 10, "2022-01-01")
      ).rejects.toThrow(InvalidDateError);
    });

    // Test when the sellingDate is greater than the currentDate
    test("should reject with InvalidDateError when sellingDate > currentDate", async () => {
      const productDAO = new ProductDAO();
      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { arrivalDate: "2022-02-01", quantity: 20 });
        return {} as Database;
      });

      await expect(
        productDAO.sellProduct("model1", 10, "2026-01-01")
      ).rejects.toThrow(InvalidDateError);
    });

    // Test when the currentQuantity is 0
    test("should reject with EmptyProductStockError when currentQuantity is 0", async () => {
      const productDAO = new ProductDAO();
      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { arrivalDate: "2022-01-01", quantity: 0 });
        return {} as Database;
      });

      await expect(
        productDAO.sellProduct("model1", 10, "2022-02-01")
      ).rejects.toThrow(EmptyProductStockError);
    });

    // Test when the currentQuantity is less than the selling quantity
    test("should reject with LowProductStockError when currentQuantity < selling quantity", async () => {
      const productDAO = new ProductDAO();
      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { arrivalDate: "2022-01-01", quantity: 5 });
        return {} as Database;
      });

      await expect(
        productDAO.sellProduct("model1", 10, "2022-02-01")
      ).rejects.toThrow(LowProductStockError);
    });

    // Test when db.run returns an error
    test("should reject with the correct error on db.run error", async () => {
      const productDAO = new ProductDAO();
      const mockError = new Error("Some db.run error");
      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { arrivalDate: "2022-01-01", quantity: 20 });
        return {} as Database;
      });
      jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(mockError);
        return {} as Database;
      });

      await expect(
        productDAO.sellProduct("model1", 10, "2022-02-01")
      ).rejects.toThrow(mockError);
    });

    // Test when everything is successful
    test("should resolve with the updated quantity on success", async () => {
      const productDAO = new ProductDAO();
      jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { arrivalDate: "2022-01-01", quantity: 20 });
        return {} as Database;
      });
      jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null);
        return {} as Database;
      });

      await expect(
        productDAO.sellProduct("model1", 10, "2022-02-01")
      ).resolves.toBe(10);
    });

    test("should reject with the correct error on synchronous try block error", async () => {
      const productDAO = new ProductDAO();
      const mockError = new Error("Some synchronous try block error");

      const originalDbGet = db.get;
      db.get = () => {
        throw mockError;
      };

      await expect(
        productDAO.sellProduct("model1", 10, "2022-01-01")
      ).rejects.toThrow(mockError);

      db.get = originalDbGet; // Restore original method after test
    });
  });

  describe("ProductDAO getProduct tests", () => {


    // Test when db.all returns an error
    test("should reject with the correct error on db.all error", async () => {
      const productDAO = new ProductDAO();
      const mockError = new Error("Some db.all error");
      jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(mockError, null);
        return {} as Database;
      });

      await expect(productDAO.getProducts(null, null, null)).rejects.toThrow(
        mockError
      );
    });


    // Test when everything is successful
    test("should resolve with the correct products on success", async () => {
      const productDAO = new ProductDAO();
      const mockProducts = [
        {
          sellingPrice: 100,
          model: "model1",
          category: Category.SMARTPHONE,
          arrivalDate: "2022-01-01",
          details: "details1",
          quantity: 10,
        },
        {
          sellingPrice: 200,
          model: "model2",
          category: Category.LAPTOP,
          arrivalDate: "2022-02-01",
          details: "details2",
          quantity: 20,
        },
      ];
      jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null, mockProducts);
        return {} as Database;
      });

      const expectedProducts = mockProducts.map(
        (p) =>
          new Product(
            p.sellingPrice,
            p.model,
            p.category,
            p.arrivalDate,
            p.details,
            p.quantity
          )
      );
      await expect(productDAO.getProducts(null, null, null)).resolves.toEqual(
        expectedProducts
      );
    });

    test("getProduct with Wrong category - should throw InvalidCategoryError", async () => {
      const productDAO = new ProductDAO();

      jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(new InvalidCategoryError(), null);
        return {} as Database;
      });

      await expect(
        productDAO.getProducts("category", "InvalidCategory", null)
      ).rejects.toThrow(InvalidCategoryError);
    });

    // Test when a synchronous error occurs in the try block
    test("should reject with the correct error on synchronous try block error", async () => {
      const productDAO = new ProductDAO();
      const mockError = new Error("Some synchronous try block error");

      const originalDbAll = db.all;
      db.all = () => {
        throw mockError;
      };

      await expect(productDAO.getProducts(null, null, null)).rejects.toThrow(
        mockError
      );

      db.all = originalDbAll; // Restore original method after test
    });

    // Test when grouping is 'category'
    test('should query products by category when grouping is "category"', async () => {
      const productDAO = new ProductDAO();
      const mockProducts = [
        {
          sellingPrice: 100,
          model: "model1",
          category: Category.SMARTPHONE,
          arrivalDate: "2022-01-01",
          details: "details1",
          quantity: 10,
        },
      ];
      jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        expect(sql).toContain("WHERE category = ?");
        expect(params).toEqual([Category.SMARTPHONE]);
        callback(null, mockProducts);
        return {} as Database;
      });

      const expectedProducts = mockProducts.map(
        (p) =>
          new Product(
            p.sellingPrice,
            p.model,
            p.category,
            p.arrivalDate,
            p.details,
            p.quantity
          )
      );
      await expect(
        productDAO.getProducts("category", Category.SMARTPHONE, null)
      ).resolves.toEqual(expectedProducts);
    });

    // Test when grouping is 'model'
    test('should query products by model when grouping is "model"', async () => {
      const productDAO = new ProductDAO();
      const mockProducts = [
        {
          sellingPrice: 100,
          model: "model1",
          category: Category.SMARTPHONE,
          arrivalDate: "2022-01-01",
          details: "details1",
          quantity: 10,
        },
      ];
      jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        expect(sql).toContain("WHERE model = ?");
        expect(params).toEqual(["model1"]);
        callback(null, mockProducts);
        return {} as Database;
      });

      const expectedProducts = mockProducts.map(
        (p) =>
          new Product(
            p.sellingPrice,
            p.model,
            p.category,
            p.arrivalDate,
            p.details,
            p.quantity
          )
      );
      await expect(
        productDAO.getProducts("model", null, "model1")
      ).resolves.toEqual(expectedProducts);
    });
  });

  //getAvailableProducts tests

  describe("ProductDAO getAvailableProducts tests", () => {
    test('should query available products by category when grouping is "category"', async () => {
      const productDAO = new ProductDAO();
      const mockProducts = [
        {
          sellingPrice: 100,
          model: "model1",
          category: Category.SMARTPHONE,
          arrivalDate: "2022-01-01",
          details: "details1",
          quantity: 10,
        },
      ];
      jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        expect(sql).toContain("WHERE quantity > 0 AND category = ?");
        expect(params).toEqual([Category.SMARTPHONE]);
        callback(null, mockProducts);
        return {} as Database;
      });

      const expectedProducts = mockProducts.map(
        (p) =>
          new Product(
            p.sellingPrice,
            p.model,
            p.category,
            p.arrivalDate,
            p.details,
            p.quantity
          )
      );
      await expect(
        productDAO.getAvailableProducts("category", Category.SMARTPHONE, null)
      ).resolves.toEqual(expectedProducts);
    });
    test("getAvailableProducts with Wrong category - should throw InvalidCategoryError", async () => {
      const productDAO = new ProductDAO();

      jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(new InvalidCategoryError(), null);
        return {} as Database;
      });

      await expect(
        productDAO.getAvailableProducts("category", "InvalidCategory", null)
      ).rejects.toThrow(InvalidCategoryError);
    });
    // Test when grouping is 'model'
    test('should query available products by model when grouping is "model"', async () => {
      const productDAO = new ProductDAO();
      const mockProducts = [
        {
          sellingPrice: 100,
          model: "model1",
          category: Category.SMARTPHONE,
          arrivalDate: "2022-01-01",
          details: "details1",
          quantity: 10,
        },
      ];
      jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        expect(sql).toContain("WHERE quantity > 0 AND model = ?");
        expect(params).toEqual(["model1"]);
        callback(null, mockProducts);
        return {} as Database;
      });

      const expectedProducts = mockProducts.map(
        (p) =>
          new Product(
            p.sellingPrice,
            p.model,
            p.category,
            p.arrivalDate,
            p.details,
            p.quantity
          )
      );
      await expect(
        productDAO.getAvailableProducts("model", null, "model1")
      ).resolves.toEqual(expectedProducts);
    });

    test("getAvailableProducts with Wrong model - should throw ProductNotFoundError", async () => {
      const productDAO = new ProductDAO();

      jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        expect(sql).toContain("WHERE quantity > 0 AND model = ?");
        expect(params).toEqual(["InvalidModel"]);
        callback(null, []);
        return {} as Database;
      });

      await expect(
        productDAO.getAvailableProducts("model", null, "InvalidModel")
      ).rejects.toThrow(new ProductNotFoundError());
    });

    test("getAvailableProducts with grouping 'model' and non-null category - should throw InvalidGroupingError", async () => {
      const productDAO = new ProductDAO();

      await expect(
        productDAO.getAvailableProducts("model", "Smartphone", null)
      ).rejects.toThrow(new InvalidGroupingError());
    });

    test("getAvailableProducts with invalid grouping - should throw InvalidGroupingError", async () => {
      const productDAO = new ProductDAO();

      await expect(
        productDAO.getAvailableProducts("invalidGrouping", null, null)
      ).rejects.toThrow(new InvalidGroupingError());
    });

    // Test when grouping is null
    test("should query all available products when grouping is null", async () => {
      const productDAO = new ProductDAO();
      const mockProducts = [
        {
          sellingPrice: 100,
          model: "model1",
          category: Category.SMARTPHONE,
          arrivalDate: "2022-01-01",
          details: "details1",
          quantity: 10,
        },
        {
          sellingPrice: 200,
          model: "model2",
          category: Category.LAPTOP,
          arrivalDate: "2022-02-01",
          details: "details2",
          quantity: 20,
        },
      ];
      jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        expect(sql).toBe("SELECT * FROM productDescriptor WHERE quantity > 0");
        expect(params).toEqual([]);
        callback(null, mockProducts);
        return {} as Database;
      });

      const expectedProducts = mockProducts.map(
        (p) =>
          new Product(
            p.sellingPrice,
            p.model,
            p.category,
            p.arrivalDate,
            p.details,
            p.quantity
          )
      );
      await expect(
        productDAO.getAvailableProducts(null, null, null)
      ).resolves.toEqual(expectedProducts);
    });



    // Test when db.all generates an error
    test("should reject with the error when db.all generates an error", async () => {
      const productDAO = new ProductDAO();
      const mockError = new Error("Database error");
      jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(mockError, null);
        return {} as Database;
      });

      await expect(
        productDAO.getAvailableProducts(null, null, null)
      ).rejects.toEqual(mockError);
    });

    // Test when a non-database error occurs
    test("should reject with the error when a non-database error occurs", async () => {
      const productDAO = new ProductDAO();
      const mockError = new Error("Non-database error");
      jest.spyOn(db, "all").mockImplementation(() => {
        throw mockError;
      });

      await expect(
        productDAO.getAvailableProducts(null, null, null)
      ).rejects.toEqual(mockError);
    });

    //deleteAllProducts tests

    describe("ProductDAO deleteAllProducts tests", () => {
      // Test when db.run does not generate an error
      test("should resolve to true when db.run does not generate an error", async () => {
        const productDAO = new ProductDAO();
        jest.spyOn(db, "run").mockImplementation((sql, callback) => {
          expect(sql).toBe("DELETE FROM productDescriptor");
          callback(null);
          return {} as Database;
        });

        await expect(productDAO.deleteAllProducts()).resolves.toBe(true);
      });

      // Test when db.run generates an error
      test("should reject with the error when db.run generates an error", async () => {
        const productDAO = new ProductDAO();
        const mockError = new Error("Database error");
        jest.spyOn(db, "run").mockImplementation((sql, callback) => {
          callback(mockError);
          return {} as Database;
        });

        await expect(productDAO.deleteAllProducts()).rejects.toEqual(mockError);
      });
    });
  });

  //deleteProduct tests

  describe("ProductDAO deleteProduct tests", () => {
    test("It should resolve true when product is deleted successfully", async () => {
      const productDAO = new ProductDAO();

      
      jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback.call({ changes: 1 }, null); // Simulates that a product has been deleted
        return {} as Database;
      });

      await expect(productDAO.deleteProduct("test_model")).resolves.toBe(true);
    });

    test("It should reject with an error when there is a database error", async () => {
      const productDAO = new ProductDAO();
      //simulates a database error
      jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback.call(null, new Error("Database error")); 
        return {} as Database;
      });

      await expect(productDAO.deleteProduct("test_model")).rejects.toThrow(
        "Database error"
      );
    });

    test("It should reject with ProductNotFoundError when no product is deleted", async () => {
      const productDAO = new ProductDAO();

      jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback.call({ changes: 0 }, null); // Simulates that no product has been deleted
        return {} as Database;
      });

      await expect(productDAO.deleteProduct("test_model")).rejects.toThrow(
        ProductNotFoundError
      );
    });
  });
});
