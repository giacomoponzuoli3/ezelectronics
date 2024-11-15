import db from "../db/db"
import { rejects } from "assert";
import { Cart, ProductInCart } from "../components/cart";
import { Category } from "../components/product";
import { resolve } from "path";
import { ProductNotFoundError } from "../errors/productError";
import { EmptyProductStockError,LowProductStockError} from "../errors/productError";
import {CartNotFoundError, ProductInCartError, ProductNotInCartError, WrongUserCartError, EmptyCartError} from "../errors/cartError";
import e from "express";
import { resolveSrv } from "dns";

/**
 * A class that implements the interaction with the database for all cart-related operations.
 * You are free to implement any method you need here, as long as the requirements are satisfied.
*/


class CartDAO {

    //fare addToCart
    /**
     * Adds a product to the user's cart. 
     * If the product is already in the cart, the quantity should be increased by 1
     * If there is no current unpaid cart in the database, then a new cart should be created.
     * @param username that represents the logged user
     * @param product that represents the model of product
     * @return A Promise that resolves to `true` if the product was successfully added.
     */

    addToCart(username: string, product: string): Promise<boolean> {
        return new Promise<boolean>( (resolve, reject) => {
            try{
                let priceProduct: number;
                /**
                 * flag che tiene traccia se ho fatto insert o update del prodotto nel carrello
                 * @param true -> insert
                 * @param false -> update
                */
                let insertUpdate: boolean; 

                //1° controllo: esistenza del modello
                let sql = "SELECT * FROM productDescriptor WHERE model = ?";
                db.get<any>(sql, [product], (err, row) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    if(row === undefined){ //se non ci sono prodotti di quel modello
                        reject(new ProductNotFoundError());
                        return;
                    }else{
                        //2° controllo: la quantità del prodotto DEVE essere maggiore di 0 
                        if(row.quantity === 0){ //se non è disponibile
                            reject(new EmptyProductStockError());
                            return;
                        }
                        //altrimenti se la quantità è maggiore di 0 memorizzo il prezzo di vendita
                        priceProduct = row.sellingPrice;
                    }
                    
                    //controllo se esiste un carrello non pagato del customer
                    const availabilityPromises = new Promise<Boolean>((resolve, reject) => {
                        const sql = "SELECT COUNT(*) AS count FROM cart WHERE user_username = ? AND paid = 0";
                        db.get<{count:number}>(sql, [username], (err, row) => {
                            if(err){ //error while checking the row
                                reject(err);
                                return;
                            }
                            
                            //if there are no rows, it means there is no unpaid cart for that user
                            if(row.count === 0){
                                //so it needs to be inserted
                                const insertQuery = `INSERT INTO cart (paid, total, user_username) VALUES (?, ?, ?)`;
                                db.run(insertQuery, [0, 0, username], (err) => {
                                    if (err) {
                                        console.log(err);
                                        reject(err);
                                        return;
                                    }
                                    //cart inserted successfully
                                    resolve(true); // Resolve the promise after successful insertion
                                });
                            } else {
                                // Cart already exists, resolve the promise
                                resolve(true);
                            }
                        });
                    }).then(()=>{
                        //se arrivo a questo punto sono sicuro che c'è un carrello unpaid dello user loggato
                        //prendo l'id del carrello dal db
                        const idCartPromises = new Promise<Boolean>((resolve, reject) => {
                            let idCart: number;

                            sql = "SELECT id FROM cart WHERE user_username = ? AND paid = 0";
                            db.get<any>(sql, [username], (err, row) =>{
                                if(err){
                                    reject(err);
                                    return;
                                }
                                //prendo l'id del carrello
                                idCart = row.id; 
                            
                                //Controllo se il prodotto è già inserito nel carrello
                                sql = "SELECT * FROM cartProduct WHERE cart_id = ? AND model_product = ?";
                                db.get(sql, [idCart, product], (err, row) => {
                                    if(err){
                                        reject(err);
                                        return;
                                    }
                                    //se non è stato inserito, lo inserisco
                                    if(row === undefined){
                                        let sqlInsert = "INSERT INTO cartProduct(cart_id, model_product, quantity) VALUES(?,?,?)";
                                        db.run(sqlInsert, [idCart, product, 1], (err) => {
                                            if(err){
                                                reject(err);
                                                return;
                                            }
                                            //inserito
                                            insertUpdate = true; //setto il flag ad insert
                                        });
                                    }else{
                                        //altrimenti se è già stato inserito, aumento la quantità
                                        let sqlUpdate = `UPDATE cartProduct SET quantity = quantity + 1 WHERE cart_id = ? AND model_product = ?`;
                                        db.run(sqlUpdate, [idCart, product], (err) => {
                                            if(err){
                                                reject(err);
                                                return;
                                            }
                                            //aggiornata la quantità
                                            insertUpdate = false; //setto il flag ad update
                                        });
                                    }
                                });
                            });
                            resolve(true);

                        }).then((idCart)=>{
                            //adesso devo aggiornare il totale del carrello
                            sql = "UPDATE cart SET total = FLOOR((total + ?) * 100) / 100 WHERE paid = 0 AND user_username = ?";
                            
                            db.run(sql, [priceProduct, username], function(err){
                                if(err){
                                    let sqlUndo;
                                    //se ho errore devo annullare l'aggiunta del prodotto nel carrello
                                    if(insertUpdate){ //se ho fatto l'inserimento devo eliminare il prodotto dal carrello
                                        sqlUndo = `DELETE FROM cartProduct WHERE cart_id = ? AND model_product = ?`;
                                    }else{ //se ho fatto l'aggiornamento devo ridurre la quantità
                                        sqlUndo = `UPDATE cartProduct SET quantity = quantity - 1 WHERE cart_id = ? AND model_product = ?`;
                                    }
                                    db.run(sqlUndo, [idCart, product], (err) => {
                                        if(err){
                                            reject(err);
                                            return;
                                        }
                                    });
                                    reject(err);
                                    return;
                                }
                                //totale aggiornato 
                                resolve(true);
                                return;
                            });
                        }).catch((err) =>{
                            reject(err)});
                    }).catch((err) =>{
                        reject(err)});  
                })

            }catch (error) {
                console.log(error);
                reject(error);
            }
        });
        
    }

    /**
     * Returns the current cart of the logged in user. 
     * The total cost of the cart needs to be equal to the total cost of its products, keeping in mind the quantity of each product. 
     * @param username represents the username of logged user
     * @returns A Promise that provides the cart of the logged user
     */
    getCart(username: string): Promise<Cart> {
        return new Promise<Cart>((resolve, reject) => {
                let sql = "SELECT COUNT(*) AS count FROM cart WHERE user_username = ? AND paid = 0";
                
                db.all<{count: number}>(sql, [username], (err, rows) => {
                    if(err){ //errore durante la verifica della riga
                        reject(err);
                        return;
                    }
                    const rowCount: number = rows[0].count;
                    //se non ci sono righe vuol dire che non esiste un carrello corrente per quell'utente
                    if(rowCount === 0 ){
                        //ritorno un Cart vuoto

                        
                        //carrello inserito correttamente 
                        resolve(new Cart(username, false, null, 0, []));    
                        //ritorno perché tanto è ovvio che non ci siano prodotti
                        return;
                    }else{ 
                        const productsPromise = new Promise<ProductInCart[]>((resolve,reject)=>{
                            let products: ProductInCart[];
                            //se invece già esiste vado a prendere i vari prodotti nel carrello
                            sql = `SELECT model, cartProduct.quantity, category, sellingPrice AS price
                                FROM productDescriptor, cart, cartProduct
                                WHERE cart.id = cartProduct.cart_id AND cartProduct.model_product = productDescriptor.model
                                    AND user_username = ? AND paid = 0`;
                            db.all<any>(sql, [username], (err, rows) => {
                                if(err){
                                    reject(err);
                                    return;
                                }else{
                                    products = rows.map((p) => new ProductInCart(p.model, p.quantity, p.category, p.price));
                                }
                                resolve(products);
                            });
                        }).then((products)=>{ //prendo il carrello dal db
                            sql = "SELECT * FROM cart WHERE user_username = ? AND paid = 0";
                            db.get<Cart>(sql, [username], (err, row) =>{
                                if(err){
                                    reject(err);
                                    return;
                                }
                                //genero il carrello introducendo anche i prodotti  
                                resolve(new Cart(username, false, null, row.total, products))
                            });
                        }).catch((err) => {
                            reject(err)});
                        }
                });
        })   
    }


    /**
     * Simulates the payment for the current cart of the logged in user
     * @param username that represents the logged user
     * @returns A Promise that resolves to `true` if the cart was successfully checked out.
     */

    checkoutCart(username: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                let cartId: number;


                // Step 1: Ottieni l'ID del carrello
                let query = "SELECT id FROM cart WHERE user_username = ? AND paid = 0";
                db.get<any>(query, [username], (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    //controllo se row è undefined -> non esiste un carrelo unpaid per quell'utente
                    if (row === undefined) {
                        reject(new CartNotFoundError());
                        return;
                    }
                    cartId = row.id;
                    
                    // Step 2: Ottieni i prodotti nel carrello corrente
                    query = `SELECT productDescriptor.model, cartProduct.quantity 
                            FROM productDescriptor 
                            JOIN cartProduct ON productDescriptor.model = cartProduct.model_product 
                            WHERE cartProduct.cart_id = ?`;
                    db.all<{ model: string, quantity: number }>(query, [cartId], (err, rows) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        //controllo se non ci sono prodotti all'interno del carrello
                        if(rows.length === 0){
                            reject (new EmptyCartError());
                            return;
                        }
    
                        // Step 3: Verifica la disponibilità dei prodotti
                        const availabilityPromises = rows.map(row => {
                            return new Promise<void>((resolve, reject) => {
                                query = "SELECT quantity FROM productDescriptor WHERE model = ?";
                                db.get<any>(query, [row.model], (err, product) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    }
                                    if(product.quantity === 0){
                                        reject(new EmptyProductStockError());
                                        return;
                                    }
                                    if (product.quantity < row.quantity) {
                                        reject(new LowProductStockError());
                                        return;
                                    } else {
                                        resolve();
                                    }
                                   
                                });
                            });
                        });
    
                        // Esegui tutti gli aggiornamenti della quantità dei prodotti
                        Promise.all(availabilityPromises).then(() => {
                            const updateQuantityPromises = rows.map(row => {
                                return new Promise<void>((resolve, reject) => {
                                    query = "UPDATE productDescriptor SET quantity = quantity - ? WHERE model = ?";
                                    db.run(query, [row.quantity, row.model], (err) => {
                                        if (err) {
                                            reject(err);
                                            return;
                                        } else {
                                            resolve();
                                        }
                                    });
                                });
                            });
    
                            // Esegui tutti gli aggiornamenti della quantità dei prodotti
                            Promise.all(updateQuantityPromises).then(() => {
                                // Step 4: Aggiorna lo stato del carrello a "pagato"
                                query = "UPDATE cart SET paid = ?, paymentDate = ? WHERE id = ?";
                                const currentDate: Date = new Date();
                                const formattedDate: string = currentDate.toISOString().split('T')[0];
                                db.run(query, [1, formattedDate, cartId], (err) => {
                                    if (err) {
                                        reject(err);
                                        return;
                                    } else {
                                        resolve(true);
                                    }
                                });
                            }).catch((error) => {
                                reject(error);
                            });
                        }).catch((error) => {
                            reject(error);
                        });
                    });
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    
    getCustomerCarts(username:string):Promise<Cart[]>{
        interface CartRow {
            cart_id: number;
            user_username: string;
            cart_paid: number;
            cart_paymentDate: string;
            cart_total: number;
            product_model: string;
            product_quantity: number;
            product_category: Category;
            product_price: number;
        }
        return new Promise((resolve, reject) => {
            const query = `
            SELECT
                cart.id AS cart_id,
                cart.user_username AS user_username,
                cart.paid AS cart_paid,
                cart.paymentDate AS cart_paymentDate,
                cart.total AS cart_total,
                cartProduct.model_product AS product_model,
                cartProduct.quantity AS product_quantity,
                productDescriptor.category AS product_category,
                productDescriptor.sellingPrice AS product_price
            FROM
                cart
            INNER JOIN
                cartProduct ON cart.id = cartProduct.cart_id
            INNER JOIN
                productDescriptor ON cartProduct.model_product = productDescriptor.model
            WHERE
            cart.paid = 1 AND cart.user_username = ?
             `;

            db.all(query, [username], (err, rows:CartRow[]) => {
                if (err) {
                    reject(err);
                    return;
                }

                const carts: { [key: number]: Cart } = {};
                rows.forEach(row => {
                    const cartId = row.cart_id;
                    if (!carts[cartId]) {
                        carts[cartId] = new Cart(
                            row.user_username,
                            !!row.cart_paid,
                            row.cart_paymentDate,
                            row.cart_total,
                            []
                        );
                    }

                    const product = new ProductInCart(
                        row.product_model,
                        row.product_quantity,
                        row.product_category,
                        row.product_price
                    );

                    carts[cartId].products.push(product);
                });

                resolve(Object.values(carts));
            });
        }); 
               
    }




removeProductFromCart(username: string, product: string):Promise<Boolean> /**Promise<Boolean> */ { 
    return new Promise((resolve,reject)=>{
        try{
        //cerco il carrello

            const sql = "SELECT COUNT(*) AS count FROM cart WHERE user_username = ? AND paid = 0";
            db.get<{count:number}>(sql, [username], (err, row) => {

                if(err){ //error while checking the row
                    reject(err);
                    return;
                }
                
                //if there are no rows, it means there is no unpaid cart for that user
                if(row.count === 0){
                    reject(new CartNotFoundError());
                    return;
                }else {
                    // prendo i modelli del carrello
                    let  query = `SELECT model, cartProduct.quantity, category, sellingPrice AS price
                    FROM productDescriptor, cart, cartProduct
                    WHERE cart.id = cartProduct.cart_id AND cartProduct.model_product = productDescriptor.model
                        AND user_username = ? AND paid = 0`;
                    db.all<any>(query, [username], (err, rows) => {
                        if(err){
                            reject(err);
                            return;
                        }else{
                            if(rows===undefined){
                                //se vuoto errore
                                reject(new EmptyCartError()); 
                            }else{
                                query = `SELECT * FROM productDescriptor WHERE model = ?`;
                                db.get<any>(query, [product], (err, row) => {
                                    if(err){
                                        reject(err);
                                        return;
                                    }
                                    if(row===undefined){
                                        reject(new ProductNotFoundError());
                                        return;
                                    }else{//seleziono i campi da aggioranare
                                    
                                        query='SELECT cartProduct.quantity, productDescriptor.sellingPrice AS price, cart.total AS cart_total FROM cartProduct INNER JOIN productDescriptor ON cartProduct.model_product = productDescriptor.model INNER JOIN cart ON cartProduct.cart_id = cart.id WHERE cart_id IN (SELECT id FROM cart WHERE user_username = ? AND paid = 0) AND model_product = ?';

                                        db.get<any>(query, [username,product], (err, row) => {
                                            if(err){
                                                reject(err);
                                                return;
                                            }
                                            if(row===undefined){
                                                reject(new ProductNotInCartError());
                                                return;
                                            }else{
                                                //aggiorno la quantità
                                                const newQuantity=row.quantity-1;
                                                console.log(row.cart_total)
                                                const newTotal= Math.trunc((row.cart_total - row.price) * 100 / 100);
                                                console.log(newTotal);
                                                if(newQuantity===0){
                                                    query = 'DELETE FROM cartProduct WHERE cart_id IN ( SELECT id FROM cart WHERE user_username = ? AND paid = 0) AND model_product = ?';

                                                    db.run(query, [username,product], (err) => {
                                                        if(err){
                                                            reject(err);
                                                            return;
                                                        }else{
                                                            resolve(true);
                                                            return;
                                                        }
                                                        //else{
                                                            //aggiorno il totale
                                                        
                                                       /* query='UPDATE cart SET total = ? WHERE id IN (SELECT id FROM cart WHERE user_username = ? AND paid = 0 )';
                    
                                                        db.run(query, [newTotal,username], (err) => {
                                                            if(err){
                                                                reject(err);
                                                                return;
                                                            }
                                                            resolve(true);
                                                        });
                                                     */    //}                                       
                                                    });

                                                }else{
                                                    query='UPDATE cartProduct SET quantity = ? WHERE cart_id IN ( SELECT id FROM cart WHERE user_username = ? AND paid = 0 ) AND model_product = ?'

                                                    db.run(query, [newQuantity,username,product], (err) => {
                                                        if(err){
                                                            reject(err);
                                                            return;
                                                        }else{
                                                            //aggiorno il totale
                                                    
                                                            query='UPDATE cart SET total = ? WHERE id IN (SELECT id FROM cart WHERE user_username = ? AND paid = 0 )';
                
                                                            db.run(query, [newTotal,username], (err) => {
                                                                if(err){
                                                                    reject(err);
                                                                    return;
                                                                }
                                                                resolve(true);
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }                       
                                });
                            }                   
                        }
                    });
                }
            });
        }catch (error) {
            reject(error);
        }
    })
}





clearCart(username:string):Promise<Boolean>{
    return new Promise((resolve,reject)=>{
        let query = 'SELECT COUNT(*) AS count FROM cart WHERE paid = 0 AND user_username = ?;';

        db.get<{count:number}>(query, [username], (err,row) => {
            if(err){
                reject(err);
                return;
            }
            if(row.count===0){
                reject(new CartNotFoundError());
                return;
            }else{
                let query = 'DELETE FROM cartProduct WHERE cart_id IN ( SELECT id FROM cart WHERE user_username = ? AND paid = 0)';

                db.run(query, [username], (err) => {
                    if(err){
                        reject(err);
                        return;
                    }else{

                        query='UPDATE cart SET total = ? WHERE id IN (SELECT id FROM cart WHERE user_username = ? AND paid = 0 )';
        
                        db.run(query, [0,username], (err) => {
                            if(err){
                                reject(err);
                                return;
                            }
                            
                            resolve(true);
                        });

                    }
                   
                })

            }

        })
       
    })
}




deleteAllCarts():Promise<Boolean>{
    return new Promise((resolve,reject)=>{
        db.serialize(() => {
            

            let query = `DELETE FROM cartProduct`;
            db.run(query, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                 query = `DELETE FROM cart`;
                db.run(query, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                  
                    resolve(true);
                });
            });
        });
    })
}







getAllCarts():Promise<Cart[]>{
    interface CartRow {
        cart_id: number;
        user_username: string;
        cart_paid: number;
        cart_paymentDate: string;
        cart_total: number;
        product_model: string;
        product_quantity: number;
        product_category: Category;
        product_price: number;
    }
    return new Promise((resolve, reject) => {
        const query = `
        SELECT
            cart.id AS cart_id,
            cart.user_username AS user_username,
            cart.paid AS cart_paid,
            cart.paymentDate AS cart_paymentDate,
            cart.total AS cart_total,
            cartProduct.model_product AS product_model,
            cartProduct.quantity AS product_quantity,
            productDescriptor.category AS product_category,
            productDescriptor.sellingPrice AS product_price
        FROM
            cart
        INNER JOIN
            cartProduct ON cart.id = cartProduct.cart_id
        INNER JOIN
            productDescriptor ON cartProduct.model_product = productDescriptor.model
         `;

        db.all(query,(err, rows:CartRow[]) => {
            if (err) {
                reject(err);
                return;
            }

        const carts: { [key: number]: Cart } = {};
        rows.forEach(row => {
            const cartId = row.cart_id;
            if (!carts[cartId]) {
                carts[cartId] = new Cart(
                    row.user_username,
                    !!row.cart_paid,
                    row.cart_paymentDate,
                    row.cart_total,
                    []
                );
            }

            const product = new ProductInCart(
                row.product_model,
                row.product_quantity,
                row.product_category,
                row.product_price
            );

            carts[cartId].products.push(product);
        });
        resolve(Object.values(carts));
        });
    });



}







}








export default CartDAO