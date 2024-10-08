const Joi = require('joi');

const signupUserDTO = Joi.object({

    name: Joi.string().min(3).max(50).required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must be less than 50 characters long',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
    }),
    role: Joi.string().valid('admin', 'user', 'vendor').required().messages({
        'any.only': 'Role must be either admin, user, or vendor',
        'string.empty': 'Role is required',
    }),
    dob: Joi.date().optional().allow(null).messages({
        'date.base': 'Date of Birth must be a valid date',
    }),
    gender: Joi.string().valid('male', 'female', 'prefer not to say').required().messages({
        'any.only': 'Gender must be male, female, or prefer not to say',
        'string.empty': 'Gender is required',
    }),
    address: Joi.string().max(100).optional().messages({
        'string.base': 'Address must be a string',
        'string.max': 'Address must be less than 100 characters long',  
    }),
    contact: Joi.string().length(10).required().messages({
        'string.base': 'Contact number must be a string',
        'string.length': 'Contact number should contain 10 digits',
        'string.empty': 'Contact number is required',
    }),
    profileImage: Joi.string().uri().optional().allow(null).messages({
        'string.uri': 'Profile image must be a valid URL',
    }),
    createdAt: Joi.date().default(Date.now).optional().messages({
        'date.base': 'Created At must be a valid date',
    }),
    modifiedAt: Joi.date().optional().allow(null).messages({
        'date.base': 'Modified At must be a valid date',
    })
});

const loginUserDTO = Joi.object({

    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
    }),

})

const verifyUserDTO = Joi.object({

    isVerified: Joi.bool().messages({
        'string.base': 'isVerified must be a bool',
    }),
})

const updateUserDTO = Joi.object({

    name: Joi.string().min(3).max(50).messages({
        'string.base': 'Name must be a string',
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must be less than 50 characters long',
    }),
    email: Joi.string().email().messages({
        'string.email': 'Please enter a valid email address',
    }),
    password: Joi.string().min(6).messages({
        'string.base': 'Password must be a string',
        'string.min': 'Password must be at least 6 characters long',
    }),
    role: Joi.string().valid('admin', 'user', 'vendor').messages({
        'any.only': 'Role must be either admin, user, or vendor',
    }),
    dob: Joi.date().optional().allow(null).messages({
        'date.base': 'Date of Birth must be a valid date',
    }),
    gender: Joi.string().valid('male', 'female', 'prefer not to say').messages({
        'any.only': 'Gender must be male, female, or prefer not to say',
    }),
    address: Joi.string().max(100).optional().messages({
        'string.base': 'Address must be a string',
        'string.max': 'Address must be less than 100 characters long',
    }),
    contact: Joi.string().length(10).messages({
        'string.base': 'Contact number must be a string',
        'string.length': 'Contact number should contain 10 digits',
    }),
    profileImage: Joi.string().uri().optional().allow(null).messages({
        'string.uri': 'Profile image must be a valid URL',
    }),

});

const resetUserDTO = Joi.object({

    email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address',
        'string.empty': 'Email is required',
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
    }),
    oldPassword: Joi.string().min(6).required().messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
    }),

})


const userResponseObject = Joi.object({
    id: Joi.string().email(),
    email: Joi.string().email(),
    role: Joi.string().email(),
})

module.exports = { signupUserDTO, loginUserDTO, verifyUserDTO, updateUserDTO, resetUserDTO, userResponseObject };
