const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index.js')
const expect = chai.expect;
const sinon = require('sinon');
const assert = require('chai').assert;

chai.use(chaiHttp);

// File Imports
const Vehicle = require('../models/Vehicle.js');
const User = require('../models/User.js');
const { generateToken } = require('../middleware/generateToken.js');
const { registerVehicle, verifyVehicle, deleteVehicle, updateVehicle, getVehicleDetails, getProductsById } = require('../services/vehicleService.js');


// 1 - REGISTERS NEW VEHICLE
describe('registerVehicle service', () => {
    let findOneStub;
    let saveStub;

    beforeEach(() => {
        findOneStub = sinon.stub(User, 'findOne');
        saveStub = sinon.stub(Vehicle.prototype, 'save');
    });

    afterEach(() => {
        findOneStub.restore();
        saveStub.restore();
    });

    it('should create a new vehicle if user is verified', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d'; // Example user ID
        const req = {
            body: {
                name: 'Mercedes',
                brand: 'Example Brand'
            },
            file: {
                path: '/path/to/image.jpg' // Mock file path
            },
            user: {
                id: userId
            }
        };

        const user = {
            _id: userId,
            isVerified: true // User is verified
        };

        findOneStub.withArgs({ _id: userId }).resolves(user);

        const newVehicle = new Vehicle({
            ...req.body,
            images: req.file ? req.file.path : null,
            createdAt: new Date(),
            userId: req.user.id,
        });

        saveStub.resolves(newVehicle);

        const result = await registerVehicle(req.body, userId, req);

        expect(result).to.have.property('status', 201);
        expect(result).to.have.property('message', 'Vehicle added successfully!');
        expect(result.data).to.deep.include(req.body);
    });

    it('should return 404 if user is not found', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d'; // Example user ID
        const req = {
            body: {
                name: 'Mercedes',
                brand: 'Example Brand'
            },
            file: {
                path: '/path/to/image.jpg' // Mock file path
            },
            user: {
                id: userId
            }
        };

        findOneStub.withArgs({ _id: userId }).resolves(null);

        const result = await registerVehicle(req.body, userId, req);

        expect(result).to.have.property('status', 404);
        expect(result).to.have.property('message', 'User not found!');
    });

    it('should return 401 if user is not verified', async () => {
        const userId = '60c72b2f9b1e8c7b2c8f9e9d'; // Example user ID
        const req = {
            body: {
                name: 'Mercedes',
                brand: 'Example Brand'
            },
            file: {
                path: '/path/to/image.jpg' // Mock file path
            },
            user: {
                id: userId
            }
        };

        const user = {
            _id: userId,
            isVerified: false // User is not verified
        };

        findOneStub.withArgs({ _id: userId }).resolves(user);

        const result = await registerVehicle(req.body, userId, req);

        expect(result).to.have.property('status', 401);
        expect(result).to.have.property('message', 'User is not verified!');
    });


});

// 2 - VERIFY THE VEHICLE
describe('verifyVehicle', function() {

    it('should verify a vehicle when given a valid _id', async function() {
        const vehicleId = 'valid_id'; // Replace with an existing vehicle ID in your database
        const mockVehicle = { _id: vehicleId, isVerified: true }; // Mock vehicle object before verification

        // Stub the findByIdAndUpdate method to return the mock vehicle object
        sinon.stub(Vehicle, 'findByIdAndUpdate').returns(mockVehicle);

        const result = await verifyVehicle(vehicleId);

        assert.equal(result.status, 200);
        assert.equal(result.message, 'Vehicle verified!');
        assert.isTrue(result.data.isVerified);

        // Restore the stubbed method
        Vehicle.findByIdAndUpdate.restore();
    });

    it('should return "Vehicle not found" message when given an invalid _id', async function() {
        const invalidId = 'invalid_id'; // Replace with a non-existent vehicle ID
        const expectedResult = { status: 404, message: 'Vehicle not found' };

        // Stub the findByIdAndUpdate method to return null (simulating not found)
        sinon.stub(Vehicle, 'findByIdAndUpdate').returns(null);

        const result = await verifyVehicle(invalidId);

        assert.deepEqual(result, expectedResult);

        // Restore the stubbed method
        Vehicle.findByIdAndUpdate.restore();
    });

    it('should handle errors gracefully', async function() {
        const vehicleId = 'valid_id'; // Replace with an existing vehicle ID
        const expectedErrorMessage = 'Database error'; // Example error message

        // Stub the findByIdAndUpdate method to throw an error
        sinon.stub(Vehicle, 'findByIdAndUpdate').throws(expectedErrorMessage);

        const result = await verifyVehicle(vehicleId);

        assert.equal(result.status, 500); // Assuming you handle errors with 500 status code
        assert.equal(result.message, 'Verify Vehicle error');

        // Restore the stubbed method
        Vehicle.findByIdAndUpdate.restore();
    });


});

// 3 - UPDATE VEHICLE
describe('updateVehicle', function () {

    // 2 test remaiaing!

    it('should return "Vehicle not found" message when given an invalid _id', async function () {
        const invalidId = 'invalid_id'; // Replace with a non-existent vehicle ID
        const userId = 'valid_user_id'; // Replace with a valid user ID
        const updates = { model: 'New Model', year: 2023 }; // Example updates
        const expectedResult = { status: 404, message: 'Vehicle not found' };

        // Stub the findById method to return null (simulating not found)
        sinon.stub(Vehicle, 'findById').returns(null);

        const result = await updateVehicle(invalidId, userId, updates);

        assert.deepEqual(result, expectedResult);

        // Restore the stubbed method
        Vehicle.findById.restore();
    });


    it('should handle errors gracefully', async function () {
        const vehicleId = 'valid_id'; // Replace with an existing vehicle ID
        const userId = 'valid_user_id'; // Replace with a valid user ID
        const updates = { model: 'New Model', year: 2023 }; // Example updates
        const expectedErrorMessage = 'Database error'; // Example error message

        // Stub the findById method to throw an error
        sinon.stub(Vehicle, 'findById').throws(expectedErrorMessage);

        const result = await updateVehicle(vehicleId, userId, updates);

        assert.equal(result.status, 500); // Assuming you handle errors with 500 status code
        assert.equal(result.message, 'Update Vehicle error');

        // Restore the stubbed method
        Vehicle.findById.restore();
    });

});

// 4 - GET SINGLE VEHICLE DETAILS
describe('getVehicleDetails', function() {

    it('should return vehicle details when given a valid _id', async function() {
        const vehicleId = 'valid_id'; // Replace with an existing vehicle ID in your database
        const mockVehicle = { _id: vehicleId, model: 'Test Model', year: 2022 }; // Mock vehicle object

        // Stub the findOne method to return the mock vehicle object
        sinon.stub(Vehicle, 'findOne').returns(mockVehicle);

        const result = await getVehicleDetails(vehicleId);

        assert.equal(result.status, 200);
        assert.equal(result.message, 'Searched Vehicle!');
        assert.deepEqual(result.data, mockVehicle);

        // Restore the stubbed method
        Vehicle.findOne.restore();
    });

    it('should return "Vehicle not found" message when given an invalid _id', async function() {
        const invalidId = 'invalid_id'; // Replace with a non-existent vehicle ID
        const expectedResult = { status: 404, message: 'Vehicle not found' };

        // Stub the findOne method to return null (simulating not found)
        sinon.stub(Vehicle, 'findOne').returns(null);

        const result = await getVehicleDetails(invalidId);

        assert.deepEqual(result, expectedResult);

        // Restore the stubbed method
        Vehicle.findOne.restore();
    });

    it('should handle errors gracefully', async function() {
        const vehicleId = 'valid_id'; // Replace with an existing vehicle ID
        const expectedErrorMessage = 'Database error'; // Example error message

        // Stub the findOne method to throw an error
        sinon.stub(Vehicle, 'findOne').throws(expectedErrorMessage);

        const result = await getVehicleDetails(vehicleId);

        assert.equal(result.status, 500); // Assuming you handle errors with 500 status code
        assert.equal(result.message, 'Get Vehicle Details error');

        // Restore the stubbed method
        Vehicle.findOne.restore();
    });

    // Additional test cases can be added as per specific requirements

});


// 5 - GET ALL PRODUCTS BY VENDOR ID
describe('getProductsById', function () {

    it('should return products when given a valid userId', async function () {
        const userId = 'valid_user_id'; // Replace with an existing user ID in your database
        const mockProducts = [
            { _id: 'product_id_1', name: 'Product 1', userId: userId },
            { _id: 'product_id_2', name: 'Product 2', userId: userId }
        ]; // Mock products array

        // Stub the find method to return the mock products array
        sinon.stub(Vehicle, 'find').returns(mockProducts);

        const result = await getProductsById(userId);

        assert.equal(result.status, 200);
        assert.equal(result.message, 'Searched Vehicle!');
        assert.deepEqual(result.data, mockProducts);

        // Restore the stubbed method
        Vehicle.find.restore();
    });

    it('should handle errors gracefully', async function () {
        const userId = 'valid_user_id'; // Replace with an existing user ID
        const expectedErrorMessage = 'Database error'; // Example error message

        // Stub the find method to throw an error
        sinon.stub(Vehicle, 'find').throws(expectedErrorMessage);

        const result = await getProductsById(userId);

        assert.equal(result.status, 500); // Assuming you handle errors with 500 status code
        assert.equal(result.message, 'Get Products By Id error');

        // Restore the stubbed method
        Vehicle.find.restore();
    });

});