const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');


const UserModelName = 'User';

if (!mongoose.models[UserModelName]) {


    const userSchema = new Schema({
        name: {
            type: String,
            required: true,
            minlength: [3, 'Name must be at least 3 characters long'],
            maxlength: [50, 'Name must be less than 50 characters long']
        },
        email: {
            type: String,
            required: true,
            match: [/.+\@.+\..+/, 'Please enter a valid email address']
        },
        password: {
            type: String,
            required: true,
            minlength: [6, 'Password must be at least 6 characters long'],
        },
        role: {
            type: String,
            enum: ['admin', 'user', 'vendor'],
            required: true,
            default: 'user'
        },
        dob: {
            type: Date,
            null: true
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'prefer not to say'],
            required: [true, 'Gender is required']
        },
        address: {
            type: String,
            maxlength: [100, 'Address must be less than 100 characters long']
        },
        contact: {
            type: String,
            required: true,
            minlength: [10, 'Contact number should contain 10 digits'],
            maxlength: [10, 'Contact number should contain 10 digits']
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false
        },
        profileImage: {
            type: String,
            match: [/^https?:\/\/.+\.(jpg|jpeg|png)$/, 'Profile image must be a valid URL'],
            null: true
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
            default: Date.now
        },
        modifiedAt: {
            type: Date,
            null: true
        }
    });


    userSchema.pre('save', async function (next) {
        const user = this;
        if (!user.isModified('password')) return next();

        try {
            const hashedPassword = await bcrypt.hash(user.password, 13);
            user.password = hashedPassword;
            next();
        } catch (error) {
            return next(error);
        }
    });


    mongoose.model(UserModelName, userSchema);

}


module.exports = mongoose.model(UserModelName);
