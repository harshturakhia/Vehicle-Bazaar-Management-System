// Import mongoose
const mongoose = require('mongoose');
const { Schema } = mongoose;


// Define the schema
const vehicleSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name must be less than 50 characters long']
    },
    brand: {
        type: String,
        required: true,
        minlength: [3, 'Brandname must be at least 3 characters long'],
        maxlength: [50, 'Brandname must be less than 50 characters long']
    },
    yearOfRegistration: {
        type: String,
        required: true,
    },
    registrationDetails: {
        type: String,
        required: true,
        minlength: [3, 'Brandname must be at least 3 characters long'],
        maxlength: [50, 'Brandname must be less than 50 characters long']
    },
    images: [
        {
            type: String,
            // match: [/^https?:\/\/.+\.(jpg|jpeg|png)$/, 'Profile image must be a valid URL'],
            null: true,
        }
    ],
    choice: {
        type: String,
        enum: ['sell', 'rent'],
        required: [true, 'Choice is required'],
    },
    fuelType: {
        type: String,
        required: true,
    },
    transmission: {
        type: String,
        required: true,
    },
    kmDriven: {
        type: Number,
        required: true,
    },
    vehicleType: {
        type: String,
        required: true,
    },
    ownerNo: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
        minlength: [3, 'Description must be at least 3 characters long'],
        maxlength: [50, 'Description must be less than 50 characters long']
    },
    availableLocation: {
        type: String,
        required: true,
    },
    insurance: {
        type: String,
    },
    amount: {
        type: Number,
        require: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    deleteReq: {
        type: Boolean,
        null: true,
    },
    isDeleted: {
        type: Boolean,
    },
    deletedAt: {
        type: Date,
        null: true,
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        null: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    modifiedAt: {
        type: Date,
        null: true
    }
});


// Create the model
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Export the model
module.exports = Vehicle;
