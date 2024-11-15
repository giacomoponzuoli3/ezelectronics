import { describe, test, expect, beforeAll, afterAll, jest } from "@jest/globals"

import UserController from "../../src/controllers/userController"
import UserDAO from "../../src/dao/userDAO"
import crypto from "crypto"
import db from "../../src/db/db"
import { Database } from "sqlite3"
import { Role, User } from "../../src/components/user"
import { InvalidBirhdateError, UnauthorizedUserError, UserAlreadyExistsError, UserIsAdminError, UserNotFoundError } from "../../src/errors/userError"


jest.mock("crypto")
jest.mock("../../src/db/db.ts")

//Example of unit test for the createUser method
//It mocks the database run method to simulate a successful insertion and the crypto randomBytes and scrypt methods to simulate the hashing of the password
//It then calls the createUser method and expects it to resolve true

describe("tests getIsUserAuthenticated", () => {
    const userDAO = new UserDAO();

    test('should resolve true when credentials are correct', async () => {
        const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            callback(null, { username: params[0], password: Buffer.from("hashedPassword").toString('hex'), salt: Buffer.from("salt") });
            return {} as any;
        });

        const mockScryptSync = jest.spyOn(crypto, 'scryptSync').mockImplementation((password, salt, keylen) => {
            return Buffer.from("hashedPassword");
        });

        const mockTimingSafeEqual = jest.spyOn(crypto, 'timingSafeEqual').mockReturnValue(true);

        const result = await userDAO.getIsUserAuthenticated("username", "plainPassword");
        expect(result).toBe(true);

        mockDBGet.mockRestore();
        mockScryptSync.mockRestore();
        mockTimingSafeEqual.mockRestore();
    });

    test('should resolve false when credentials are incorrect', async () => {
        const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            callback(null, { username: params[0], password: Buffer.from("hashedPassword").toString('hex'), salt: Buffer.from("salt") });
            return {} as any;
        });

        const mockScryptSync = jest.spyOn(crypto, 'scryptSync').mockImplementation((password, salt, keylen) => {
            return Buffer.from("wrongHashedPassword");
        });

        const mockTimingSafeEqual = jest.spyOn(crypto, 'timingSafeEqual').mockReturnValue(false);

        const result = await userDAO.getIsUserAuthenticated("username", "plainPassword");
        expect(result).toBe(false);

        mockDBGet.mockRestore();
        mockScryptSync.mockRestore();
        mockTimingSafeEqual.mockRestore();
    });

    test('should resolve false when user not found', async () => {
        const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            callback(null, null);
            return {} as any;
        });

        const result = await userDAO.getIsUserAuthenticated("username", "plainPassword");
        expect(result).toBe(false);

        mockDBGet.mockRestore();
    });

    test('should resolve false when user has no salt', async () => {
        const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            callback(null, { username: params[0], password: Buffer.from("hashedPassword").toString('hex'), salt: null });
            return {} as any;
        });

        const result = await userDAO.getIsUserAuthenticated("username", "plainPassword");
        expect(result).toBe(false);

        mockDBGet.mockRestore();
    });

    test('should reject with error on db.get error', async () => {
        const testError = new Error('Database error');

        const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            callback(testError);
            return {} as any;
        });

        await expect(userDAO.getIsUserAuthenticated("username", "plainPassword")).rejects.toThrow(testError);

        mockDBGet.mockRestore();
    });

    test('should reject with error on crypto error', async () => {
        const originalScryptSync = crypto.scryptSync;

        crypto.scryptSync = jest.fn(() => {
            throw new Error('Crypto error');
        });

        const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
            callback(null, { username: params[0], password: Buffer.from("hashedPassword").toString('hex'), salt: Buffer.from("salt") });
            return {} as any;
        });

        await expect(userDAO.getIsUserAuthenticated("username", "plainPassword")).rejects.toThrow('Crypto error');

        crypto.scryptSync = originalScryptSync;
        mockDBGet.mockRestore();
    });

})


describe("tests createUser", () => {
    const userDAO = new UserDAO()

test("It should resolve true", async () => {
    const userDAO = new UserDAO()
    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        // Simula il completamento della query senza errori
        callback(null)
        return {} as Database
    });
    const mockRandomBytes = jest.spyOn(crypto, "randomBytes").mockImplementation((size) => {
        return (Buffer.from("salt"))
    })
    const mockScrypt = jest.spyOn(crypto, "scrypt").mockImplementation(async (password, salt, keylen) => {
        return Buffer.from("hashedPassword")
    })
    const result = await userDAO.createUser("username", "name", "surname", "password", "role")
    expect(result).toBe(true)
    mockRandomBytes.mockRestore()
    mockDBRun.mockRestore()
    mockScrypt.mockRestore()

})

test('should reject with UserAlreadyExistsError when username is already taken', async () => {
    const mockDBRun = jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
        const error = new Error('UNIQUE constraint failed: users.username');
        callback(error);
        return {} as any;
    });

    await expect(userDAO.createUser('username', 'name', 'surname', 'password', 'role')).rejects.toThrow(new UserAlreadyExistsError());

    mockDBRun.mockRestore();
});

test('should reject with error on db.run error', async () => {
    const testError = new Error('Database error');

    const mockDBRun = jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
        callback(testError);
        return {} as any;
    });

    await expect(userDAO.createUser('username', 'name', 'surname', 'password', 'role')).rejects.toThrow(testError);

    mockDBRun.mockRestore();
});

test('should reject with error on crypto error', async () => {
    const originalScryptSync = crypto.scryptSync;

    crypto.scryptSync = jest.fn(() => {
        throw new Error('Crypto error');
    });

    await expect(userDAO.createUser('username', 'name', 'surname', 'password', 'role')).rejects.toThrow('Crypto error');

    crypto.scryptSync = originalScryptSync;
});

});

//--------------------------------------------------------------------------//

describe("tests getAllUser", () => {
    const userDAO = new UserDAO();

test("It should resolve with an array of users", async () => {
    const usersMock = [
        { username: "user1", name: "Name1", surname: "Surname1", role: Role.ADMIN, address: "Address1", birthdate: "2000-01-01" },
        { username: "user2", name: "Name2", surname: "Surname2", role: Role.CUSTOMER, address: "Address2", birthdate: "2001-01-02" }
    ];

    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, callback) => {
        callback(null, usersMock);
        return {} as Database;
    });

    const result = await userDAO.getAllUsers();
    expect(result).toEqual(usersMock.map(user => new User(user.username, user.name, user.surname, user.role, user.address, user.birthdate)));
    mockDBAll.mockRestore();
});

test('should reject with error on db.all error', async () => {
    const testError = new Error('Database all error');

    const mockDBAll = jest.spyOn(db, 'all').mockImplementation((sql, callback) => {
        callback(testError, null);
        return {} as any;
    });

    await expect(userDAO.getAllUsers()).rejects.toThrow('Database all error');

   
});

});

describe("test getuserByUsername", () => {
    const userDAO = new UserDAO();

test("It should resolve with a User object when user is found", async () => {
    const userMock = {
        username: "user1",
        name: "Name1",
        surname: "Surname1",
        role: Role.ADMIN,
        address: "Address1",
        birthdate: "2000-01-01"
    };

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, userMock);
        return {} as Database;
    });

    const result = await userDAO.getUserByUsername("user1");
    expect(result).toEqual(new User(userMock.username, userMock.name, userMock.surname, userMock.role, userMock.address, userMock.birthdate));
    mockDBGet.mockRestore();
});

test("It should reject with UserNotFoundError when no user is found", async () => {
    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        // Simulate no user found
        callback(null, null);
        return {} as Database;
    });

    await expect(userDAO.getUserByUsername("nonexistent")).rejects.toThrow(UserNotFoundError);
    mockDBGet.mockRestore();
});

test("It should reject with an error when there is a database error", async () => {
    const errorMock = new Error("Database error");

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        // Simulate a database error
        callback(errorMock, null);
        return {} as Database;
    });

    await expect(userDAO.getUserByUsername("user1")).rejects.toThrow("Database error");
    mockDBGet.mockRestore();
});

});

describe("test getUserByRole", () => {
    const userDAO = new UserDAO();

test("It should resolve with an array of users for a valid role", async () => {
    const role = "Admin";
    const usersMock = [
        { username: "user1", name: "Name1", surname: "Surname1", role: Role.CUSTOMER, address: "Address1", birthdate: "2000-01-01" },
        { username: "user2", name: "Name2", surname: "Surname2", role: Role.ADMIN, address: "Address2", birthdate: "2001-01-02" },
        { username: "user3", name: "Name3", surname: "Surname3", role: Role.MANAGER, address: "Address3", birthdate: "2011-01-02" }
    ];

    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(null, usersMock);
        return {} as Database;
    });

    const result = await userDAO.getUsersByRole(role);
    expect(result).toEqual(usersMock.map(user => new User(user.username, user.name, user.surname, user.role, user.address, user.birthdate)));
    mockDBAll.mockRestore();
});

test("It should reject with an error when there is a database error", async () => {
    const role = "Admin";
    const errorMock = new Error("Database error");

    const mockDBAll = jest.spyOn(db, "all").mockImplementation((sql, params, callback) => {
        callback(errorMock, null);
        return {} as Database;
    });

    await expect(userDAO.getUsersByRole(role)).rejects.toThrow("Database error");
    mockDBAll.mockRestore();
});

});

describe("tests deleteUser", () => {
    const userDAO = new UserDAO();

test("It should resolve with true for authorized user", async () => {
    const user = new User("username", "Name", "Surname", Role.ADMIN, "Address", "2000-01-01");
    const username = "username";

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { role: Role.ADMIN }); 
        return {} as Database;
    });

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null);
        return {} as Database;
    });

    const result = await userDAO.deleteUser(user, username);
    expect(result).toBe(true);
    mockDBGet.mockRestore();
    mockDBRun.mockRestore();
});

test("It should reject with UnauthorizedUserError if user is not authorized", async () => {
    const user = new User("anotherUsername", "Name", "Surname", Role.CUSTOMER, "Address", "2000-01-01");
    const username = "username";

    await expect(userDAO.deleteUser(user, username)).rejects.toThrow(UnauthorizedUserError);
});

test("It should reject with UserNotFoundError if user to delete does not exist", async () => {
    const user = new User("nonexistentUsername", "Name", "Surname", Role.ADMIN, "Address", "2000-01-01");
    const username = "nonexistentUsername";

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, null);
        return {} as Database;
    });

    await expect(userDAO.deleteUser(user, username)).rejects.toThrow(UserNotFoundError);
    mockDBGet.mockRestore();
});

test("It should reject with UserIsAdminError if admin tries to delete another admin", async () => {
    const user = new User("adminUsername", "Name", "Surname", Role.ADMIN, "Address", "2000-01-01");
    const username = "anotherAdminUsername";

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { role: Role.ADMIN }); 
        return {} as Database;
    });

    await expect(userDAO.deleteUser(user, username)).rejects.toThrow(UserIsAdminError);
    mockDBGet.mockRestore();
});

test("It should reject with an error when there is a database error", async () => {
    const user = new User("username", "Name", "Surname", Role.ADMIN, "Address", "2000-01-01");
    const username = "username";
    const errorMock = new Error("Database error");

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(errorMock, null);
        return {} as Database;
    });

    await expect(userDAO.deleteUser(user, username)).rejects.toThrow("Database error");
    mockDBGet.mockRestore();
});

test('It should reject with error on db.get error', async () => {
    const user = new User("username", "Name", "Surname", Role.ADMIN, "Address", "2000-01-01");
    const username = 'otheruser';
    const testError = new Error('Database get error');

    const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
        callback(testError, null);
        return {} as any;
    });

    await expect(userDAO.deleteUser(user, username)).rejects.toThrow('Database get error');

    mockDBGet.mockRestore();
});

test('It should reject with error on db.run error', async () => {
    const user = new User("username", "Name", "Surname", Role.ADMIN, "Address", "2000-01-01");
    const username = 'testuser';
    const testError = new Error('Database run error');

    const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
        callback(null, { username: "username", name: "Name", surname: "Surname", role: Role.ADMIN, address: "Address", birthdate: "2000-01-01"});
        return {} as any;
    });

    const mockDBRun = jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
        callback(testError, null);
        return {} as any;
    });

    await expect(userDAO.deleteUser(user, user.username)).rejects.toThrow('Database run error');

    mockDBGet.mockRestore();
    mockDBRun.mockRestore();
});

});

describe("tests deleteAll", () => {
    const userDAO = new UserDAO();

test("It should resolve with true after deleting all non-admin users and logged user is admin", async () => {

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null);
        return {} as Database;
    });

    const result = await userDAO.deleteAll();
    expect(result).toBe(true);
    mockDBRun.mockRestore();
});

test("It should reject with an error when there is a database error", async () => {
    const errorMock = new Error("Database error");

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(errorMock);
        return {} as Database;
    });

    await expect(userDAO.deleteAll()).rejects.toThrow("Database error");
    mockDBRun.mockRestore();
});

});

describe("tests updateUserInfo", () => {
    const userDAO = new UserDAO();

test("It should resolve with updated user info for authorized user", async () => {
    const user = new User("username", "Name", "Surname", Role.CUSTOMER, "Address", "2000-01-01");
    const name = "NewName";
    const surname = "NewSurname";
    const address = "NewAddress";
    const birthdate = "2000-01-01";
    const username = "username";

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { role: Role.CUSTOMER }); 
        return {} as Database;
    });

    const mockDBRun = jest.spyOn(db, "run").mockImplementation((sql, params, callback) => {
        callback(null);
        return {} as Database;
    });

    const result = await userDAO.updateUserInfo(user, name, surname, address, birthdate, username);
    expect(result).toEqual(new User(username, name, surname, Role.CUSTOMER, address, birthdate));
    mockDBGet.mockRestore();
    mockDBRun.mockRestore();
});

test("It should reject with UnauthorizedUserError if user is not authorized", async () => {
    const user = new User("anotherUsername", "Name", "Surname", Role.CUSTOMER, "Address", "2000-01-01");
    const name = "NewName";
    const surname = "NewSurname";
    const address = "NewAddress";
    const birthdate = "2000-01-01";
    const username = "username";

    await expect(userDAO.updateUserInfo(user, name, surname, address, birthdate, username)).rejects.toThrow(UnauthorizedUserError);
});

test("It should reject with UserNotFoundError if user to update does not exist", async () => {
    const user = new User("nonexistentUsername", "Name", "Surname", Role.CUSTOMER, "Address", "2000-01-01");
    const name = "NewName";
    const surname = "NewSurname";
    const address = "NewAddress";
    const birthdate = "2000-01-01";
    const username = "nonexistentUsername";

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, null);
        return {} as Database;
    });

    await expect(userDAO.updateUserInfo(user, name, surname, address, birthdate, username)).rejects.toThrow(UserNotFoundError);
    mockDBGet.mockRestore();
});

test("It should reject with UnauthorizedUserError if admin tries to update another admin", async () => {
    const user = new User("adminUsername", "Name", "Surname", Role.ADMIN, "Address", "2000-01-01");
    const name = "NewName";
    const surname = "NewSurname";
    const address = "NewAddress";
    const birthdate = "2000-01-01";
    const username = "anotherAdminUsername";

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(null, { role: Role.ADMIN }); 
        return {} as Database;
    });

    await expect(userDAO.updateUserInfo(user, name, surname, address, birthdate, username)).rejects.toThrow(UserIsAdminError);
    mockDBGet.mockRestore();
});

test("It should reject with InvalidBirhdateError if birthdate is invalid", async () => {
    const user = new User("username", "Name", "Surname", Role.CUSTOMER, "Address", "2000-01-01");
    const name = "NewName";
    const surname = "NewSurname";
    const address = "NewAddress";
    const birthdate = "2030-01-01";
    const username = "username";

    await expect(userDAO.updateUserInfo(user, name, surname, address, birthdate, username)).rejects.toThrow(InvalidBirhdateError);
});

test("It should reject with an error when there is a database error", async () => {
    const user = new User("username", "Name", "Surname", Role.CUSTOMER, "Address", "2000-01-01");
    const name = "NewName";
    const surname = "NewSurname";
    const address = "NewAddress";
    const birthdate = "2000-01-01";
    const username = "username";
    const errorMock = new Error("Database error");

    const mockDBGet = jest.spyOn(db, "get").mockImplementation((sql, params, callback) => {
        callback(errorMock, null);
        return {} as Database;
    });

    await expect(userDAO.updateUserInfo(user, name, surname, address, birthdate, username)).rejects.toThrow("Database error");
    mockDBGet.mockRestore();
});


test('It should reject with error on db.get error', async () => {
    const user = new User("username", "Name", "Surname", Role.CUSTOMER, "Address", "2000-01-01");
    const name = 'New Name';
    const surname = 'New Surname';
    const address = 'New Address';
    const birthdate = '2000-01-01';
    const username = 'testuser';
    const testError = new Error('Database run error');

    const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
        callback(testError, null);
        return {} as any;
    });

    await expect(userDAO.updateUserInfo(user, name, surname, address, birthdate, user.username)).rejects.toThrow(testError);

    mockDBGet.mockRestore();
});

test('It should reject with error on db.run error', async () => {
    const user = new User("username", "Name", "Surname", Role.CUSTOMER, "Address", "2000-01-01");
    const name = 'New Name';
    const surname = 'New Surname';
    const address = 'New Address';
    const birthdate = '2000-01-01';
    const username = 'testuser';
    const testError = new Error('Database run error');

    const mockDBGet = jest.spyOn(db, 'get').mockImplementation((sql, params, callback) => {
        callback(null, { username: 'testuser', role: Role.CUSTOMER });
        return {} as any;
    });

    const mockDBRun = jest.spyOn(db, 'run').mockImplementation((sql, params, callback) => {
        callback(testError, null);
        return {} as any;
    });

    await expect(userDAO.updateUserInfo(user, name, surname, address, birthdate, user.username)).rejects.toThrow(testError);

    mockDBGet.mockRestore();
    mockDBRun.mockRestore();
});

});




