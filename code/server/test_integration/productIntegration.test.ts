 import { describe, test, expect, beforeAll, afterAll, beforeEach,afterEach} from "@jest/globals"
 import request from 'supertest'
 import { app } from "../index"
import db from "../src/db/db"
import { Product, Category } from "../src/components/product"

import { cleanup } from '../src/db/cleanup'; 
import e from "express"


const currentDate: Date = new Date();
const formattedDate: string = currentDate.toISOString().split('T')[0];

const baseURL = "/ezelectronics"

async function cleanupProducts() {
     db.run("DELETE FROM productDescriptor")
}

const customer = { username: "customer", name: "customer", surname: "customer", password: "customer", role: "Customer" }
const admin = { username: "admin", name: "admin", surname: "admin", password: "admin", role: "Admin" }
const manager = { username: "manager", name: "manager", surname: "manager", password: "manager", role: "Manager" }

let customerCookie: string
let adminCookie: string
let managerCookie: string


const postUser = async (userInfo: any) => {
    await request(app)
        .post(`${baseURL}/users`)
        .send(userInfo)
        .expect(200)
}


const login = async (userInfo: any) => {
    return new Promise<string>((resolve, reject) => {
        request(app)
            .post(`${baseURL}/sessions`)
            .send(userInfo)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res.header["set-cookie"][0])
            })
    })
}


beforeAll(async () => {
    cleanup()
    await postUser(admin)
    adminCookie = await login(admin)

    await postUser(customer)
    customerCookie = await login(customer)

    await postUser(manager)
    managerCookie = await login(manager)
})


afterAll(() => {
    cleanup()
})



describe ("Product integration tests", () => {

    describe("registerProduct integration tests", () => {
        
        beforeEach(async ()=>{
           await  cleanupProducts();
        })
        afterEach(async ()=>{
            await cleanupProducts();
        })
        test("register product - 200 success code", async () => {
           
           

            const addProduct = await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) // set the session ID in the Cookie header
                .send({model: "product1", category: "Smartphone",sellingPrice: 299.99,quantity: 10});

            expect(addProduct.status).toBe(200);
           
        }) 

        test("register product - 401 error code not Authorized", async () => {
           
           

            const addProduct = await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', customerCookie)
                .send({model: "product1", category: "Smartphone",sellingPrice: 299.99,quantity: 10});

            expect(addProduct.status).toBe(401);
           
        }) 

        test("register product - 401 error code not logged in", async () => {
           
           

            const addProduct = await request(app)
                .post(`${baseURL}/products`)
                .send({model: "product1", category: "Smartphone",sellingPrice: 299.99,quantity: 10});

            expect(addProduct.status).toBe(401);
           
        }) 



        test("register product - already existing product (409)", async () => {

           const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
        
            const addProduct = await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({model: "product1", category: "Smartphone",sellingPrice: 299.99,quantity: 10});

            expect(addProduct.status).toBe(409);

        }) 


        test("register product - Category null", async () => {
            

            const product = {sellingPrice :300, model: "product1", arrivalDate: formattedDate, details: "test",quantity: 20}

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
           
            const addProduct = await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) // set the session ID in the Cookie header
                .send({model: "product1",sellingPrice: 299.99,quantity: 10});

            expect(addProduct.status).toBe(422);

        },) 

        test("register product - wrong Category ", async () => {
            

            const product = {sellingPrice :300, model: "product1", category: "WRONG CATEGORY", arrivalDate: formattedDate, details: "test",quantity: 20}

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
           
            const addProduct = await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) // set the session ID in the Cookie header
                .send({model: "product1",sellingPrice: 299.99,quantity: 10});

            expect(addProduct.status).toBe(422);

        },) 


        test("register product - Selling price null", async () => {

        
            const product = { model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20}


            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
         
            const addProduct = await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) // set the session ID in the Cookie header
                .send({model: "product1",category : "Smartphone",quantity: 10});

            expect(addProduct.status).toBe(422);

        }) 

        test("register product - arrival date after current date (400)", async () => {

           
           
            const addProduct = await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({model: "product1", category: "Smartphone",arrivalDate:"2026-06-02",sellingPrice: 299.99,quantity: 10});

            expect(addProduct.status).toBe(400);
        }) 

        test("register product - selling price 0", async () => {
         
           

            const addProduct = await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) // set the session ID in the Cookie header
                .send({model: "product1", category: "Smartphone",sellingPrice: 0,quantity: 10});
                
            expect(addProduct.status).toBe(422);
        }) 

        test("register product - selling price < 0", async () => {

            const addProduct = await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) // set the session ID in the Cookie header
                .send({model: "product1", category: "Smartphone",sellingPrice: -1,quantity: 10});
                
            expect(addProduct.status).toBe(422);
        }) 

        test("register - selling price string", async () => {

       
            const addProduct = await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie',managerCookie) // set the session ID in the Cookie header
                .send({model: "product1", category: "Smartphone",sellingPrice: "a",quantity: 10});
            expect(addProduct.status).toBe(422);

        }) 
        })


    describe("deleteProduct integration tests", () => {

        beforeEach(async ()=>{
           await  cleanupProducts();
        })
        afterEach(async ()=>{
           await  cleanupProducts();
        })

        test("delete product - OK", async () => {
           
        
            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
          
            const response = await request(app)
                .delete(`${baseURL}/products/product1`)
                .set('Cookie', managerCookie);

            expect(response.status).toBe(200);

            const response2 = await request(app)
                .get(`${baseURL}/products/product1`)
                .set('Cookie', managerCookie);
            expect(response2.status).toBe(404);

        })

        test("delete product - product not found", async () => {
            
           

            const deleteProduct = await request(app)
                .delete(`${baseURL}/products/product1`)
                .set('Cookie', managerCookie);// set the session ID in the Cookie header

            expect(deleteProduct.status).toBe(404);

        })


        test("delete product - error 401 Not Authorized", async () => {
            
            

            const deleteProduct = await request(app)
                .delete(`${baseURL}/products/model1`)
                .set('Cookie', customerCookie);
                
            expect(deleteProduct.status).toBe(401);

        })


        test("delete product - error 401 Not Logged IN", async () => {

        
            const deleteProduct = await request(app)
                .delete(`${baseURL}/products/model1`)

            expect(deleteProduct.status).toBe(401);

        })

    })

    describe("changeProductQuantity integration tests", () => {

        beforeEach(async ()=>{
            await cleanupProducts();
        })
        afterEach(async ()=>{
            await cleanupProducts();
        })
        test("changeProductquantity - 200 success code ", async () => {

            

            const test = {quantity: 10,changeDate : "2024-06-06"}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: "2024-06-06", details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
        
           
            const response = await request(app)
                .patch(`${baseURL}/products/product1`)
                .send(test)
                .set('Cookie', managerCookie);

            expect(response.status).toBe(200);
            expect(response.body.quantity).toBe(30);

        })
        test("changeProductquantity - 200 success code new quantity = 0 ", async () => {

            

            const test = {quantity: 0,changeDate : "2024-06-06"}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: "2024-06-06", details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
        
           
            const response = await request(app)
                .patch(`${baseURL}/products/product1`)
                .send(test)
                .set('Cookie', managerCookie);

            expect(response.status).toBe(422);
            

        })

        test("changeProductquantity - 200 success code new quantity < 0 ", async () => {

            

            const test = {quantity: -1,changeDate : "2024-06-06"}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: "2024-06-06", details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
        
           
            const response = await request(app)
                .patch(`${baseURL}/products/product1`)
                .send(test)
                .set('Cookie', managerCookie);

            expect(response.status).toBe(422);
            

        })

       

        test("changeProductquantity - 400 error code changeDate > currentDate", async () => {
            
           

            const test ={quantity: 10,changeDate : "2030-06-02"}
 
            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
           
            const response = await request(app)
                .patch(`${baseURL}/products/product2`)
                .send(test)
                .set('Cookie', managerCookie);

            expect(response.status).toBe(400);
            
        })

        test("changeProductquantity - 400 error code changeDate < currentDate by 1 day", async () => {
            
           

            const test ={quantity: 10,changeDate : "2030-06-02"}
 
            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: "2030-06-03", details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
           
            const response = await request(app)
                .patch(`${baseURL}/products/product2`)
                .send(test)
                .set('Cookie', managerCookie);

            expect(response.status).toBe(400);
            
        })

    
            test("changeProductquantity - 400 error code changeDate << arrivalDate", async () => {

               

                const test ={quantity: 10,changeDate : "2010-06-02"}

                const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: "2024-06-02", details: "test",quantity: 20}

                await request(app)
                    .post(`${baseURL}/products`)
                    .set('Cookie', managerCookie) 
                    .send(product);
            
                const response = await request(app)
                    .patch(`${baseURL}/products/product1`)
                    .send(test)
                    .set('Cookie',managerCookie);

                expect(response.status).toBe(400);
    
            })

            test("changeProductquantity - 404 error code product not found", async () => {

               

                const test ={quantity: 10,changeDate : "2010-06-02"}

                const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: "2024-06-02", details: "test",quantity: 20}

                await request(app)
                    .post(`${baseURL}/products`)
                    .set('Cookie', managerCookie) 
                    .send(product);
            
                const response = await request(app)
                    .patch(`${baseURL}/products/product2`)
                    .send(test)
                    .set('Cookie',managerCookie);

                expect(response.status).toBe(404);
    
            })


           


        
    })

    describe("sellProduct integration tests", () => {

        beforeEach(async ()=>{
            await cleanupProducts();
        })
        afterEach(async ()=>{
            await cleanupProducts();
        })

        test("sellProduct - 200 success code", async () => {

            const test ={quantity: 10,sellingDate : formattedDate}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
      
            const sellProduct = await request(app)
                .patch(`${baseURL}/products/product1/sell`)
                .send(test)
                .set('Cookie', managerCookie);
                
            expect(sellProduct.status).toBe(200);
            expect(sellProduct.body.quantity).toEqual(10);

        })

        test("sellProduct - 200 success code quantity = 1", async () => {

            const test ={quantity: 1,sellingDate : formattedDate}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
      
            const sellProduct = await request(app)
                .patch(`${baseURL}/products/product1/sell`)
                .send(test)
                .set('Cookie', managerCookie);
                
            expect(sellProduct.status).toBe(200);
            expect(sellProduct.body.quantity).toEqual(19);

        })

        test("sellProduct - 401 error code  not Authorized", async () => {

            const test ={quantity: 10,sellingDate : "2030-06-02"}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: "2024-06-02", details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
      
            const sellProduct = await request(app)
                .patch(`${baseURL}/products/product1/sell`)
                .send(test)
                .set('Cookie', customerCookie);
                
            expect(sellProduct.status).toBe(401);
            

        })
        test("sellProduct - 422 error code  quantity 0", async () => {

            const test ={quantity: 0,sellingDate : "2030-06-02"}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: "2024-06-02", details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
      
            const sellProduct = await request(app)
                .patch(`${baseURL}/products/product1/sell`)
                .send(test)
                .set('Cookie', managerCookie);
                
            expect(sellProduct.status).toBe(422);
            

        })

        test("sellProduct - 422 error code  quantity <0", async () => {

            const test ={quantity: -1,sellingDate : "2030-06-02"}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: "2024-06-02", details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
      
            const sellProduct = await request(app)
                .patch(`${baseURL}/products/product1/sell`)
                .send(test)
                .set('Cookie', managerCookie);
                
            expect(sellProduct.status).toBe(422);
            

        })

        test("sellProduct - 422 error code  model empty", async () => {

            const test ={quantity: 10,sellingDate : "2024-06-02"}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: "2024-06-02", details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
      
            const sellProduct = await request(app)
                .patch(`${baseURL}/products/ /sell`)
                .send(test)
                .set('Cookie', managerCookie);
                
            expect(sellProduct.status).toBe(422);
            

        })

        test("sellProduct - 400 error code  sellingDate>currentDate", async () => {

            const test ={quantity: 10,sellingDate : "2030-06-02"}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: "2024-06-02", details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
      
            const sellProduct = await request(app)
                .patch(`${baseURL}/products/product1/sell`)
                .send(test)
                .set('Cookie', managerCookie);
                
            expect(sellProduct.status).toBe(400);
            

        })

        test("sellProduct - 400 error code sellingDate < arrivalDate", async () => {

            const test ={quantity: 10,sellingDate :"2010-06-02"}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: "2024-06-02", details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
      
            const sellProduct = await request(app)
                .patch(`${baseURL}/products/product1/sell`)
                .send(test)
                .set('Cookie', managerCookie);
                
            expect(sellProduct.status).toBe(400);

        })

        test("sellProduct - 404 error code ProductNotFound", async () => {

            const test ={quantity: 10,sellingDate : formattedDate}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
       
            const response = await request(app)
                .patch(`${baseURL}/products/product2/sell`)
                .send(test)
                .set('Cookie', managerCookie);
            expect(response.status).toBe(404);

        })

        test("sellProduct - 409 error code EmptyProductStock", async () => {
            
            
            const test ={quantity: 20,sellingDate : formattedDate}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 1}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);

            const testzero ={quantity: 1,changeDate : formattedDate}
            await request(app)
                .patch(`${baseURL}/products/product1/sell`)
                .send(testzero)
                .set('Cookie', managerCookie);
        
     
            
            const response = await request(app)
                .patch(`${baseURL}/products/product1/sell`)
                .send(test)
                .set('Cookie', managerCookie);
            expect(response.status).toBe(409);

        })

        test("sellProduct - 409 error code LowProductStock", async () => {

            

            const test ={quantity: 20,sellingDate : formattedDate}

            const product = {sellingPrice :300, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 10}

           

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send(product);
        
            
            const response = await request(app)
                .patch(`${baseURL}/products/product1/sell`)
                .send(test)
                .set('Cookie', managerCookie);

            expect(response.status).toBe(409);

        })
    })

    describe("getProducts integration tests",()=>{

        beforeEach(async ()=>{
            await cleanupProducts();
        })
        afterEach(async ()=>{
            await cleanupProducts();
        })
        test("getProducts All product - 200 success code", async () => {

            

            const product1 = new Product(299.99,"product1",Category.SMARTPHONE,formattedDate, "test",20)
            const product2 = new Product(299.99,"product2",Category.LAPTOP,formattedDate, "test",20)

            const products = [product1,product2]
        
         

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});
         
           
            const response = await request(app)
                .get(`${baseURL}/products`)
                .set('Cookie', managerCookie);// set the session ID in the Cookie header
              
            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);

        })


        test("getProducts product by Category - 200 success code", async () => {

           

            const product2 = new Product(299.99,"product2",Category.LAPTOP,formattedDate, "test",20)

        
        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});
        
          
            
            const response = await request(app)
                .get(`${baseURL}/products?grouping=category&category=Laptop&`)
                .set('Cookie', managerCookie);
              
            expect(response.status).toBe(200);
            expect(response.body).toEqual([product2]);

        })

        test("getProducts product by Category db Empty - 200 success code", async () => {

           

          
            
            const response = await request(app)
                .get(`${baseURL}/products?grouping=category&category=Laptop&`)
                .set('Cookie', managerCookie);
              
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);

        })

        test("getProducts product by Model - 200 success code", async () => {

           
           
           
            
            const product1 = new Product(299.99,"product1",Category.SMARTPHONE,formattedDate, "test",20)
            

        
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});
        
          
            
            const response = await request(app)
                .get(`${baseURL}/products?grouping=model&model=product1&`)
                .set('Cookie', managerCookie);// set the session ID in the Cookie header
              
            expect(response.status).toBe(200);
            expect(response.body).toEqual([product1]);

        })

        test("getProducts- 422 error code", async () => {

           
           
           
            
            const product1 = new Product(299.99,"product1",Category.SMARTPHONE,formattedDate, "test",20)
            

        
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});
        
          
            
            const response = await request(app)
                .get(`${baseURL}/products?grouping=wrongcategory&model=product1&`)
                .set('Cookie', managerCookie);// set the session ID in the Cookie header
              
            expect(response.status).toBe(422);
           

        })


        test("getProducts  - 401 success code not Authorized", async () => {

           
           
           
            
            const product1 = new Product(299.99,"product1",Category.SMARTPHONE,formattedDate, "test",20)
            

        
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});
        
          
            
            const response = await request(app)
                .get(`${baseURL}/products?grouping=model&model=product1&`)
                .set('Cookie', customerCookie);// set the session ID in the Cookie header
              
            expect(response.status).toBe(401);
           

        })

        test("getProducts product by Model - 404 error code product not found", async () => {

           
             
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});
        
          
            
            const response = await request(app)
                .get(`${baseURL}/products?grouping=model&model=product3&`)
                .set('Cookie',managerCookie);
              
            expect(response.status).toBe(404);
            

        })

        test("getProducts product by Model DB empty - 404 error code product not found", async () => {

       
          
            
            const response = await request(app)
                .get(`${baseURL}/products?grouping=model&model=product3&`)
                .set('Cookie',managerCookie);
              
            expect(response.status).toBe(404);
            

        })


        test("getProducts  - 422 error code grouping: null and model:not null ", async () => {

           
           
            
            
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});
      
            
            const response = await request(app)
                .get(`${baseURL}/products?model=product3&`)
                .set('Cookie', managerCookie);// set the session ID in the Cookie header
            expect(response.status).toBe(422);
            

        })

        test("getProducts All  - 422 error code grouping: category and model: not null,: and category  null", async () => {

           
            
            
        
            await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});
        
            
            
            const response = await request(app)
                .get(`${baseURL}/products?grouping=category&model=product3&`)
                .set('Cookie', managerCookie);// set the session ID in the Cookie header
            expect(response.status).toBe(422);
            

        })

        test("getProducts All  - 422 error code grouping: model  and category : not null and model: null", async () => {

           
            
            
        
            await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});
        
            
            
            const response = await request(app)
                .get(`${baseURL}/products?grouping=model&category=Laptop&`)
                .set('Cookie', managerCookie);// set the session ID in the Cookie header
            expect(response.status).toBe(422);
            

        })

        test("getProducts All  - 422 error code grouping: model  and category: not null and model:not null", async () => {

           
            
            
        
            await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});
        
            
            
            const response = await request(app)
                .get(`${baseURL}/products?grouping=model&category=Laptop&model=product1&`)
                .set('Cookie', managerCookie);// set the session ID in the Cookie header
            expect(response.status).toBe(422);
            

        })



    })



    describe("getAvailableProducts ",()=>{

        beforeEach(async ()=>{
            await cleanupProducts();
        })
        afterEach(async ()=>{
            await cleanupProducts();
        })
        test("getAvailableproducts ALL - 200 success code", async () => {

            
            const product1 = new Product(299.99,"product1",Category.SMARTPHONE,formattedDate, "test",20)
            const product2 = new Product(299.99,"product2",Category.LAPTOP,formattedDate, "test",20)
            

            const products = [product1,product2]
        
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie',managerCookie) 
                .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product3", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity:1});

                const testzero ={quantity: 1,changeDate : formattedDate}
            await request(app)
                .patch(`${baseURL}/products/product3/sell`)
                .send(testzero)
                .set('Cookie', managerCookie);
        
        
          
            const response = await request(app)
                .get(`${baseURL}/products/available`)
                .set('Cookie', customerCookie);// set the session ID in the Cookie header
              
            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);

        })

        test("getAvailableproducts  - 422 error code wrong category", async () => {

            
            const product1 = new Product(299.99,"product1",Category.SMARTPHONE,formattedDate, "test",20)
            const product2 = new Product(299.99,"product2",Category.LAPTOP,formattedDate, "test",20)
            

            const products = [product1,product2]
        
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie',managerCookie) 
                .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product3", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity:1});

                const testzero ={quantity: 1,changeDate : formattedDate}
            await request(app)
                .patch(`${baseURL}/products/product3/sell`)
                .send(testzero)
                .set('Cookie', managerCookie);
        
        
          
            const response = await request(app)
                .get(`${baseURL}/products/available?category=wrongcategory&`)
                .set('Cookie', customerCookie);// set the session ID in the Cookie header
              
            expect(response.status).toBe(422);
           

        })


        test("getAvailableproducts by Model - 200 success code", async () => {

           
           
           
            const product2 = new Product(299.99,"product2",Category.LAPTOP,formattedDate, "test",20)
        

            const products = [product2]
        
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product3", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 1});

                const testzero ={quantity: 1,changeDate : formattedDate}
            await request(app)
                .patch(`${baseURL}/products/product3/sell`)
                .send(testzero)
                .set('Cookie', managerCookie);
        
        
           
          
            const response = await request(app)
                .get(`${baseURL}/products/available?grouping=model&model=product2&`)
                .set('Cookie', managerCookie);
              
            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);

        })

        test("getAvailableproducts by Category - 200 success code", async () => {

           
           
           
            const product2 = new Product(299.99,"product2",Category.LAPTOP,formattedDate, "test",20)
        

            const products = [product2]
        
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product3", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 1});

                const testzero ={quantity: 1,changeDate : formattedDate}
            await request(app)
                .patch(`${baseURL}/products/product3/sell`)
                .send(testzero)
                .set('Cookie', managerCookie);
        
        
           
          
            const response = await request(app)
                .get(`${baseURL}/products/available?grouping=category&category=Laptop&`)
                .set('Cookie', managerCookie);
              
            expect(response.status).toBe(200);
            expect(response.body).toEqual(products);

        })




        test("getAvailableProducts   - 422 error code grouping null and model or category not null", async () => {

         
            await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});

        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product3", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 1});

            const testzero ={quantity: 1,changeDate : formattedDate}
            await request(app)
                .patch(`${baseURL}/products/product3/sell`)
                .send(testzero)
                .set('Cookie', managerCookie);
        
        
            
            const response = await request(app)
                .get(`${baseURL}/products/available?model=product3&`)
                .set('Cookie', managerCookie);
            expect(response.status).toBe(422);
            

        })

        test("getAvailableProducts  - 422 error code grouping category and model not null and category  null", async () => {

           

          
            await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});

        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product3", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 1});

            const testzero ={quantity: 1,changeDate : formattedDate}
            await request(app)
                .patch(`${baseURL}/products/product3/sell`)
                .send(testzero)
                .set('Cookie', managerCookie);
        
        
            
            const response = await request(app)
                .get(`${baseURL}/products/available?grouping=category&model=product2&`)
                .set('Cookie', managerCookie);

            expect(response.status).toBe(422);
            

        })


        test("getAvailableProducts   - 401 error code not logged in", async () => {

           

          
            await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});

        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product3", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 1});

            const testzero ={quantity: 1,changeDate : formattedDate}
            await request(app)
                .patch(`${baseURL}/products/product3/sell`)
                .send(testzero)
                .set('Cookie', managerCookie);
        
        
            
            const response = await request(app)
                .get(`${baseURL}/products/available?grouping=category&model=product2&`)
                

            expect(response.status).toBe(401);
            

        })



    })

    describe("deleteALL",()=>{

        beforeEach(async ()=>{
            await cleanupProducts();
        })
        afterEach(async ()=>{
            await cleanupProducts();
        })
        test("deleteAll  200 success code", async () => {

            
        
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product3", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 1});

                const testzero ={quantity: 1,changeDate : formattedDate}
            await request(app)
                .patch(`${baseURL}/products/product3/sell`)
                .send(testzero)
                .set('Cookie', managerCookie);
        
          
          
            const response = await request(app)
                .delete(`${baseURL}/products`)
                .set('Cookie', managerCookie);
              
            expect(response.status).toBe(200);

            const response2 = await request(app)
                .get(`${baseURL}/products`)
                .set('Cookie', managerCookie);

            expect(response2.body).toEqual([]);
            

        })

        test("deleteAll  200 success code", async () => {

            
        
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});

            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product3", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 1});

                const testzero ={quantity: 1,changeDate : formattedDate}
            await request(app)
                .patch(`${baseURL}/products/product3/sell`)
                .send(testzero)
                .set('Cookie', managerCookie);
        
          
          
            const response = await request(app)
                .delete(`${baseURL}/products`)
                .set('Cookie', managerCookie);
              
            expect(response.status).toBe(200);

            const response2 = await request(app)
                .get(`${baseURL}/products/available`)
                .set('Cookie', managerCookie);

            expect(response2.body).toEqual([]);
            

        })



        test("deleteAll - 401 error code not Authorized", async () => {

            
                  
        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});

        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});

        await request(app)
            .post(`${baseURL}/products`)
            .set('Cookie', managerCookie) 
            .send({sellingPrice :299.99, model: "product3", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 1});


        const testzero ={quantity: 1,changeDate : formattedDate}
                await request(app)
                .patch(`${baseURL}/products/product3/sell`)
                .send(testzero)
                .set('Cookie', managerCookie);
        
          
            const response = await request(app)
                .delete(`${baseURL}/products`)
                .set('Cookie', customerCookie);
              
            expect(response.status).toBe(401);
            

        })

        test("deleteAll - 401 error code not logged in", async () => {

            
                  
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product1", category: Category.SMARTPHONE, arrivalDate: formattedDate, details: "test",quantity: 20});
    
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product2", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 20});
    
            await request(app)
                .post(`${baseURL}/products`)
                .set('Cookie', managerCookie) 
                .send({sellingPrice :299.99, model: "product3", category: Category.LAPTOP, arrivalDate: formattedDate, details: "test",quantity: 1});
    
    
            const testzero ={quantity: 1,changeDate : formattedDate}
                    await request(app)
                    .patch(`${baseURL}/products/product3/sell`)
                    .send(testzero)
                    .set('Cookie', managerCookie);
            
              
                const response = await request(app)
                    .delete(`${baseURL}/products`)
                    
                  
                expect(response.status).toBe(401);
                
    
            })
    











    })

})