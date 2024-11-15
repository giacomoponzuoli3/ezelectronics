import { describe, test, expect, jest, afterAll} from "@jest/globals"
import request from 'supertest'
import { app } from "../index"
import db from "../src/db/db"
import { Role } from "../src/components/user"
import { cleanup } from '../src/db/cleanup'; 
import UserDAO from "../src/dao/userDAO"

const baseURL = "/ezelectronics"

const userDao = new UserDAO;

async function createUser() {
    await userDao.createUser("customer", "test", "test", "test", "Customer");
    await userDao.createUser("customer2", "test", "test", "test", "Customer");
    await userDao.createUser("admin", "test", "test", "test", "Admin");
    await userDao.createUser("admin2", "test", "test", "test", "Admin");
    await userDao.createUser("manager", "test", "test", "test", "Manager");
}


describe("Create user test", () => {

    test("It should returns 200 if user is created successfully", async () => {
        const user = {username: "test", name: "test", surname: "test", password: "test", role: "Customer"}
        await cleanup();
        await createUser()
        const addUser = await request(app).post(baseURL + "/users").send(user)
        expect(addUser.status).toBe(200)
    })

    test("should return 409 if username already exists", async () => {
        const user = { username: "customer", name: "test", surname: "test", password: "test", role: "Customer" };
        await cleanup();
        await createUser(); 
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(409);
    });

    test("should return 422 if username is missing", async () => {
        const user = { name: "test", surname: "test", password: "test", role: "Customer" };
        await cleanup();
        await createUser(); 
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
    });

    test("should return 422 if name is missing", async () => {
        const user = { username: "test", surname: "test", password: "test", role: "Customer" };
        await cleanup();
        await createUser(); 
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
        
    });

    test("should return 422 if surname is missing", async () => {
        const user = { username: "test", name: "test", password: "test", role: "Customer" };
        await cleanup();
        await createUser(); 
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
        
    });

    test("should return 422 if password is missing", async () => {
        const user = { username: "test", name: "test", surname: "test", role: "Customer" };
        await cleanup();
        await createUser(); 
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
    });

    test("should return 422 if role is missing", async () => {
        const user = { username: "test", name: "test", surname: "test", password: "test" };
        await cleanup();
        await createUser(); 
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
    });

    test("should return 422 if role is invalid", async () => {
        const user = { username: "test", name: "test", surname: "test", password: "test", role: "InvalidRole" };
        await cleanup();
        await createUser(); 
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
    });

    test("should return 422 if role is empty", async () => {
        const user = { username: "test", name: "test", surname: "test", password: "test", role: "" };
        await cleanup();
        await createUser(); 
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
    });

    test("should return 422 if username is empty", async () => {
        const user = { username: "", name: "test", surname: "test", password: "test", role: "Customer" };
        await cleanup();
        await createUser();
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
    });

    test("should return 422 if name is empty", async () => {
        const user = { username: "test", name: "", surname: "test", password: "test", role: "Customer" };
        await cleanup();
        await createUser();
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
    });

    test("should return 422 if surname is empty", async () => {
        const user = { username: "test", name: "test", surname: "", password: "test", role: "Customer" };
        await cleanup();
        await createUser();
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
    });

    test("should return 422 if password is empty", async () => {
        const user = { username: "test", name: "test", surname: "test", password: "", role: "Customer" };
        await cleanup();
        await createUser();
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
    });

    test("should return 422 if username and password are missing", async () => {
        const user = { name: "test", surname: "test", role: "Customer" };
        await cleanup();
        await createUser();
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
    });

    test("should return 422 if name and surname are missing", async () => {
        const user = { username: "test", password: "test", role: "Customer" };
        await cleanup();
        await createUser();
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
    });

    test("should return 422 if role is missing", async () => {
        const user = { username: "test", password: "test", name: "test", surname: "test" };
        await cleanup();
        await createUser();
        const addUser = await request(app).post(baseURL + "/users").send(user);
        expect(addUser.status).toBe(422);
    });

})

    describe("getUserByUsername test", () => {

        test("It should returns 401 if user is not logged in", async () => {
            await cleanup();
            await createUser()
            const userInfo = await request(app).get(baseURL + "/users/customer")
            expect(userInfo.status).toBe(401)
        })

        test("It should returns 200 if customer login and get himself", async () => {
            const user = {username: "customer", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const response = await request(app).get(baseURL + "/users/customer")
                .set('Cookie', sessionID) 
            expect(response.status).toBe(200)
            expect(response.body.username).toBe("customer")
        })

        test("It should returns 200 if admin login and get himself", async () => {
            const user = {username: "admin", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const response = await request(app).get(baseURL + "/users/admin")
                .set('Cookie', sessionID) 
            expect(response.status).toBe(200)
            expect(response.body.username).toBe("admin")
        })

        test("It should returns 200 if manager login and get himself", async () => {
            const user = {username: "manager", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const response = await request(app).get(baseURL + "/users/manager")
                .set('Cookie', sessionID) 
            expect(response.status).toBe(200)
            expect(response.body.username).toBe("manager")
        })

        test("It should returns 200 if admin login and get other customer users", async () => {
            const user = {username: "admin", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const response = await request(app).get(baseURL + "/users/customer")
                .set('Cookie', sessionID) 
            expect(response.status).toBe(200)
            expect(response.body.username).toBe("customer")
        })

        test("It should returns 200 if admin login and get other manager users", async () => {
            const user = {username: "manager", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const response = await request(app).get(baseURL + "/users/manager")
                .set('Cookie', sessionID) 
            expect(response.status).toBe(200)
            expect(response.body.username).toBe("manager")
        })


        test("It should returns 200 if admin login and get other admin users", async () => {
            await cleanup();
            await createUser();
        
            const Login = {username: "admin", password: "test"};
            const loginResponse = await request(app).post(baseURL + "/sessions").send(Login);
            const sessionID = loginResponse.headers['set-cookie'];
            const response = await request(app).get(baseURL + "/users/admin2")
                .set('Cookie', sessionID);
            expect(response.status).toBe(200);
            expect(response.body.username).toBe("admin2");
        });

        test("It should returns 401 if customer login and get other customer users", async () => {
            await cleanup();
            await createUser();
        
            const Login = {username: "customer", password: "test"};
            const loginResponse = await request(app).post(baseURL + "/sessions").send(Login);
            const sessionID = loginResponse.headers['set-cookie'];
            const response = await request(app).get(baseURL + "/users/customer2")
                .set('Cookie', sessionID);
            expect(response.status).toBe(401);
        });

        test("It should returns 401 if manager login and get other customer users", async () => {
            await cleanup();
            await createUser();
        
            const Login = {username: "manager", password: "test"};
            const loginResponse = await request(app).post(baseURL + "/sessions").send(Login);
            const sessionID = loginResponse.headers['set-cookie'];
            const response = await request(app).get(baseURL + "/users/customer")
                .set('Cookie', sessionID);
            expect(response.status).toBe(401);
        });

        test("It should returns 404 if admin login but user does not exist in db", async () => {
            await cleanup();
            await createUser();
        
            const Login = {username: "admin", password: "test"};
            const loginResponse = await request(app).post(baseURL + "/sessions").send(Login);
            const sessionID = loginResponse.headers['set-cookie'];
            const response = await request(app).get(baseURL + "/users/notExist")
                .set('Cookie', sessionID);
            expect(response.status).toBe(404);
        });

        test("It should returns 401 if customer login and get user that does not exist", async () => {
            await cleanup();
            await createUser();
        
            const Login = {username: "customer", password: "test"};
            const loginResponse = await request(app).post(baseURL + "/sessions").send(Login);
            const sessionID = loginResponse.headers['set-cookie'];
            const response = await request(app).get(baseURL + "/users/notExist")
                .set('Cookie', sessionID);
            expect(response.status).toBe(401);
        });
     
    });

    describe("getAllUsers test", () => {

        test("It should returns 401 if user is not logged", async () => {
            await cleanup();
            await createUser()
            const response = await request(app).get(baseURL + "/users")
            expect(response.status).toBe(401)
        })

        //getAllUsers può essere chiamata solo da un admin
        test("It should returns 200 if user is admin", async () => {
            const user = {username: "admin", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const response = await request(app).get(baseURL + "/users")
                .set('Cookie', sessionID) 
            expect(response.status).toBe(200)
        })

        test("It should returns 401 if user is customer", async () => {
            const user = {username: "customer", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const response = await request(app).get(baseURL + "/users")
                .set('Cookie', sessionID) 
            expect(response.status).toBe(401)
        })

        test("It should returns 401 if user is manager", async () => {
            const user = {username: "manager", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const response = await request(app).get(baseURL + "/users")
                .set('Cookie', sessionID) 
            expect(response.status).toBe(401)
        })

    });

    describe("getUserByRole", () => {

        test("It should returns 401 if user is not logged in", async () => {
            await cleanup();
            await createUser()
            const response = await request(app).get(baseURL + "/users/roles/Customer")
            expect(response.status).toBe(401)
        })

        //La funzione getUserByRole può essere chiamata solo da un Admin
        test("It should returns 200 if user is admin", async () => {
            const user = {username: "admin", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const response = await request(app).get(baseURL + "/users/roles/Customer")
                .set('Cookie', sessionID)
            expect(response.status).toBe(200)
        })

        test("It should returns 401 if user is customer", async () => {
            const user = {username: "customer", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const response = await request(app).get(baseURL + "/users/roles/Customer")
                .set('Cookie', sessionID)
            expect(response.status).toBe(401)
        })

        test("It should returns 401 if user is manager", async () => {
            const user = {username: "manager", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const response = await request(app).get(baseURL + "/users/roles/Customer")
                .set('Cookie', sessionID)
            expect(response.status).toBe(401)
        })

        test("It should returns 422 if role is invalid", async () => {
            const user = {username: "admin", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const response = await request(app).get(baseURL + "/users/roles/InvalidRole")
                .set('Cookie', sessionID)
            expect(response.status).toBe(422)
        })

    })

    describe("delete", () => {

        test("It should returns 401 if user is not logged in", async () => {
            await cleanup();
            await createUser()
            const deleteResult = await request(app).delete(baseURL + "/users/customer")
            expect(deleteResult.status).toBe(401)
        })

        test("It should returns 200 if customer delete himself", async () => {
            const user = {username: "customer", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const deleteResult = await request(app).delete(baseURL + "/users/customer")
                .set('Cookie', sessionID) 
            expect(deleteResult.status).toBe(200)
            //Prova a loggare con l'account appena eliminato
            const loginDeleted = await request(app).post(baseURL + "/sessions").send({
                username: "customer",
                password: "test"
            })
            expect(loginDeleted.status).toBe(401)
        })

        test("It should returns 200 if admin delete himself", async () => {
            const user = {username: "admin", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const deleteResult = await request(app).delete(baseURL + "/users/admin")
                .set('Cookie', sessionID) 
            expect(deleteResult.status).toBe(200)
            //Prova a loggare con l'account appena eliminato
            const loginDeleted = await request(app).post(baseURL + "/sessions").send({
                username: "test",
                password: "test"
            })
            expect(loginDeleted.status).toBe(401)
        })

        test("It should returns 200 if manager delete himself", async () => {
            const user = {username: "manager", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const deleteResult = await request(app).delete(baseURL + "/users/manager")
                .set('Cookie', sessionID) 
            expect(deleteResult.status).toBe(200)
            const loginDeleted = await request(app).post(baseURL + "/sessions").send({
                username: "test",
                password: "test"
            })
            expect(loginDeleted.status).toBe(401)
        })

        test("It should returns 200 if admin delete other not-admin users", async () => {
            const user = {username: "admin", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const deleteResult = await request(app).delete(baseURL + "/users/customer")
                .set('Cookie', sessionID) 
            expect(deleteResult.status).toBe(200)
            const loginDeleted = await request(app).post(baseURL + "/sessions").send({
                username: "test",
                password: "test"
            })
            expect(loginDeleted.status).toBe(401)
        })

        test("It should returns 401 if admin tries to delete other admin user", async () => {
            const user = {username: "admin", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const deleteResult = await request(app).delete(baseURL + "/users/admin2")
                .set('Cookie', sessionID) 
            expect(deleteResult.status).toBe(401)
        })

        test("It should returns 401 if customer tries to delete other customer users", async () => {
            const user = {username: "customer", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const deleteResult = await request(app).delete(baseURL + "/users/customer2")
                .set('Cookie', sessionID) 
            expect(deleteResult.status).toBe(401)
        })

        test("It should returns 401 if manager tries to delete other customer users", async () => {
            const user = {username: "manager", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const deleteResult = await request(app).delete(baseURL + "/users/customer")
                .set('Cookie', sessionID) 
            expect(deleteResult.status).toBe(401)
        })

        test("It should returns 404 if admin tries to delete user that does not exist", async () => {
            const user = {username: "admin", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const deleteResult = await request(app).delete(baseURL + "/users/notExistUser")
                .set('Cookie', sessionID) 
            expect(deleteResult.status).toBe(404)
    });

});

    describe("deleteAllUser", () => {

        test("It should returns 401 if user is not logged in", async () => {
            await cleanup();
            await createUser()
            const deleteResult = await request(app).delete(baseURL + "/users")
            expect(deleteResult.status).toBe(401)
        })

        test("It should returns 401 if user is customer", async () => {
            const user = {username: "customer", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const deleteResult = await request(app).delete(baseURL + "/users")
                .set('Cookie', sessionID) 
            expect(deleteResult.status).toBe(401)
        })

        test("It should returns 401 if user is manager", async () => {
            const user = {username: "customer", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const deleteResult = await request(app).delete(baseURL + "/users")
                .set('Cookie', sessionID) 
            expect(deleteResult.status).toBe(401)
        })

        test("It should returns 200 if user is admin", async () => {
            const user = {username: "admin", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const deleteResult = await request(app).delete(baseURL + "/users")
                .set('Cookie', sessionID) 
            expect(deleteResult.status).toBe(200)
            const response = await request(app).get(baseURL + "/users").set('Cookie', sessionID)
            expect(response.status).toBe(200)
            //expect(response.body.length).toBe(2) //dipende da quanti admin sono presenti nel db
        })

    });

    describe("UpdateUserInfo", () => {

        test("It should returns 401 if user is not logged in", async () => {
            await cleanup();
            await createUser()
            const updateUser = {username: "customer", name: "test", surname: "test", birthdate: "2000-01-01", address: "test"}
            const updateResult = await request(app).patch(baseURL + "/users/customer").send(updateUser)
            expect(updateResult.status).toBe(401)
        })
        
        test("It should returns 200 if customer update his details", async () => {
            const user= { username: "customer", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateInfo = {name: "test", surname: "test", birthdate: "1990-01-01", address: "test"}
            const updateResult = await request(app).patch(baseURL + "/users/customer").send(updateInfo)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(200)
            //Verifica sull'utente appena aggiornato
            const userInfo = await request(app).get(baseURL + "/users/customer")
                .set('Cookie', sessionID) 
            expect(userInfo.status).toBe(200)
            expect(userInfo.body.name).toBe("test")
            expect(userInfo.body.surname).toBe("test")
            expect(userInfo.body.birthdate).toBe("1990-01-01")
            expect(userInfo.body.address).toBe("test")
        })

        test("It should return 200 if admin update his details", async () => {
            const user= { username: "admin", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateUser = {name: "test", surname: "test", birthdate: "1990-01-01", address: "test"}
            const updateResult = await request(app).patch(baseURL + "/users/admin").send(updateUser)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(200)
            //Verifica sull'utente appena aggiornato
            const userInfo = await request(app).get(baseURL + "/users/admin")
                .set('Cookie', sessionID) 
            expect(userInfo.status).toBe(200)
            expect(userInfo.body.name).toBe("test")
            expect(userInfo.body.surname).toBe("test")
            expect(userInfo.body.birthdate).toBe("1990-01-01")
            expect(userInfo.body.address).toBe("test")
        })

        test("It should returns 200 if manager update his details", async () => {
            const user= { username: "manager", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateUser = {name: "test", surname: "test", birthdate: "1990-01-01", address: "test"}
            const updateResult = await request(app).patch(baseURL + "/users/manager").send(updateUser)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(200)
            //Verifica sull'utente appena aggiornato
            const userInfo = await request(app).get(baseURL + "/users/manager")
                .set('Cookie', sessionID) 
            expect(userInfo.status).toBe(200)
            expect(userInfo.body.name).toBe("test")
            expect(userInfo.body.surname).toBe("test")
            expect(userInfo.body.birthdate).toBe("1990-01-01")
            expect(userInfo.body.address).toBe("test")
        })

        test("It should returns 422 if name is empty", async () => {
            const user= { username: "admin", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateUser = {name: "", surname: "test", birthdate: "1990-01-01", address: "test"}
            const updateResult = await request(app).patch(baseURL + "/users/admin").send(updateUser)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(422)
        })

        test("It should returns 422 if surname is empty", async () => {
            const user= { username: "admin", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateUser = {name: "test", surname: "", birthdate: "1990-01-01", address: "test"}
            const updateResult = await request(app).patch(baseURL + "/users/admin").send(updateUser)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(422)
        })

        test("It should returns 422 if address is empty", async () => {
            const user= { username: "admin", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateUser = {name: "test", surname: "test", birthdate: "1990-01-01", address: ""}
            const updateResult = await request(app).patch(baseURL + "/users/admin").send(updateUser)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(422)
        })

        test("It should returns 422 if birthdate is empty", async () => {
            const user= { username: "admin", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateUser = {name: "test", surname: "test", birthdate: "", address: "ciao"}
            const updateResult = await request(app).patch(baseURL + "/users/admin").send(updateUser)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(422)
        })

        test("It should returns 400 if birthdate is Invalid", async () => {
            const user= { username: "admin", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateUser = {name: "test", surname: "test", birthdate: "2025-01-01", address: "test"}
            const updateResult = await request(app).patch(baseURL + "/users/admin").send(updateUser)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(400)
        })

        test("It should returns 422 if date format is not valid", async () => {
            const user= { username: "admin", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateUser = {name: "test", surname: "test", birthdate: "01-01-2030", address: "test"}
            const updateResult = await request(app).patch(baseURL + "/users/admin").send(updateUser)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(422)
        })

        test("It should returns 401 if admin tries to update other admin's details", async () => {
            const user= { username: "admin", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateUser = {name: "test", surname: "test", birthdate: "2000-01-01", address: "test"}
            const updateResult = await request(app).patch(baseURL + "/users/admin2").send(updateUser)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(401)
        })

        test("It should returns 200 if admin tries to update other not-admin's details", async () => {
            const user= { username: "admin", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateUser = {name: "test", surname: "test", birthdate: "2000-01-01", address: "test"}
            const updateResult = await request(app).patch(baseURL + "/users/customer2").send(updateUser)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(200)
             //Verifica sull'utente appena aggiornato
             const userInfo = await request(app).get(baseURL + "/users/customer2")
             .set('Cookie', sessionID) 
                 expect(userInfo.status).toBe(200)
                 expect(userInfo.body.name).toBe("test")
                 expect(userInfo.body.surname).toBe("test")
                 expect(userInfo.body.birthdate).toBe("2000-01-01")
                 expect(userInfo.body.address).toBe("test")
        })

        test("It should returns 401 if customer tries to update other admin's details", async () => {
            const user= { username: "customer", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateUser = {name: "test", surname: "test", birthdate: "2000-01-01", address: "test"}
            const updateResult = await request(app).patch(baseURL + "/users/admin").send(updateUser)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(401)
        })

        test("It should returns 401 if customer tries to update other manager's details", async () => {
            const user= { username: "customer", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateUser = {name: "test", surname: "test", birthdate: "2000-01-01", address: "test"}
            const updateResult = await request(app).patch(baseURL + "/users/manager").send(updateUser)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(401)
        })

        test("It should returns 404 if admin tries to update a not admin user that doesn't exist", async () => {
            const user= { username: "admin", password: "test" }
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const updateUser = {name: "test", surname: "test", birthdate: "2000-01-01", address: "test"}
            const updateResult = await request(app).patch(baseURL + "/users/notExist").send(updateUser)
                .set('Cookie', sessionID) 
            expect(updateResult.status).toBe(404)
        })

 });

 describe("Auth test", () => {

    describe("login ", () => {

        test("It should returns 422 if username is empty", async () => {
            const user = {username: "", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            expect(login.status).toBe(422)
        })

        test("It should return 422 if password is empty", async () => {
            const user = {username: "customer", password: ""}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            expect(login.status).toBe(422)
        })

        test("It should returns 401 if user doesn't exist", async () => {
            const user = {username: "notExist", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            expect(login.status).toBe(401)
        })

        test("It should returns 401 if password is wrong", async () => {
            const user = {username: "customer", password: "testpass"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            expect(login.status).toBe(401)
        })

        test("It should return 200 if password is correct", async () => {
            const user = {username: "customer", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            expect(login.status).toBe(200)
        })

    }) 

    describe("logout ", () => {

        test("It should returns 200 if logout is successful", async () => {
            const user = {username: "customer", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const logout = await request(app).delete(baseURL + "/sessions/current")
                .set('Cookie', sessionID) 
            expect(logout.status).toBe(200)
        })
        test("It should returns 401 if user tries to logout without a session", async () => {
            await cleanup();
            await createUser()
            const logout = await request(app).delete(baseURL + "/sessions/current")
            expect(logout.status).toBe(401)
        })

        test("It should returns 401 if user tries to logout with a wrong session", async () => {
            await cleanup();
            await createUser()
            const logout = await request(app).delete(baseURL + "/sessions/current")
                .set('Cookie', "wrongSession") 
            expect(logout.status).toBe(401)
        })

    });

    describe("retrieve info about logged user ", () => {

        test("It should returns 401 if session is wrong", async () => {
            await cleanup();
            await createUser()
            const userInfo = await request(app).get(baseURL + "/sessions/current")
                .set('Cookie', "wrongSession") 
            expect(userInfo.status).toBe(401)
        })

        test("It should returns 200 if user get current user info", async () => {
            const user = {username: "customer", password: "test"}
            await cleanup();
            await createUser()
            const login = await request(app).post(baseURL + "/sessions").send(user)
            const sessionID = login.header['set-cookie'] 
            const userInfo = await request(app).get(baseURL + "/sessions/current")
                .set('Cookie', sessionID) 
            expect(userInfo.status).toBe(200)
        })

    });

 });

    afterAll(() => {
        jest.clearAllMocks();
        cleanup();
    });
