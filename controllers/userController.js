
// Dto
const { signupUserDTO, loginUserDTO, verifyUserDTO, updateUserDTO, resetUserDTO } = require('../models/dto/UserDto');

// Service files import
const userService = require('../services/userService');



const getAlluser = async (req, res) => {

    // Extract query parameters
    const { sortBy, sortOrder, search, filter } = req.query;

    // Validate query parameters
    const validSortByFields = ['name', 'email', 'role', 'createdAt'];
    const validSortOrderValues = ['asc', 'desc'];

    if (sortBy && !validSortByFields.includes(sortBy)) {
        return res.status(400).json({ message: 'Invalid sortBy field' });
    }

    if (sortOrder && !validSortOrderValues.includes(sortOrder)) {
        return res.status(400).json({ message: 'Invalid sortOrder value' });
    }

    const result = await userService.getAlluser({ sortBy, sortOrder, search, filter });

    if (result.status == 200) {
        res.status(200).json({ message: result.message, user: result.data });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
};

const signupUser = async (req, res) => {

    try {
        const newImage = req.file;

        const { error, value } = signupUserDTO.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({ message: error.details.map(detail => detail.message) });
        }

        const result = await userService.signupUser(value, newImage);

        if (result.status === 201) {
            return res.status(201).json({ message: result.message, userId: result.data });
        }
        else {
            return res.status(result.status).json({ message: result.message });
        }
    }
    catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ message: 'Unexpected server error' });
    }
};

const signinUser = async (req, res) => {

    // const { email, password } = req.body;

    const { error, value } = loginUserDTO.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    const result = await userService.signinUser(value);

    if (result.status == 200) {
        res.cookie('token', result.data.token, { httpOnly: true, secure: false, sameSite: 'strict', });
        res.status(200).json({ message: result.message, userId: result.data.user.id, token: result.data.token });
    }
    else {
        return res.status(result.status).json({ message: result.message });
    }

};

const signoutUser = async (req, res) => {

    const userId = req.params.id;
    const result = await userService.signoutUser(userId);

    if (result.status === 200) {
        // Clear the token cookie from the response
        res.clearCookie('token');
        res.status(200).json({ message: result.message });
    } else {
        res.status(result.status).json({ message: result.message });
    }

}

const getUserById = async (req, res) => {

    const userId = req.params.id;
    const result = await userService.getUserById(userId);

    if (result.status === 200) {
        res.status(200).json(result.data);
    } else {
        res.status(result.status).json({ message: result.message });
    }
}

const verifyUser = async (req, res) => {

    const userId = req.params.id;
    const result = await userService.verifyUser(userId);

    if (result.status === 200) {
        res.status(200).json({ message: result.message, isVerified: result.data });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
};

const updateUser = async (req, res) => {

    const userId = req.params.id;
    const updates = req.body;

    const { error, value } = updateUserDTO.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    const result = await userService.updateUser(userId, value);

    if (result.status === 200) {
        res.status(200).json({ message: result.message });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }

}

const resetPassword = async (req, res) => {

    const userId = req.params.id;
    const { email, oldPassword, newPassword } = req.body;

    const { error, value } = resetUserDTO.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    const result = await userService.resetPassword(userId, value);

    if (result.status == 200) {
        res.status(200).json({ message: result.message });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}

const deleteUser = async (req, res) => {

    const userId = req.user.id;
    const result = await userService.deleteUser(userId);

    if (result.status == 200) {
        res.status(200).json({ message: result.message });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}

const deleteListOfUser = async (req, res) => {

    const result = await userService.deleteListOfUser();

    if (result.status == 200) {
        res.status(200).json({ message: result.message, data: result.data });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}

const deleteUserByAdmin = async (req, res) => {

    const adminId = req.user.id;
    const userId = req.params.id;
    const result = await userService.deleteUserByAdmin(adminId, userId);

    if (result.status == 200) {
        res.status(200).json({ message: result.message, data: result.data });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}

// REDIS
const sendMail = async (req, res) => {

    try {
        const result = await userService.sendMail(req, res);
        console.log("result", result)

        if (result.status == 200) {
            res.status(200).json({ message: result.message, data: result.data });
        }
        else {
            res.status(result.status).json({ message: result.message });
        }
    }
    catch (error) {
        console.log(error)
        res.status(400).json(error)
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
}