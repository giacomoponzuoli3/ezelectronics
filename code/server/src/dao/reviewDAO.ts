import db from "../db/db"
import { ProductReview } from "../components/review"
import { resolve } from "path";
import { ExistingReviewError, NoReviewProductError, NoReviewsForProducts } from "../errors/reviewError"
import { rejects } from "assert";
import { ProductNotFoundError } from "../errors/productError";
import { error } from "console";

/**
 * A class that implements the interaction with the database for all review-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
 */

class ReviewDAO {

    getProductByModel(model: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const sql = "SELECT model FROM productDescriptor WHERE model = ?";
            db.get<any>(sql, [model], function (err, row){
                if(err){
                    reject(err);
                    return;
                }

                if(row === undefined){
                    reject(new ProductNotFoundError());
                    return;
                }
                resolve(row.model);
            })
        });
    }

    getProductReviewByUserModel(model: string, username: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "SELECT * FROM review WHERE model = ? AND username = ?";
            db.get<any>(sql, [model, username], function (err, row){
                if(err){
                    reject(err);
                    return;
                }
                if(row !== undefined){
                    reject(new ExistingReviewError());
                    return;
                }
                resolve();
            })
        });
    }

    insertReview(username: string, model: string, score: number, comment: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const currentDate: Date = new Date();
            const year: number = currentDate.getFullYear();
            const month: number = currentDate.getMonth() + 1; // Months are 0-based
            const day: number = currentDate.getDate();

            const formattedDate = month < 10 ? `${year}-0${month}-${day}` : `${year}-${month}-${day}`;
            const sql = "INSERT INTO review(username, model, score, dateReview, comment) VALUES(?, ?, ?, ?, ?)"
            db.run(sql, [username, model, score, formattedDate, comment], function (this: any, err: Error | null) {
                if (err) {
                    reject(err);
                    return;
                }
                if(this.lastID !== 0){
                    resolve();
                    return;
                }
            });
        });
    }

    deleteReviewByModelUser(username: string, model: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "DELETE FROM review WHERE model = ? AND username = ?";
                db.run(sql, [model, username], function(this: any, err: Error | null ) {
                    if(err){
                        reject(err);
                        return;
                    }
                    if(this.changes !== 0){
                        resolve();
                        return;
                    }else{
                        reject(new NoReviewProductError());
                        return;
                    }
            })
        })
    }

    deleteReviewsByModel(model: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            //controllo che il modello esiste
            const sql = "DELETE FROM review WHERE model = ?";
            db.run(sql, [model], function(this: any, err: Error | null ) {
                if(err){
                    reject(err);
                    return;
                }
                if(this.changes !== 0)
                    resolve();
                else
                    reject(new NoReviewProductError());
            });
        })
    }

    /**
     * Adds a new review by a single customer to a product. A customer can leave at most one review 
     * for each product model. The current date is used as the date for the review, in format YYYY-MM-DD.
     * @param username that repesents the user that creates the review
     * @param model that represents the model of the product
     * @param score that represents the review's value 
     * @param comment that represents the brief commnet by the user
     * @returns A Promise that resolves to true if the review has been created
     */

    addReview(username: string, model: string, score: number, comment: string): Promise<void> {
        return this.getProductByModel(model)
                    .then(() => this.getProductReviewByUserModel(model, username))
                    .then(() => 
                    {
                        return this.insertReview(username, model, score, comment)}
                    )
                    .catch((err) => {
                        return Promise.reject(err)
                    })
    }

    /**
     * Returns all reviews made for a specific product
     * @param model that represents the model of product
     * @returns A Promise of Reviews[] that represents all reviews for the specific product
     */
    getProductReviews(model: string): Promise<ProductReview[]> {
        return this.getProductByModel(model)
            .then(() => new Promise<ProductReview[]>((resolve, reject) => {
            
            const sql = "SELECT * FROM review WHERE model = ?";
            db.all(sql, [model], (err: Error | null, rows: any) => {
                if(err){
                    reject(err)
                    return
                }
                const reviews = rows.map((r: any) => new ProductReview(r.model, r.username, r.score, r.dateReview, r.comment));
                resolve(reviews);
            });
        }))
    }

    /**
     * Deletes the review made by the current user for a specific product. 
     * It does not allow the deletion of a review made by another user for the product.
     * @param username that represents the user who wants delete a review 
     * @param model that represents the model of specific product 
     * @return A Promise that resolves to true if the review is deleted, false otherwise. 
     */
    deleteReview(username: string, model: string): Promise<void> {
        return this.getProductByModel(model)
                .then(() => this.deleteReviewByModelUser(username, model))
                .catch((err) => Promise.reject(err));
    }

    /**
     * Deletes all reviews of a specific product. 
     * @param model that represents the model of specific product 
     * @return A Promise that resolves to true if the reviews of a specific product are deleted, false otherwise. 
     */
    deleteReviewsOfProduct(model: string): Promise<void> {
        return this.getProductByModel(model)
            .then(() => this.deleteReviewsByModel(model))
            .catch((err) => Promise.reject(err)); 
    }

    /**
     * Deletes all reviews of all existing products.
     * @return A Promise that resolves to true if the reviews of a specific product are deleted, false otherwise. 
     */
    deleteAllReviews(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const sql = "DELETE FROM review";
            db.run(sql, [], function(this: any, err: Error | null ) {
                if(err){
                    reject(err);
                    return;
                }
                resolve();
                return;
            });
        })
    }


}

export default ReviewDAO;
