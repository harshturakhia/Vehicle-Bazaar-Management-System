const Joi = require('joi');

// Define the Joi schema
const registerVehicleDTO = Joi.object({

    name: Joi.string().min(3).max(50).required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must be less than 50 characters long',
    }),
    brand: Joi.string().min(3).max(50).required().messages({
        'string.base': 'Brand must be a string',
        'string.empty': 'Brand is required',
        'string.min': 'Brand must be at least 3 characters long',
        'string.max': 'Brand must be less than 50 characters long',
    }),
    yearOfRegistration: Joi.string().required().messages({
        'string.base': 'Year of Registration must be a string',
        'string.empty': 'Year of Registration is required',
    }),
    registrationDetails: Joi.string().min(3).max(50).required().messages({
        'string.base': 'Registration Details must be a string',
        'string.empty': 'Registration Details are required',
        'string.min': 'Registration Details must be at least 3 characters long',
        'string.max': 'Registration Details must be less than 50 characters long',
    }),
    images: Joi.array().items(Joi.string().uri().allow(null)).messages({
        'array.base': 'Images must be an array',
        'string.uri': 'Each image must be a valid URL',
    }),
    choice: Joi.string().valid('sell', 'rent').required().messages({
        'any.only': 'Choice must be either "sell" or "rent"',
        'string.empty': 'Choice is required',
    }),
    fuelType: Joi.string().required().messages({
        'string.base': 'Fuel Type must be a string',
        'string.empty': 'Fuel Type is required',
    }),
    transmission: Joi.string().required().messages({
        'string.base': 'Transmission must be a string',
        'string.empty': 'Transmission is required',
    }),
    kmDriven: Joi.number().required().messages({
        'number.base': 'Km Driven must be a number',
        'any.required': 'Km Driven is required',
    }),
    vehicleType: Joi.string().required().messages({
        'string.base': 'Vehicle Type must be a string',
        'string.empty': 'Vehicle Type is required',
    }),
    ownerNo: Joi.number().required().messages({
        'number.base': 'Owner No must be a number',
        'any.required': 'Owner No is required',
    }),
    description: Joi.string().min(3).max(50).required().messages({
        'string.base': 'Description must be a string',
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 3 characters long',
        'string.max': 'Description must be less than 50 characters long',
    }),
    availableLocation: Joi.string().required().messages({
        'string.base': 'Available Location must be a string',
        'string.empty': 'Available Location is required',
    }),
    insurance: Joi.string().allow(null).messages({
        'string.base': 'Insurance must be a string',
    }),
    amount: Joi.number().required().messages({
        'number.base': 'Rent/Sell amount must be a number',
        'any.required': 'Amount is required',
    }),
});


const updateVehicleDTO = Joi.object({

    name: Joi.string().min(3).max(50).messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must be less than 50 characters long',
    }),
    brand: Joi.string().min(3).max(50).messages({
        'string.base': 'Brand must be a string',
        'string.min': 'Brand must be at least 3 characters long',
        'string.max': 'Brand must be less than 50 characters long',
    }),
    yearOfRegistration: Joi.string().messages({
        'string.base': 'Year of Registration must be a string',
    }),
    registrationDetails: Joi.string().min(3).max(50).messages({
        'string.base': 'Registration Details must be a string',
        'string.min': 'Registration Details must be at least 3 characters long',
        'string.max': 'Registration Details must be less than 50 characters long',
    }),
    images: Joi.array().items(Joi.string().uri().allow(null)).messages({
        'array.base': 'Images must be an array',
        'string.uri': 'Each image must be a valid URL',
    }),
    choice: Joi.string().valid('sell', 'rent').messages({
        'any.only': 'Choice must be either "sell" or "rent"',
    }),
    fuelType: Joi.string().messages({
        'string.base': 'Fuel Type must be a string',
    }),
    transmission: Joi.string().messages({
        'string.base': 'Transmission must be a string',
    }),
    kmDriven: Joi.number().messages({
        'number.base': 'Km Driven must be a number',
        'any.required': 'Km Driven is required',
    }),
    vehicleType: Joi.string().messages({
        'string.base': 'Vehicle Type must be a string',
    }),
    ownerNo: Joi.number().messages({
        'number.base': 'Owner No must be a number',
    }),
    description: Joi.string().min(3).max(50).messages({
        'string.base': 'Description must be a string',
        'string.min': 'Description must be at least 3 characters long',
        'string.max': 'Description must be less than 50 characters long',
    }),
    availableLocation: Joi.string().messages({
        'string.base': 'Available Location must be a string',
    }),
    insurance: Joi.string().allow(null).messages({
        'string.base': 'Insurance must be a string',
    }),
    isVerified: Joi.bool().messages({
        'string.base': 'isVerified must be a bool',
    }),
    amount: Joi.number().required().messages({
        'number.base': 'Rent/Sell amount must be a number',
        'any.required': 'Amount is required',
    }),
});


module.exports = { registerVehicleDTO, updateVehicleDTO }
