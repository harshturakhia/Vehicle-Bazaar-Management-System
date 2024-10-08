const assert = require('chai').assert;
const _ = require('lodash');
const sinon = require('sinon');
const User = require('../models/User');
const Cart = require('../models/Cart');
const { getCartItems, addToCartService, deleteCart } = require('../services/cartService');



describe('getCartItems', function () {

    it('should return cart items when given a valid userId', async function () {
        const userId = 'valid_user_id';
        const mockUser = { _id: userId };
        const mockCart = { userId: userId, items: ['item1', 'item2'] };

        sinon.stub(User, 'findById').returns(mockUser);
        sinon.stub(Cart, 'findOne').returns(mockCart);

        const result = await getCartItems(userId);

        assert.equal(result.status, 200);
        assert.equal(result.message, 'Cart fetched successfully!');
        assert.deepEqual(result.data, mockCart);

        User.findById.restore();
        Cart.findOne.restore();
    });

    it('should return "Invalid userid" when userId is not provided', async function () {
        const result = await getCartItems(null);

        assert.equal(result.status, 400);
        assert.equal(result.message, 'Invalid userid');
    });

    it('should return "No user found!" when user does not exist', async function () {
        const userId = 'invalid_user_id';

        sinon.stub(User, 'findById').returns(null);

        const result = await getCartItems(userId);

        assert.equal(result.status, 400);
        assert.equal(result.message, 'No user found!');

        User.findById.restore();
    });

    it('should return "No cart exists for this user!" when cart does not exist', async function () {
        const userId = 'valid_user_id';
        const mockUser = { _id: userId };

        sinon.stub(User, 'findById').returns(mockUser);
        sinon.stub(Cart, 'findOne').returns(null);

        const result = await getCartItems(userId);

        assert.equal(result.status, 400);
        assert.equal(result.message, 'No cart exists for this user!');

        User.findById.restore();
        Cart.findOne.restore();
    });

    it('should handle errors gracefully', async function () {
        const userId = 'valid_user_id';
        const expectedErrorMessage = 'Database error';

        sinon.stub(User, 'findById').throws(expectedErrorMessage);

        const result = await getCartItems(userId);

        assert.equal(result.status, 500);
        assert.equal(result.message, 'Server error');

        User.findById.restore();
    });

});


describe('addToCartService', function () {

    it('should create a new cart when given a valid userId and vehicleId', async function () {
        const userId = 'valid_user_id';
        const vehicleId = 'valid_vehicle_id';
        const mockUser = { _id: userId };
        const mockCart = {
            userId: userId,
            productId: vehicleId,
            createdAt: new Date(),
            quantity: 1
        };

        sinon.stub(User, 'findById').resolves(mockUser);
        sinon.stub(Cart, 'findOne').resolves(null);

        const cartInstance = new Cart(mockCart);
        sinon.stub(cartInstance, 'save').resolves(cartInstance);

        const CartConstructorStub = sinon.stub().returns(cartInstance);

        const originalCart = Cart;
        require.cache[require.resolve('../models/Cart')].exports = CartConstructorStub;

        const result = await addToCartService(userId, vehicleId);

        assert.equal(result.status, 201);
        assert.equal(result.message, 'Cart created successfully!');
        assert.equal(result.data.quantity, mockCart.quantity);

        User.findById.restore();
        Cart.findOne.restore();
        cartInstance.save.restore();
        require.cache[require.resolve('../models/Cart')].exports = originalCart;
    });

    it('should return "Invalid userid or vehicleid" when userId or vehicleId is not provided', async function () {
        const result = await addToCartService(null, null);

        assert.equal(result.status, 400);
        assert.equal(result.message, 'Invalid userid or vehicleid');
    });

    it('should return "No user found!" when user does not exist', async function () {
        const userId = 'invalid_user_id';
        const vehicleId = 'valid_vehicle_id';

        sinon.stub(User, 'findById').returns(null);

        const result = await addToCartService(userId, vehicleId);

        assert.equal(result.status, 400);
        assert.equal(result.message, 'No user found!');

        User.findById.restore();
    });

    it('should return "Cart already exists for this user and vehicle" when cart already exists', async function () {
        const userId = 'valid_user_id';
        const vehicleId = 'valid_vehicle_id';
        const mockUser = { _id: userId };
        const existingCart = { userId: userId, productId: vehicleId };

        sinon.stub(User, 'findById').returns(mockUser);
        sinon.stub(Cart, 'findOne').returns(existingCart);

        const result = await addToCartService(userId, vehicleId);

        assert.equal(result.status, 400);
        assert.equal(result.message, 'Cart already exists for this user and vehicle');

        User.findById.restore();
        Cart.findOne.restore();
    });

    it('should handle errors gracefully', async function () {
        const userId = 'valid_user_id';
        const vehicleId = 'valid_vehicle_id';
        const expectedErrorMessage = 'Database error';

        sinon.stub(User, 'findById').throws(expectedErrorMessage);

        const result = await addToCartService(userId, vehicleId);

        assert.equal(result.status, 500);
        assert.equal(result.message, 'Server error');

        User.findById.restore();
    });

});


describe('deleteCart', function () {

    it('should delete the cart when given a valid userId', async function () {
        const userId = 'valid_user_id';
        const mockUser = { _id: userId };
        const existingCart = { userId: userId, items: ['item1', 'item2'] };

        sinon.stub(User, 'findById').returns(mockUser);
        sinon.stub(Cart, 'findOne').returns(existingCart);
        sinon.stub(Cart, 'deleteOne').resolves({ deletedCount: 1 });

        const result = await deleteCart(userId);

        assert.equal(result.status, 200);
        assert.equal(result.message, 'Cart deleted successfully!');

        User.findById.restore();
        Cart.findOne.restore();
        Cart.deleteOne.restore();
    });

    it('should return "Invalid userid" when userId is not provided', async function () {
        const result = await deleteCart(null);

        assert.equal(result.status, 400);
        assert.equal(result.message, 'Invalid userid');
    });

    it('should return "No user found!" when user does not exist', async function () {
        const userId = 'invalid_user_id';

        sinon.stub(User, 'findById').returns(null);

        const result = await deleteCart(userId);

        assert.equal(result.status, 400);
        assert.equal(result.message, 'No user found!');

        User.findById.restore();
    });

    it('should return "No cart exists for this user!" when cart does not exist', async function () {
        const userId = 'valid_user_id';
        const mockUser = { _id: userId };

        sinon.stub(User, 'findById').returns(mockUser);
        sinon.stub(Cart, 'findOne').returns(null);

        const result = await deleteCart(userId);

        assert.equal(result.status, 400);
        assert.equal(result.message, 'No cart exists for this user!');

        User.findById.restore();
        Cart.findOne.restore();
    });

    it('should handle errors gracefully', async function () {
        const userId = 'valid_user_id';
        const expectedErrorMessage = 'Database error';

        sinon.stub(User, 'findById').throws(expectedErrorMessage);

        const result = await deleteCart(userId);

        assert.equal(result.status, 500);
        assert.equal(result.message, 'Server error');

        User.findById.restore();
    });

});
