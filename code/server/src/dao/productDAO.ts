import db from "../db/db";
import {
  ProductNotFoundError,
  ProductAlreadyExistsError,
  ProductSoldError,
  EmptyProductStockError,
  LowProductStockError,
  InvalidDateError,
  InvalidGroupingError,
  InvalidCategoryError,
} from "../errors/productError";
import { Product } from "../components/product";
import { resolve } from "path";
/**
 * A class that implements the interaction with the database for all product-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */
class ProductDAO {
  /**
   * Registers a new product concept (model, with quantity defining the number of units available) in the database.
   * @param model The unique model of the product.
   * @param category The category of the product.
   * @param quantity The number of units of the new product.
   * @param details The optional details of the product.
   * @param sellingPrice The price at which one unit of the product is sold.
   * @param arrivalDate The optional date in which the product arrived.
   * @returns A Promise that resolves to nothing.
   */

  registerProducts(
    model: string,
    category: string,
    arrivalDate: string | null,
    sellingPrice: number,
    quantity: number,
    details: string | null
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (
        category !== "Smartphone" &&
        category !== "Laptop" &&
        category !== "Appliance"
      ) {
        reject(new InvalidCategoryError());
        return;
      }
      const sql =
        "INSERT INTO productDescriptor(model, category, arrivalDate, sellingPrice, quantity, details) VALUES (?, ?, ?, ?, ?, ?)";

      try {
        
        const currentDate: Date = new Date();
        const formattedDate: string = currentDate.toISOString().split("T")[0];

        if (arrivalDate !== null && arrivalDate > formattedDate) {
          throw new InvalidDateError();
        }

        db.run(
          sql,
          [
            model,
            category,
            arrivalDate ? arrivalDate : formattedDate,
            sellingPrice,
            quantity,
            details,
          ],
          (err: Error | null) => {
            if (err) {
              if (
                err.message.includes(
                  "UNIQUE constraint failed: productDescriptor.model"
                )
              ) {
                reject(new ProductAlreadyExistsError());
              } else {
                console.log(err);
                reject(err);
              }
              return;
            }
            resolve(true);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Increases the available quantity of a product through the addition of new units.
   * @param model The model of the product to increase.
   * @param newQuantity The number of product units to add. This number must be added to the existing quantity, it is not a new total.
   * @param changeDate The optional date in which the change occurred.
   * @returns A Promise that resolves to the new available quantity of the product.
   */
  changeProductQuantity(
    model: string,
    newQuantity: number,
    changeDate: string | null
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      try {
        const currentDate: Date = new Date();
        const formattedDate: string = currentDate.toISOString().split("T")[0];

        if (changeDate !== null && changeDate > formattedDate) {
          throw new InvalidDateError();
        }
        const selectSql =
          "SELECT quantity, arrivalDate FROM productDescriptor WHERE model = ?";

        db.get(selectSql, [model], (err: Error | null, row: any) => {
          if (err) {
            reject(err);
            return;
          }
          if (!row) {
            reject(new ProductNotFoundError());
            return;
          }
          const arrivalDate = row.arrivalDate;
          if (changeDate !== null && arrivalDate > changeDate) {
            reject(new InvalidDateError());
            return;
          }

          const currentQuantity = row.quantity;
          const updatedQuantity = currentQuantity + newQuantity;

          const updateSql =
            "UPDATE productDescriptor SET quantity = ? WHERE model = ?";
          const params = [updatedQuantity, model];

          db.run(updateSql, params, (updateErr: Error | null) => {
            if (updateErr) {
              reject(updateErr);
              return;
            }
            resolve(updatedQuantity);
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   * Decreases the available quantity of a product through the sale of units.
   * @param model The model of the product to sell
   * @param quantity The number of product units that were sold.
   * @param sellingDate The optional date in which the sale occurred.
   * @returns A Promise that resolves to the new available quantity of the product.
   */
  sellProduct(
    model: string,
    quantity: number,
    sellingDate: string | null
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      try {
        const currentDate: Date = new Date();
        const formattedDate: string = currentDate.toISOString().split("T")[0];

        if (sellingDate !== null && sellingDate > formattedDate) {
          throw new InvalidDateError();
        }
        const selectSql =
          "SELECT quantity, arrivalDate FROM productDescriptor WHERE model = ?";
        db.get(selectSql, [model], (err: Error | null, row: any) => {
          if (err) {
            reject(err);
            return;
          }
          if (!row) {
            reject(new ProductNotFoundError());
            return;
          }
          const arrivalDate = row.arrivalDate;
          if (sellingDate !== null && arrivalDate > sellingDate) {
            reject(new InvalidDateError());
            return;
          }
          const currentQuantity = row.quantity;

          if (currentQuantity == 0) {
            reject(new EmptyProductStockError());
            return;
          }
          if (currentQuantity < quantity) {
            reject(new LowProductStockError());
            return;
          }

          const updatedQuantity = currentQuantity - quantity;

          const updateSql =
            "UPDATE productDescriptor SET quantity = ? WHERE model = ?";
          const params = [updatedQuantity, model];

          db.run(updateSql, params, (updateErr: Error | null) => {
            if (updateErr) {
              reject(updateErr);
              return;
            }

            resolve(updatedQuantity);
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Returns all products in the database, with the option to filter them by category or model.
   * @param grouping An optional parameter. If present, it can be either "category" or "model".
   * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
   * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
   * @returns A Promise that resolves to an array of Product objects.
   */

  getProducts(
    grouping: string | null,
    category: string | null,
    model: string | null
  ): Promise<Product[]> {
    return new Promise<Product[]>((resolve, reject) => {
      try {
        let sql = "SELECT * FROM productDescriptor";
        const params: any[] = [];

        if (grouping == null || grouping == undefined) {
          if (category != null || model != null) {
            throw new InvalidGroupingError();
          }
        } else if (grouping === "category") {
          if (category == null || model != null) {
            throw new InvalidGroupingError();
          } else if (
            category !== "Smartphone" &&
            category !== "Laptop" &&
            category !== "Appliance"
          ) {
            throw new InvalidCategoryError();
          }
        } else if (grouping === "model") {
          if (model == null || category != null) {
            throw new InvalidGroupingError();
          }
        } else {
          throw new InvalidGroupingError();
        }

        if (grouping === "category" && category) {
          sql += " WHERE category = ?";
          params.push(category);
        } else if (grouping === "model" && model) {
          sql += " WHERE model = ?";
          params.push(model);
        }

        db.all(sql, params, (err: Error | null, rows: any) => {
          if (err) {
            reject(err);
            return;
          }
          if (rows.length === 0 && model) {
            reject(new ProductNotFoundError());
            return;
          }
          const products = rows.map(
            (p: any) =>
              new Product(
                p.sellingPrice,
                p.model,
                p.category,
                p.arrivalDate,
                p.details,
                p.quantity
              )
          );
          resolve(products);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Returns all available products (with a quantity above 0) in the database, with the option to filter them by category or model.
   * @param grouping An optional parameter. If present, it can be either "category" or "model".
   * @param category An optional parameter. It can only be present if grouping is equal to "category" (in which case it must be present) and, when present, it must be one of "Smartphone", "Laptop", "Appliance".
   * @param model An optional parameter. It can only be present if grouping is equal to "model" (in which case it must be present and not empty).
   * @returns A Promise that resolves to an array of Product objects.
   */
  getAvailableProducts(
    grouping: string | null,
    category: string | null,
    model: string | null
  ): Promise<Product[]> {
    return new Promise<Product[]>((resolve, reject) => {
      try {
        if (grouping == null || grouping == undefined) {
          if (category != null || model != null) {
            throw new InvalidGroupingError();
          }
        } else if (grouping === "category") {
          if (category == null || model != null) {
            throw new InvalidGroupingError();
          } else if (
            category !== "Smartphone" &&
            category !== "Laptop" &&
            category !== "Appliance"
          ) {
            throw new InvalidCategoryError();
          }
        } else if (grouping === "model") {
          if (model == null || category != null) {
            throw new InvalidGroupingError();
          }
        } else {
          throw new InvalidGroupingError();
        }

        let sql = "SELECT * FROM productDescriptor WHERE quantity > 0";
        const params: any[] = [];

        if (grouping === "category" && category) {
          sql += " AND category = ?";
          params.push(category);
        } else if (grouping === "model" && model) {
          sql += " AND model = ?";
          params.push(model);
        }

        db.all(sql, params, (err: Error | null, rows: any) => {
          if (err) {
            reject(err);
            return;
          }
          if (rows.length === 0 && model) {
            const checkModelSql = "SELECT COUNT(*) AS count FROM productDescriptor WHERE model = ?";
            db.get(checkModelSql, [model], (err: Error | null, row: any) => {
              if (err) {
                reject(err);
                return;
              }
              if (row.count > 0) {
                resolve([]); 
              } else {
                reject(new ProductNotFoundError()); 
              }
            });
           return;
          }
          const products = rows.map(
            (p: any) =>
              new Product(
                p.sellingPrice,
                p.model,
                p.category,
                p.arrivalDate,
                p.details,
                p.quantity
              )
          );
          resolve(products);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Deletes all products.
   * @returns A Promise that resolves to `true` if all products have been successfully deleted.
   */
  async deleteAllProducts(): Promise<Boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const deleteSql = "DELETE FROM productDescriptor";

      db.run(deleteSql, (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * Deletes one product, identified by its model
   * @param model The model of the product to delete
   * @returns A Promise that resolves to `true` if the product has been successfully deleted.
   */
  deleteProduct(model: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const sql = "DELETE FROM productDescriptor WHERE model = ?";
      db.run(sql, [model], function (this: any, err: Error | null) {
        if (err) {
          reject(err);
          return;
        }
        if (this.changes !== 0) {
          resolve(true);
          return;
        } else {
          reject(new ProductNotFoundError());
          return;
        }
      });
    });
  }
}
export default ProductDAO;
