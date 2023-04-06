import { UserService } from '../../src/User/UserService';
import { ObjectNotFound } from '../../src/Database/Exceptions';
import { User } from '../../src/types';

describe('getUser', () => {
    let userService: UserService;

    beforeAll(() => {
        userService = new UserService();
    });

    afterAll(() => {
        userService.dbClient.close();
    });

    it('should return a user when a valid username is provided', async () => {
        const username = 'testuser';
        const user = await userService.getUser(username);

        expect(user.username).toBe(username);
    });

    it('should throw an ObjectNotFound error when an invalid username is provided', async () => {
        const username = 'invaliduser';

        await expect(userService.getUser(username)).rejects.toThrow(ObjectNotFound);
    });
})

describe("confirmEmail", () => {

    let userService: UserService;
    const usersList: string[] = []

    beforeAll(() => {
        userService = new UserService();
    });

    afterAll(async () => {
        Promise.all(usersList.map((username) => userService.eraseUser(username)))
        userService.dbClient.close();
    });

    it("should update the confirmedEmail flag for a user", async () => {
        const testUser: User = {
            username: `testuser${Math.random()}`,
            email: `testUser${Math.random()}@example.com`,
            firstName: "Test",
            lastName: "User",
            password: "password",
            confirmedEmail: false,
        };
        await userService.register(testUser);
        usersList.push(testUser.username)

        await userService.confirmEmail(testUser);
        const result = await userService.getUser(testUser.username);

        expect(result.confirmedEmail).toEqual(true);
    });
});


describe("updateUserData", () => {

    let userService: UserService;
    const usersList: string[] = []
    const testUsername = "testuser"
    beforeAll(() => {
        userService = new UserService();
    });

    afterAll(async () => {
        Promise.all(usersList.map((username) => userService.eraseUser(username)))
        userService.dbClient.close();
    });

    it("should update the user data for a user", async () => {
        const testUser: User = await userService.getUser("testuser")
        const updatedUser: User = {
            ...testUser,
            email: `${Math.random()}@example.com`,
            firstName: "Updated",
            lastName: "User",
        };
        await userService.updateUserData(updatedUser);
        const result = await userService.getUser(testUser.username);

        expect(result).toEqual(updatedUser);
    });
});

describe('register and login', () => {
    let userService: UserService;
    const usersList: string[] = []
    const testUsername = "testuser"
    beforeAll(() => {
        userService = new UserService();
    });

    afterAll(async () => {
        Promise.all(usersList.map((username) => userService.eraseUser(username)))
        userService.dbClient.close();
    });

    describe('register', () => {


        it('should create a new user', async () => {
            // create a new user object to register
            const newUser: User = {
                username: 'testuser2',
                email: 'testuser7@example.com',
                firstName: 'Test',
                lastName: 'User',
                password: 'password123',
            };

            // call the register method to create the new user
            const result = await userService.register(newUser);
            usersList.push(newUser.username)
            // expect the result to be true, indicating successful registration
            expect(result).toBe(true);
        });
    });

    describe('login', () => {
        it('should authenticate a user with valid credentials', async () => {
            // define the username and password for an existing user
            const username = 'testuser2';
            const password = 'password123';

            // call the login method to authenticate the user
            const user = await userService.login(username, password);

            // expect the user object to be returned, indicating successful authentication
            expect(user).toBeDefined();
            expect(user.username).toBe(username);
        });

        it('should throw an error with invalid credentials', async () => {
            // define an invalid username and password combination
            const username = 'invaliduser';
            const password = 'invalidpassword';

            // call the login method with invalid credentials and expect an error to be thrown
            await expect(userService.login(username, password)).rejects.toThrow();
        });
    });
})
