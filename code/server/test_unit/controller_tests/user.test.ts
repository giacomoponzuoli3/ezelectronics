import { test, expect, jest, afterEach } from "@jest/globals"
import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import { Role, User } from "../../src/components/user";
import { InvalidBirhdateError, UnauthorizedUserError, UserAlreadyExistsError, UserIsAdminError, UserNotFoundError } from "../../src/errors/userError";

jest.mock("../../src/dao/userDAO")


describe("Test user control", () => {

    afterEach(() => {
        jest.clearAllMocks(); 
    });
    
    afterAll(() => {
        jest.clearAllMocks();
    
    })

    describe("Create user", () => {

        test("It should return false if user creation was unsuccessful", async () => {
            const testUser = { 
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: "Manager"
            }
        
            jest.spyOn(UserDAO.prototype, "createUser").mockResolvedValueOnce(false); 
        
            const controller = new UserController(); 
        
            const response = await controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);
        
            expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);
            
            expect(response).toBe(false); 
        });


        test("It should return true if user creation was successful", async () => {
            const testUser = { 
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: "Manager"
            }
            jest.spyOn(UserDAO.prototype, "createUser").mockResolvedValueOnce(true); 
            const controller = new UserController(); 
            const response = await controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role);
        
            expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(testUser.username,
                testUser.name,
                testUser.surname,
                testUser.password,
                testUser.role);
            expect(response).toBe(true); 
                
        });

        test("It should throw UserAlreadyExistsError if the username is already taken", async () => {
            const testUser = { 
                username: "existingUser",
                name: "test",
                surname: "test",
                password: "test",
                role: "Manager"
            };
    
            jest.spyOn(UserDAO.prototype, "createUser").mockRejectedValueOnce(new UserAlreadyExistsError()); 
            const controller = new UserController(); 
    
            await expect(controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role))
                .rejects.toThrow(UserAlreadyExistsError);
    
            expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(
                testUser.username,
                testUser.name,
                testUser.surname,
                testUser.password,
                testUser.role
            );
        });

        test("It should handle general errors", async () => {
            const testUser = { 
                username: "test",
                name: "test",
                surname: "test",
                password: "test",
                role: "Manager"
            };
    
            const errorMessage = "Database error";
            jest.spyOn(UserDAO.prototype, "createUser").mockRejectedValueOnce(new Error(errorMessage)); 
            const controller = new UserController(); 
    
            await expect(controller.createUser(testUser.username, testUser.name, testUser.surname, testUser.password, testUser.role))
                .rejects.toThrow(errorMessage);
    
            expect(UserDAO.prototype.createUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.createUser).toHaveBeenCalledWith(
                testUser.username,
                testUser.name,
                testUser.surname,
                testUser.password,
                testUser.role
            );
        });

    })

    describe("getUsers", () => { 

        test("It should return an empty array", async () => {

            jest.spyOn(UserDAO.prototype, "getAllUsers").mockResolvedValueOnce([]);
            const controller = new UserController(); 
            const response = await controller.getUsers(); 
            expect(UserDAO.prototype.getAllUsers).toHaveBeenCalledTimes(1);
            expect(response).toEqual([]);
        });
        
        test("It should return an array of users", async () => {
            
            const users = [
                new User("test1", "Test1", "User1", Role.ADMIN, "Test Address 1", "2000-01-01"),
                new User("test2", "Test2", "User2", Role.MANAGER, "Test Address 2", "2001-01-01")
            ];
            jest.spyOn(UserDAO.prototype, "getAllUsers").mockResolvedValueOnce(users);
        
            const controller = new UserController(); 
            const response = await controller.getUsers(); 
            expect(UserDAO.prototype.getAllUsers).toHaveBeenCalledTimes(1);
            expect(response).toEqual(users);
        });


    });

    describe("getUsersByRole", () => {

        test("It should return users by role", async () => {
            const role = 'Customer';
            const mockUsers = [
                new User('user1', 'User', 'One', Role.CUSTOMER, 'Address 1', '1990-01-01'),
                new User('user2', 'User', 'Two', Role.CUSTOMER, 'Address 2', '1991-02-02'),
            ];
    
            jest.spyOn(UserDAO.prototype, "getUsersByRole").mockResolvedValueOnce(mockUsers);
            const controller = new UserController();
            const response = await controller.getUsersByRole(role);
    
            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledWith(role);
            expect(response).toEqual(mockUsers);
        });

        test("It should handle general errors", async () => {
            
            const role = 'Customer';
            const errorMessage = "Database error";
    
            jest.spyOn(UserDAO.prototype, "getUsersByRole").mockRejectedValueOnce(new Error(errorMessage));
            const controller = new UserController();
    
            await expect(controller.getUsersByRole(role)).rejects.toThrow(errorMessage);
    
            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.getUsersByRole).toHaveBeenCalledWith(role);
        });

    });

    describe("getUserByUsername", () => {

        test("It should return the user by username", async () => {
            
            const username = 'testuser';
            const mockUser = new User('testuser', 'Test', 'User', Role.CUSTOMER, 'Address', '1990-01-01');
            
            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockResolvedValueOnce(mockUser);
            const controller = new UserController();
            const response = await controller.getUserByUsername(mockUser, username);
    
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith(username);
            expect(response).toEqual(mockUser);
        });

        test("It should throw UserNotFoundError if the user does not exist", async () => {
            
            const username = 'nonexistentuser';
            const mockUser = new User('adminuser', 'Admin', 'User', Role.ADMIN, 'Address', '1990-01-01');
    
            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockRejectedValueOnce(new UserNotFoundError());
            const controller = new UserController();
    
            await expect(controller.getUserByUsername(mockUser, username)).rejects.toThrow(UserNotFoundError);
    
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith(username);
        });

        test("It should handle general errors", async () => {
           
            const username = 'testuser';
            const errorMessage = "Database error";
            const mockUser = new User('adminuser', 'Admin', 'User', Role.ADMIN, 'Address', '1990-01-01');
    
            jest.spyOn(UserDAO.prototype, "getUserByUsername").mockRejectedValueOnce(new Error(errorMessage));
            const controller = new UserController();
    
            await expect(controller.getUserByUsername(mockUser, username)).rejects.toThrow(errorMessage);
    
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.getUserByUsername).toHaveBeenCalledWith(username);
        });

    });

    describe("deleteUser controller test", () => { 

        test("Admin can delete any non-Admin user", async () => {
           
            const adminUser = new User('adminuser', 'Admin', 'User', Role.ADMIN, 'Address', '1990-01-01');
            const targetUser = 'targetuser';
    
            jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValueOnce(true);
            const controller = new UserController();
            const response = await controller.deleteUser(adminUser, targetUser);
    
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledWith(adminUser, targetUser);
            expect(response).toBe(true);
        });
    
        test("User can delete their own account", async () => {
            
            const normalUser = new User('normaluser', 'Normal', 'User', Role.CUSTOMER, 'Address', '1990-01-01');
    
            jest.spyOn(UserDAO.prototype, "deleteUser").mockResolvedValueOnce(true);
            const controller = new UserController();
            const response = await controller.deleteUser(normalUser, normalUser.username);
    
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledWith(normalUser, normalUser.username);
            expect(response).toBe(true);
        });
    
        test("Non-admin user cannot delete another user", async () => {
            
            const normalUser = new User('normaluser', 'Normal', 'User', Role.CUSTOMER, 'Address', '1990-01-01');
            const targetUser = 'targetuser';
    
            jest.spyOn(UserDAO.prototype, "deleteUser").mockRejectedValueOnce(new UnauthorizedUserError());
            const controller = new UserController();
    
            await expect(controller.deleteUser(normalUser, targetUser)).rejects.toThrow(UnauthorizedUserError);
    
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledWith(normalUser, targetUser);
        });
    
        test("Admin cannot delete another Admin user", async () => {
            
            const adminUser = new User('adminuser', 'Admin', 'User', Role.ADMIN, 'Address', '1990-01-01');
            const targetUser = 'otheradmin';
    
            jest.spyOn(UserDAO.prototype, "deleteUser").mockRejectedValueOnce(new UserIsAdminError());
            const controller = new UserController();
    
            await expect(controller.deleteUser(adminUser, targetUser)).rejects.toThrow(UserIsAdminError);
    
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledWith(adminUser, targetUser);
        });
    
        test("It Should throw UserNotFoundError if user does not exist", async () => {
            
            const adminUser = new User('adminuser', 'Admin', 'User', Role.ADMIN, 'Address', '1990-01-01');
            const targetUser = 'nonexistentuser';
    
            jest.spyOn(UserDAO.prototype, "deleteUser").mockRejectedValueOnce(new UserNotFoundError());
            const controller = new UserController();
    
            await expect(controller.deleteUser(adminUser, targetUser)).rejects.toThrow(UserNotFoundError);
    
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledWith(adminUser, targetUser);
        });
    
        test("It Should handle general database errors", async () => {
            
            const adminUser = new User('adminuser', 'Admin', 'User', Role.ADMIN, 'Address', '1990-01-01');
            const targetUser = 'targetuser';
            const errorMessage = "Database error";
    
            jest.spyOn(UserDAO.prototype, "deleteUser").mockRejectedValueOnce(new Error(errorMessage));
            const controller = new UserController();
            await expect(controller.deleteUser(adminUser, targetUser)).rejects.toThrow(errorMessage);
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.deleteUser).toHaveBeenCalledWith(adminUser, targetUser);
        });

    });

    describe("DeleteAllUser controller test", () => { 

        test("It should return true when all non-Admin users are deleted", async () => {
            
            jest.spyOn(UserDAO.prototype, "deleteAll").mockResolvedValueOnce(true);
            const controller = new UserController();
            const response = await controller.deleteAll();
            expect(UserDAO.prototype.deleteAll).toHaveBeenCalledTimes(1);
            expect(response).toBe(true);
        });

        test("It should handle errors and reject the promise", async () => {
            
            const error = new Error("Database error");

            jest.spyOn(UserDAO.prototype, "deleteAll").mockRejectedValueOnce(error);
            const controller = new UserController();
            await expect(controller.deleteAll()).rejects.toThrow("Database error");
            expect(UserDAO.prototype.deleteAll).toHaveBeenCalledTimes(1);
        });

    });

    describe("updateUserInfo controller test", () => { 

        const AdminUser = { username: "testAdmin", name: "test", surname: "test", role: Role.ADMIN, address: "test", birthdate: "2000-01-01"}
        const updatedAdminUser = { username: "testAdmin", name: "NewName", surname: "NewSurname", role: Role.ADMIN, address: "NewAddress", birthdate: "2001-01-01"}
        const customerUser = { username: "testCustomer", name: "test", surname: "test", role: Role.CUSTOMER, address: "test", birthdate: "2000-01-01"}
        const updatedCustomerUser = { username: "testCustomer", name: "NewName", surname: "NewSurname", role: Role.CUSTOMER, address: "NewAddress", birthdate: "2001-01-01"}
        const update = { name: "NewName", surname: "NewSurname", address: "NewAddress", birthdate: "2001-01-01"}
       
        //Admin prova ad aggionare il suo account
        test("It should return the updated user info when the update is successful", async () => {
    
            jest.spyOn(UserDAO.prototype, "updateUserInfo").mockResolvedValueOnce(updatedAdminUser);
            const controller = new UserController();
            const response = await controller.updateUserInfo(AdminUser, update.name, update.surname, update.address, update.birthdate, AdminUser.username);
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledWith(AdminUser, update.name, update.surname, update.address, update.birthdate, AdminUser.username);
            expect(response).toEqual(updatedAdminUser);
        });

        //Customer prova ad aggionare il suo account
        test("It should return the updated user info when the update is successful", async () => {
    
            jest.spyOn(UserDAO.prototype, "updateUserInfo").mockResolvedValueOnce(updatedCustomerUser);
            const controller = new UserController();
            const response = await controller.updateUserInfo(customerUser, update.name, update.surname, update.address, update.birthdate, customerUser.username);
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledTimes(1);
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledWith(customerUser, update.name, update.surname, update.address, update.birthdate, customerUser.username);
            expect(response).toEqual(updatedCustomerUser);
        });

        test("It should throw InvalidBirthdateError if the birthdate is invalid", async () => {
            
            const invalidBirthdate = "3000-01-01";
           
            jest.spyOn(UserDAO.prototype, "updateUserInfo").mockRejectedValueOnce(new InvalidBirhdateError());
            const controller = new UserController();
            await expect(controller.updateUserInfo(customerUser, "NewName", "NewSurname", "New Address", invalidBirthdate, customerUser.username)).rejects.toThrow(InvalidBirhdateError);
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledTimes(1);
        });

        test("It should throw UnauthorizedUserError if the user is not authorized to update", async () => {
            
            const customerUser2 = { username: "testCustomer2", name: "test", surname: "test", role: Role.CUSTOMER, address: "test", birthdate: "2002-01-01"}

            jest.spyOn(UserDAO.prototype, "updateUserInfo").mockRejectedValueOnce(new UnauthorizedUserError());
            const controller = new UserController();
            await expect(controller.updateUserInfo(customerUser, "NewName", "NewSurname", "New Address", "2000-01-01", customerUser2.username)).rejects.toThrow(UnauthorizedUserError);
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledTimes(1);
        });

        test("It should throw UserNotFoundError if the user to update does not exist", async () => {
            
            const nonExistentUser = {username: "nonExist", name: "test", surname: "test", role: Role.CUSTOMER, address: "test", birthdate: "2002-01-01"};
            
            jest.spyOn(UserDAO.prototype, "updateUserInfo").mockRejectedValueOnce(new UserNotFoundError());
            const controller = new UserController();
            await expect(controller.updateUserInfo(AdminUser, "NewName", "NewSurname", "New Address", "2000-01-01", nonExistentUser.username)).rejects.toThrow(UserNotFoundError);
            expect(UserDAO.prototype.updateUserInfo).toHaveBeenCalledTimes(1);
        });

    });

});


