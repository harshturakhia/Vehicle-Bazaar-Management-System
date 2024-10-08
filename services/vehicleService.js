const mongoose = require('mongoose')

// File Imports
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");


// Error function
const handleError = (error, message = 'Server error') => {
    console.error(message, error);
    return { status: 500, message };
};


const registerVehicle = async (value, userId, req) => {

    try {

        if (!userId) {
            return { status: 404, message: 'User not found!' };
        }

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return { status: 404, message: 'User not found!' };
        }

        if (user.isVerified == false) {
            return { status: 401, message: 'User is not verified!' };
        }

        const newVehicle = new Vehicle({
            ...req.body,
            images: req.file ? req.file.path : null,
            createdAt: new Date(),
            userId: req.user.id,
        });

        await newVehicle.save();

        return { status: 201, message: 'Vehicle added successfully!', data: newVehicle.id };
    }
    catch (error) {
        return handleError(error, 'Register Vehicle error');
    }
}

const verifyVehicle = async (_id) => {

    try {

        // const vehicle = await Vehicle.findOne({ _id });
        const vehicle = await Vehicle.findByIdAndUpdate(_id, { isVerified: true }, { new: true });

        if (!vehicle) {
            return { status: 404, message: 'Vehicle not found' };
        }

        // vehicle.isVerified = true;

        return { status: 200, message: 'Vehicle verified!', data: vehicle };
    }
    catch (error) {
        return handleError(error, 'Verify Vehicle error');
    }

}


const updateVehicle = async (_id, userId, updates) => {

    try {

        const vehicle = await Vehicle.findById(_id);

        if (!vehicle) {
            return { status: 404, message: 'Vehicle not found' };
        }

        const userIdObj = new mongoose.Types.ObjectId(userId);
        if (!vehicle.userId.equals(userIdObj)) {
            return { status: 400, message: 'You are not authorized to update this vehicle!' };
        }

        // Update user fields based on the request body
        // for (let key in updates) {
        //     if (updates.hasOwnProperty(key)) {
        //         vehicle[key] = updates[key];
        //     }
        // }
        Object.assign(vehicle, updates);
        const updatedvehicle = await vehicle.save();

        return { status: 200, message: 'Vehicle updated!', data: updatedvehicle };
    }
    catch (error) {
        return handleError(error, 'Update Vehicle error');
    }

}

const getAllVehicles = async ({ sortBy, sortOrder, search, filter, pagination }) => {

    // http://localhost:9898/api/getAllVehicles?sortBy=name&sortOrder=asc&search=Kia&page=1&limit=5

    let query = {};
    try {

        // Implement search logic
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { brand: { $regex: search, $options: 'i' } },
                    { yearOfRegistration: { $regex: search, $options: 'i' } },
                    { fuelType: { $regex: search, $options: 'i' } },
                    { registrationDetails: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { availableLocation: { $regex: search, $options: 'i' } },
                    { insurance: { $regex: search, $options: 'i' } },
                ],

                isDeleted: null
            };
        }
        else {
            query = { isDeleted: null };
        }

        if (filter) {
            const filterObj = JSON.parse(filter);
            query = { ...query, ...filterObj };
        }

        const sort = {};
        sortBy = sortBy || 'createdAt';
        sortOrder = sortOrder || 'desc';
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        // const allVehicles = await Vehicle.find(query).sort(sort);
        const allVehicles = await Vehicle.find(query).sort(sort).skip(skip).limit(limit);
        const totalVehicles = await Vehicle.countDocuments(query);

        return {
            status: 200, message: 'List of registered vehicles!', data: {
                vehicles: allVehicles,
                totalVehicles,
                totalPages: Math.ceil(totalVehicles / limit),
                currentPage: page,
            }
        };
    }
    catch (error) {
        return handleError(error, 'Get All Vehicles error');
    }
}

const getVehicleDetails = async (_id,) => {

    try {

        const vehicle = await Vehicle.findOne({ _id });

        if (!vehicle) {
            return { status: 404, message: 'Vehicle not found' };
        }

        return { status: 200, message: 'Searched Vehicle!', data: vehicle };
    }
    catch (error) {
        return handleError(error, 'Get Vehicle Details error');
    }

}

const getProductsById = async (userId) => {

    try {
        if (!userId) {
            return { status: 404, message: 'Vendor not found' };
        }

        const productByVendorId = await Vehicle.find({ userId: userId });

        return { status: 200, message: 'Searched Vehicle!', data: productByVendorId };
    }
    catch (error) {
        return handleError(error, 'Get Products By Id error');
    }
}

const updateImage = async (userId, vehicleId, newImage) => {

    try {
        if (!newImage) {
            return { status: 400, message: 'No file uploaded' };
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return { status: 404, message: 'Vehicle not found' };
        }

        const userIdObj = new mongoose.Types.ObjectId(userId);
        if (!vehicle.userId.equals(userIdObj)) {
            return { status: 403, message: 'You are not authorized to update this vehicle' };
        }

        vehicle.images = newImage.path;

        await vehicle.save();

        return { status: 200, message: 'Image updated successfully!', data: vehicle };
    }
    catch (error) {
        return handleError(error, 'Update Image error');
    }
}

// DELETE
const deleteVehicle = async (vehicleId, vendorId) => {

    try {
        const vendor = await User.findById(vendorId);
        if (!vendorId || !vendor) {
            return { status: 404, message: 'Vendor not found!' };
        }

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicleId || !vehicle) {
            return { status: 404, message: 'Vehicle not found!' };
        }

        if (vehicle.deleteReq == true) {
            return { status: 404, message: 'Vehicle delete request already sent!' };
        }

        vehicle.deleteReq = true;
        await vehicle.save();

        return { status: 200, message: 'Vehicle delete request sent successfully to admin!' };

    }
    catch (error) {
        return handleError(error, 'Delete Vehicle Request Error!');
    }


}

const deleteListOfVehicle = async () => {

    try {
        const vehiclesList = await Vehicle.find({ deleteReq: true, isDeleted: null })

        if (vehiclesList.length == 0) {
            return { status: 404, message: 'No Vehicles found with Delete Request!' };
        }

        return { status: 200, message: 'List of vehicle delete request!', data: vehiclesList };

    }
    catch (error) {
        return handleError(error, 'Fetch Delete Vehicle Request Error!');
    }

}

const deleteVehicleByAdmin = async (adminId, vehicleId) => {

    try {
        const admin = await User.findOne({ _id: adminId });
        console.log(adminId, admin)
        if (!adminId || !admin) {
            return { status: 404, message: 'Admin not found!' };
        }

        const vehicle = await Vehicle.findOne({ _id: vehicleId });
        if (!vehicleId || !vehicle) {
            return { status: 404, message: 'Vehicle not found!' };
        }

        if (vehicle.isDeleted == true) {
            vehicle.deleteReq = null;
            vehicle.isDeleted = null;
            vehicle.deletedAt = null;
            vehicle.deletedBy = null;
            vehicle.modifiedAt = Date.now();
            await vehicle.save();
            return { status: 200, message: 'Vehicle is unblocked now!' };
        }

        vehicle.isDeleted = true;
        vehicle.deletedAt = Date.now();
        vehicle.deletedBy = adminId;
        vehicle.modifiedAt = Date.now();
        await vehicle.save();

        return { status: 200, message: 'Vehicle deleted successfully!' };

    }
    catch (error) {
        return handleError(error, 'Error in Delete Vehicle by Admin!');
    }

}

module.exports = {
    getAllVehicles,
    registerVehicle,
    verifyVehicle,
    deleteVehicle,
    getVehicleDetails,
    updateVehicle,
    getProductsById,
    updateImage,
    deleteVehicle,
    deleteListOfVehicle,
    deleteVehicleByAdmin
};
