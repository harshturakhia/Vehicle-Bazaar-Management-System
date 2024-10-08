const Queue = require("bull")

const { generateToken } = require("../middleware/generateToken");
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const Vehicle = require("../models/Vehicle");

const emailQueue = require('../queues/emailQueue'); // Import the email queue


// Error function
const handleError = (error, message = 'Server error') => {
    console.error(message, error);
    return { status: 500, message };
};



const getAlluser = async ({ sortBy, sortOrder, search, filter }) => {
    let query = {};

    try {

        // Implement search logic
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        // Implement filter logic
        if (filter) {
            const filterObj = JSON.parse(filter);
            query = { ...query, ...filterObj };
        }

        // Ensure the query includes users with isDeleted = true
        query.isDeleted = null;

        // Set default sort values if not provided
        const sort = {};
        sortBy = sortBy || 'createdAt';
        sortOrder = sortOrder || 'desc';
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const users = await User
            .find(query)
            .select('name email role contact isVerified isDeleted')
            .sort(sort);

        if (users.length === 0) {
            return { status: 404, message: 'No users found!' };
        }

        return { status: 200, message: 'List of registered users!', data: users };
    }
    catch (error) {
        console.error('Error verifying user:', error);
        return { status: 500, message: 'Server error' };
    }

}

const signupUser = async (value, profileImage) => {

    try {
        const { email, ...userData } = value;
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (!existingUser.isDeleted) {
                return { status: 400, message: 'Email already exists' };
            }
        }

        const newUser = new User({
            ...userData,
            profileImage,
            email,
            deleteReq: null,
            deletedAt: null,
            deleteBy: null,
            isDeleted: null,
            createdAt: new Date(),
        });

        await newUser.save();

        // Add job to email queue
        await emailQueue.add({
            email: newUser.email,
            subject: 'Welcome to Our Service',
            text: 'Thank you for signing up!'
        });

        return { status: 201, message: 'User created successfully!', data: newUser.id };
    }
    catch (error) {
        return handleError(error, 'Signup User Error');
    }
}

const signinUser = async (value) => {

    try {
        // Find the user by email
        const user = await User.findOne({ email: value.email });

        if (!user) {
            return { status: 404, message: 'User not found' };
        }

        if (user.isDeleted == true) {
            return { status: 404, message: 'User account is deleted!' };
        }

        // Comparing the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(value.password, user.password);

        if (!isMatch) {
            return { status: 401, message: 'Incorrect email or password' };
        }

        // Generating the JWT token
        const token = generateToken(user);

        // Created a user response object with only id, email and role
        const userResponseObject = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        return { status: 200, message: 'Signin successful', data: { user, token } };
    }
    catch (error) {
        return handleError(error, 'Signin User Error');
    }

}

const signoutUser = async (userId) => {

    try {
        const user = await User.findById(userId);

        if (!user) {
            return { status: 404, message: 'User not found' };
        }

        return { status: 200, message: 'Signout successful' };
    }
    catch (error) {
        return handleError(error, 'Signout User Error');
    }

}

const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return { status: 404, message: 'User not found' };
        }

        return { status: 200, data: user };
    } catch (error) {
        return handleError(error, 'Server error');
    }
};

const verifyUser = async (userId) => {

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isVerified = !user.isVerified;

        user.modifiedAt = new Date();
        await user.save()

        return { status: 200, message: `User verification is ${user.isVerified}`, data: user.isVerified };
    }
    catch (error) {
        return handleError(error, 'Verify User Error');
    }
}

const updateUser = async (userId, value) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            return { status: 404, message: 'User not found' };
        }
        // Update user fields based on the request body
        for (let key in value) {
            if (value.hasOwnProperty(key)) {
                user[key] = value[key];
            }
        }
        user.modifiedAt = new Date();

        const updatedUser = await user.save();
        return { status: 200, message: 'User updated successfully!' };
    }
    catch (error) {
        return handleError(error, 'Server error');
    }
}


const resetPassword = async (userId, value) => {

    if (!userId) {
        return { status: 404, message: 'Userid is not defined!' };
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return { status: 404, message: 'User is not defined!' };
        }

        if (value.email !== user.email || !await bcrypt.compare(value.oldPassword, user.password)) {
            return { status: 400, message: 'Incorrect credentials' };
        }

        user.password = value.newPassword;
        user.modifiedAt = new Date();
        await user.save();

        return { status: 200, message: 'Password reset successfully' };
    }
    catch (error) {
        return handleError(error, 'Reset Password Error');
    }
}

const deleteUser = async (userId) => {

    try {
        const user = await User.findById(userId);

        if (!user) {
            return { status: 404, message: 'User not found!' };
        }
        if (user.isDeleted == true) {
            return { status: 404, message: 'Account already deleted!' };
        }
        if (user.role == 'admin') {
            return { status: 404, message: 'Admin(s) should not delete their account!' };
        }

        // Delete the user document from the database
        user.deleteReq = true;
        await user.save();

        return { status: 200, message: 'User delete request sent to admin successfully!', data: user };
    }
    catch (error) {
        return handleError(error, 'Server error');
    }
}

const deleteListOfUser = async () => {

    try {
        const users = await User.find({ deleteReq: true, isDeleted: null });

        if (users.length == 0) {
            return { status: 404, message: 'No users found with delete request!' };
        }
        return { status: 200, message: 'User list with delete request!', data: users };

    }
    catch (error) {
        return handleError(error, 'Server error');
    }
}

const deleteUserByAdmin = async (adminId, userId) => {

    try {

        // ADMIN
        const admin = await User.findById(adminId);
        if (!adminId || !admin) {
            return { status: 404, message: 'Admin not found!' };
        }

        // USER
        const user = await User.findById(userId);
        if (!userId || !user) {
            return { status: 404, message: 'User not found!' };
        }

        const deleteReqUser = await User.findOne({ _id: userId, deleteReq: true });
        if (!deleteReqUser) {
            return { status: 404, message: 'User with delete request not found!' };
        }
        console.log(deleteReqUser)
        if (deleteReqUser.isDeleted == true) {
            deleteReqUser.deleteReq = null;
            deleteReqUser.isDeleted = null;
            deleteReqUser.deletedAt = null;
            deleteReqUser.deletedBy = null;
            await deleteReqUser.save();
            return { status: 200, message: 'User account recovered successfully!' };
        }

        deleteReqUser.isDeleted = true;
        deleteReqUser.deletedAt = Date.now()
        deleteReqUser.deletedBy = adminId;
        await deleteReqUser.save();

        if (deleteReqUser.role === 'vendor') {
            const vehicles = await Vehicle.find({ userId: userId });
            for (const vehicle of vehicles) {
                vehicle.isDeleted = true;
                vehicle.deletedAt = Date.now();
                vehicle.deletedBy = adminId;
                await vehicle.save();
            }
        }

        return { status: 200, message: 'User deleted successfully!', data: true };

    }
    catch (error) {
        return handleError(error, 'Server error');
    }
}


// REDIS
const sendMail = async (req, res) => {

    const { name, email } = req.body;
    try {
        console.log("Inside Try block");

        const users = await User.find({ role: 'user' });
        console.log("users \n ", users)

        users.forEach((user, index) => {
            emailQueue.add({ user })
                .then(() => {
                    if (index + 1 === users.length) {
                        // res.status(200).json("All users are added to qoeue!")
                        return { status: 200, message: 'All users are added to qoeue!', data: users };
                    }
                })
        })
    }
    catch (error) {
        return handleError(error, 'Server error');
    }
}


module.exports = {
    getAlluser,
    signupUser,
    signinUser,
    signoutUser,
    getUserById,
    verifyUser,
    updateUser,
    deleteUser,
    deleteListOfUser,
    deleteUserByAdmin,
    resetPassword,
    sendMail
};
