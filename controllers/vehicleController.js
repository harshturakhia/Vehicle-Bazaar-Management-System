const Vehicle = require("../models/Vehicle");
const vehicleService = require('../services/vehicleService');

// DTO Imports
const { registerVehicleDTO, updateVehicleDTO } = require('../models/dto/VehicleDto')


const registerVehicle = async (req, res) => {

    const { error, value } = registerVehicleDTO.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }

    const userId = req.user.id;
    const result = await vehicleService.registerVehicle(value, userId, req);

    if (result.status === 201) {
        res.status(201).json({ message: result.message, vehicleId: result.data });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}

const verifyVehicle = async (req, res) => {

    const vehicleId = req.body.vehicleId;
    const result = await vehicleService.verifyVehicle(vehicleId);

    if (result.status === 200) {
        res.status(200).json({ message: result.message });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}


const updateVehicle = async (req, res) => {

    const id = req.params.id;
    const userId = req.user.id;
    const updates = req.body;

    const { error, value } = updateVehicleDTO.validate(updates, { abortEarly: false });

    if (error) {
        return res.status(400).json({ message: error.details.map(detail => detail.message) });
    }


    const result = await vehicleService.updateVehicle(id, userId, value);

    if (result.status === 200) {
        res.status(200).json({ message: result.message });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}

const getAllVehicles = async (req, res) => {

    const { sortBy, sortOrder, search, filter, page, limit } = req.query;
    // const validSortByFields = ['name', 'brand', 'kmDriven', 'fuelType'];
    // const validSortOrderValues = ['asc', 'desc'];

    // if (sortBy && !validSortByFields.includes(sortBy)) {
    //     return res.status(400).json({ message: 'Invalid sortBy field' });
    // }

    // if (sortOrder && !validSortOrderValues.includes(sortOrder)) {
    //     return res.status(400).json({ message: 'Invalid sortOrder value' });
    // }

    const validSortByFields = ['name', 'brand', 'yearOfRegistration', 'fuelType', 'registrationDetails', 'kmDriven', 'ownerNo', 'description', 'availableLocation', 'insurance', 'amount'];
    const validSortOrderValues = ['asc', 'desc'];

    // Validate sortBy and sortOrder
    if (sortBy && !validSortByFields.includes(sortBy)) {
        return res.status(400).json({ message: 'Invalid sortBy field' });
    }
    if (sortOrder && !validSortOrderValues.includes(sortOrder)) {
        return res.status(400).json({ message: 'Invalid sortOrder value' });
    }

    const pagination = {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 5,
    };


    const result = await vehicleService.getAllVehicles({ sortBy, sortOrder, search, filter, pagination });

    if (result.status === 200) {
        res.status(200).json({ message: result.message, data: result.data });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}

const getVehicleDetails = async (req, res) => {

    const id = req.params.id;
    const result = await vehicleService.getVehicleDetails(id);

    if (result.status === 200) {
        res.status(200).json({ message: result.message, data: result.data });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}

const getProductsById = async (req, res) => {

    const userId = req.user.id
    const result = await vehicleService.getProductsById(userId);

    if (result.status === 200) {
        res.status(200).json({ message: result.message, data: result.data });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}

const updateImage = async (req, res) => {

    const userId = req.user.id;
    const vehicleId = req.params.id;
    const newImage = req.file;

    const result = await vehicleService.updateImage(userId, vehicleId, newImage);

    if (result.status === 200) {
        res.status(200).json({ message: result.message });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}


const deleteVehicle = async (req, res) => {

    const vehicleId = req.params.id;
    const vendorId = req.user.id;

    const result = await vehicleService.deleteVehicle(vehicleId, vendorId);

    if (result.status == 200) {
        res.status(200).json({ message: result.message });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }

}

const deleteListOfVehicle = async (req, res) => {

    const result = await vehicleService.deleteListOfVehicle();

    if (result.status == 200) {
        res.status(200).json({ message: result.message, data: result.data });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}

const deleteVehicleByAdmin = async (req, res) => {

    const adminId = req.user.id;
    const vehicleId = req.params.id;

    const result = await vehicleService.deleteVehicleByAdmin(adminId, vehicleId);

    if (result.status == 200) {
        res.status(200).json({ message: result.message });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }

}

module.exports = {
    registerVehicle,
    verifyVehicle,
    deleteVehicle,
    updateVehicle,
    getAllVehicles,
    getVehicleDetails,
    getProductsById,
    updateImage,
    deleteVehicle,
    deleteListOfVehicle,
    deleteVehicleByAdmin,
}