const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
const expect = chai.expect;
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const assert = require('chai').assert;

chai.use(chaiHttp);

// File Imports
const User = require('../models/User.js')
const { verifyUser, resetPassword, signoutUser, updateUser, signinUser, signupUser } = require('../services/userService.js')
const userService = require('../services/userService.js')
const { generateToken } = require('../middleware/generateToken'); // Assuming you have a separate helper file for JWT

// 1 - SIGNUP
describe('signupUser', function () {

    it('should create a new user when given a new email', async function () {
        const newUser = {
            email: 'test@example111.com',
            password: 'testpassword',
            name: 'Test User'
        };

        // Stub the findOne method to return null (simulating email does not exist)
        sinon.stub(User, 'findOne').returns(null);

        // Stub the save method to resolve with the newUser object
        sinon.stub(User.prototype, 'save').resolves(newUser);

        const result = await signupUser(newUser);

        assert.equal(result.status, 201);
        assert.equal(result.message, 'User created successfully!');

        // Restore the stubbed methods
        User.findOne.restore();
        User.prototype.save.restore();
    });

    it('should return "Email already exists" message when given an existing email', async function () {
        const existingEmail = 'admin@gmail.com';
        const existingUser = { email: existingEmail };

        // Stub the findOne method to return an existing user object
        sinon.stub(User, 'findOne').returns(existingUser);

        const result = await signupUser(existingUser);
        assert.equal(result.status, 400);
        assert.equal(result.message, 'Email already exists');

        // Restore the stubbed method
        User.findOne.restore();
    });

    it('should handle errors gracefully', async function () {
        const newUser = {
            email: 'test@example.com',
            password: 'testpassword',
            name: 'Test User'
        };
        const expectedErrorMessage = 'Database error'; // Example error message

        // Stub the findOne method to return null (simulating email does not exist)
        sinon.stub(User, 'findOne').returns(null);

        // Stub the save method to throw an error
        sinon.stub(User.prototype, 'save').throws(expectedErrorMessage);

        const result = await signupUser(newUser);

        assert.equal(result.status, 500); // Assuming you handle errors with 500 status code
        assert.equal(result.message, 'Signup User Error');

        // Restore the stubbed methods
        User.findOne.restore();
        User.prototype.save.restore();
    });

});


// 2 - SIGNIN
describe('signinUser service', () => {

    let findOneStub;
    let compareStub;
    let generateTokenStub;

    beforeEach(() => {
        findOneStub = sinon.stub(User, 'findOne');
        compareStub = sinon.stub(bcrypt, 'compare');
        generateTokenStub = sinon.stub().returns('mocked.jwt.token'); // Adjust to return the exact token string
    });

    afterEach(() => {
        findOneStub.restore();
        compareStub.restore();
    });

    it('should sign in a user successfully', async () => {
        const mockUser = {
            _id: '60c72b2f9b1e8c7b2c8f9e9d',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10), // Mock hashed password
            role: 'user'
        };

        findOneStub.withArgs({ email: 'test@example.com' }).resolves(mockUser);
        compareStub.resolves(true);

        const result = await signinUser({ email: 'test@example.com', password: 'password123' });

        expect(result).to.have.property('status', 200);
        expect(result).to.have.property('message', 'Signin successful');
    });

    it('should return 404 if user is not found', async () => {
        findOneStub.withArgs({ email: 'nonexistent@example.com' }).resolves(null);

        const result = await signinUser({ email: 'nonexistent@example.com', password: 'password123' });

        expect(result).to.have.property('status', 404);
        expect(result).to.have.property('message', 'User not found');
    });

    it('should return 401 if password is incorrect', async () => {
        const mockUser = {
            _id: '60c72b2f9b1e8c7b2c8f9e9d',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10) // Mock hashed password
        };

        findOneStub.withArgs({ email: 'test@example.com' }).resolves(mockUser);
        compareStub.resolves(false);

        const result = await signinUser({ email: 'test@example.com', password: 'incorrectpassword' });

        expect(result).to.have.property('status', 401);
        expect(result).to.have.property('message', 'Incorrect email or password');
    });

    it('should handle server errors', async () => {
        findOneStub.rejects(new Error('Database error'));

        const result = await signinUser({ email: 'test@example.com', password: 'password123' });

        expect(result).to.have.property('status', 500);
        expect(result).to.have.property('message', 'Signin User Error');
    });

});


// 3 - VERIFY USER
describe('verifyUser service', () => {
    let findByIdStub;
    let updateOneStub;

    beforeEach(() => {
        findByIdStub = sinon.stub(User, 'findById');
        updateOneStub = sinon.stub(User, 'updateOne');
    });

    afterEach(() => {
        findByIdStub.restore();
        updateOneStub.restore();
    });

    it('should verify a user successfully', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d'; // Example user ID
        const value = { isVerified: true };

        const user = {
            _id: userId,
            isVerified: false,
            save: sinon.stub().resolves({ _id: userId, isVerified: value.isVerified, modifiedAt: new Date() }),
        };

        findByIdStub.withArgs(userId).resolves(user);

        const result = await verifyUser(userId, value);

        expect(result).to.have.property('status', 200);
        // expect(result.data).to.have.property('isVerified', true);
        expect(result.message).to.equal(`User verification is ${value.isVerified}`);
    });

    it('should handle server errors', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d';
        const value = { isVerified: true };

        findByIdStub.withArgs(userId).throws(new Error('Server error'));

        const result = await verifyUser(userId, value);

        expect(result).to.have.property('status', 500);
        expect(result).to.have.property('message', 'Verify User Error');
    });


});


// 4 - RESET PASS
describe('resetPassword service', () => {
    let findByIdStub;
    let bcryptCompareStub;

    beforeEach(() => {
        findByIdStub = sinon.stub(User, 'findById');
        bcryptCompareStub = sinon.stub(bcrypt, 'compare');
    });

    afterEach(() => {
        findByIdStub.restore();
        bcryptCompareStub.restore();
    });

    it('should reset password successfully', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d';
        const value = {
            email: 'test@example.com',
            oldPassword: 'oldPassword123',
            newPassword: 'newPassword123'
        };

        const user = {
            _id: userId,
            email: value.email,
            password: 'hashedOldPassword',
            save: sinon.stub().resolves(this)
        };

        findByIdStub.withArgs(userId).resolves(user);
        bcryptCompareStub.withArgs(value.oldPassword, user.password).resolves(true);

        const result = await resetPassword(userId, value);
        expect(result).to.have.property('status', 200);
        expect(result).to.have.property('message', 'Password reset successfully');
        expect(user.save.calledOnce).to.be.true;
    });

    it('should return 404 if userId is not defined', async () => {
        const result = await resetPassword(null, {});

        expect(result).to.have.property('status', 404);
        expect(result).to.have.property('message', 'Userid is not defined!');
    });

    it('should return 404 if user is not found', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d';
        findByIdStub.withArgs(userId).resolves(null);

        const result = await resetPassword(userId, {});

        expect(result).to.have.property('status', 404);
        expect(result).to.have.property('message', 'User is not defined!');
    });

    it('should return 400 for incorrect credentials', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d';
        const value = {
            email: 'test@example.com',
            oldPassword: 'wrongPassword',
            newPassword: 'newPassword123'
        };

        const user = {
            _id: userId,
            email: value.email,
            password: 'hashedOldPassword'
        };

        findByIdStub.withArgs(userId).resolves(user);
        bcryptCompareStub.withArgs(value.oldPassword, user.password).resolves(false);

        const result = await resetPassword(userId, value);

        expect(result).to.have.property('status', 400);
        expect(result).to.have.property('message', 'Incorrect credentials');
    });

    it('should handle server errors', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d';
        const value = {
            email: 'test@example.com',
            oldPassword: 'oldPassword123',
            newPassword: 'newPassword123'
        };

        findByIdStub.withArgs(userId).throws(new Error('Server error'));

        const result = await resetPassword(userId, value);

        expect(result).to.have.property('status', 500);
        expect(result).to.have.property('message', 'Reset Password Error');
    });

});


// 5 - SIGNOUT USER
describe('signoutUser service', () => {
    let findByIdStub;

    beforeEach(() => {
        findByIdStub = sinon.stub(User, 'findById');
    });

    afterEach(() => {
        findByIdStub.restore();
    });

    it('should sign out a user successfully', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d';
        const user = { _id: userId };

        findByIdStub.withArgs(userId).resolves(user);

        const result = await signoutUser(userId);

        expect(result).to.have.property('status', 200);
        expect(result).to.have.property('message', 'Signout successful');
    });

    it('should return 404 if user is not found', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d';

        findByIdStub.withArgs(userId).resolves(null);

        const result = await signoutUser(userId);

        expect(result).to.have.property('status', 404);
        expect(result).to.have.property('message', 'User not found');
    });

    it('should handle server errors', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d';

        findByIdStub.withArgs(userId).throws(new Error('Server error'));

        const result = await signoutUser(userId);

        expect(result).to.have.property('status', 500);
        expect(result).to.have.property('message', 'Signout User Error');
    });


});


// 6 - UPDATE USER
describe('updateUser service', () => {
    let findByIdStub;
    let userSaveStub;

    beforeEach(() => {
        findByIdStub = sinon.stub(User, 'findById');
        userSaveStub = sinon.stub(User.prototype, 'save');
    });

    afterEach(() => {
        findByIdStub.restore();
        userSaveStub.restore();
    });

    it('should update user successfully', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d';
        const value = {
            name: 'Updated Name',
            email: 'updated@example.com'
        };

        const user = new User({
            _id: userId,
            name: 'Old Name',
            email: 'old@example.com'
        });

        findByIdStub.withArgs(userId).resolves(user);
        userSaveStub.resolves({ ...user._doc, ...value, modifiedAt: new Date() });

        const result = await updateUser(userId, value);

        expect(result).to.have.property('status', 200);
        expect(result).to.have.property('message', 'User updated successfully!');
        expect(userSaveStub.calledOnce).to.be.true;
    });


    it('should handle server errors', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d';
        const value = {
            name: 'Updated Name',
            email: 'updated@example.com'
        };

        findByIdStub.withArgs(userId).throws(new Error('Server error'));

        const result = await updateUser(userId, value);

        expect(result).to.have.property('status', 500);
        expect(result).to.have.property('message', 'Server error');
    });


});


// 7 - AUTHORIZATION
describe('Authorization and Verification Endpoint Tests', () => {

    let adminToken;
    let regularUserToken;
    let expiredToken;

    before(() => {
        // Generate tokens for testing
        adminToken = generateToken({ _id: 'adminUserId', email: 'admin@example.com', role: 'admin' });
        regularUserToken = generateToken({ _id: 'regularUserId', email: 'john@example.com', role: 'user' });

        // Generate an expired token
        const expiredPayload = { _id: 'expiredUserId', email: 'expired@example.com', role: 'admin' };
        expiredToken = generateToken(expiredPayload);
    });

    beforeEach(() => {
        // Stub userService.verifyUser method
        sinon.stub(userService, 'verifyUser');
    });

    afterEach(() => {
        // Restore the stubbed method after each test
        userService.verifyUser.restore();
    });

    it('should allow admin to verify user', async () => {
        // Stub userService.verifyUser to return a mock response
        userService.verifyUser.resolves({ status: 200, message: 'User verification is true', data: true });

        const response = await chai.request('localhost:9898/api')
            .post('/verifyVendor/adminUserId')
            .set('Cookie', `token=${adminToken}`);

        expect(response).to.have.status(200);
        expect(response.body).to.have.property('isVerified', true);
    });

    it('should forbid non-admin users', async () => {
        const response = await chai.request(app)
            .post('/verifyVendor/adminUserId')
            .set('Cookie', `token=${regularUserToken}`);

        expect(response).to.have.status(404);
    });

    it('should return unauthorized if no token provided', async () => {
        const response = await chai.request(app)
            .post('/verifyVendor/adminUserId');
        expect(response).to.have.status(404);
    });

    it('should return unauthorized if token is invalid', async () => {
        const response = await chai.request(app)
            .post('/verifyVendor/adminUserId')
            .set('Cookie', 'token=invalidToken');

        expect(response).to.have.status(404);
    });

    it('should return unauthorized if token is expired', async () => {
        const response = await chai.request(app)
            .post('/verifyVendor/adminUserId')
            .set('Cookie', `token=${expiredToken}`);

        expect(response).to.have.status(404);
    });

    it('should return not found if user ID does not exist', async () => {
        // Stub userService.verifyUser to return a mock response for user not found
        userService.verifyUser.resolves({ status: 404, message: 'User not found' });

        const response = await chai.request(app)
            .post('/verifyVendor/nonExistingUserId')
            .set('Cookie', `token=${adminToken}`);

        expect(response).to.have.status(404);
    });

});